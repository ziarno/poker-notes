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
  <RouterLink class="cursor-pointer" :to="`/${game._id}`">
    <Panel class="border-surface-200 mb-5 border-1 shadow-md">
      <template #header>
        <div class="flex w-full justify-between">
          <p class="flex-1 text-lg">{{ game.title }}</p>
          <InfoTags :game="game" class="ml-3" />
        </div>
      </template>
      <div class="flex justify-between">
        <span class="flex-grow-1 text-sm">
          {{ game.players.map(p => p.name).join(', ') }}
        </span>
        <span class="ml-5 flex shrink-0 items-end text-sm opacity-50">
          {{ date }}
        </span>
      </div>
    </Panel>
  </RouterLink>
</template>
