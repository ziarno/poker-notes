<script setup lang="ts">
import { computed } from 'vue'

import { Game } from '@/types'
import { formatDate, getGameTotal } from '@/utils'

import Panel from '/src/volt/Panel.vue'
import Tag from '/src/volt/Tag.vue'

const props = defineProps<{
  game: Game
}>()

const gameTotal = computed(() => getGameTotal(props.game))
const date = computed(() => formatDate(props.game.date, 'E, dd.MM.yyyy'))
</script>

<template>
  <RouterLink class="cursor-pointer" :to="`/games/${game._id}`">
    <Panel class="mb-5 border-1 border-surface-400">
      <template #header>
        {{ game.title }}
      </template>
      <template #icons>
        <Tag
          severity="secondary"
          icon="pi pi-user"
          :value="game.players.length"
        />
        <Tag severity="secondary" icon="pi pi-wallet" :value="game.buyIn" />
        <Tag severity="secondary" icon="pi pi-dollar" :value="gameTotal" />
      </template>
      <div class="flex justify-between">
        <span class="flex-grow-1 text-sm">
          {{ game.players.map(p => p.name).join(', ') }}
        </span>
        <span class="text-sm ml-5 shrink-0 flex items-end opacity-50">
          {{ date }}
        </span>
      </div>
    </Panel>
  </RouterLink>
</template>

<style scoped></style>
