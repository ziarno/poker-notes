<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { TransitionGroup, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { addTransfer, setAdjustments } from '@/api/methods'
import { useIsGameEditor } from '@/composables'
import { POT_KEY_NAME } from '@/constants'
import { Game, Transfer } from '@/types'
import SectionTitle from '@/ui/components/SectionTitle.vue'
import TransferRow from '@/ui/components/TransferRow.vue'
import AdjustmentsDialog from '@/ui/views/GameDetails/components/AdjustmentsDialog.vue'
import {
  applyAdjustments,
  getGameSettlement,
  hasAdjustments,
  isGameFinished,
  isGameInOutEqual,
  isGameOngoing,
} from '@/utils'

const { game } = defineProps<{
  game: Game
}>()
const { t } = useI18n()
const isCreator = useIsGameEditor(() => game)

const isOngoing = computed(() => isGameOngoing(game))
const isInOutEqual = computed(() => isGameInOutEqual(game))
const showAdjustments = computed(() => !isOngoing.value && hasAdjustments(game))
const isAdjustmentsDialogVisible = ref(false)
const confirm = useConfirm()
const toast = useToast()

const settlement = computed<Transfer[]>(() => {
  if (!isGameFinished(game)) return []
  return getGameSettlement(applyAdjustments(game))
})

function pretty(name: string): string {
  return name === POT_KEY_NAME ? t('pot').toUpperCase() : name
}

function addToTransfers(transfer: Transfer) {
  addTransfer({ gameId: game._id, transfer })
}

function confirmResetAdjustments() {
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
  <section class="mt-5 mb-6">
    <SectionTitle>{{ t('settlement') }}</SectionTitle>

    <div
      v-if="showAdjustments && isCreator"
      class="mb-3 flex flex-wrap justify-center gap-2"
    >
      <SecondaryButton
        size="small"
        outlined
        icon="pi pi-pencil"
        :label="t('adjustments_edit')"
        @click="isAdjustmentsDialogVisible = true"
      />
      <SecondaryButton
        size="small"
        outlined
        icon="pi pi-refresh"
        :label="t('adjustments_reset')"
        @click="confirmResetAdjustments"
      />
    </div>

    <p v-if="isOngoing" class="text-ft-ink-50 py-3 text-center text-[15px]">
      {{ t('settlement_info') }}
    </p>

    <div v-else-if="!isInOutEqual" class="flex flex-col items-center gap-3">
      <div
        class="bg-ft-red-soft text-ft-red flex w-full items-center
          justify-center gap-2 rounded-xl px-[14px] py-[10px] text-[15px]"
      >
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ t('settlement_warning') }}</span>
      </div>
      <SecondaryButton
        v-if="isCreator"
        size="small"
        outlined
        icon="pi pi-wrench"
        :label="t('resolve')"
        @click="isAdjustmentsDialogVisible = true"
      />
    </div>

    <template v-else>
      <p
        v-if="!settlement.length"
        class="text-ft-green flex items-center justify-center gap-2 py-3
          text-center text-[15px]"
      >
        <i class="pi pi-check-circle"></i>
        <span>{{ t('settlement_settled') }}</span>
      </p>

      <TransitionGroup
        v-else
        tag="div"
        name="ft-list"
        class="relative grid
          grid-cols-[minmax(0,max-content)_auto_minmax(0,max-content)_1fr_auto]
          gap-x-1 gap-y-[6px]"
      >
        <TransferRow
          v-for="transfer in settlement"
          :key="`${transfer.from}-${transfer.to}-${transfer.value}`"
          :from="pretty(transfer.from)"
          :to="pretty(transfer.to)"
          :value="transfer.value"
        >
          <template #action>
            <button
              v-if="isCreator"
              type="button"
              class="border-ft-ink-10 text-ft-ink-50 hover:text-ft-green
                hover:border-ft-green bg-ft-surface inline-flex h-[26px]
                w-[26px] cursor-pointer items-center justify-center rounded-full
                border"
              :aria-label="t('add')"
              @click="addToTransfers(transfer)"
            >
              <i class="pi pi-check text-[12px]"></i>
            </button>
          </template>
        </TransferRow>
      </TransitionGroup>
    </template>

    <AdjustmentsDialog
      v-if="isCreator"
      v-model:visible="isAdjustmentsDialogVisible"
      :game="game"
    />
  </section>
</template>
