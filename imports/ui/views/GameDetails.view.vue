<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useI18n } from 'vue-i18n'
import { autorun, subscribe } from 'vue-meteor-tracker'
import { useRoute, useRouter } from 'vue-router'

import { GamesCollection } from '@/api/collections'
import { useFormattedDate } from '@/composables'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import EditablePlayersList from '@/ui/components/EditablePlayersList.vue'
import InfoTags from '@/ui/components/InfoTags.vue'
import NavigationHeader from '@/ui/components/NavigationHeader.vue'
import Transfers from '@/ui/components/Transfers.vue'

const route = useRoute()
const router = useRouter()

async function removeGame() {
  await Meteor.callAsync('removeGame', game.value?._id)
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
    <EditablePlayersList :game="game" />

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
    <p class="text-surface-400 text-center text-sm">
      {{ t('settlement_info') }}
    </p>
    <p class="text-surface-400 text-center text-sm">
      {{ t('settlement_warning') }}
    </p>
  </template>
</template>

<style>
.game-details-footer-row > span {
  font-weight: normal !important;
}
</style>
