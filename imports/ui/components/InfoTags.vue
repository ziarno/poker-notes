<script setup lang="ts">
import Tag from '@volt/Tag.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { Game } from '@/types'
import { getGameTotal } from '@/utils'

const { t } = useI18n()

const props = defineProps<{
  game: Game
  long?: boolean
}>()

const gameTotal = computed(() => getGameTotal(props.game))
</script>

<template>
  <div class="shrink-0 space-x-1">
    <Tag severity="secondary" icon="pi pi-user">
      <span class="font-light" v-if="long">{{ t('players_count') }}:</span>
      <span>{{ game.players.length }}</span>
    </Tag>
    <Tag severity="secondary" icon="pi pi-wallet">
      <span class="font-light" v-if="long">{{ t('buy_in') }}:</span>
      <span>{{ game.buyIn }}</span>
    </Tag>
    <Tag severity="secondary" icon="pi pi-dollar">
      <span class="font-light" v-if="long">{{ t('pot') }}:</span>
      <span>{{ gameTotal }}</span>
    </Tag>
  </div>
</template>

<style scoped></style>
