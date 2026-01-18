import { GamesCollection } from '@/api/collections'
import { Game, NewGame, NewPlayer } from '@/types'
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
  async removeGame(id: string) {
    return GamesCollection.removeAsync(id)
  },
  async setPlayerIn(gameId: string, playerName: string, inValue: number) {
    return GamesCollection.updateAsync(
      { _id: gameId, 'players.name': playerName },
      { $set: { 'players.$.in': inValue } }
    )
  },
  async setPlayerOut(
    gameId: string,
    playerName: string,
    outValue: number | null
  ) {
    return GamesCollection.updateAsync(
      { _id: gameId, 'players.name': playerName },
      { $set: { 'players.$.out': outValue } }
    )
  },
  async addPlayer(gameId: string, player: NewPlayer) {
    return GamesCollection.updateAsync(
      { _id: gameId },
      { $push: { players: { name: player.name, in: player.in, out: null } } }
    )
  },
})
