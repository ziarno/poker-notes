import { createMethod } from 'meteor/jam:method'
import { Meteor } from 'meteor/meteor'

import { GamesCollection } from '@/api/collections'
import { renamePlayerInHistoryAndTransfers } from '@/api/methods/games.methods.utils.ts'
import {
  Game,
  HistoryItem,
  HistoryItemTransfer,
  NewGame,
  NewPlayer,
  Player,
  Transfer,
} from '@/types'
import { isNumber } from '@/utils/number.utils.ts'
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
      pinCode: game.pinCode,
      title: capitalizeFirstLetter(game.title),
      buyIn: game.buyIn,
      players: game.players.map(p => ({ ...p, out: null })),
      transfers: [],
      date: new Date(),
      history: [],
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
  validate({
    gameId,
    playerName,
    player,
  }: {
    gameId: string
    playerName: string
    player: Player
  }) {
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
    const game = await GamesCollection.findOneAsync(gameId)
    if (!game) return

    const oldPlayer = game.players.find(p => p.name === playerName)
    if (!oldPlayer) return

    const historyItems: HistoryItem[] = []
    const timestamp = new Date()

    if (oldPlayer.in !== player.in) {
      historyItems.push({
        type: 'player_in_changed',
        timestamp,
        playerName: player.name,
        oldValue: oldPlayer.in,
        newValue: player.in,
      })
    }
    if (oldPlayer.out !== player.out && player.out !== null) {
      historyItems.push({
        type: 'player_out_changed',
        timestamp,
        playerName: player.name,
        newValue: player.out,
        balance: isNumber(player.out) ? player.out - player.in : null,
      })
    }

    await GamesCollection.updateAsync(
      { _id: gameId, 'players.name': playerName },
      {
        $set: { 'players.$': player },
        $push: { history: { $each: historyItems } },
      }
    )

    if (playerName !== player.name) {
      await renamePlayerInHistoryAndTransfers(gameId, playerName, player.name)
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
    const historyItem: HistoryItem = {
      type: 'player_added',
      timestamp: new Date(),
      playerName: player.name,
    }
    return GamesCollection.updateAsync(
      { _id: gameId },
      {
        $push: {
          players: { name: player.name, in: player.in, out: null },
          history: historyItem,
        },
      }
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
    const historyItem: HistoryItem = {
      type: 'player_removed',
      timestamp: new Date(),
      playerName,
    }
    return GamesCollection.updateAsync(
      { _id: gameId },
      {
        $pull: {
          players: { name: playerName },
          transfers: { $or: [{ from: playerName }, { to: playerName }] } as any,
        },
        $push: { history: historyItem },
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
    const historyItem: HistoryItemTransfer = {
      type: 'transfer_added',
      timestamp: new Date(),
      transfer: { from: transfer.from, to: transfer.to, value: transfer.value },
    }
    return GamesCollection.updateAsync(
      { _id: gameId },
      { $push: { transfers: transfer, history: historyItem } }
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
    const historyItem: HistoryItem = {
      type: 'transfer_removed',
      timestamp: new Date(),
      transfer: { from: transfer.from, to: transfer.to, value: transfer.value },
    }
    return GamesCollection.updateAsync(
      { _id: gameId },
      { $pull: { transfers: transfer }, $push: { history: historyItem } }
    )
  },
})
