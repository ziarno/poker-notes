const STORAGE_KEY = 'gamePinCodes'

function getPinCodeMap(): Record<string, string> {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

function savePinCodeMap(map: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function generatePinCode(): string {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0')
}

export function savePinCode(gameId: string, pin: string) {
  const map = getPinCodeMap()
  map[gameId] = pin
  savePinCodeMap(map)
}

export function getPinCode(gameId: string): string | undefined {
  return getPinCodeMap()[gameId]
}

export function hasValidPinCode(
  gameId: string,
  pinCode: string | undefined
): boolean {
  if (!pinCode) return false
  const storedPin = getPinCode(gameId)
  return storedPin === pinCode
}
