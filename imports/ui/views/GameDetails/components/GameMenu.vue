<script setup lang="ts">
import Drawer from '@volt/Drawer.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Timeline from '@volt/Timeline.vue'
import { toNumber } from 'lodash'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { removeGame as removeGameMethod } from '@/api/methods/games.methods'
import { useFormattedDate, useIsGameCreator } from '@/composables'
import { useDeleteConfirmationDialog } from '@/composables/useDeleteConfirmationDialog.ts'
import { useGetName } from '@/composables/useGetName.ts'
import { NBSP } from '@/constants/string.const.ts'
import { Game, HistoryItem } from '@/types'
import { balanceToString } from '@/utils'

const { game } = defineProps<{
  game: Game
}>()

const router = useRouter()
const { t } = useI18n()
const getName = useGetName()
const isCreator = useIsGameCreator(() => game)

async function removeGame() {
  router.replace('/')
  await removeGameMethod(game._id)
}

const confirmRemoveGame = useDeleteConfirmationDialog(removeGame)

const sortedHistory = computed(() => {
  if (!game.history?.length) return []
  return [...game.history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

function formatChange(item: HistoryItem): string {
  const playerName = 'playerName' in item && getName(item.playerName)
  switch (item.type) {
    case 'player_added':
      return t('player_added', { name: playerName })
    case 'player_removed':
      return t('player_removed', { name: playerName })
    case 'player_in_changed':
      return t('player_in_changed', {
        name: playerName,
        oldValue: item.oldValue,
        newValue: item.newValue,
        diff: balanceToString(
          toNumber(item.newValue) - toNumber(item.oldValue)
        ),
      })
    case 'player_out_changed':
      return t('player_out_changed', {
        name: playerName,
        newValue: item.newValue,
        balance: balanceToString(item.balance),
      })
    case 'transfer_added': {
      const { from, to, value } = item.transfer
      return `${t('transfer')}\n${getName(from)} → ${getName(to)}:${NBSP}${value}`
    }
    case 'transfer_removed': {
      const { from, to, value } = item.transfer
      return `${t('transfer_removed')}\n${getName(from)} → ${getName(to)}:${NBSP}${value}`
    }
    default:
      return ''
  }
}

function formatTime(timestamp: Date): string {
  return useFormattedDate(timestamp, 'HH:mm').value ?? ''
}
</script>

<template>
  <Drawer position="right">
    <h3 class="text-surface-700 dark:text-surface-0 mb-4 font-semibold">
      {{ t('history') }}
    </h3>

    <p
      v-if="!sortedHistory.length"
      class="text-surface-400 text-center text-sm"
    >
      {{ t('no_history') }}
    </p>
    <Timeline v-else :value="sortedHistory" class="w-full">
      <template #opposite="{ item }">
        <span class="text-surface-400 text-sm">{{
          formatTime(item.timestamp)
        }}</span>
      </template>
      <template #content="{ item }">
        <span class="mb-5 inline-block text-sm whitespace-pre-wrap">{{
          formatChange(item)
        }}</span>
      </template>
    </Timeline>

    <template #footer v-if="isCreator">
      <SecondaryButton
        outlined
        :label="t('delete_game')"
        icon="pi pi-trash"
        class="w-full"
        @click="confirmRemoveGame"
      />
    </template>
  </Drawer>
</template>
