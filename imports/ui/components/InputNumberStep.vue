<script setup lang="ts">
import MinusIcon from '@primevue/icons/minus'
import PlusIcon from '@primevue/icons/plus'
import InputNumber from 'primevue/inputnumber'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    step?: number
    min?: number
    max?: number
    size?: 'small' | 'normal'
    fluid?: boolean
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

const pt = computed(() => {
  const btnBase =
    'inline-flex items-center justify-center cursor-pointer border-0 bg-transparent text-ft-ink-70 hover:bg-neutral-50 hover:text-ft-ink disabled:opacity-40 disabled:pointer-events-none transition-colors'
  const btnSize = isSmall.value ? 'px-2 py-1' : 'px-[10px] py-[6px]'
  const inputBase =
    'order-2 border-0 border-x border-ft-ink-10 bg-ft-surface-alt text-center font-bold text-ft-ink outline-none focus:border-ft-ink-10'
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
    incrementButton: `${btnBase} ${btnSize} order-3`,
    decrementButton: `${btnBase} ${btnSize} order-1`,
  }
})
</script>

<template>
  <InputNumber
    v-model="value"
    unstyled
    :min="min"
    :max="max"
    :step="step"
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
</template>
