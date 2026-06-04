import assert from 'assert'

import { POT_KEY_NAME } from '@/constants/transfers.const.ts'
import { FinishedGame, Transfer } from '@/types'
import { getGameSettlement } from '@/utils/gameSettlement.utils.ts'
import gameA from './gameA.mock.json'

function assertBalances(game: FinishedGame, result: Transfer[]) {
  const balances: Record<string, number> = { [POT_KEY_NAME]: 0 }
  for (const player of game.players) {
    balances[player.name] = player.out - player.in
  }
  for (const t of [...game.transfers, ...result]) {
    if (balances[t.from] !== undefined) balances[t.from]! += t.value
    if (balances[t.to] !== undefined) balances[t.to]! -= t.value
  }
  for (const [name, balance] of Object.entries(balances)) {
    assert.strictEqual(
      balance,
      0,
      `${name} did not settle to zero (left with ${balance})`
    )
  }
}

describe('getGameSettlement', function () {
  function createGame(
    players: { name: string; in: number; out: number }[],
    transfers: { from: string; to: string; value: number }[] = []
  ): FinishedGame {
    return {
      _id: 'test-game',
      creatorId: 'test-user',
      pinCode: '1234',
      buyIn: 10,
      title: 'Test Game',
      date: new Date(),
      players,
      transfers,
      history: [],
    }
  }

  it('should return empty array when all players break even', function () {
    const game = createGame([
      { name: 'Alice', in: 100, out: 100 },
      { name: 'Bob', in: 100, out: 100 },
    ])

    const result = getGameSettlement(game)

    assert.deepStrictEqual(result, [])
  })

  it('should create single transfer for 2-player game', function () {
    const game = createGame([
      { name: 'Alice', in: 100, out: 120 }, // wins 20
      { name: 'Bob', in: 100, out: 80 }, // loses 20
    ])

    const result = getGameSettlement(game)

    assert.strictEqual(result.length, 1)
    assert.deepStrictEqual(result[0], { from: 'Bob', to: 'Alice', value: 20 })
  })

  it('should handle 3 players with one winner and two losers', function () {
    const game = createGame([
      { name: 'Alice', in: 100, out: 150 }, // wins 50
      { name: 'Bob', in: 100, out: 70 }, // loses 30
      { name: 'Charlie', in: 100, out: 80 }, // loses 20
    ])

    const result = getGameSettlement(game)

    // Total transferred to Alice should equal 50
    const aliceReceived = result
      .filter(t => t.to === 'Alice')
      .reduce((sum, t) => sum + t.value, 0)
    assert.strictEqual(aliceReceived, 50)
  })

  it('should handle 3 players with two winners and one loser', function () {
    const game = createGame([
      { name: 'Alice', in: 100, out: 120 }, // wins 20
      { name: 'Bob', in: 100, out: 130 }, // wins 30
      { name: 'Charlie', in: 100, out: 50 }, // loses 50
    ])

    const result = getGameSettlement(game)

    // Charlie should pay total of 50
    const charliePaid = result
      .filter(t => t.from === 'Charlie')
      .reduce((sum, t) => sum + t.value, 0)
    assert.strictEqual(charliePaid, 50)
  })

  it('should account for existing transfers', function () {
    const game = createGame(
      [
        { name: 'Alice', in: 100, out: 120 }, // wins 20
        { name: 'Bob', in: 100, out: 80 }, // loses 20
      ],
      [{ from: 'Bob', to: 'Alice', value: 10 }] // Bob already paid 10
    )

    const result = getGameSettlement(game)

    // Bob should only need to pay 10 more
    assert.strictEqual(result.length, 1)
    assert.deepStrictEqual(result[0], { from: 'Bob', to: 'Alice', value: 10 })
  })

  it('should return empty when existing transfers cover all debts', function () {
    const game = createGame(
      [
        { name: 'Alice', in: 100, out: 120 }, // wins 20
        { name: 'Bob', in: 100, out: 80 }, // loses 20
      ],
      [{ from: 'Bob', to: 'Alice', value: 20 }] // Already settled
    )

    const result = getGameSettlement(game)

    assert.deepStrictEqual(result, [])
  })

  it('should handle complex 4-player game', function () {
    const game = createGame([
      { name: 'Alice', in: 100, out: 140 }, // wins 40
      { name: 'Bob', in: 100, out: 110 }, // wins 10
      { name: 'Charlie', in: 100, out: 70 }, // loses 30
      { name: 'Diana', in: 100, out: 80 }, // loses 20
    ])

    const result = getGameSettlement(game)

    // Verify net balances are preserved
    const netByPlayer: Record<string, number> = {}
    for (const t of result) {
      netByPlayer[t.from] = (netByPlayer[t.from] || 0) - t.value
      netByPlayer[t.to] = (netByPlayer[t.to] || 0) + t.value
    }

    assert.strictEqual(netByPlayer['Alice'] || 0, 40)
    assert.strictEqual(netByPlayer['Bob'] || 0, 10)
    assert.strictEqual(netByPlayer['Charlie'] || 0, -30)
    assert.strictEqual(netByPlayer['Diana'] || 0, -20)
  })

  it('should handle different buy-in amounts', function () {
    const game = createGame([
      { name: 'Alice', in: 50, out: 80 }, // wins 30
      { name: 'Bob', in: 150, out: 120 }, // loses 30
    ])

    const result = getGameSettlement(game)

    assert.strictEqual(result.length, 1)
    assert.deepStrictEqual(result[0], { from: 'Bob', to: 'Alice', value: 30 })
  })

  it('should optimize transfers to minimize count when possible', function () {
    // Scenario where Alice wins 30, Bob loses 30, Charlie breaks even
    const game = createGame([
      { name: 'Alice', in: 100, out: 130 }, // wins 30
      { name: 'Bob', in: 100, out: 70 }, // loses 30
      { name: 'Charlie', in: 100, out: 100 }, // breaks even
    ])

    const result = getGameSettlement(game)

    // Should be single transfer from Bob to Alice
    assert.strictEqual(result.length, 1)
    assert.deepStrictEqual(result[0], { from: 'Bob', to: 'Alice', value: 30 })
  })

  it('should settle a 16-player game correctly and quickly', function () {
    this.timeout(10_000)
    const game = createGame(gameA.players, gameA.transfers)

    const start = performance.now()
    const result = getGameSettlement(game)
    const durationMs = performance.now() - start

    assertBalances(game, result)

    const MAX_DURATION_MS = 200
    assert.ok(
      durationMs < MAX_DURATION_MS,
      `getGameSettlement took ${durationMs.toFixed(2)}ms, ` +
        `expected under ${MAX_DURATION_MS}ms`
    )
  })
})
