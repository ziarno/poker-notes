<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import Button from '@volt/Button.vue'
import Dialog from '@volt/Dialog.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import InputNumber from 'primevue/inputnumber'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { addTransfer as addTransferMethod } from '@/api/methods/games.methods.ts'
import { POT_KEY_NAME } from '@/constants'
import { Game, PlayerColor } from '@/types'
import PlayerName from '@/ui/components/PlayerName.vue'
import AddTransferArrow, {
  ArrowBoxes,
} from '@/ui/views/GameDetails/components/AddTransferArrow.vue'
import { getGamePlayerColors } from '@/utils'

type Side = 'from' | 'to'

const { game } = defineProps<{
  game: Game
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { t } = useI18n()

const QUICK_STEPS = [10, 20, 50, 100]

const from = ref<string>()
const to = ref<string>()
const value = ref<number | null>(game.buyIn)

const entries = computed(() => [POT_KEY_NAME, ...game.players.map(p => p.name)])
const playerColors = computed(() => getGamePlayerColors(game))
const canSubmit = computed(
  () => !!from.value && !!to.value && from.value !== to.value && !!value.value
)

// Every open starts fresh, so closing without saving needs no cleanup.
watch(visible, isVisible => {
  if (!isVisible) return
  from.value = undefined
  to.value = undefined
  value.value = game.buyIn
})

// Pressing the selected entry again deselects it.
function pick(side: Side, key: string) {
  const selected = side === 'from' ? from : to
  selected.value = selected.value === key ? undefined : key
}

function isDisabled(side: Side, key: string) {
  return (side === 'from' ? to.value : from.value) === key
}

function step(delta: number) {
  value.value = Math.max(0, (value.value ?? 0) + delta)
}

function submit() {
  if (!canSubmit.value || !visible.value) return
  addTransferMethod({
    gameId: game._id!,
    transfer: { from: from.value!, to: to.value!, value: value.value! },
  })
  visible.value = false
}

const colorVars = (color?: PlayerColor) =>
  color
    ? { '--player-color': color.light, '--player-color-dark': color.dark }
    : undefined

// The selected rows' boxes, measured relative to the grid the arrow overlays.
const grid = useTemplateRef<HTMLElement>('grid')
const rows: Record<Side, Map<string, HTMLElement>> = {
  from: new Map(),
  to: new Map(),
}
const boxes = ref<ArrowBoxes | null>(null)

function setRow(side: Side, key: string, el: unknown) {
  if (el instanceof HTMLElement) rows[side].set(key, el)
  else rows[side].delete(key)
}

function measure() {
  const fromRow = from.value && rows.from.get(from.value)
  const toRow = to.value && rows.to.get(to.value)
  if (!fromRow || !toRow) {
    boxes.value = null
    return
  }
  // Offsets are relative to the grid (the rows' offsetParent) and, unlike
  // getBoundingClientRect, ignore the dialog's scale-in transform.
  boxes.value = [
    fromRow.offsetLeft,
    fromRow.offsetTop,
    fromRow.offsetWidth,
    fromRow.offsetHeight,
    toRow.offsetLeft,
    toRow.offsetTop,
    toRow.offsetWidth,
    toRow.offsetHeight,
  ]
}

watch([from, to, () => game.players.length], () => nextTick(measure))
useResizeObserver(grid, measure)
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :draggable="false"
    modal
    :header="t('add_transfer')"
    closable
    class="m-4 flex w-lg max-w-screen flex-col"
  >
    <div
      ref="grid"
      class="relative grid grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)]
        gap-y-[6px]"
    >
      <p class="text-ft-ink-50 col-start-1 text-[13px] font-medium uppercase">
        {{ t('from') }}
      </p>
      <p class="text-ft-ink-50 col-start-3 text-[13px] font-medium uppercase">
        {{ t('to') }}
      </p>

      <template v-for="key in entries" :key="key">
        <button
          v-for="side in ['from', 'to'] as const"
          :key="side"
          :ref="el => setRow(side, key, el)"
          type="button"
          class="ft-player-accent bg-ft-surface border-ft-ink-10 flex min-h-11
            min-w-0 cursor-pointer items-center rounded-xl border px-3 py-2
            text-left text-[15px] break-words transition-colors
            disabled:cursor-not-allowed disabled:opacity-35
            aria-pressed:border-(--accent) aria-pressed:bg-(--accent)/12
            aria-pressed:shadow-[inset_0_0_0_1px_var(--accent)]"
          :class="side === 'from' ? 'col-start-1' : 'col-start-3'"
          :style="colorVars(playerColors.get(key))"
          :aria-pressed="(side === 'from' ? from : to) === key"
          :disabled="isDisabled(side, key)"
          @click="pick(side, key)"
        >
          <PlayerName :name="key" :color="playerColors.get(key)" />
        </button>
      </template>

      <AddTransferArrow
        :boxes="boxes"
        :from-color="from ? playerColors.get(from) : undefined"
        :to-color="to ? playerColors.get(to) : undefined"
      />
    </div>

    <template #footer>
      <form
        class="border-ft-ink-10 flex w-full flex-col gap-4 border-t pt-4"
        @submit.prevent="submit"
      >
        <div class="flex items-center justify-center gap-2">
          <div class="grid grid-cols-2 gap-[6px]">
            <SecondaryButton
              v-for="n in QUICK_STEPS"
              :key="n"
              outlined
              class="h-11 w-[52px] !px-0"
              :label="`−${n}`"
              @click="step(-n)"
            />
          </div>
          <InputNumber
            v-model="value"
            unstyled
            :min="0"
            :use-grouping="false"
            highlight-on-focus
            :aria-label="t('value')"
            :pt="{
              root: 'flex-1 min-w-0 max-w-[96px]',
              pcInputText: {
                root: `w-full rounded-xl border border-ft-ink-10 bg-ft-surface-alt
                  px-1 py-3 text-center text-[22px] font-bold text-ft-ink
                  tabular-nums outline-none focus:border-ft-ink-30`,
              },
            }"
          />
          <div class="grid grid-cols-2 gap-[6px]">
            <SecondaryButton
              v-for="n in QUICK_STEPS"
              :key="n"
              outlined
              class="h-11 w-[52px] !px-0"
              :label="`+${n}`"
              @click="step(n)"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <SecondaryButton :label="t('cancel')" @click="visible = false" />
          <Button type="submit" :label="t('add')" :disabled="!canSubmit" />
        </div>
      </form>
    </template>
  </Dialog>
</template>
