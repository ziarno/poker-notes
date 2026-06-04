import type { FinishedGame, Game } from '../types'
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

export function isGameInOutEqual(game: Game) {
  return getTotalIn(game) === getTotalOut(game)
}
