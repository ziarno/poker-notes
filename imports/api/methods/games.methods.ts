import { createMethod } from 'meteor/jam:method'

import { GamesCollection } from '@/api/collections'
import { Game, NewGame, NewPlayer, Transfer } from '@/types'
import { capitalizeFirstLetter } from '@/utils/string.utils.ts'

export const createGame = createMethod({
  name: 'createGame',
  validate: () => {},
  async run(game: NewGame) {
    const newGame: Game = {
      _id: game._id,
      title: capitalizeFirstLetter(game.title),
      buyIn: game.buyIn,
      players: game.players.map(p => ({ ...p, out: null })),
      transfers: [],
      date: new Date(),
    }
    return GamesCollection.insertAsync(newGame)
  },
})

export const removeGame = createMethod({
  name: 'removeGame',
  validate: () => {},
  async run(id: string) {
    return GamesCollection.removeAsync(id)
  },
})

export const setPlayerIn = createMethod({
  name: 'setPlayerIn',
  validate: () => {},
  async run({
    gameId,
    playerName,
    inValue,
  }: {
    gameId: string
    playerName: string
    inValue: number
  }) {
    return GamesCollection.updateAsync(
      { _id: gameId, 'players.name': playerName },
      { $set: { 'players.$.in': inValue } }
    )
  },
})

export const setPlayerOut = createMethod({
  name: 'setPlayerOut',
  validate: () => {},
  async run({
    gameId,
    playerName,
    outValue,
  }: {
    gameId: string
    playerName: string
    outValue: number | null
  }) {
    return GamesCollection.updateAsync(
      { _id: gameId, 'players.name': playerName },
      { $set: { 'players.$.out': outValue } }
    )
  },
})

export const addPlayer = createMethod({
  name: 'addPlayer',
  validate: () => {},
  async run({ gameId, player }: { gameId: string; player: NewPlayer }) {
    return GamesCollection.updateAsync(
      { _id: gameId },
      { $push: { players: { name: player.name, in: player.in, out: null } } }
    )
  },
})

export const removePlayer = createMethod({
  name: 'removePlayer',
  validate: () => {},
  async run({ gameId, playerName }: { gameId: string; playerName: string }) {
    return GamesCollection.updateAsync(
      { _id: gameId },
      {
        $pull: {
          players: { name: playerName },
          transfers: { $or: [{ from: playerName }, { to: playerName }] } as any,
        },
      }
    )
  },
})

export const addTransfer = createMethod({
  name: 'addTransfer',
  validate: () => {},
  async run({ gameId, transfer }: { gameId: string; transfer: Transfer }) {
    return GamesCollection.updateAsync(
      { _id: gameId },
      { $push: { transfers: transfer } }
    )
  },
})

export const removeTransfer = createMethod({
  name: 'removeTransfer',
  validate: () => {},
  async run({ gameId, transfer }: { gameId: string; transfer: Transfer }) {
    return GamesCollection.updateAsync(
      { _id: gameId },
      { $pull: { transfers: transfer } }
    )
  },
})
