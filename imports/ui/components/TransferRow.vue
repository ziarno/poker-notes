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
    class="bg-ft-surface border-ft-ink-10 flex items-center gap-2 rounded-xl
      border px-3 py-[10px]"
  >
    <span class="text-ft-ink-70">{{ from }}</span>
    <TransferArrow class="text-ft-ink-30 dark:text-ft-ink-70" />
    <span class="text-ft-ink font-semibold">{{ to }}</span>
    <span class="text-ft-ink ml-auto text-[16px] font-bold">{{ value }}</span>
    <slot name="action" />
  </div>
</template>
