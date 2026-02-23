import { ref } from 'vue'

import { Card } from '@/types/PlayingCards.type.ts'

const visible = ref(false)
let onSelectCallback: ((card: Card) => void) | null = null

export function useCardKeyboard() {
  function show(callback: (card: Card) => void) {
    onSelectCallback = callback
    visible.value = true
  }

  function hide() {
    visible.value = false
    onSelectCallback = null
  }

  function handleSelect(card: Card) {
    if (onSelectCallback) {
      onSelectCallback(card)
    }
    hide()
  }

  return {
    visible,
    show,
    hide,
    handleSelect,
  }
}
