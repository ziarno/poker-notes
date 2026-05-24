<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { addPlayer as addPlayerMethod } from '@/api/methods/games.methods.ts'
import { useIsGameCreator } from '@/composables'
import { Game, NewPlayer, Player } from '@/types'
import AnimatedNumber from '@/ui/components/AnimatedNumber.vue'
import DashedAddButton from '@/ui/components/DashedAddButton.vue'
import InputNewPlayer from '@/ui/components/InputNewPlayer.vue'
import EditPlayerDialog from '@/ui/views/GameDetails/components/EditPlayerDialog.vue'
import { getTotalIn, getTotalOut, isNumber } from '@/utils'

const { game } = defineProps<{
  game: Game
}>()

const { t } = useI18n()
const isCreator = useIsGameCreator(() => game)

const isAddingNewPlayer = ref(false)
const editingPlayer = ref<Player | null>(null)

const rows = computed(() =>
  game.players.map(p => ({
    ...p,
    balance: isNumber(p.out) ? (p.out as number) - p.in : null,
  }))
)

const totalIn = computed(() => getTotalIn(game))
const totalOut = computed(() => getTotalOut(game))

function addPlayer(player: NewPlayer) {
  addPlayerMethod({
    gameId: game._id!,
    player,
  })
  isAddingNewPlayer.value = false
}

function onRowClick(player: Player) {
  if (!isCreator.value) return
  editingPlayer.value = player
}

function balanceText(b: number | null): string {
  if (!isNumber(b)) return ''
  if (b === 0) return '0'
  return b > 0 ? `+${b}` : `${b}`
}

const gridCols = 'grid grid-cols-[1.3fr_1fr_1fr_1fr]'
</script>

<template>
  <div
    class="bg-ft-surface border-ft-ink-10 mb-12 overflow-hidden rounded-[14px]
      border"
  >
    <div
      :class="gridCols"
      class="text-ft-ink-50 border-ft-ink-10 border-b px-[14px] py-[10px]
        text-[12px] font-semibold tracking-[0.08em] uppercase"
    >
      <div>{{ t('players') }}</div>
      <div class="text-right">{{ t('buy_in') }}</div>
      <div class="text-right">{{ t('buy_out') }}</div>
      <div class="text-right">{{ t('balance') }}</div>
    </div>

    <div
      v-for="r in rows"
      :key="r.name"
      :class="[
        gridCols,
        'border-ft-ink-10 items-center border-b px-[14px] py-3 last:border-b-0',
        isCreator ? 'cursor-pointer hover:bg-[rgba(13,20,17,0.02)]' : '',
      ]"
      @click="onRowClick(r as Player)"
    >
      <div class="text-md">
        {{ r.name }}
      </div>
      <div class="text-ft-ink-70 text-right text-[16px]">
        <AnimatedNumber :value="r.in" />
      </div>
      <div class="text-ft-ink-70 text-right text-[16px]">
        <AnimatedNumber v-if="isNumber(r.out)" :value="r.out as number" />
        <template v-else>—</template>
      </div>
      <div
        class="text-right text-sm text-[16px] font-bold"
        :class="
          (r.balance ?? 0) > 0
            ? 'text-lime-600'
            : (r.balance ?? 0) < 0
              ? 'text-red-700'
              : 'text-ft-ink-70'
        "
      >
        <AnimatedNumber
          v-if="isNumber(r.balance)"
          :value="r.balance as number"
          :format="b => balanceText(Math.round(b))"
        />
      </div>
    </div>

    <div
      v-if="isCreator"
      class="border-ft-ink-10 bg-ft-surface-alt border-t px-[14px] py-[10px]"
    >
      <DashedAddButton
        v-if="!isAddingNewPlayer"
        :label="t('add_player')"
        @click="isAddingNewPlayer = true"
      />
      <InputNewPlayer
        v-else
        show-cancel
        show-buy-in
        :buy-in="game.buyIn"
        :exclude-names="game.players.map(p => p.name)"
        @add="addPlayer"
        @cancel="isAddingNewPlayer = false"
      />
    </div>

    <div
      :class="gridCols"
      class="text-ft-ink-70 border-ft-ink-10 bg-ft-surface-alt border-t
        px-[14px] py-[10px]"
    >
      <span>{{ t('sum') }}</span>
      <span class="text-ft-ink text-right text-[16px]">
        <AnimatedNumber :value="totalIn" />
      </span>
      <span class="text-ft-ink text-right text-[16px]">
        <AnimatedNumber :value="totalOut" />
      </span>
      <span></span>
    </div>
  </div>

  <EditPlayerDialog
    :player="editingPlayer"
    @hide="editingPlayer = null"
    :game="game"
  />
</template>
