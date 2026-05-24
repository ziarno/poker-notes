<script setup lang="ts">
import transferArrowUrl from '@/assets/transfer-arrow.svg'

defineProps<{
  from: string
  to: string
  value: number
}>()
</script>

<template>
  <div
    class="bg-ft-surface border-ft-ink-10 flex items-center gap-2 rounded-xl
      border px-3 py-[10px]"
  >
    <span class="text-ft-ink-70">{{ from }}</span>
    <img :src="transferArrowUrl" alt="" class="shrink-0 dark:invert" />
    <span class="text-ft-ink font-semibold">{{ to }}</span>
    <span class="text-ft-ink ml-auto text-[16px] font-bold">{{ value }}</span>
    <slot name="action" />
  </div>
</template>
