<script setup lang="ts">
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
import WinnerBanner from '@/ui/views/GameDetails/components/WinnerBanner.vue'
import { addAccessToGameId } from '@/utils/accessToGameIds.utils.ts'

const route = useRoute()

const id = route.params.id as string
subscribe('game', id)
addAccessToGameId(id)

const game = autorun(() => GamesCollection.findOne(id)).result
const date = useFormattedDate(() => game.value?.date, 'E, dd.MM.yyyy')
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
  <div class="px-[18px] pt-[18px] pb-6">
    <NavigationHeader :title="game?.title" :subtitle="date">
      <template #icon>
        <button
          class="ft-icon-btn"
          @click="copyLink"
          :aria-label="t('link_copied')"
        >
          <i class="pi pi-share-alt"></i>
        </button>
        <button
          class="ft-icon-btn"
          @click="showMenu = true"
          :aria-label="t('history')"
        >
          <i class="pi pi-bars"></i>
        </button>
      </template>
    </NavigationHeader>

    <template v-if="game">
      <InfoTags :game="game" class="pt-1 pb-[14px]" />

      <WinnerBanner :game="game" />
      <PlayersTable :game="game" />
      <Transfers :game="game" />
      <Settlement :game="game" />
      <GameMenu :game="game" v-model:visible="showMenu" />
    </template>
  </div>
</template>
