<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useI18n } from 'vue-i18n'
import { autorun, subscribe } from 'vue-meteor-tracker'
import { useRoute, useRouter } from 'vue-router'

import { GamesCollection } from '@/api/collections'
import { removeGame as removeGameMethod } from '@/api/methods/games.methods'
import { useFormattedDate } from '@/composables'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import InfoTags from '@/ui/components/InfoTags.vue'
import NavigationHeader from '@/ui/components/NavigationHeader.vue'
import PlayersTable from '@/ui/components/PlayersTable.vue'
import Settlement from '@/ui/components/Settlement.vue'
import Transfers from '@/ui/components/Transfers.vue'

const route = useRoute()
const router = useRouter()

async function removeGame() {
  await removeGameMethod(game.value?._id)
  router.replace('/')
}

const { t } = useI18n()
const id = route.params.id
subscribe('game', id)

const game = autorun(() => GamesCollection.findOne(id)).result
const date = useFormattedDate(game.value?.date, 'dd.MM.yyyy')
const confirmRemoveGame = useDeleteConfirmationDialog(removeGame)
</script>

<template>
  <div>
    <NavigationHeader :title="game?.title" :subtitle="date">
      <template #icon>
        <SecondaryButton
          @click="confirmRemoveGame"
          variant="outlined"
          icon="pi pi-trash"
          severity="danger"
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

      <h2
        class="text-surface-700 dark:text-surface-0 mt-15 mb-4 text-lg font-semibold"
      >
        {{ t('transfers') }}
      </h2>
      <Transfers :game="game" />

      <h2
        class="text-surface-700 dark:text-surface-0 mt-15 mb-4 text-lg font-semibold"
      >
        {{ t('settlement') }}
      </h2>
      <Settlement :game="game" />
    </template>
  </div>
</template>

<style>
.game-details-footer-row > span {
  font-weight: normal !important;
}
</style>
