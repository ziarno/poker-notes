import assert from 'assert'

import {
  getGamePlayerColors,
  getPlayerColors,
} from '@/utils/playerColor.utils.ts'

describe('getPlayerColors', () => {
  it('gives every player a different color while the palette allows', () => {
    const names = ['Adam', 'Borys', 'Cieć', 'Dupek', 'Edek', 'Filip']
    const colors = getPlayerColors(names)
    assert.strictEqual(new Set(colors.values()).size, names.length)
  })

  it('keeps existing colors when a name is appended', () => {
    const names = ['Adam', 'Borys', 'Cieć']
    const before = getPlayerColors(names)
    const after = getPlayerColors([...names, 'Dupek', 'Edek'])
    for (const name of names) {
      assert.strictEqual(after.get(name), before.get(name))
    }
  })

  it('assigns a color to every player beyond the palette size', () => {
    const names = Array.from({ length: 20 }, (_, i) => `Player ${i}`)
    assert.strictEqual(getPlayerColors(names).size, names.length)
  })
})

describe('getGamePlayerColors', () => {
  it('colors players before anything happens in history', () => {
    const colors = getGamePlayerColors({
      players: [
        { name: 'Adam', in: 50, out: null },
        { name: 'Borys', in: 50, out: null },
      ],
      history: [],
    })
    assert.deepStrictEqual([...colors.keys()].sort(), ['Adam', 'Borys'])
  })

  it('keeps colors for players only present in history', () => {
    const colors = getGamePlayerColors({
      players: [{ name: 'Adam', in: 50, out: null }],
      history: [
        { type: 'player_removed', timestamp: new Date(), playerName: 'Borys' },
      ],
    })
    assert.ok(colors.has('Borys'))
  })

  it('keeps colors stable when players join mid-game', () => {
    const players = ['Adam', 'Borys', 'Cieć'].map(name => ({
      name,
      in: 50,
      out: null,
    }))
    const before = getGamePlayerColors({ players, history: [] })
    const after = getGamePlayerColors({
      players: [...players, { name: 'Aaron', in: 50, out: null }],
      history: [
        {
          type: 'player_added',
          timestamp: new Date(),
          playerName: 'Aaron',
          in: 50,
        },
      ],
    })
    for (const { name } of players) {
      assert.strictEqual(after.get(name), before.get(name))
    }
  })
})
