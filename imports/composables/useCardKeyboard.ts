import { ref } from 'vue'

import { Card } from '@/types/PlayingCards.type.ts'

const visible = ref(true)
let onSelectCallback: ((card: Card) => void) | null = null
let onDeleteCallback: (() => void) | null = null

export function useCardKeyboard() {
  function show(callbacks: {
    onSelect: (card: Card) => void
    onDelete: () => void
  }) {
    onSelectCallback = callbacks.onSelect
    onDeleteCallback = callbacks.onDelete
    visible.value = true
  }

  function hide() {
    visible.value = false
    onSelectCallback = null
    onDeleteCallback = null
  }

  function handleSelect(card: Card) {
    if (onSelectCallback) {
      onSelectCallback(card)
    }
  }

  function handleDelete() {
    if (onDeleteCallback) {
      onDeleteCallback()
    }
  }

  return {
    visible,
    show,
    hide,
    handleSelect,
    handleDelete,
  }
}
