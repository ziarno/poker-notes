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
import SectionTitle from '@/ui/components/SectionTitle.vue'
import ThemeToggle from '@/ui/components/ThemeToggle.vue'
import GameMenu from '@/ui/views/GameDetails/components/GameMenu.vue'
import GameMenuActions from '@/ui/views/GameDetails/components/GameMenuActions.vue'
import History from '@/ui/views/GameDetails/components/History.vue'
import PlayersTable from '@/ui/views/GameDetails/components/PlayersTable.vue'
import Settlement from '@/ui/views/GameDetails/components/Settlement.vue'
import Transfers from '@/ui/views/GameDetails/components/Transfers.vue'
import WinnerBanner from '@/ui/views/GameDetails/components/WinnerBanner.vue'
import { addAccessToGameId } from '@/utils'

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
  <div
    class="px-[18px] pb-6 xl:flex xl:h-full xl:flex-col xl:px-8 xl:pt-[18px]
      xl:pb-0"
  >
    <div class="bg-ft-bg sticky top-0 z-20 pt-[18px] xl:pt-0">
      <NavigationHeader :title="game?.title" :subtitle="date">
        <template #icon>
          <InfoTags
            v-if="game"
            :game="game"
            class="mr-1 hidden flex-wrap items-center justify-end gap-2 xl:flex"
          />
          <div class="hidden xl:block">
            <ThemeToggle />
          </div>
          <button
            class="ft-icon-btn"
            @click="copyLink"
            :aria-label="t('link_copied')"
          >
            <i class="pi pi-share-alt"></i>
          </button>
          <button
            class="ft-icon-btn xl:hidden"
            @click="showMenu = true"
            :aria-label="t('history')"
          >
            <i class="pi pi-bars"></i>
          </button>
        </template>
      </NavigationHeader>
    </div>

    <template v-if="game">
      <InfoTags
        :game="game"
        class="mt-2 flex flex-wrap justify-around pt-1 pb-[14px] xl:hidden"
      />

      <div
        class="xl:grid xl:grid-cols-[2.1fr_1fr] xl:grid-rows-[minmax(0,1fr)]
          xl:min-h-0 xl:flex-1 xl:items-start xl:gap-7"
      >
        <div
          class="xl:grid xl:h-full xl:min-h-0 xl:grid-cols-[1.1fr_1fr]
            xl:items-start xl:gap-7 xl:overflow-y-auto"
        >
          <div class="xl:pr-3">
            <WinnerBanner :game="game" />
            <PlayersTable :game="game" />
          </div>

          <div
            class="xl:[&>section:first-child]:mt-0 xl:pr-3 flex flex-col
              xl:flex-col-reverse"
          >
            <Transfers :game="game" />
            <Settlement :game="game" />
          </div>
        </div>

        <div class="hidden xl:flex xl:h-full xl:min-h-0 xl:flex-col">
          <SectionTitle>{{ t('history') }}</SectionTitle>
          <div class="mb-6">
            <GameMenuActions :game="game" />
          </div>
          <History
            :history="game.history"
            class="xl:min-h-0 xl:flex-1 xl:overflow-y-auto"
          />
        </div>
      </div>

      <GameMenu :game="game" v-model:visible="showMenu" />
    </template>
  </div>
</template>
