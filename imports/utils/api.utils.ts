import { Game } from '@/types'

export function getGameTotal(game: Game) {
  return game.players.reduce((sum, player) => sum + player.in, 0)
}
