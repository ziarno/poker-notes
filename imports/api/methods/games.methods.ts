import { GamesCollection } from '@/api/collections'
import { Game, NewGame } from '@/types'
import { capitalizeFirstLetter } from '@/utils/string.utils.ts'

Meteor.methods({
  async createGame(game: NewGame) {
    const newGame: Game = {
      title: capitalizeFirstLetter(game.title),
      buyIn: game.buyIn,
      players: game.players.map(p => ({ ...p, out: null })),
      transfers: [],
      date: new Date(),
    }
    return GamesCollection.insertAsync(newGame)
  },
})
