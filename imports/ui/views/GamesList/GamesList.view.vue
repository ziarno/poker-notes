<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { autorun } from 'vue-meteor-tracker'

import { GamesCollection } from '@/api/collections'
import TitleBanner from '@/ui/components/TitleBanner.vue'
import GameListItem from '@/ui/views/GamesList/components/GameListItem.vue'

const { t } = useI18n()
const games = autorun(() => GamesCollection.find().fetch()).result
const gamesSorted = computed(() =>
  games.value?.sort((g1, g2) => g2.date.getTime() - g1.date.getTime())
)
</script>

<template>
  <div class="flex min-h-full flex-col pt-[18px] pb-6">
    <TitleBanner />

    <div
      class="text-ft-ink px-[22px] pt-[2px] pb-2 font-sans text-[15px]
        font-semibold"
    >
      {{ t('recent_games') }}
    </div>

    <p
      v-if="!gamesSorted?.length"
      class="text-surface-400 flex flex-1 items-center justify-center text-center
        text-sm"
    >
      {{ t('no_games') }}
    </p>
    <div v-else class="flex flex-col gap-2 px-[14px]">
      <GameListItem
        v-for="(game, idx) of gamesSorted"
        :key="game._id"
        :game="game"
        :index="idx"
      />
    </div>
  </div>
</template>
