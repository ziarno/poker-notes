<script setup lang="ts">
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useClipboard } from '@vueuse/core'
import { flow, join, map, sortBy } from 'lodash/fp'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFormattedDate } from '@/composables'
import { FinishedGame, FinishedPlayer, Transfer } from '@/types'
import { getGameSettlement } from '@/utils/game.utils.ts'

const { game } = defineProps<{
  game: FinishedGame
}>()
const { t } = useI18n()
const date = useFormattedDate(game.date, 'E, dd.MM.yyyy')
const toast = useToast()

const source = ref('text-to-copy')
const { copy, isSupported } = useClipboard({ source })

function copyToClipboard() {
  const playersText = flow(
    sortBy((p: FinishedPlayer) => p.in - p.out),
    map(p => {
      const balanceSign = p.out - p.in > 0 ? '+' : ''
      return `${p.name}: ${p.in} -> ${p.out} = ${balanceSign}${p.out - p.in}`
    }),
    join('\n')
  )(game.players as FinishedPlayer[])

  const settlementText = flow(
    map((t: Transfer) => `${t.from} -> ${t.to}: ${t.value}`),
    join('\n')
  )(getGameSettlement(game))

  const textToCopy = `${game.title} | ${date.value}

${playersText}

${t('settlement').toUpperCase()}
${settlementText}
`

  copy(textToCopy)
  toast.add({
    closable: true,
    severity: 'success',
    summary: t('copied'),
    detail: textToCopy,
    life: 3000,
  })
}
</script>

<template>
  <SecondaryButton
    icon="pi pi-copy"
    v-if="isSupported"
    @click="copyToClipboard"
    :label="t('copy_game')"
  />
</template>

<style scoped></style>
