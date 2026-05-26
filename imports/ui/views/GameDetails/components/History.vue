<script setup lang="ts">
import { toNumber } from 'lodash'
import { TransitionGroup, computed } from 'vue'
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

function inDiff(oldValue: number | null, newValue: number | null): string {
  return balanceToString(toNumber(newValue) - toNumber(oldValue))
}

function balanceColorClass(balance: number | null): string {
  if (!balance) return ''
  return balance > 0 ? 'text-lime-600' : 'text-red-700 dark:text-red-400'
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
    <TransitionGroup
      v-else
      tag="div"
      name="ft-list"
      class="relative flex w-full flex-col"
    >
      <div
        v-for="(item, idx) in sortedHistory"
        :key="new Date(item.timestamp).getTime()"
        class="relative flex"
      >
        <span
          class="text-surface-400 mt-[2px] w-12 flex-none pr-2 text-right
            text-sm"
        >
          {{ formatTime(item.timestamp) }}
        </span>

        <div class="flex flex-none flex-col items-center">
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full
              leading-normal"
            :class="getColorClass(item)"
          >
            <i :class="getIcon(item)" class="text-xs"></i>
          </span>
          <span
            v-if="idx !== sortedHistory.length - 1"
            class="bg-surface-200 mt-1 w-[2px] grow"
          ></span>
        </div>

        <span class="mb-5 flex-1 pl-3 leading-tight whitespace-pre-wrap">
          <template v-if="item.type === 'player_added'">
            {{ getName(item.playerName)
            }}<template v-if="item.in">: {{ item.in }}</template>
          </template>
          <i18n-t
            v-else-if="item.type === 'player_in_changed'"
            keypath="player_in_changed"
            tag="span"
          >
            <template #name>
              {{ getName(item.playerName) }}
            </template>
            <template #diff>
              <strong>
                {{ inDiff(item.oldValue, item.newValue) }}
              </strong>
            </template>
            <template #oldValue>
              {{ item.oldValue }}
            </template>
            <template #newValue>
              {{ item.newValue }}
            </template>
          </i18n-t>
          <i18n-t
            v-else-if="item.type === 'player_out_changed'"
            keypath="player_out_changed"
            tag="span"
          >
            <template #name
              ><strong>{{ getName(item.playerName) }}</strong></template
            >
            <template #newValue
              ><strong>{{ item.newValue }}</strong></template
            >
            <template #balance
              ><strong :class="balanceColorClass(item.balance)">{{
                balanceToString(item.balance)
              }}</strong></template
            >
          </i18n-t>
          <template
            v-else-if="
              item.type === 'transfer_added' || item.type === 'transfer_removed'
            "
            >{{
              item.type === 'transfer_added'
                ? t('transfer')
                : t('transfer_removed')
            }}{{ '\n' }}{{ getName(item.transfer.from) }} {{ ' → '
            }}{{ getName(item.transfer.to) }}:{{ NBSP
            }}<strong>{{ item.transfer.value }}</strong></template
          >
          <template v-else-if="'playerName' in item"
            ><strong>{{ getName(item.playerName) }}</strong></template
          >
        </span>
      </div>
    </TransitionGroup>
  </div>
</template>
