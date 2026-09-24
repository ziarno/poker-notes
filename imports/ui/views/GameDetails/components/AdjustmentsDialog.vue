<script setup lang="ts">
import Button from '@volt/Button.vue'
import Dialog from '@volt/Dialog.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { setAdjustments } from '@/api/methods'
import { Game, Player } from '@/types'
import Balance from '@/ui/components/Balance.vue'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'
import PlayerName from '@/ui/components/PlayerName.vue'
import {
  balanceToString,
  distributeEvenly,
  getAdjustment,
  getHistoryPlayerColors,
  getInOutDifference,
  hasAdjustments,
  isNumber,
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

// Balance with the adjustment currently entered in the modal.
function balance(player: Player): number | null {
  if (!isNumber(player.out)) return null
  return player.out + (deltas.value[player.name] ?? 0) - player.in
}

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
      <div
        class="mb-4 flex items-center justify-center gap-2 font-mono text-[32px]
          leading-none font-bold tabular-nums"
        :class="remaining === 0 ? 'text-ft-green' : 'text-ft-red'"
      >
        <i v-if="remaining === 0" class="pi pi-check-circle text-[24px]"></i>
        <span>{{ balanceToString(remaining) || '0' }}</span>
      </div>

      <ul
        class="m-0 grid list-none
          grid-cols-[auto_minmax(0,1fr)_repeat(5,auto)_auto] items-center
          gap-x-2 p-0"
      >
        <li
          v-for="player in game.players"
          :key="player.name"
          class="border-ft-ink-10 col-span-full grid grid-cols-subgrid
            items-center gap-y-1 border-b py-2 last:border-b-0"
        >
          <input
            :id="`adjustment-${player.name}`"
            v-model="included[player.name]"
            type="checkbox"
            class="accent-ft-green size-5 cursor-pointer max-sm:row-span-2"
          />
          <label
            :for="`adjustment-${player.name}`"
            class="min-w-0 cursor-pointer break-words max-sm:col-[2/-2]"
          >
            <PlayerName
              :name="player.name"
              :color="playerColors.get(player.name)"
            />
          </label>
          <!-- On narrow screens the numbers wrap under the name. -->
          <span
            class="text-ft-ink-50 text-right text-[13px] tabular-nums
              max-sm:col-start-3"
          >
            {{ player.in }}
          </span>
          <span class="text-ft-ink-30 text-[13px]">→</span>
          <span class="text-ft-ink-50 text-right text-[13px] tabular-nums">
            {{ player.out ?? '—' }}
          </span>
          <span class="text-ft-ink-30 text-[13px]">=</span>
          <Balance
            class="text-right text-[13px] tabular-nums"
            :value="balance(player)"
          />
          <div
            class="ml-1 max-sm:col-start-8 max-sm:row-span-2 max-sm:row-start-1"
          >
            <InputNumberStep
              v-model="deltas[player.name]"
              size="small"
              :step="1"
              :min="Number.MIN_SAFE_INTEGER"
            />
          </div>
        </li>
      </ul>

      <div class="mt-4 flex justify-center">
        <SecondaryButton
          size="small"
          outlined
          icon="pi pi-sliders-h"
          :label="t('adjustments_distribute')"
          :disabled="!includedCount"
          @click="distribute"
        />
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
