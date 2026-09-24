<script setup lang="ts">
import MinusIcon from '@primevue/icons/minus'
import PlusIcon from '@primevue/icons/plus'
import InputNumber from 'primevue/inputnumber'
import { computed } from 'vue'

import { isNumber } from '@/utils'

const props = withDefaults(
  defineProps<{
    step?: number
    min?: number
    max?: number
    size?: 'small' | 'normal'
    fluid?: boolean
    placeholder?: number
  }>(),
  {
    step: 10,
    min: 0,
    size: 'normal',
    fluid: false,
  }
)

const value = defineModel<number | null>({ default: 0 })

const isSmall = computed(() => props.size === 'small')

const INCREMENT_SELECTOR = '[data-increment]'

// Pressing "+" on an empty input jumps straight to the placeholder instead of
// starting from 0. Runs in the capture phase so it can stop InputNumber's own
// spin handler from also stepping the value.
function fillPlaceholder(event: MouseEvent | KeyboardEvent) {
  if (props.placeholder === undefined || isNumber(value.value)) return
  const onIncrement = !!(event.target as Element).closest(INCREMENT_SELECTOR)
  const isIncrement =
    event instanceof KeyboardEvent
      ? event.key === 'ArrowUp' ||
        (onIncrement && (event.key === 'Enter' || event.key === ' '))
      : onIncrement
  if (!isIncrement) return
  event.preventDefault()
  event.stopPropagation()
  value.value = props.placeholder
}

const pt = computed(() => {
  const btnBase =
    'inline-flex items-center justify-center cursor-pointer border-0 bg-transparent text-ft-ink-70 hover:bg-neutral-50 hover:text-ft-ink disabled:opacity-40 disabled:pointer-events-none transition-colors'
  const btnSize = isSmall.value ? 'px-2 py-1' : 'px-[10px] py-[6px]'
  const inputBase =
    'order-2 border-0 border-x border-ft-ink-10 bg-ft-surface-alt text-center font-bold text-ft-ink outline-none placeholder:text-ft-ink-30 focus:border-ft-ink-10'
  const inputSize = isSmall.value
    ? 'w-[40px] px-1 py-1 text-[15px]'
    : 'w-[56px] px-1 py-[6px] text-[16px]'
  return {
    root: `inline-flex w-fit items-stretch overflow-hidden rounded-xl border border-ft-ink-10 bg-ft-surface ${
      props.fluid ? 'flex !w-full' : ''
    }`,
    pcInputText: {
      root: `${inputBase} ${inputSize} ${props.fluid ? 'flex-1 !w-full' : ''}`,
    },
    incrementButton: {
      class: `${btnBase} ${btnSize} order-3`,
      'data-increment': '',
    },
    decrementButton: `${btnBase} ${btnSize} order-1`,
  }
})
</script>

<template>
  <div
    class="contents"
    @mousedown.capture="fillPlaceholder"
    @keydown.capture="fillPlaceholder"
  >
    <InputNumber
      v-model="value"
      unstyled
      :min="min"
      :max="max"
      :step="step"
      :placeholder="placeholder?.toString()"
      show-buttons
      button-layout="horizontal"
      :use-grouping="false"
      :pt="pt"
    >
      <template #incrementicon>
        <PlusIcon class="text-[13px]" />
      </template>
      <template #decrementicon>
        <MinusIcon class="text-[13px]" />
      </template>
    </InputNumber>
  </div>
</template>
