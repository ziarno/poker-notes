<script setup lang="ts">
import Tag from '@volt/Tag.vue'
import { computed } from 'vue'

import { useFormattedDate } from '@/composables'
import { Game } from '@/types'
import { getGameTotal } from '@/utils'

const props = defineProps<{
  game: Game
  long?: boolean
}>()

const gameTotal = computed(() => getGameTotal(props.game))
const date = useFormattedDate(props.game.date, 'dd.MM.yyyy')
</script>

<template>
  <div class="shrink-0 space-x-1">
    <Tag v-if="long" severity="secondary" icon="pi pi-calendar">
      <span class="font-light">{{ date }}</span>
    </Tag>
    <Tag severity="secondary" icon="pi pi-user">
      <span class="font-light" v-if="long">{{ $t('players_count') }}:</span>
      <span>{{ game.players.length }}</span>
    </Tag>
    <Tag severity="secondary" icon="pi pi-wallet">
      <span class="font-light" v-if="long">{{ $t('buy_in') }}:</span>
      <span>{{ game.buyIn }}</span>
    </Tag>
    <Tag severity="secondary" icon="pi pi-dollar">
      <span class="font-light" v-if="long">{{ $t('pot') }}:</span>
      <span>{{ gameTotal }}</span>
    </Tag>
  </div>
</template>

<style scoped></style>
