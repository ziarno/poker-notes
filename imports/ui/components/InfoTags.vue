<script setup lang="ts">
import Tag from '@volt/Tag.vue'
import { computed } from 'vue'

import { Game } from '@/types'
import { getGameTotal } from '@/utils'

const props = defineProps<{
  game: Game
}>()
const gameTotal = computed(() => getGameTotal(props.game))
</script>

<template>
  <div class="shrink-0 space-x-1 ml-3">
    <Tag severity="secondary" icon="pi pi-user" :value="game.players.length" />
    <Tag severity="secondary" icon="pi pi-wallet" :value="game.buyIn" />
    <Tag severity="secondary" icon="pi pi-dollar" :value="gameTotal" />
  </div>
</template>

<style scoped></style>
