<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { useCardKeyboard } from '@/composables/useCardKeyboard.ts'
import { Card } from '@/types/PlayingCards.type.ts'
import PlayingCardText from '@/ui/views/Odds/components/PlayingCardText.vue'

const props = defineProps<{ max: number; label?: string; onFelt?: boolean }>()
const cards = defineModel<Card[]>({ default: [] })

const { show, isActive, onActiveIdChanged } = useCardKeyboard(
  cards,
  props.max,
  props.label
)

const buttonRef = useTemplateRef('button')

function scrollIntoView() {
  if (isActive.value) {
    setTimeout(() => {
      buttonRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }
}

onActiveIdChanged(scrollIntoView)

const placeholderCount = computed(() =>
  Math.max(0, props.max - cards.value.length)
)
</script>

<template>
  <button
    ref="button"
    type="button"
    class="inline-flex cursor-pointer items-center gap-[5px] rounded-lg
      border-none bg-transparent p-[6px] outline outline-2 outline-offset-0
      transition-[outline-color] duration-200"
    :class="isActive ? 'outline-black/70' : 'outline-transparent'"
    @click="show"
  >
    <PlayingCardText v-for="(card, i) in cards" :key="i" :card="card" />
    <span
      v-for="i in placeholderCount"
      :key="`p${i}`"
      class="h-12 w-[34px] rounded-[5px] border-[1.5px] border-dashed
        bg-transparent"
      :class="onFelt ? 'border-white/22' : 'border-ft-ink-30'"
    ></span>
  </button>
</template>
