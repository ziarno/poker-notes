import type { Game } from '../types'
import { isNumber } from './number.utils.ts'

// How much the players' out values have to change in total for the raw in and
// out sums to match. Adjustments resolving the mismatch must sum up to this.
export function getInOutDifference(game: Game): number {
  return game.players.reduce((sum, p) => sum + p.in - (p.out || 0), 0)
}

export function getAdjustment(game: Game, name: string): number {
  return game.adjustments?.find(a => a.name === name)?.delta ?? 0
}

export function hasAdjustments(game: Game): boolean {
  return !!game.adjustments?.some(a => a.delta !== 0)
}

// Returns the game with each player's out value shifted by their adjustment.
// Players who haven't cashed out yet keep their `null` out.
export function applyAdjustments<T extends Game>(game: T): T {
  if (!hasAdjustments(game)) return game
  return {
    ...game,
    players: game.players.map(p =>
      isNumber(p.out) ? { ...p, out: p.out + getAdjustment(game, p.name) } : p
    ),
  }
}

// Splits an integer amount into `count` integer parts that differ by at most 1
// and sum up to the amount. The first parts get the rounded-up share.
export function distributeEvenly(amount: number, count: number): number[] {
  if (count <= 0) return []
  const sign = amount < 0 ? -1 : 1
  const magnitude = Math.abs(amount)
  const base = Math.floor(magnitude / count)
  const remainder = magnitude % count
  return Array.from(
    { length: count },
    (_, i) => sign * (base + (i < remainder ? 1 : 0)) || 0
  )
}
