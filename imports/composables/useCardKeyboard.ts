import { Ref, computed, onMounted, onUnmounted, ref } from 'vue'

import { Card } from '@/types/PlayingCards.type.ts'

type InputRegistration = {
  id: symbol
  cards: Ref<Card[]>
  max: number
  label: string
}

const activeId = ref<symbol | null>(null)
const registrations: InputRegistration[] = []

export function useCardKeyboard(
  cards?: Ref<Card[]>,
  max?: number,
  label?: string
) {
  const id = Symbol()
  const visible = computed(() => activeId.value !== null)
  const isActive = computed(() => activeId.value === id)
  const activeLabel = computed(
    () => registrations.find(r => r.id === activeId.value)?.label ?? null
  )

  if (cards && max) {
    onMounted(() => registrations.push({ id, cards, max, label: label ?? '' }))
    onUnmounted(() => {
      const idx = registrations.findIndex(r => r.id === id)
      if (idx !== -1) registrations.splice(idx, 1)
    })
  }

  function show() {
    activeId.value = id
  }

  function hide() {
    activeId.value = null
  }

  function getActive() {
    return registrations.find(r => r.id === activeId.value) ?? null
  }

  function isCardTaken(card: Card) {
    return registrations.some((r) =>
      r.cards.value.some((c) => c.rank === card.rank && c.suit === card.suit),
    )
  }

  function addCard(card: Card) {
    const active = getActive()
    if (!active) return
    if (isCardTaken(card)) return

    let nextCards = [...active.cards.value, card]
    if (nextCards.length > active.max) {
      nextCards = [card]
    }
    active.cards.value = nextCards
    if (nextCards.length >= active.max) {
      const currentIdx = registrations.indexOf(active)
      const next = registrations
        .slice(currentIdx + 1)
        .find(r => r.cards.value.length < r.max)
      if (next) {
        activeId.value = next.id
      } else {
        hide()
      }
    }
  }

  function removeLastCard() {
    const active = getActive()
    if (active) {
      active.cards.value = active.cards.value.slice(0, -1)
    }
  }

  return {
    visible,
    isActive,
    activeLabel,
    show,
    hide,
    addCard,
    removeLastCard,
  }
}
