<script setup lang="ts">
import { balanceToString } from '@/utils'

const { value } = defineProps<{ value: number | null }>()

const colorClass = !value ? '' : value > 0 ? 'text-lime-600' : 'text-red-700'
</script>

<template>
  <span :class="`font-bold text-nowrap ${colorClass}`">{{
    balanceToString(value)
  }}</span>
</template>
