<script setup lang="ts">
import Tag from '@volt/Tag.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { Game } from '@/types'
import { getGameTotal } from '@/utils'

const props = defineProps<{
  game: Game
}>()

const { t } = useI18n()

const chips = computed(() => [
  {
    icon: 'pi-user',
    label: t('players_count').toLowerCase(),
    value: props.game.players.length,
  },
  {
    icon: 'pi-wallet',
    label: t('buy_in').toLowerCase(),
    value: props.game.buyIn,
  },
  {
    icon: 'pi-dollar',
    label: t('pot').toLowerCase(),
    value: getGameTotal(props.game),
  },
])
</script>

<template>
  <div>
    <Tag
      v-for="chip in chips"
      :key="chip.icon"
      :icon="`pi ${chip.icon} text-ft-ink-50!`"
      class="bg-ft-surface! border-ft-ink-10! text-ft-ink! gap-[6px]!
        rounded-full! border! py-[5px]! pr-[10px]! pl-2! text-[15px]!
        font-normal!"
    >
      <span class="text-ft-ink-50 text-[13px] tracking-[0.02em]">{{
        chip.label
      }}</span>
      <span class="font-mono font-semibold tabular-nums">{{ chip.value }}</span>
    </Tag>
  </div>
</template>
