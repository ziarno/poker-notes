<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { addTransfer } from '@/api/methods'
import { useIsGameCreator } from '@/composables'
import { POT_KEY_NAME } from '@/constants/transfers.const.ts'
import { Game, Transfer } from '@/types'
import SectionTitle from '@/ui/components/SectionTitle.vue'
import TransferRow from '@/ui/components/TransferRow.vue'
import {
  getGameSettlement,
  isGameFinished,
  isGameInOutEqual,
  isGameOngoing,
} from '@/utils/game.utils.ts'

const { game } = defineProps<{
  game: Game
}>()
const { t } = useI18n()
const isCreator = useIsGameCreator(() => game)

const isOngoing = computed(() => isGameOngoing(game))
const isInOutEqual = computed(() => isGameInOutEqual(game))

const settlement = computed<Transfer[]>(() => {
  if (!isGameFinished(game)) return []
  return getGameSettlement(game)
})

function pretty(name: string): string {
  return name === POT_KEY_NAME ? t('pot').toUpperCase() : name
}

function addToTransfers(transfer: Transfer) {
  addTransfer({ gameId: game._id, transfer })
}
</script>

<template>
  <section class="mt-5 mb-6">
    <SectionTitle>{{ t('settlement') }}</SectionTitle>

    <p v-if="isOngoing" class="text-ft-ink-50 py-3 text-center text-[15px]">
      {{ t('settlement_info') }}
    </p>

    <div
      v-else-if="!isInOutEqual"
      class="bg-ft-red-soft text-ft-red flex items-center justify-center gap-2
        rounded-xl px-[14px] py-[10px] text-[15px]"
    >
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ t('settlement_warning') }}</span>
    </div>

    <template v-else>
      <div v-if="settlement.length" class="flex flex-col gap-[6px]">
        <TransferRow
          v-for="(transfer, i) in settlement"
          :key="i"
          :from="pretty(transfer.from)"
          :to="pretty(transfer.to)"
          :value="transfer.value"
        >
          <template #action>
            <button
              v-if="isCreator"
              type="button"
              class="border-ft-ink-10 text-ft-ink-50 hover:text-ft-green
                hover:border-ft-green inline-flex h-[26px] w-[26px]
                cursor-pointer items-center justify-center rounded-full border
                bg-white"
              :aria-label="t('add')"
              @click="addToTransfers(transfer)"
            >
              <i class="pi pi-check text-[12px]"></i>
            </button>
          </template>
        </TransferRow>
      </div>
    </template>
  </section>
</template>
