import { ref, watch } from 'vue'

import { SUIT_TO_LETTER } from '@/constants/playingCrads.const'
import {
  Card,
  PlayerInOddsCalculator,
  PlayerOdds,
} from '@/types/PlayingCards.type.ts'

export const PLAYER_MAX_CARDS = 2
export const BOARD_MAX_CARDS = 5

function toLibCard(card: Card): string {
  return `${card.rank}${SUIT_TO_LETTER[card.suit]}`
}

const players = ref<PlayerInOddsCalculator[]>([{ cards: [] }, { cards: [] }])
const board = ref<Card[]>([])
const odds = ref<(PlayerOdds | null)[] | null>(null)
const isLoading = ref(false)

let currentRequestId = 0
const worker = new Worker(
  new URL('../workers/oddsWorker.ts', import.meta.url),
  { type: 'module' }
)

function getActivePlayers() {
  return players.value.filter(p => p.cards.length === PLAYER_MAX_CARDS)
}

function resetOdds() {
  odds.value = null
  isLoading.value = false
}

worker.onmessage = (
  event: MessageEvent<{ requestId: number; result: PlayerOdds[] | null }>
) => {
  const { requestId, result } = event.data
  if (requestId !== currentRequestId) return

  isLoading.value = false

  if (!result) {
    resetOdds()
    return
  }

  const activePlayers = getActivePlayers()
  odds.value = players.value.map(player => {
    if (player.cards.length < PLAYER_MAX_CARDS) return null
    return result[activePlayers.indexOf(player)] ?? null
  })
}

watch(
  [players, board],
  () => {
    const activePlayers = getActivePlayers()
    if (
      activePlayers.length < 2 ||
      (board.value.length !== 0 && board.value.length < 3)
    ) {
      resetOdds()
      return
    }

    isLoading.value = true
    const requestId = ++currentRequestId
    worker.postMessage({
      requestId,
      players: activePlayers.map(p => p.cards.map(toLibCard)),
      board: board.value.map(toLibCard),
    })
  },
  { deep: true }
)

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
    odds,
    calculating: isLoading,
    addPlayer,
    removeLastPlayer,
    reset,
  }
}
