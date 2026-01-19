import { Game } from '@/types'

export function getTotalIn(game: Game) {
  return game.players.reduce((sum, p) => sum + p.in, 0)
}

export function getTotalOut(game: Game) {
  return game.players.reduce((sum, p) => sum + (p.out || 0), 0)
}
