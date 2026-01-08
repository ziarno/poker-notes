<script setup lang="ts">
import { Game } from '@/types'

defineProps<{
  game: Game
}>()
</script>

<template>
  <div class="p-1 mx-1 my-1 border-solid border-1 border-gray-700">
    {{ game.title }}
  </div>
</template>

<style scoped></style>
