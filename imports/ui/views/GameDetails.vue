<script setup lang="ts">
import { autorun, subscribe } from 'vue-meteor-tracker'
import { useRoute } from 'vue-router'

import { GamesCollection } from '@/api/collections'

const route = useRoute()
const id = route.params.id
subscribe('game', id)

const game = autorun(() => GamesCollection.findOne(id)).result
</script>

<template>
  <p>Game Details</p>
  <template v-if="game">
    <p>{{ game.title }}</p>
  </template>
</template>

<style scoped></style>
