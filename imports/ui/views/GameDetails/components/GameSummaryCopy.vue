<script setup lang="ts">
import Fieldset from '@volt/Fieldset.vue'
import { useClipboard } from '@vueuse/core'
import { flow, join, map, sortBy } from 'lodash/fp'
import { useToast } from 'primevue/usetoast'
import { ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFormattedDate } from '@/composables'
import { useGetName } from '@/composables/useGetName.ts'
import { FinishedGame, FinishedPlayer, Transfer } from '@/types'
import { getGameSettlement } from '@/utils/game.utils.ts'
import { balanceToString } from '@/utils/string.utils.ts'

const { game } = defineProps<{
  game: FinishedGame
}>()
const { t } = useI18n()
const date = useFormattedDate(game.date, 'E, dd.MM.yyyy')
const summaryRef = useTemplateRef('summary')
const toast = useToast()
const name = useGetName()

const source = ref('text-to-copy')
const { copy, isSupported } = useClipboard({ source })

function copyToClipboard() {
  const textToCopy = generateCopyText()
  copy(textToCopy)
  toast.add({
    closable: true,
    severity: 'success',
    summary: t('copied'),
    detail: textToCopy,
    life: 3000,
  })
}

function generateCopyText() {
  const playersText = flow(
    sortBy((p: FinishedPlayer) => p.in - p.out),
    map(p => {
      return `${p.name}: ${p.in} → ${p.out} = ${balanceToString(p.out - p.in)}`
    }),
    join('\n')
  )(game.players as FinishedPlayer[])

  const settlementText = flow(
    map((t: Transfer) => ({
      from: name(t.from),
      to: name(t.to),
      value: t.value,
    })),
    map((t: Transfer) => `${t.from} → ${t.to}: ${t.value}`),
    join('\n')
  )(getGameSettlement(game))

  return `${game.title} | ${date.value}
${document.URL}

${playersText}

${t('settlement').toUpperCase()}
${settlementText}`
}

function onCollapsed(collapsed: boolean) {
  if (collapsed) return
  window.getSelection()?.selectAllChildren(summaryRef.value!)
}
</script>

<template>
  <button
    v-if="isSupported"
    type="button"
    class="bg-ft-green inline-flex cursor-pointer items-center gap-[6px]
      rounded-full border-none px-[14px] py-2 font-sans text-xs font-semibold
      text-white shadow-[0_3px_10px_-4px_var(--color-ft-green-ink)]"
    @click="copyToClipboard"
  >
    <i class="pi pi-copy text-[13px]"></i>
    <span>{{ t('copy_game') }}</span>
  </button>
  <Fieldset
    v-else
    :legend="t('summary')"
    class="w-full"
    toggleable
    collapsed
    @update:collapsed="onCollapsed"
  >
    <pre ref="summary" class="text-xs">{{ generateCopyText() }}</pre>
  </Fieldset>
</template>
