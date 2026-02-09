<script setup lang="ts">
import Dialog from '@volt/Dialog.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  pinCode: string
}>()

const visible = defineModel<boolean>('visible', { default: false })
const { t } = useI18n()
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="t('add_editor')"
    modal
    :draggable="false"
    class="m-4 w-80"
  >
    <p class="text-surface-600 dark:text-surface-300 mb-4 text-sm">
      {{ t('add_editor_description') }}
    </p>
    <div class="flex items-center justify-center">
      <span
        class="bg-surface-100 dark:bg-surface-800 rounded-lg px-6 py-3 font-mono text-2xl tracking-widest"
      >
        {{ pinCode }}
      </span>
    </div>
    <template #footer>
      <SecondaryButton :label="t('close')" @click="visible = false" />
    </template>
  </Dialog>
</template>
