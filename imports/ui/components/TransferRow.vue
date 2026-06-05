<script setup lang="ts">
import TransferArrow from '@/ui/components/TransferArrow.vue'

defineProps<{
  from: string
  to: string
  value: number
}>()
</script>

<template>
  <div
    class="bg-ft-surface border-ft-ink-10 col-span-full grid grid-cols-subgrid
      items-center rounded-xl border px-3 py-[10px]"
  >
    <span class="text-ft-ink-70 min-w-0 break-words">{{ from }}</span>
    <TransferArrow class="text-ft-ink-30 dark:text-ft-ink-70 mx-2" />
    <span class="text-ft-ink min-w-0 font-semibold break-words">{{ to }}</span>
    <span
      class="text-ft-ink justify-self-end text-[16px] font-bold mr-2 ml-2"
      >{{ value }}</span
    >
    <slot name="action" />
  </div>
</template>
