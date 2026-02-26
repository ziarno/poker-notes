import { TexasHoldem } from 'poker-odds-calc'
import { computed, ref } from 'vue'

import { SUIT_TO_LETTER } from '@/constants/playingCrads.const'
import { Card } from '@/types/PlayingCards.type.ts'

export const PLAYER_MAX_CARDS = 2
export const BOARD_MAX_CARDS = 5

export type PlayerInOddsCalculator = {
  cards: Card[]
}

export type PlayerOdds = {
  wins: string
  ties: string
}

function toLibCard(card: Card): string {
  return `${card.rank}${SUIT_TO_LETTER[card.suit]}`
}

const players = ref<PlayerInOddsCalculator[]>([{ cards: [] }, { cards: [] }])
const board = ref<Card[]>([])

export function useSelectedCards() {
  function addPlayer() {
    players.value = [...players.value, { cards: [] }]
  }

  function removeLastPlayer() {
    if (players.value.length > 2) {
      players.value = players.value.slice(0, -1)
    }
  }

  function reset() {
    players.value = [{ cards: [] }, { cards: [] }]
    board.value = []
  }

  const odds = computed<(PlayerOdds | null)[] | null>(() => {
    const activePlayers = players.value.filter(
      p => p.cards.length === PLAYER_MAX_CARDS
    )
    if (activePlayers.length < 2) return null
    if (board.value.length !== 0 && board.value.length < 3) return null

    try {
      const table = new TexasHoldem()
      activePlayers.forEach(p => {
        table.addPlayer(p.cards.map(toLibCard) as [string, string])
      })
      if (board.value.length > 0) {
        table.setBoard(board.value.map(toLibCard))
      }

      const result = table.calculate()
      const resultPlayers = result.getPlayers()

      return players.value.map(player => {
        if (player.cards.length < PLAYER_MAX_CARDS) return null
        const activeIdx = activePlayers.indexOf(player)
        const rp = resultPlayers[activeIdx]!
        return {
          wins: rp.getWinsPercentageString(),
          ties: rp.getTiesPercentageString(),
        }
      })
    } catch {
      return null
    }
  })

  return {
    players,
    board,
    odds,
    addPlayer,
    removeLastPlayer,
    reset,
  }
}
