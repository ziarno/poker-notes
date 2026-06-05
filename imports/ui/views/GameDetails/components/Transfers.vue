<script setup lang="ts">
import { TransitionGroup, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  addTransfer as addTransferMethod,
  removeTransfer as removeTransferMethod,
} from '@/api/methods/games.methods.ts'
import { useDeleteConfirmationDialog, useIsGameEditor } from '@/composables'
import { POT_KEY_NAME } from '@/constants'
import { Game, Transfer } from '@/types'
import DashedAddButton from '@/ui/components/DashedAddButton.vue'
import InputNewTransfer from '@/ui/components/InputNewTransfer.vue'
import SectionTitle from '@/ui/components/SectionTitle.vue'
import TransferRow from '@/ui/components/TransferRow.vue'

const { game } = defineProps<{
  game: Game
}>()

const { t } = useI18n()
const isEditor = useIsGameEditor(() => game)
const isAddingNewTransfer = ref(false)

const count = computed(() => game.transfers.length)
const subtitle = computed(() => `${t('transfers')} · ${count.value}`)

function name(n: string) {
  return n === POT_KEY_NAME ? t('pot').toUpperCase() : n
}

async function addTransfer(transfer: Transfer) {
  addTransferMethod({ gameId: game._id!, transfer })
  isAddingNewTransfer.value = false
}

function removeTransfer(transfer: Transfer) {
  return removeTransferMethod({ gameId: game._id!, transfer })
}

const confirmRemoveTransfer = useDeleteConfirmationDialog(removeTransfer)
</script>

<template>
  <section class="mt-4 mb-12">
    <SectionTitle>{{ subtitle }}</SectionTitle>

    <TransitionGroup
      v-if="game.transfers.length"
      tag="div"
      name="ft-list"
      class="relative grid
        grid-cols-[minmax(0,max-content)_auto_minmax(0,max-content)_1fr_auto]
        gap-x-1 gap-y-[6px]"
    >
      <TransferRow
        v-for="transfer in game.transfers"
        :key="`${transfer.from}-${transfer.to}-${transfer.value}`"
        :from="name(transfer.from)"
        :to="name(transfer.to)"
        :value="transfer.value"
      >
        <template #action>
          <button
            v-if="isEditor"
            type="button"
            class="border-ft-ink-10 text-ft-ink-50 hover:text-ft-red
              hover:border-ft-red bg-ft-surface inline-flex h-[26px] w-[26px]
              cursor-pointer items-center justify-center rounded-full border"
            :aria-label="t('cancel')"
            @click="confirmRemoveTransfer(transfer)"
          >
            <i class="pi pi-times text-[12px]"></i>
          </button>
        </template>
      </TransferRow>
    </TransitionGroup>

    <p
      v-if="!game.transfers.length && !isEditor"
      class="text-ft-ink-50 my-2 text-center text-[15px]"
    >
      {{ t('no_transfers') }}
    </p>

    <div v-if="isEditor" class="mt-[10px]">
      <DashedAddButton
        v-if="!isAddingNewTransfer"
        :label="t('add_transfer')"
        @click="isAddingNewTransfer = true"
      />
      <InputNewTransfer
        v-else
        :game="game"
        @add="addTransfer"
        @cancel="isAddingNewTransfer = false"
      />
    </div>
  </section>
</template>
