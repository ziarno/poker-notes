import { Meteor } from 'meteor/meteor'
import { createMethod } from 'meteor/jam:method'

import { GamesCollection } from '@/api/collections'
import { Game, NewGame, NewPlayer, Player, Transfer } from '@/types'
import { capitalizeFirstLetter } from '@/utils/string.utils.ts'

function check(condition: boolean, message: string) {
  if (!condition) throw new Meteor.Error('validation-error', message)
}

export const createGame = createMethod({
  name: 'createGame',
  validate(game: NewGame) {
    check(!!game.title?.trim(), 'Title is required')
    check(game.buyIn > 0, 'Buy-in must be positive')
    check(game.players?.length > 0, 'At least one player is required')
    const names = game.players.map(p => p.name)
    check(new Set(names).size === names.length, 'Player names must be unique')
  },
  async run(game: NewGame) {
    const newGame: Game = {
      _id: game._id,
      creatorId: game.creatorId,
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
  validate(id: string) {
    check(typeof id === 'string' && !!id, 'Game ID is required')
  },
  async run(id: string) {
    return GamesCollection.removeAsync(id)
  },
})

export const setPlayer = createMethod({
  name: 'setPlayer',
  validate({ gameId, playerName, player }: { gameId: string; playerName: string; player: Player }) {
    check(!!gameId, 'Game ID is required')
    check(!!playerName, 'Player name is required')
    check(!!player.name?.trim(), 'New player name is required')
    check(player.in >= 0, 'Buy-in must be non-negative')
  },
  async run({
    gameId,
    playerName,
    player,
  }: {
    gameId: string
    playerName: string
    player: Player
  }) {
    function maybeRename(name: string) {
      return name === playerName ? player.name : name
    }
    await GamesCollection.updateAsync(
      { _id: gameId, 'players.name': playerName },
      { $set: { 'players.$': player } }
    )

    if (playerName !== player.name) {
      const game = await GamesCollection.findOneAsync(gameId)
      if (game) {
        const transfers = game.transfers.map(t => ({
          ...t,
          from: maybeRename(t.from),
          to: maybeRename(t.to),
        }))
        await GamesCollection.updateAsync(gameId, {
          $set: { transfers },
        })
      }
    }
  },
})

export const addPlayer = createMethod({
  name: 'addPlayer',
  validate({ gameId, player }: { gameId: string; player: NewPlayer }) {
    check(!!gameId, 'Game ID is required')
    check(!!player.name?.trim(), 'Player name is required')
    check(player.in >= 0, 'Buy-in must be non-negative')
  },
  async run({ gameId, player }: { gameId: string; player: NewPlayer }) {
    return GamesCollection.updateAsync(
      { _id: gameId },
      { $push: { players: { name: player.name, in: player.in, out: null } } }
    )
  },
})

export const removePlayer = createMethod({
  name: 'removePlayer',
  validate({ gameId, playerName }: { gameId: string; playerName: string }) {
    check(!!gameId, 'Game ID is required')
    check(!!playerName, 'Player name is required')
  },
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
  validate({ gameId, transfer }: { gameId: string; transfer: Transfer }) {
    check(!!gameId, 'Game ID is required')
    check(!!transfer.from?.trim(), 'Transfer sender is required')
    check(!!transfer.to?.trim(), 'Transfer receiver is required')
    check(transfer.from !== transfer.to, 'Cannot transfer to yourself')
    check(transfer.value > 0, 'Transfer value must be positive')
  },
  async run({ gameId, transfer }: { gameId: string; transfer: Transfer }) {
    return GamesCollection.updateAsync(
      { _id: gameId },
      { $push: { transfers: transfer } }
    )
  },
})

export const removeTransfer = createMethod({
  name: 'removeTransfer',
  validate({ gameId, transfer }: { gameId: string; transfer: Transfer }) {
    check(!!gameId, 'Game ID is required')
    check(!!transfer.from, 'Transfer sender is required')
    check(!!transfer.to, 'Transfer receiver is required')
  },
  async run({ gameId, transfer }: { gameId: string; transfer: Transfer }) {
    return GamesCollection.updateAsync(
      { _id: gameId },
      { $pull: { transfers: transfer } }
    )
  },
})
