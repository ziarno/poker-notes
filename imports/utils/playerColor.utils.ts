import { PLAYER_COLORS, POT_KEY_NAME } from '@/constants'
import { HistoryItem, PlayerColor } from '@/types'

// FNV-1a — a stable string hash, so a name always prefers the same slot.
function hashString(str: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export function getPlayerColors(
  names: Iterable<string>
): Map<string, PlayerColor> {
  const sorted = [...new Set(names)].sort()
  const size = Math.min(sorted.length, PLAYER_COLORS.length)
  const taken = new Set<number>()
  const colors = new Map<string, PlayerColor>()
  for (const name of sorted) {
    if (taken.size === size) taken.clear()
    let slot = hashString(name) % size
    while (taken.has(slot)) slot = (slot + 1) % size
    taken.add(slot)
    colors.set(name, PLAYER_COLORS[slot]!)
  }
  return colors
}

// Colors for every player mentioned in a game's history, so the same name gets
// the same color wherever it is shown for that game.
export function getHistoryPlayerColors(
  history: HistoryItem[]
): Map<string, PlayerColor> {
  const names = history.flatMap(item =>
    'transfer' in item
      ? [item.transfer.from, item.transfer.to]
      : [item.playerName]
  )
  return getPlayerColors(names.filter(name => name !== POT_KEY_NAME))
}
