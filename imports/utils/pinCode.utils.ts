import { useStorage } from '@vueuse/core'

const STORAGE_KEY = 'gamePinCodes'

export const pinCodes = useStorage<Record<string, string>>(STORAGE_KEY, {})

export function generatePinCode(): string {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0')
}

export function savePinCode(gameId: string, pin: string) {
  pinCodes.value[gameId] = pin
}

export function getPinCode(gameId: string): string | undefined {
  return pinCodes.value[gameId]
}

export function hasValidPinCode(
  gameId: string,
  pinCode: string | undefined
): boolean {
  if (!pinCode) return false
  return getPinCode(gameId) === pinCode
}
