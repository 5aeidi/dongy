import { extractExpenseInformationFromImage } from './create-from-receipt-button-actions'

// See the note in src/components/expense-form-actions.test.ts on why this is a
// `var` reached through an arrow.
var mockCreate = jest.fn()

jest.mock('openai', () => ({
  __esModule: true,
  default: class {
    chat = {
      completions: { create: (...args: unknown[]) => mockCreate(...args) },
    }
  },
}))
jest.mock('../../../../lib/env', () => ({
  env: {
    OPENAI_API_KEY: 'sk-test',
    OPENAI_BASE_URL: undefined,
    OPENAI_MODEL_RECEIPT_EXTRACT: 'test-vision-model',
  },
}))
jest.mock('../../../../lib/featureFlags', () => ({
  getRuntimeFeatureFlags: async () => ({ enableReceiptExtract: true }),
}))
jest.mock('../../../../lib/api', () => ({
  getCategories: async () => [
    { id: 0, grouping: 'General', name: 'General' },
    { id: 4, grouping: 'Transport', name: 'Taxi' },
  ],
}))
jest.mock('../../../../lib/uploaded-image-url', () => ({
  isAllowedUploadUrl: (url: string) => url.startsWith('https://uploads.test/'),
}))

const IMAGE = 'https://uploads.test/receipt.jpg'

function respondWith(content: string | null) {
  mockCreate.mockResolvedValue({ choices: [{ message: { content } }] })
}

const IMAGE_BYTES = Buffer.from('fake-jpeg-bytes')

// The action downloads the upload and sends it inline, so `fetch` stands in
// for the S3 storage.
const mockFetch = jest.fn()

function storageServes({
  status = 200,
  contentType = 'image/jpeg',
  body = IMAGE_BYTES,
  contentLength = String(body.length),
}: {
  status?: number
  contentType?: string | null
  body?: Buffer
  contentLength?: string | null
} = {}) {
  const headers: Record<string, string | null> = {
    'content-type': contentType,
    'content-length': contentLength,
  }
  mockFetch.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
    arrayBuffer: async () =>
      body.buffer.slice(body.byteOffset, body.byteOffset + body.length),
  })
}

const NOTHING_EXTRACTED = {
  amount: null,
  categoryId: null,
  date: null,
  title: null,
}

describe('extractExpenseInformationFromImage', () => {
  beforeEach(() => {
    mockCreate.mockReset()
    mockFetch.mockReset()
    storageServes()
    global.fetch = mockFetch as unknown as typeof fetch
  })

  it('returns every field the model read off the receipt', async () => {
    respondWith(
      JSON.stringify({
        amount: 42.5,
        categoryId: '4',
        date: '2026-03-01',
        title: 'Dinner',
      }),
    )
    expect(await extractExpenseInformationFromImage(IMAGE)).toEqual({
      amount: 42.5,
      categoryId: '4',
      date: '2026-03-01',
      title: 'Dinner',
    })
  })

  it('keeps a title containing a comma intact', async () => {
    respondWith(
      JSON.stringify({
        amount: 42.5,
        categoryId: '4',
        date: '2026-03-01',
        title: 'Dinner, drinks and tip',
      }),
    )
    const info = await extractExpenseInformationFromImage(IMAGE)
    expect(info.title).toBe('Dinner, drinks and tip')
    expect(info.amount).toBe(42.5)
  })

  it('asks for a strict JSON schema, and for the configured model', async () => {
    respondWith(
      JSON.stringify({
        amount: 1,
        categoryId: '0',
        date: '2026-03-01',
        title: 'x',
      }),
    )
    await extractExpenseInformationFromImage(IMAGE)

    const request = mockCreate.mock.calls[0][0]
    expect(request.model).toBe('test-vision-model')
    expect(request.response_format.type).toBe('json_schema')
    expect(request.response_format.json_schema.strict).toBe(true)
  })

  it.each([
    [
      'a field of the wrong type',
      JSON.stringify({
        amount: '42.5',
        categoryId: '4',
        date: '2026-03-01',
        title: 'x',
      }),
    ],
    ['a missing field', JSON.stringify({ amount: 42.5, categoryId: '4' })],
    ['a response that is not JSON', '42.5,4,2026-03-01,Dinner'],
    ['an empty response', ''],
  ])('reports nothing extracted for %s', async (_name, content) => {
    respondWith(content)
    expect(await extractExpenseInformationFromImage(IMAGE)).toEqual(
      NOTHING_EXTRACTED,
    )
  })

  it('reports nothing extracted when there is no content at all', async () => {
    respondWith(null)
    expect(await extractExpenseInformationFromImage(IMAGE)).toEqual(
      NOTHING_EXTRACTED,
    )
  })

  it('refuses an image URL the app did not upload', async () => {
    respondWith(JSON.stringify({ amount: 1 }))
    await expect(
      extractExpenseInformationFromImage('https://evil.example/receipt.jpg'),
    ).rejects.toThrow('Invalid image URL.')
    expect(mockCreate).not.toHaveBeenCalled()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('sends the image inline, so the provider never has to reach the storage', async () => {
    respondWith(
      JSON.stringify({
        amount: 1,
        categoryId: '0',
        date: '2026-03-01',
        title: 'x',
      }),
    )
    await extractExpenseInformationFromImage(IMAGE)

    expect(mockFetch).toHaveBeenCalledWith(IMAGE, { redirect: 'error' })
    const request = mockCreate.mock.calls[0][0]
    const imageParts = request.messages
      .flatMap((message: { content: unknown[] }) => message.content)
      .filter((part: { type: string }) => part.type === 'image_url')
    expect(imageParts).toEqual([
      {
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${IMAGE_BYTES.toString('base64')}`,
        },
      },
    ])
    expect(JSON.stringify(request)).not.toContain(IMAGE)
  })

  it.each([
    ['the storage answers with an error', { status: 404 }, '(404)'],
    ['the file is not an image', { contentType: 'text/html' }, 'not an image'],
    ['the file has no content type', { contentType: null }, 'not an image'],
    [
      'the storage declares a file that is too large',
      { contentLength: String(16 * 1024 * 1024) },
      'too large',
    ],
    [
      'the file turns out too large without a declared length',
      { body: Buffer.alloc(16 * 1024 * 1024), contentLength: null },
      'too large',
    ],
  ])('does not call the model when %s', async (_name, storage, message) => {
    storageServes(storage)
    respondWith(JSON.stringify({ amount: 1 }))
    await expect(extractExpenseInformationFromImage(IMAGE)).rejects.toThrow(
      message,
    )
    expect(mockCreate).not.toHaveBeenCalled()
  })
})
