<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { ref } from 'vue'
import { autorun, subscribe } from 'vue-meteor-tracker'
import { useRoute } from 'vue-router'

import { GamesCollection } from '@/api/collections'
import { useFormattedDate } from '@/composables'
import InfoTags from '@/ui/components/InfoTags.vue'
import NavigationHeader from '@/ui/components/NavigationHeader.vue'
import GameMenu from '@/ui/views/GameDetails/components/GameMenu.vue'
import PlayersTable from '@/ui/views/GameDetails/components/PlayersTable.vue'
import Settlement from '@/ui/views/GameDetails/components/Settlement.vue'
import Transfers from '@/ui/views/GameDetails/components/Transfers.vue'
import { addAccessToGameId } from '@/utils/accessToGameIds.utils.ts'

const route = useRoute()

const id = route.params.id as string
subscribe('game', id)
addAccessToGameId(id)

const game = autorun(() => GamesCollection.findOne(id)).result
const date = useFormattedDate(game.value?.date, 'dd.MM.yyyy')
const showMenu = ref(false)
</script>

<template>
  <div>
    <NavigationHeader :title="game?.title" :subtitle="date">
      <template #icon>
        <SecondaryButton
          @click="showMenu = true"
          variant="outlined"
          icon="pi pi-bars"
        />
      </template>
    </NavigationHeader>
    <template v-if="game">
      <InfoTags
        :game="game"
        long
        class="mt-5 flex flex-wrap items-start justify-around space-x-1"
      />
      <PlayersTable :game="game" />
      <Transfers :game="game" />
      <Settlement :game="game" />
      <GameMenu :game="game" v-model:visible="showMenu" />
    </template>
  </div>
</template>
