<script setup lang="ts">
import Panel from '@volt/Panel.vue'

import { useFormattedDate } from '@/composables'
import { Game } from '@/types'
import InfoTags from '@/ui/components/InfoTags.vue'

const props = defineProps<{
  game: Game
}>()

const date = useFormattedDate(props.game.date, 'E, dd.MM.yyyy')
</script>

<template>
  <RouterLink class="cursor-pointer" :to="`/games/${game._id}`">
    <Panel class="mb-5 border-1 border-surface-200 shadow-md">
      <template #header>
        <div class="flex justify-between w-full">
          <p class="flex-1 text-lg">{{ game.title }}</p>
          <InfoTags :game="game" class="ml-3" />
        </div>
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
