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
    <span class="text-ft-ink-70">{{ from }}</span>
    <TransferArrow class="text-ft-ink-30 dark:text-ft-ink-70 mx-5" />
    <span class="text-ft-ink font-semibold">{{ to }}</span>
    <span class="text-ft-ink justify-self-end text-[16px] font-bold mr-2">{{
      value
    }}</span>
    <slot name="action" />
  </div>
</template>
