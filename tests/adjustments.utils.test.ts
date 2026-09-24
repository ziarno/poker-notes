import assert from 'assert'

import { Adjustment, Game } from '@/types'
import {
  applyAdjustments,
  distributeEvenly,
  getAdjustment,
  getInOutDifference,
  hasAdjustments,
} from '@/utils/adjustments.utils.ts'
import { isGameInOutEqual } from '@/utils/game.utils.ts'

function createGame(
  players: { name: string; in: number; out: number | null }[],
  adjustments?: Adjustment[]
): Game {
  return {
    _id: 'test-game',
    creatorId: 'test-user',
    pinCode: '1234',
    buyIn: 10,
    title: 'Test Game',
    date: new Date(),
    players,
    transfers: [],
    history: [],
    adjustments,
  }
}

function sum(values: number[]) {
  return values.reduce((a, b) => a + b, 0)
}

describe('distributeEvenly', () => {
  it('splits an evenly divisible amount into equal parts', () => {
    assert.deepStrictEqual(distributeEvenly(9, 3), [3, 3, 3])
  })

  it('gives the rounded-up share to the first parts', () => {
    assert.deepStrictEqual(distributeEvenly(10, 3), [4, 3, 3])
    assert.deepStrictEqual(distributeEvenly(11, 3), [4, 4, 3])
  })

  it('rounds the magnitude up for negative amounts', () => {
    assert.deepStrictEqual(distributeEvenly(-10, 3), [-4, -3, -3])
  })

  it('gives zeros when the amount is smaller than the number of parts', () => {
    assert.deepStrictEqual(distributeEvenly(-2, 4), [-1, -1, 0, 0])
  })

  it('always sums up to the amount, with parts differing by at most 1', () => {
    for (const total of [-37, -5, 0, 1, 7, 100]) {
      for (let count = 1; count <= 7; count++) {
        const parts = distributeEvenly(total, count)
        assert.strictEqual(parts.length, count)
        assert.strictEqual(sum(parts), total)
        assert.ok(Math.max(...parts) - Math.min(...parts) <= 1)
        assert.ok(parts.every(Number.isInteger))
      }
    }
  })

  it('returns an empty list for zero parts', () => {
    assert.deepStrictEqual(distributeEvenly(10, 0), [])
  })
})

describe('getInOutDifference', () => {
  it('is totalIn − raw totalOut, ignoring adjustments', () => {
    const game = createGame(
      [
        { name: 'Alice', in: 100, out: 150 },
        { name: 'Bob', in: 100, out: 60 },
      ],
      [{ name: 'Alice', delta: -10 }]
    )
    assert.strictEqual(getInOutDifference(game), -10)
  })
})

describe('applyAdjustments', () => {
  it('adds each delta to the raw out value', () => {
    const game = createGame(
      [
        { name: 'Alice', in: 100, out: 150 },
        { name: 'Bob', in: 100, out: 60 },
      ],
      [{ name: 'Alice', delta: -10 }]
    )
    assert.deepStrictEqual(
      applyAdjustments(game).players.map(p => p.out),
      [140, 60]
    )
  })

  it('leaves players without an out value untouched', () => {
    const game = createGame(
      [{ name: 'Alice', in: 100, out: null }],
      [{ name: 'Alice', delta: -10 }]
    )
    assert.strictEqual(applyAdjustments(game).players[0]!.out, null)
  })

  it('allows the adjusted out to go below zero', () => {
    const game = createGame(
      [{ name: 'Alice', in: 100, out: 0 }],
      [{ name: 'Alice', delta: -4 }]
    )
    assert.strictEqual(applyAdjustments(game).players[0]!.out, -4)
  })

  it('returns the game as is when there are no adjustments', () => {
    const game = createGame([{ name: 'Alice', in: 100, out: 100 }])
    assert.strictEqual(applyAdjustments(game), game)
  })
})

describe('adjustment helpers', () => {
  const game = createGame(
    [
      { name: 'Alice', in: 100, out: 150 },
      { name: 'Bob', in: 100, out: 60 },
    ],
    [{ name: 'Alice', delta: -10 }]
  )

  it('getAdjustment returns the delta or 0', () => {
    assert.strictEqual(getAdjustment(game, 'Alice'), -10)
    assert.strictEqual(getAdjustment(game, 'Bob'), 0)
  })

  it('hasAdjustments ignores zero deltas and missing field', () => {
    assert.strictEqual(hasAdjustments(game), true)
    assert.strictEqual(hasAdjustments(createGame([])), false)
    assert.strictEqual(
      hasAdjustments(createGame([], [{ name: 'Alice', delta: 0 }])),
      false
    )
  })

  it('isGameInOutEqual compares adjusted totals', () => {
    assert.strictEqual(isGameInOutEqual(game), true)
    assert.strictEqual(
      isGameInOutEqual({ ...game, adjustments: undefined }),
      false
    )
  })
})
