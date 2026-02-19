<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-surface-700 dark:text-surface-0 mb-4 text-2xl font-semibold">
      {{ t('odds') }}
    </h1>
    <p class="text-surface-500 dark:text-surface-400 text-center">
      {{ t('coming_soon') }}
    </p>
  </div>
</template>
