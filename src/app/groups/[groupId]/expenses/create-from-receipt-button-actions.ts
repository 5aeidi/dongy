'use server'

import { getCategories } from '@/lib/api'
import { env } from '@/lib/env'
import { getRuntimeFeatureFlags } from '@/lib/featureFlags'
import { getOpenAIClient } from '@/lib/openai'
import { isAllowedUploadUrl } from '@/lib/uploaded-image-url'
import { formatCategoryForAIPrompt } from '@/lib/utils'
import { z } from 'zod'

// The model is contractually bound to this shape by `strict: true` below, but
// the response is still parsed rather than trusted: a self-hosted or older
// endpoint may ignore the schema.
const receiptResponseSchema = z.object({
  amount: z.number(),
  categoryId: z.string(),
  date: z.string(),
  title: z.string(),
})

// Inline images are limited by providers (Gemini: ~20 MB per request), and a
// phone photo of a receipt is far below this.
const MAX_RECEIPT_IMAGE_BYTES = 15 * 1024 * 1024

/**
 * Download an uploaded receipt and return it as a base64 `data:` URL.
 *
 * The model provider cannot always fetch the upload URL itself: a private
 * bucket, or a local S3 such as MinIO on localhost, is unreachable from its
 * servers (Gemini answers "Cannot fetch content from the provided URL").
 * Sending the bytes inline works with every OpenAI-compatible vision API.
 * Callers must have checked the URL with `isAllowedUploadUrl` first.
 */
async function fetchImageAsDataUrl(imageUrl: string): Promise<string> {
  // `redirect: 'error'` keeps the request on the allow-listed host.
  const response = await fetch(imageUrl, { redirect: 'error' })
  if (!response.ok) {
    throw new Error(`Could not read the receipt image (${response.status}).`)
  }
  const contentType = response.headers.get('content-type')?.split(';')[0]
  if (!contentType?.startsWith('image/')) {
    throw new Error('The receipt file is not an image.')
  }
  const declaredLength = Number(response.headers.get('content-length'))
  if (declaredLength > MAX_RECEIPT_IMAGE_BYTES) {
    throw new Error('The receipt image is too large.')
  }
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length > MAX_RECEIPT_IMAGE_BYTES) {
    throw new Error('The receipt image is too large.')
  }
  return `data:${contentType};base64,${bytes.toString('base64')}`
}

export async function extractExpenseInformationFromImage(imageUrl: string) {
  'use server'

  // Enforce the feature flag server-side: the UI gate only hides the button, it
  // does not prevent the action endpoint from being invoked directly.
  const { enableReceiptExtract } = await getRuntimeFeatureFlags()
  if (!enableReceiptExtract) {
    throw new Error('Receipt extraction is not enabled.')
  }

  // Only extract from images the app itself uploaded. Without this, an arbitrary
  // caller-supplied URL is forwarded to the model, enabling SSRF-via-OpenAI and
  // unbounded API spend.
  if (!isAllowedUploadUrl(imageUrl)) {
    throw new Error('Invalid image URL.')
  }

  const imageDataUrl = await fetchImageAsDataUrl(imageUrl)
  const categories = await getCategories()
  const openai = getOpenAIClient()

  const completion = await openai.chat.completions.create({
    model: env.OPENAI_MODEL_RECEIPT_EXTRACT,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'receipt_response',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            categoryId: { type: 'string' },
            date: { type: 'string' },
            title: { type: 'string' },
          },
          required: ['amount', 'categoryId', 'date', 'title'],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `
              This image contains a receipt.
              Read the total amount and store it as a non-formatted number without any other text or currency.
              Then guess the category for this receipt among the following categories and store its ID: ${categories.map(
                (category) => formatCategoryForAIPrompt(category),
              )}.
              Guess the expense’s date and store it as yyyy-mm-dd.
              Guess a title for the expense.`,
          },
        ],
      },
      {
        role: 'user',
        content: [{ type: 'image_url', image_url: { url: imageDataUrl } }],
      },
    ],
  })

  const messageContent = completion.choices.at(0)?.message.content
  const parsed = (() => {
    if (!messageContent) return null
    try {
      return receiptResponseSchema.parse(JSON.parse(messageContent))
    } catch {
      // Malformed or schema-violating output: report "nothing extracted"
      // rather than passing junk on to the expense form.
      return null
    }
  })()

  const amount = Number(parsed?.amount)
  return {
    amount: Number.isFinite(amount) ? amount : null,
    categoryId: parsed?.categoryId ?? null,
    date: parsed?.date ?? null,
    title: parsed?.title ?? null,
  }
}

export type ReceiptExtractedInfo = Awaited<
  ReturnType<typeof extractExpenseInformationFromImage>
>
