<script setup lang="ts">
import Drawer from '@volt/Drawer.vue'
import { useI18n } from 'vue-i18n'

import { Game } from '@/types'
import GameMenuActions from '@/ui/views/GameDetails/components/GameMenuActions.vue'
import History from '@/ui/views/GameDetails/components/History.vue'

const { game } = defineProps<{
  game: Game
}>()

const visible = defineModel<boolean>('visible', { default: false })

const { t } = useI18n()
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :header="t('history')"
    class="p-right:w-[440px] p-right:max-w-[85vw] rounded-tl-[14px]"
  >
    <History :history="game.history" />

    <template #footer>
      <GameMenuActions :game="game" @saved="visible = false" />
    </template>
  </Drawer>
</template>
