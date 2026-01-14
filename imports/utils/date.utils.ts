import { formatDate as formatDateFns } from 'date-fns'
import { pl } from 'date-fns/locale'

export const formatDate: typeof formatDateFns = function (
  date,
  formatStr,
  options = {}
) {
  options.locale = pl
  return formatDateFns(date, formatStr, options)
}
