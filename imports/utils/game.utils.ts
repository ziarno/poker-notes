import { flow, omitBy, reduce, sortBy, tap, thru } from 'lodash/fp'

import { POT_KEY_NAME } from '@/constants/transfers.const.ts'
import { FinishedGame, FinishedPlayer, Game, Transfer } from '@/types'
import { isNumber } from '@/utils/number.utils.ts'

export function getTotalIn(game: Game) {
  return game.players.reduce((sum, p) => sum + p.in, 0)
}

export function getTotalOut(game: Game) {
  return game.players.reduce((sum, p) => sum + (p.out || 0), 0)
}

export function isGameOngoing(game: Game) {
  return game.players.some(p => !isNumber(p.out))
}

export function isGameFinished(game: Game): game is FinishedGame {
  return !isGameOngoing(game)
}

export function isGameInOutEqual(game: Game) {
  return getTotalIn(game) === getTotalOut(game)
}

export function getGameSettlement(game: FinishedGame) {
  function giveMoney(from: string, to: string, value: number) {
    loosers[from] += value
    winners[to] -= value
    if (loosers[from] === 0) delete loosers[from]
    if (winners[to] === 0) delete winners[to]

    transfers.push({ from, to, value })
  }

  function cascadeAllDebt() {
    for (const looserName in loosers) {
      for (const winnerName in winners) {
        while (loosers[looserName] < 0 && winners[winnerName] > 0) {
          const looserAmount = Math.abs(loosers[looserName])
          const winnerAmount = winners[winnerName]
          const amountToGive = Math.min(looserAmount, winnerAmount)
          giveMoney(looserName, winnerName, amountToGive)
        }
      }
    }
  }

  function findSumParts(players, sum, sumPartsCount, omitPlayerNames) {
    if (sum === 0) return null
    if (sumPartsCount === 1) {
      for (const name in players) {
        if (omitPlayerNames.includes(name)) continue
        if (players[name] === sum) return [[name, players[name]]]
      }
    }

    for (const name in players) {
      if (omitPlayerNames.includes(name)) continue
      const amount = players[name]
      const otherPlayers = findSumParts(
        players,
        sum - amount,
        sumPartsCount - 1,
        omitPlayerNames ? [...omitPlayerNames, name] : [name]
      )
      if (otherPlayers) {
        return [...otherPlayers, [name, players[name]]]
      }
    }

    return null
  }

  type SettlementPlayers = Record<string, number>

  const POT = { name: POT_KEY_NAME, in: 0, out: 0 }
  const transfers: Transfer[] = []

  const [winners, loosers]: [SettlementPlayers, SettlementPlayers] = flow(
    sortBy((p: FinishedPlayer) => p.in - p.out),
    reduce((players: SettlementPlayers, p: FinishedPlayer) => {
      players[p.name] = p.out - p.in
      return players
    }, {}),
    tap((players: SettlementPlayers) => {
      game.transfers.forEach(t => {
        if (!isNumber(players[t.from]) || !isNumber(players[t.to])) return
        players[t.from]! += t.value
        players[t.to]! -= t.value
      })
    }),
    omitBy(value => value === 0),
    thru((players: SettlementPlayers) => {
      const winners: SettlementPlayers = {}
      const loosers: SettlementPlayers = {}
      for (const name in players) {
        if (players[name]! > 0) {
          winners[name] = players[name]
        } else {
          loosers[name] = players[name]
        }
      }
      return [winners, loosers]
    })
  )([...game.players, POT])

  for (const sumPartsCount of [1, 2, 3, 4, 5]) {
    for (const winnerName in winners) {
      if (!(winnerName in winners)) continue
      const winnerAmount = winners[winnerName]
      const loosersToPay = findSumParts(
        loosers,
        -winnerAmount,
        sumPartsCount,
        []
      )

      if (loosersToPay) {
        loosersToPay.forEach(looser =>
          giveMoney(looser[0], winnerName, -looser[1])
        )
      }
    }
    for (const looserName in loosers) {
      if (!(looserName in loosers)) continue
      const looserAmount = loosers[looserName]
      const winnersToPay = findSumParts(
        winners,
        -looserAmount,
        sumPartsCount,
        []
      )
      if (winnersToPay) {
        winnersToPay.forEach(winner =>
          giveMoney(looserName, winner[0], winner[1])
        )
      }
    }
  }

  cascadeAllDebt()

  return transfers
}
