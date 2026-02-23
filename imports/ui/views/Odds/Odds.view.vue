<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import CardInput, { Card } from '@/ui/components/CardInput.vue'

const { t } = useI18n()

const selectedCard = ref<Card | null>(null)
</script>

<template>
  <div>
    <h1
      class="text-surface-700 dark:text-surface-0 mb-4 text-2xl font-semibold"
    >
      {{ t('odds') }}
    </h1>

    <div class="mt-4 flex justify-center">
      <CardInput v-model="selectedCard" />
    </div>
  </div>
</template>
