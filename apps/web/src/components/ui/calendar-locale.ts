import type { DayPickerLocale } from 'react-day-picker'
import { enUS, faIR } from 'react-day-picker/locale'

import type { Locale } from '@spliit/domain/i18n'

const calendarLocaleByAppLocale: Record<Locale, DayPickerLocale> = {
  'en-US': enUS,
  'fa-IR': faIR,
}

export function getCalendarLocale(locale: string): DayPickerLocale {
  return calendarLocaleByAppLocale[locale as Locale] ?? enUS
}
