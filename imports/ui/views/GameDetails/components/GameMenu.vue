<script setup lang="ts">
import Drawer from '@volt/Drawer.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { removeGame as removeGameMethod } from '@/api/methods/games.methods'
import { useIsGameCreator } from '@/composables'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import { Game } from '@/types'
import EnterPinDialog from '@/ui/views/GameDetails/components/EnterPinDialog.vue'
import History from '@/ui/views/GameDetails/components/History.vue'
import SharePinDialog from '@/ui/views/GameDetails/components/SharePinDialog.vue'

const { game } = defineProps<{
  game: Game
}>()

const visible = defineModel<boolean>('visible', { default: false })

const router = useRouter()
const { t } = useI18n()
const isCreator = useIsGameCreator(() => game)

const showSharePinDialog = ref(false)
const showEnterPinDialog = ref(false)

async function removeGame() {
  router.replace('/')
  await removeGameMethod(game._id)
}

const confirmRemoveGame = useDeleteConfirmationDialog(removeGame)
</script>

<template>
  <Drawer v-model:visible="visible" position="right" :header="t('history')">
    <History :history="game.history" />

    <template #footer>
      <div class="flex justify-center gap-3">
        <SecondaryButton
          size="small"
          v-if="isCreator"
          outlined
          :label="t('add_editor')"
          icon="pi pi-user-plus"
          @click="showSharePinDialog = true"
        />
        <SecondaryButton
          v-else
          size="small"
          outlined
          :label="t('become_editor')"
          icon="pi pi-pencil"
          @click="showEnterPinDialog = true"
        />
        <SecondaryButton
          v-if="isCreator"
          size="small"
          outlined
          :label="t('delete_game')"
          icon="pi pi-trash"
          @click="confirmRemoveGame"
        />
      </div>
    </template>
  </Drawer>

  <SharePinDialog
    :pin-code="game.pinCode"
    v-model:visible="showSharePinDialog"
  />
  <EnterPinDialog
    :game-id="game._id!"
    :pin-code="game.pinCode"
    v-model:visible="showEnterPinDialog"
    @saved="visible = false"
  />
</template>
