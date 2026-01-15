export function isNumber(num: any): boolean {
  return typeof num === 'number' && !isNaN(num) && isFinite(num)
}
