<script setup lang="ts">
import { PlayerColor } from '@/types'
import PlayerName from '@/ui/components/PlayerName.vue'
import TransferArrow from '@/ui/components/TransferArrow.vue'

defineProps<{
  from: string
  to: string
  value: number
  colors: Map<string, PlayerColor>
}>()
</script>

<template>
  <div
    class="bg-ft-surface border-ft-ink-10 col-span-full grid grid-cols-subgrid
      items-center rounded-xl border px-3 py-[10px]"
  >
    <PlayerName
      :name="from"
      :color="colors.get(from)"
      class="min-w-0 break-words"
    />
    <TransferArrow class="text-ft-ink-30 dark:text-ft-ink-70 mx-2" />
    <PlayerName
      :name="to"
      :color="colors.get(to)"
      class="min-w-0 break-words"
    />
    <span
      class="text-ft-ink justify-self-end text-[16px] font-bold mr-2 ml-2"
      >{{ value }}</span
    >
    <slot name="action" />
  </div>
</template>
