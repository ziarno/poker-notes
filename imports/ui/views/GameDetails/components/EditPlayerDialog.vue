<script setup lang="ts">
import Button from '@volt/Button.vue'
import DangerButton from '@volt/DangerButton.vue'
import Dialog from '@volt/Dialog.vue'
import InputText from '@volt/InputText.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  removePlayer as removePlayerMethod,
  setPlayer as setPlayerMethod,
} from '@/api/methods/games.methods.ts'
import { useCheckExcludedName } from '@/composables'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import { Game, Player } from '@/types'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'

const { player, game } = defineProps<{
  player: Player | null
  game: Game
}>()
const { t } = useI18n()
const visible = ref(false)
const buyIn = ref<number>()
const buyOut = ref<number | null>()
const name = ref<string>('')
const excludedNames = ref<string[]>()
const checkIsNameExcluded = useCheckExcludedName(excludedNames)
const confirmRemove = useDeleteConfirmationDialog(removePlayer)

watchEffect(() => {
  if (!player) return
  visible.value = !!player
  buyIn.value = player.in
  buyOut.value = player.out
  name.value = player.name
  excludedNames.value = game.players
    .map(p => p.name)
    .filter(n => n !== player.name)
})

async function removePlayer() {
  await removePlayerMethod({ gameId: game._id, playerName: player!.name })
  visible.value = false
}

async function setPlayer() {
  if (checkIsNameExcluded(name.value)) {
    return
  }

  await setPlayerMethod({
    gameId: game._id,
    playerName: player!.name,
    player: {
      name: name.value,
      in: buyIn.value,
      out: buyOut.value,
    },
  })
  visible.value = false
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :draggable="false"
    modal
    :header="player?.name"
    closable
    class="m-4 w-lg max-w-screen"
  >
    <div class="m-7">
      <div class="my-5 flex items-center justify-between">
        <p class="text-lg">{{ t('buy_in') }}</p>
        <InputNumberStep v-model="buyIn" />
      </div>
      <div class="my-5 flex items-center justify-between">
        <p class="text-lg">{{ t('buy_out') }}</p>
        <InputNumberStep v-model="buyOut" />
      </div>
      <div class="flex items-center justify-between">
        <label for="name" class="mr-10 inline-block text-lg">{{
          t('name')
        }}</label>
        <InputText id="name" v-model="name" fluid size="large" />
      </div>
    </div>

    <template #footer>
      <div class="flex w-full justify-between">
        <DangerButton
          outlined
          :label="t('remove_player')"
          icon="pi pi-trash"
          @click="confirmRemove"
        />
        <div class="space-x-2">
          <SecondaryButton :label="t('cancel')" @click="visible = false" />
          <Button :label="t('save')" @click="setPlayer" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped></style>
