import assert from 'assert'

import { getPlayerColors } from '@/utils/playerColor.utils.ts'

describe('getPlayerColors', () => {
  it('gives every player a different color while the palette allows', () => {
    const names = ['Adam', 'Borys', 'Cieć', 'Dupek', 'Edek', 'Filip']
    const colors = getPlayerColors(names)
    assert.strictEqual(new Set(colors.values()).size, names.length)
  })

  it('does not depend on the order of names', () => {
    const a = getPlayerColors(['Adam', 'Borys', 'Dupek'])
    const b = getPlayerColors(['Dupek', 'Adam', 'Borys'])
    assert.deepStrictEqual([...a].sort(), [...b].sort())
  })

  it('assigns a color to every player beyond the palette size', () => {
    const names = Array.from({ length: 20 }, (_, i) => `Player ${i}`)
    assert.strictEqual(getPlayerColors(names).size, names.length)
  })
})
