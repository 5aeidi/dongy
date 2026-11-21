export const localeLabels = {
  'en-US': 'English',
  'fa-IR': 'فارسی',
} as const

export const locales = Object.keys(localeLabels) as Array<
  keyof typeof localeLabels
>
export type Locale = keyof typeof localeLabels
export type Locales = ReadonlyArray<Locale>
export const defaultLocale: Locale = 'en-US'

/**
 * Sparse overlay locales and the fallback bundles they inherit from.
 *
 * A locale listed here ships only the keys that genuinely differ from its
 * parent: any missing key resolves through the chain at runtime (i18next
 * `fallbackLng`) and is treated as covered by the `bun i18n` tooling. Locales
 * NOT listed here are full bundles that must keep full parity with en-US (with
 * en-US itself as their only runtime fallback).
 *
 * Keep entries minimal — chains resolve transitively, so `'en-AU': ['en-GB']`
 * already implies `en-AU → en-GB → en-US`.
 */
export const localeFallbacks = {} as const satisfies Partial<
  Record<Locale, readonly Locale[]>
>

/** Sparse overlay locale: ships only overrides, inherits the rest. */
export function isSparseLocale(locale: string): boolean {
  return Object.hasOwn(localeFallbacks, locale)
}

/**
 * Ordered fallback bundle chain for a locale (transitive, cycle-safe, always
 * terminating at the default locale — empty for en-US itself).
 */
export function fallbackChain(locale: Locale): Locale[] {
  if (locale === defaultLocale) return []
  const chain: Locale[] = []
  const seen = new Set<string>([locale])
  const queue: Locale[] = [
    ...((localeFallbacks[locale as keyof typeof localeFallbacks] ?? [
      defaultLocale,
    ]) as readonly Locale[]),
  ]
  while (queue.length > 0) {
    const next = queue.shift()!
    if (seen.has(next)) continue
    seen.add(next)
    chain.push(next)
    const deeper = localeFallbacks[next as keyof typeof localeFallbacks] as
      | readonly Locale[]
      | undefined
    if (deeper) {
      for (const candidate of deeper) {
        if (!seen.has(candidate)) queue.push(candidate)
      }
    }
  }
  if (!seen.has(defaultLocale)) chain.push(defaultLocale)
  return chain
}

/**
 * Translation bundle identifiers are not always complete BCP 47 locale tags.
 * Resolve them to the regional locale whose formatting conventions match the
 * flag/region presented in the locale picker before using Intl APIs.
 */
const formattingLocaleByLocale: Readonly<Record<string, string>> = {
  id: 'id-ID',
  ca: 'ca-ES',
  es: 'es-ES',
  eu: 'eu-ES',
  // The generic Portuguese bundle is the Portugal variant; pt-BR is explicit.
  pt: 'pt-PT',
  ro: 'ro-RO',
  fi: 'fi-FI',
  he: 'he-IL',
  ko: 'ko-KR',
  vi: 'vi-VN',
  // en-GZ is a synthetic translation bundle, not a real territory.
  'en-GZ': 'en-US',
}

export function resolveFormattingLocale(locale: string): string {
  const mapped = formattingLocaleByLocale[locale]
  if (mapped) return mapped
  try {
    return new Intl.Locale(locale).toString()
  } catch {
    return defaultLocale
  }
}

/** Returns ISO weekday numbering (Monday = 1, Sunday = 7). */
export function firstDayOfWeek(locale: string): number {
  try {
    const localeInfo = new Intl.Locale(
      resolveFormattingLocale(locale),
    ) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number }
      weekInfo?: { firstDay: number }
    }
    const weekInfo =
      typeof localeInfo.getWeekInfo === 'function'
        ? localeInfo.getWeekInfo()
        : localeInfo.weekInfo
    if (weekInfo && typeof weekInfo.firstDay === 'number') {
      return weekInfo.firstDay
    }
  } catch {
    // Fall through to the default English-US convention.
  }
  return 7
}

export function isRtlLocale(locale: string): boolean {
  try {
    return new Set(['ar', 'fa', 'he', 'ur']).has(
      new Intl.Locale(resolveFormattingLocale(locale)).language,
    )
  } catch {
    return false
  }
}
