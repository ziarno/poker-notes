<script setup lang="ts">
import Timeline from '@volt/Timeline.vue'
import { toNumber } from 'lodash'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFormattedDate } from '@/composables'
import { useGetName } from '@/composables/useGetName.ts'
import { NBSP } from '@/constants/string.const.ts'
import { HistoryItem } from '@/types'
import { balanceToString } from '@/utils'

const { history } = defineProps<{
  history: HistoryItem[]
}>()

const { t } = useI18n()
const getName = useGetName()

const sortedHistory = computed(() => {
  if (!history?.length) return []
  return [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

function formatChange(item: HistoryItem): string {
  const playerName = 'playerName' in item && getName(item.playerName)
  switch (item.type) {
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
      return playerName || ''
  }
}

function formatTime(timestamp: Date): string {
  return useFormattedDate(timestamp, 'HH:mm').value ?? ''
}

function getIcon(item: HistoryItem): string {
  switch (item.type) {
    case 'player_added':
      return 'pi pi-user-plus'
    case 'player_removed':
      return 'pi pi-user-minus'
    case 'player_in_changed':
      return 'pi pi-dollar'
    case 'player_out_changed':
      return 'pi pi-sign-out'
    case 'transfer_added':
      return 'pi pi-arrows-h'
    case 'transfer_removed':
      return 'pi pi-arrows-h'
    default:
      return 'pi pi-circle'
  }
}

function getColorClass(item: HistoryItem): string {
  switch (item.type) {
    case 'player_added':
      return 'bg-blue-500 text-white'
    case 'player_removed':
      return 'bg-red-500 text-white'
    case 'player_in_changed':
      return 'bg-green-500 text-white'
    case 'player_out_changed':
      return 'bg-amber-500 text-white'
    case 'transfer_added':
      return 'bg-teal-500 text-white'
    case 'transfer_removed':
      return 'bg-red-400 text-white'
    default:
      return 'bg-surface-400 text-white'
  }
}
</script>

<template>
  <div>
    <p
      v-if="!sortedHistory.length"
      class="text-surface-400 text-center text-sm"
    >
      {{ t('no_history') }}
    </p>
    <Timeline v-else :value="sortedHistory" class="w-full">
      <template #marker="{ item }">
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full"
          :class="getColorClass(item)"
        >
          <i :class="getIcon(item)" class="text-xs"></i>
        </span>
      </template>
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
  </div>
</template>
