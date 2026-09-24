<script setup lang="ts">
import Button from '@volt/Button.vue'
import Dialog from '@volt/Dialog.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { setAdjustments } from '@/api/methods'
import { Game } from '@/types'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'
import PlayerName from '@/ui/components/PlayerName.vue'
import {
  balanceToString,
  distributeEvenly,
  getAdjustment,
  getHistoryPlayerColors,
  getInOutDifference,
  hasAdjustments,
} from '@/utils'

const { game } = defineProps<{
  game: Game
}>()
const visible = defineModel<boolean>('visible', { default: false })
const { t } = useI18n()

const deltas = ref<Record<string, number | null>>({})
const included = ref<Record<string, boolean>>({})

const playerColors = computed(() => getHistoryPlayerColors(game.history))
const target = computed(() => getInOutDifference(game))
const assigned = computed(() =>
  game.players.reduce((sum, p) => sum + (deltas.value[p.name] ?? 0), 0)
)
const remaining = computed(() => target.value - assigned.value)
const includedCount = computed(
  () => game.players.filter(p => included.value[p.name]).length
)

const targetHint = computed(() => {
  if (target.value < 0) {
    return t('adjustments_excess', { value: -target.value })
  }
  if (target.value > 0) {
    return t('adjustments_shortfall', { value: target.value })
  }
  return t('adjustments_raw_match')
})

// Prefill with the saved adjustments. When editing, only players that already
// have an adjustment stay included in the even split.
watch(visible, isVisible => {
  if (!isVisible) return
  const isEditing = hasAdjustments(game)
  deltas.value = Object.fromEntries(
    game.players.map(p => [p.name, getAdjustment(game, p.name)])
  )
  included.value = Object.fromEntries(
    game.players.map(p => [
      p.name,
      !isEditing || getAdjustment(game, p.name) !== 0,
    ])
  )
})

function distribute() {
  const parts = distributeEvenly(target.value, includedCount.value)
  let i = 0
  deltas.value = Object.fromEntries(
    game.players.map(p => [
      p.name,
      included.value[p.name] ? (parts[i++] ?? 0) : 0,
    ])
  )
}

function confirm() {
  if (remaining.value !== 0) return
  setAdjustments({
    gameId: game._id!,
    adjustments: game.players.map(p => ({
      name: p.name,
      delta: deltas.value[p.name] ?? 0,
    })),
  })
  visible.value = false
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :draggable="false"
    modal
    :header="t('adjustments_dialog_title')"
    closable
    class="m-4 w-lg max-w-screen"
  >
    <div class="mx-2 mb-2 sm:mx-5">
      <div class="mb-4 text-center">
        <div
          class="font-mono text-[32px] leading-none font-bold tabular-nums"
          :class="target === 0 ? 'text-ft-ink-70' : 'text-ft-red'"
        >
          {{ balanceToString(target) || '0' }}
        </div>
        <p class="text-ft-ink-70 mt-2 text-[15px]">{{ targetHint }}</p>
        <p class="text-ft-ink-50 mt-1 text-[13px]">
          {{ t('adjustments_description') }}
        </p>
      </div>

      <ul class="m-0 list-none p-0">
        <li
          v-for="player in game.players"
          :key="player.name"
          class="border-ft-ink-10 flex items-center gap-3 border-b py-2
            last:border-b-0"
        >
          <input
            :id="`adjustment-${player.name}`"
            v-model="included[player.name]"
            type="checkbox"
            class="accent-ft-green size-5 shrink-0 cursor-pointer"
          />
          <label
            :for="`adjustment-${player.name}`"
            class="min-w-0 flex-1 cursor-pointer break-words"
          >
            <PlayerName
              :name="player.name"
              :color="playerColors.get(player.name)"
            />
            <span class="text-ft-ink-50 ml-2 text-[13px]">
              {{ t('buy_out') }}: {{ player.out ?? '—' }}
            </span>
          </label>
          <InputNumberStep
            v-model="deltas[player.name]"
            size="small"
            :step="1"
            :min="Number.MIN_SAFE_INTEGER"
          />
        </li>
      </ul>

      <div class="mt-4 flex flex-col items-center gap-3">
        <SecondaryButton
          size="small"
          outlined
          icon="pi pi-sliders-h"
          :label="t('adjustments_distribute')"
          :disabled="!includedCount"
          @click="distribute"
        />
        <p
          class="m-0 text-center text-[14px] tabular-nums"
          :class="remaining === 0 ? 'text-ft-green' : 'text-ft-ink-70'"
        >
          <i v-if="remaining === 0" class="pi pi-check-circle mr-1"></i>
          {{
            t('adjustments_assigned', {
              assigned: balanceToString(assigned) || '0',
              target: balanceToString(target) || '0',
              remaining: balanceToString(remaining) || '0',
            })
          }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <SecondaryButton :label="t('cancel')" @click="visible = false" />
        <Button
          :label="t('confirm')"
          :disabled="remaining !== 0"
          @click="confirm"
        />
      </div>
    </template>
  </Dialog>
</template>
