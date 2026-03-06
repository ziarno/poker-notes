<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useClipboard } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
const toast = useToast()
const { copy } = useClipboard()

function copyLink() {
  copy(window.location.href)
  toast.add({
    closable: true,
    severity: 'success',
    summary: t('link_copied'),
    life: 1000,
  })
}
</script>

<template>
  <div>
    <NavigationHeader :title="game?.title" :subtitle="date">
      <template #icon>
        <div class="flex gap-2">
          <SecondaryButton
            @click="copyLink"
            variant="outlined"
            icon="pi pi-share-alt"
          />
          <SecondaryButton
            @click="showMenu = true"
            variant="outlined"
            icon="pi pi-bars"
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
      <GameMenu :game="game" v-model:visible="showMenu" />
    </template>
  </div>
</template>
