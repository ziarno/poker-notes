import assert from 'assert'

import { Game, HistoryItem, Transfer } from '@/types'
import {
  editTransferInGame,
  removeTransferFromGame,
} from '@/utils/transfer.utils.ts'

const AB50: Transfer = { from: 'Adam', to: 'Borys', value: 50 }

function added(transfer: Transfer, time: number): HistoryItem {
  return { type: 'transfer_added', timestamp: new Date(time), transfer }
}

function createGame(
  transfers: Transfer[],
  history: HistoryItem[]
): Pick<Game, 'transfers' | 'history'> {
  return { transfers, history }
}

describe('removeTransferFromGame', () => {
  it('removes only one of identical transfers', () => {
    const game = createGame(
      [AB50, { ...AB50 }],
      [added(AB50, 1000), added(AB50, 2000)]
    )
    const result = removeTransferFromGame(game, AB50)
    assert.deepStrictEqual(result.transfers, [AB50])
    assert.strictEqual(result.history.length, 1)
  })

  it('removes the latest matching transfer_added item', () => {
    const game = createGame(
      [AB50, AB50],
      [added(AB50, 3000), added(AB50, 1000), added(AB50, 2000)]
    )
    const result = removeTransferFromGame(game, AB50)
    assert.deepStrictEqual(
      result.history.map(item => item.timestamp.getTime()),
      [1000, 2000]
    )
  })

  it('leaves other history items untouched', () => {
    const other: Transfer = { from: 'Adam', to: 'Borys', value: 20 }
    const history: HistoryItem[] = [
      { type: 'player_added', timestamp: new Date(500), playerName: 'Cieć' },
      { type: 'transfer_removed', timestamp: new Date(900), transfer: AB50 },
      added(other, 1500),
      added(AB50, 1000),
    ]
    const result = removeTransferFromGame(
      createGame([AB50, other], history),
      AB50
    )
    assert.deepStrictEqual(result.transfers, [other])
    assert.deepStrictEqual(result.history, [history[0], history[1], history[2]])
  })

  it('changes nothing when no transfer matches', () => {
    const game = createGame([AB50], [added(AB50, 1000)])
    const result = removeTransferFromGame(game, { ...AB50, value: 10 })
    assert.strictEqual(result, game)
  })

  it('removes the transfer when no history item matches', () => {
    const history: HistoryItem[] = [
      { type: 'player_added', timestamp: new Date(500), playerName: 'Cieć' },
    ]
    const result = removeTransferFromGame(createGame([AB50], history), AB50)
    assert.deepStrictEqual(result.transfers, [])
    assert.deepStrictEqual(result.history, history)
  })
})

describe('editTransferInGame', () => {
  const CB20: Transfer = { from: 'Cieć', to: 'Borys', value: 20 }

  it('replaces the last matching transfer', () => {
    const other: Transfer = { from: 'Adam', to: 'Borys', value: 10 }
    const game = createGame([AB50, other, AB50], [])
    const result = editTransferInGame(game, AB50, CB20)
    assert.deepStrictEqual(result.transfers, [AB50, other, CB20])
  })

  it('updates the latest transfer_added item, keeping its timestamp', () => {
    const game = createGame(
      [AB50, AB50],
      [added(AB50, 1000), added(AB50, 2000)]
    )
    const result = editTransferInGame(game, AB50, CB20)
    assert.deepStrictEqual(result.history, [
      added(AB50, 1000),
      added(CB20, 2000),
    ])
  })

  it('leaves transfer_removed items untouched', () => {
    const removed: HistoryItem = {
      type: 'transfer_removed',
      timestamp: new Date(3000),
      transfer: AB50,
    }
    const game = createGame([AB50], [added(AB50, 1000), removed])
    const result = editTransferInGame(game, AB50, CB20)
    assert.deepStrictEqual(result.history, [added(CB20, 1000), removed])
  })

  it('changes nothing when no transfer matches', () => {
    const game = createGame([AB50], [added(AB50, 1000)])
    const result = editTransferInGame(game, CB20, AB50)
    assert.strictEqual(result, game)
  })
})
