import { isNumber } from '@/utils/number.utils.ts'

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function balanceToString(num: number | null): string {
  if (!isNumber(num)) return ''
  const sign = num === 0 ? '' : num > 0 ? '+' : '-'
  return `${sign}\u00A0${Math.abs(num)}`
}
