import { describe, expect, it } from 'vitest'

import { buildStructurePrompt, buildVisionPrompt } from './prompts'

const groupCurrencyInput = { currency: 'IRT', currencyCode: 'IRT' }

describe('receipt prompts: Iranian rial/toman guidance', () => {
  it('tells the vision model how to tell rials from tomans', () => {
    const prompt = buildVisionPrompt({
      noun: 'image',
      groupCurrencyInput,
      ocrOnly: false,
    })
    expect(prompt).toContain('1 toman = 10 rials')
    expect(prompt).toContain('150,000 to 2,000,000 toman')
    expect(prompt).toContain('return currencyCode IRR')
    expect(prompt).toContain('Never rescale the digits yourself')
  })

  it('gives the structuring model the same guidance', () => {
    const prompt = buildStructurePrompt({
      origin: 'ocr',
      documentText: 'x',
      groupCurrencyInput,
    })
    expect(prompt).toContain('1 toman = 10 rials')
    expect(prompt).toContain('or IRT when they are tomans')
  })
})
