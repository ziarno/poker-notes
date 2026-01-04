<script setup lang="ts">
import { autorun, subscribe } from 'vue-meteor-tracker'
import { GamesCollection } from '/imports/api/collections'

subscribe('games')
const games = autorun(() => GamesCollection.find({}).fetch()).result
console.log(games)
</script>

<template>
  <p>GamesList</p>
  <ul class="list-disc underline">
    <li v-for="game of games" :key="game._id" class="hover:text-green-700">
      <a :href="`/games/${game._id}`">{{ game.title }}</a>
    </li>
  </ul>
</template>

<style scoped></style>
