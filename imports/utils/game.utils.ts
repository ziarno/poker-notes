import type { FinishedGame, Game } from '../types'
import { applyAdjustments } from './adjustments.utils.ts'
import { isNumber } from './number.utils.ts'

export function getTotalIn(game: Game) {
  return game.players.reduce((sum, p) => sum + p.in, 0)
}

export function getTotalOut(game: Game) {
  return game.players.reduce((sum, p) => sum + (p.out || 0), 0)
}

export function isGameOngoing(game: Game) {
  return game.players.some(p => !isNumber(p.out))
}

export function isGameFinished(game: Game): game is FinishedGame {
  return !isGameOngoing(game)
}

// Compares the totals with adjustments applied on top of the raw out values.
export function isGameInOutEqual(game: Game) {
  return getTotalIn(game) === getTotalOut(applyAdjustments(game))
}
