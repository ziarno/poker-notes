<script setup lang="ts">
import { Game } from '@/types'

import Panel from '/src/volt/Panel.vue'
import Tag from '/src/volt/Tag.vue'

defineProps<{
  game: Game
}>()
</script>

<template>
  <RouterLink class="cursor-pointer" :to="`/games/${game._id}`">
    <Panel class="mb-5">
      <template #header>
        <h1 class="text-xl">
          {{ game.title }}
        </h1>
      </template>
      <template #icons>
        <Tag>
          <i class="fa-light fa-chevron-down"></i>
        </Tag>
      </template>
      <div class="flex flex-wrap">
        <span v-for="(player, index) in game.players">
          <span>{{ index === 0 ? '' : ', ' }}{{ player.name }}</span>
        </span>
      </div>
    </Panel>
  </RouterLink>
</template>

<style scoped></style>
