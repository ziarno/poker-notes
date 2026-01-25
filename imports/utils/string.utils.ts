import { isNull } from 'lodash'

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function balanceToString(num: number | null): string {
  if (isNull(num)) return ''
  const sign = num === 0 ? '' : num > 0 ? '+' : '-'
  return `${sign}\u00A0${Math.abs(num)}`
}
