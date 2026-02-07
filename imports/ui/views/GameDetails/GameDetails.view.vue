<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { ref } from 'vue'
import { autorun, subscribe } from 'vue-meteor-tracker'
import { useRoute, useRouter } from 'vue-router'

import { GamesCollection } from '@/api/collections'
import { removeGame as removeGameMethod } from '@/api/methods/games.methods'
import { useFormattedDate, useIsGameCreator } from '@/composables'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import InfoTags from '@/ui/components/InfoTags.vue'
import NavigationHeader from '@/ui/components/NavigationHeader.vue'
import GameHistory from '@/ui/views/GameDetails/components/GameHistory.vue'
import PlayersTable from '@/ui/views/GameDetails/components/PlayersTable.vue'
import Settlement from '@/ui/views/GameDetails/components/Settlement.vue'
import Transfers from '@/ui/views/GameDetails/components/Transfers.vue'

const route = useRoute()
const router = useRouter()

async function removeGame() {
  router.replace('/')
  await removeGameMethod(game.value?._id)
}

const id = route.params.id
subscribe('game', id)

const game = autorun(() => GamesCollection.findOne(id)).result
const date = useFormattedDate(game.value?.date, 'dd.MM.yyyy')
const isCreator = useIsGameCreator(game)
const confirmRemoveGame = useDeleteConfirmationDialog(removeGame)
const showHistory = ref(false)
</script>

<template>
  <div>
    <NavigationHeader :title="game?.title" :subtitle="date">
      <template #icon>
        <div class="flex gap-3">
          <SecondaryButton
            @click="showHistory = true"
            variant="outlined"
            icon="pi pi-history"
          />
          <SecondaryButton
            v-if="isCreator"
            @click="confirmRemoveGame"
            variant="outlined"
            icon="pi pi-trash"
            severity="danger"
          />
        </div>
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

      <GameHistory :game="game" v-model:visible="showHistory" />
    </template>
  </div>
</template>
