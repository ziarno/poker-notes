<script setup lang="ts">
import { useGetName } from '@/composables'
import { PlayerColor } from '@/types'

const { name, color } = defineProps<{
  name: string
  color?: PlayerColor
}>()

const getName = useGetName()
</script>

<template>
  <span
    class="font-bold"
    :class="{ 'ft-player-name': color }"
    :style="
      color
        ? { '--player-color': color.light, '--player-color-dark': color.dark }
        : undefined
    "
    >{{ getName(name) }}</span
  >
</template>
