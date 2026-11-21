import { locales, type Locale } from '../../../packages/domain/src/i18n'

export type LanguageFamily = {
  id: string
  label: string
  locales: Locale[]
  /** Suggested sibling locales for terminology when packing this family. */
  refsHint: string
}

/**
 * Fixed family groupings for translation dispatch (every non-en locale exactly
 * once).
 */
export const LANGUAGE_FAMILIES: LanguageFamily[] = [
  {
    id: 'iranian',
    label: 'Iranian',
    locales: ['fa-IR'],
    refsHint: '',
  },
]

export function nonEnLocales(): Locale[] {
  return locales.filter((l) => l !== 'en-US')
}

/** Throws if families drift from domain locales. */
export function assertFamiliesCoverAllLocales(): void {
  const covered = new Set(LANGUAGE_FAMILIES.flatMap((f) => f.locales))
  const expected = nonEnLocales()
  const missing = expected.filter((l) => !covered.has(l))
  const extra = [...covered].filter(
    (l) => !(expected as readonly string[]).includes(l),
  )
  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      `LANGUAGE_FAMILIES out of sync (missing: ${missing.join(',') || '—'}; extra: ${extra.join(',') || '—'})`,
    )
  }
  const seen = new Set<string>()
  for (const locale of LANGUAGE_FAMILIES.flatMap((f) => f.locales)) {
    if (seen.has(locale)) {
      throw new Error(`LANGUAGE_FAMILIES duplicate locale: ${locale}`)
    }
    seen.add(locale)
  }
}

export function familyForLocale(locale: Locale): LanguageFamily | undefined {
  return LANGUAGE_FAMILIES.find((f) => f.locales.includes(locale))
}
