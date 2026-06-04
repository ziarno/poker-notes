import type { FinishedGame, Transfer } from '@/types'
import { POT_KEY_NAME } from '@/constants'

export function getGameSettlement(game: FinishedGame): Transfer[] {
  // Compute each participant's net balance, then greedily pair the largest
  // creditor with the largest debtor until everyone nets out. This produces
  // at most (N - 1) transfers for N non-zero balances — optimal for the
  // balance shapes typical of a home-poker game and O(N log N) overall.

  // Positive balance = needs to receive; negative = needs to pay.
  // The POT is a virtual participant: it starts at zero and only shows up
  // here if existing transfers moved money in or out of it.
  const balances = new Map<string, number>([[POT_KEY_NAME, 0]])
  for (const player of game.players) {
    balances.set(player.name, player.out - player.in)
  }
  for (const t of game.transfers) {
    const from = balances.get(t.from)
    if (from !== undefined) balances.set(t.from, from + t.value)
    const to = balances.get(t.to)
    if (to !== undefined) balances.set(t.to, to - t.value)
  }

  const winners: { name: string; balance: number }[] = []
  const losers: { name: string; balance: number }[] = []
  for (const [name, balance] of balances) {
    if (balance > 0) winners.push({ name, balance })
    else if (balance < 0) losers.push({ name, balance })
  }
  winners.sort((a, b) => b.balance - a.balance)
  losers.sort((a, b) => a.balance - b.balance)

  const transfers: Transfer[] = []
  let wi = 0
  let li = 0
  while (wi < winners.length && li < losers.length) {
    const w = winners[wi]!
    const l = losers[li]!
    const amount = Math.min(w.balance, -l.balance)
    transfers.push({ from: l.name, to: w.name, value: amount })
    w.balance -= amount
    l.balance += amount
    if (w.balance === 0) wi++
    if (l.balance === 0) li++
  }

  return transfers
}
