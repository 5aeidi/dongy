import type { Locale } from '@/i18n/request'
import { localeLabels, locales } from '@/i18n/request'

// DONGY: short language codes instead of country flags.
export const localeFlags = {
  'en-US': 'EN',
  'fa-IR': 'FA',
} satisfies Record<Locale, string>

export const popularLocales = [
  'fa-IR',
  'en-US',
] as const satisfies ReadonlyArray<Locale>

export const localeRegionOrder = [
  'americas',
  'asiaPacific',
  'europe',
  'middleEastAndNorthAfrica',
] as const

type LocaleRegion = (typeof localeRegionOrder)[number]

export const localeRegions = {
  'en-US': 'americas',
  'fa-IR': 'middleEastAndNorthAfrica',
} as const satisfies Record<Locale, LocaleRegion>

const localizedLabelsCache = new Map<Locale, Record<Locale, string>>()

const SYNTHETIC_LOCALE_LABELS: Partial<Record<Locale, string>> = {}

const SYNTHETIC_FALLBACK: Partial<Record<Locale, string>> = {}

function adjustMacedoniaLabel(label: string, locale: string): string {
  if (locale !== 'mk-MK' && locale !== 'mk') return label
  return label
    .replace(/\s*\(Северна Македонија\)\s*/g, '')
    .replace(/\s*\(North Macedonia\)\s*/g, '')
    .replace(/（北マケドニア）\s*/g, '')
    .replace(/（北马其顿）\s*/g, '')
    .replace(/（北馬其頓）\s*/g, '')
    .replace(/\(북마케도니아\)\s*/g, '')
    .replace(/\([^)]*Nord[^)]*\)\s*/gi, '')
    .replace(/\([^)]*Север[^)]*\)\s*/g, '')
    .replace(/\([^)]*Північ[^)]*\)\s*/g, '')
    .replace(/\([^)]*مقدونيا[^)]*\)\s*/g, '')
    .replace(/\([^)]*मकदूनिया[^)]*\)\s*/g, '')
    .replace(/\([^)]*Makedo[^)]*\)\s*/gi, '')
    .replace(/\([^)]*Mazedon[^)]*\)\s*/gi, '')
    .replace(/\([^)]*Macedo[^)]*\)\s*/gi, '')
    .replace(/\([^)]*Macédo[^)]*\)\s*/g, '')
    .replace(/\([^)]*Bắc[^)]*\)\s*/g, '')
    .trim()
}

export function getLocalizedLocaleLabels(
  displayLocale: Locale,
): Record<Locale, string> {
  const cached = localizedLabelsCache.get(displayLocale)
  if (cached) return cached

  let displayNames: Intl.DisplayNames | undefined
  let fallbackDisplayNames: Intl.DisplayNames | undefined
  const fallbackLocale = SYNTHETIC_FALLBACK[displayLocale]
  try {
    displayNames = new Intl.DisplayNames([displayLocale], {
      type: 'language',
    })
  } catch {
    // Native labels remain usable in environments without Intl.DisplayNames.
  }
  if (fallbackLocale) {
    try {
      fallbackDisplayNames = new Intl.DisplayNames([fallbackLocale], {
        type: 'language',
      })
    } catch {
      // ignore
    }
  }

  const labels = Object.fromEntries(
    locales.map((locale) => {
      if (SYNTHETIC_LOCALE_LABELS[locale]) {
        return [locale, SYNTHETIC_LOCALE_LABELS[locale]!]
      }
      let label: string | undefined
      const raw = displayNames?.of(locale)
      if (raw && raw !== locale) {
        label = raw
      } else if (fallbackDisplayNames) {
        const fb = fallbackDisplayNames.of(locale)
        if (fb && fb !== locale) label = fb
      }
      label ??= localeLabels[locale]
      label = adjustMacedoniaLabel(label, locale)
      return [locale, label]
    }),
  ) as Record<Locale, string>
  localizedLabelsCache.set(displayLocale, labels)
  return labels
}
