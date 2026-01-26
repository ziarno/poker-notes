import { formatDate as formatDateFns } from 'date-fns'
import { enUS, pl } from 'date-fns/locale'

import type { Langs } from '@/lang'
import { i18n } from '@/startup/main-client'

const locales = {
  en: enUS,
  pl,
} as const

export const formatDate: typeof formatDateFns = (
  date,
  formatStr,
  options = {}
) => {
  const locale = i18n.global.locale as Langs
  return formatDateFns(date, formatStr, { ...options, locale: locales[locale] })
}
