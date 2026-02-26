import { ref } from 'vue'

import { Card } from '@/types/PlayingCards.type.ts'

export const PLAYER_MAX_CARDS = 2
export const BOARD_MAX_CARDS = 5

export type PlayerInOddsCalculator = {
  cards: Card[]
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

  return {
    players,
    board,
    addPlayer,
    removeLastPlayer,
    reset,
  }
}
