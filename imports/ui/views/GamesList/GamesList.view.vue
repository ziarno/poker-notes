<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { autorun } from 'vue-meteor-tracker'

import { GamesCollection } from '@/api/collections'
import { getCreatorId } from '@/utils/creatorId.utils.ts'
import GameListItem from '@/ui/views/GamesList/components/GameListItem.vue'

const { t } = useI18n()
const creatorId = getCreatorId()
const games = autorun(() => GamesCollection.find({ creatorId }).fetch()).result
const gamesSorted = computed(() =>
  games.value?.sort((g1, g2) => g2.date.getTime() - g1.date.getTime())
)
</script>

<template>
  <div>
    <h1
      class="mt-3 mb-3 text-center font-[Poker] text-5xl text-black dark:text-white"
    >
      {{ t('poker_notes') }}
    </h1>
    <div class="mt-8 mb-10 flex justify-center">
      <SecondaryButton
        raised
        @click="$router.push('/new')"
        icon="pi pi-plus"
        :label="t('new_game')"
      />
    </div>
    <GameListItem v-for="game of gamesSorted" :key="game._id" :game="game" />
    <div class="fixed right-0 bottom-0 left-0 mb-10 flex justify-center"></div>
  </div>
</template>
