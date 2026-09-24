<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { setAdjustments } from '@/api/methods'
import { useIsGameEditor } from '@/composables'
import { Game } from '@/types'
import Balance from '@/ui/components/Balance.vue'
import PlayerName from '@/ui/components/PlayerName.vue'
import {
  getAdjustment,
  getHistoryPlayerColors,
  getInOutDifference,
} from '@/utils'

const { game } = defineProps<{
  game: Game
}>()
const emit = defineEmits<{ edit: [] }>()
const { t } = useI18n()
const isEditor = useIsGameEditor(() => game)
const confirm = useConfirm()
const toast = useToast()

const playerColors = computed(() => getHistoryPlayerColors(game.history))
const rows = computed(() =>
  game.players
    .map(p => ({ name: p.name, delta: getAdjustment(game, p.name) }))
    .filter(row => row.delta !== 0)
)
const isRawInOutEqual = computed(() => getInOutDifference(game) === 0)

function confirmReset() {
  confirm.require({
    header: t('adjustments_reset'),
    message: t('adjustments_reset_description'),
    rejectProps: {
      label: t('cancel'),
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: t('reset'),
    },
    accept: async () => {
      await setAdjustments({ gameId: game._id!, adjustments: [] })
      toast.add({
        severity: 'success',
        summary: t('adjustments_reset_done'),
        life: 1000,
      })
    },
  })
}
</script>

<template>
  <div class="bg-ft-surface border-ft-ink-10 mb-3 rounded-xl border px-3 py-3">
    <div
      class="text-ft-ink-50 mb-2 text-[12px] font-semibold tracking-[0.08em]
        uppercase"
    >
      {{ t('adjustments_title') }}
    </div>

    <ul class="m-0 list-none p-0">
      <li
        v-for="row in rows"
        :key="row.name"
        class="flex items-center justify-between gap-3 py-1"
      >
        <PlayerName
          class="min-w-0 break-words"
          :name="row.name"
          :color="playerColors.get(row.name)"
        />
        <Balance :value="row.delta" />
      </li>
    </ul>

    <p
      v-if="isRawInOutEqual"
      class="bg-ft-green-soft text-ft-green-ink mt-2 mb-0 flex items-center
        gap-2 rounded-lg px-3 py-2 text-[14px]"
    >
      <i class="pi pi-info-circle"></i>
      <span>{{ t('adjustments_raw_match') }}</span>
    </p>

    <div v-if="isEditor" class="mt-3 flex flex-wrap justify-end gap-2">
      <SecondaryButton
        size="small"
        outlined
        icon="pi pi-refresh"
        :label="t('adjustments_reset')"
        @click="confirmReset"
      />
      <SecondaryButton
        size="small"
        outlined
        icon="pi pi-pencil"
        :label="t('edit')"
        @click="emit('edit')"
      />
    </div>
  </div>
</template>
