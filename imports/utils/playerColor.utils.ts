import { PLAYER_COLORS, POT_KEY_NAME } from '@/constants'
import { Game, HistoryItem, PlayerColor } from '@/types'

// Assigns palette colors in the given order, so the first players get the most
// distinct ones and appending a name never changes the colors of the names
// before it. Past the palette size, colors repeat.
export function getPlayerColors(
  names: Iterable<string>
): Map<string, PlayerColor> {
  const colors = new Map<string, PlayerColor>()
  for (const name of names) {
    if (colors.has(name)) continue
    colors.set(name, PLAYER_COLORS[colors.size % PLAYER_COLORS.length]!)
  }
  return colors
}

// Colors for every player in a game — current players plus anyone mentioned in
// its history (e.g. removed players) — so the same name gets the same color
// wherever it is shown for that game, from the very start. Players the game
// started with go first (sorted, as they have no join order), then players who
// joined later in the order they joined, so a newcomer never recolors anyone.
export function getGamePlayerColors(
  game: Pick<Game, 'players' | 'history'>
): Map<string, PlayerColor> {
  const history = [...game.history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
  const firstEvents = new Map<string, HistoryItem['type']>()
  for (const item of history) {
    const names =
      'transfer' in item
        ? [item.transfer.from, item.transfer.to]
        : [item.playerName]
    for (const name of names) {
      if (!firstEvents.has(name)) firstEvents.set(name, item.type)
    }
  }
  const allNames = new Set([
    ...game.players.map(p => p.name),
    ...firstEvents.keys(),
  ])
  allNames.delete(POT_KEY_NAME)
  const joined = [...allNames].filter(
    name => firstEvents.get(name) === 'player_added'
  )
  const initial = [...allNames].filter(name => !joined.includes(name)).sort()
  return getPlayerColors([...initial, ...joined])
}
