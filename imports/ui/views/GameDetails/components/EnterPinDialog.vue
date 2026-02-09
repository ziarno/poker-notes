<script setup lang="ts">
import Button from '@volt/Button.vue'
import Dialog from '@volt/Dialog.vue'
import InputText from '@volt/InputText.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { savePinCode } from '@/utils/pinCode.utils.ts'

const { gameId, pinCode } = defineProps<{
  gameId: string
  pinCode: string
}>()

const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{ saved: [] }>()
const { t } = useI18n()
const toast = useToast()
const enteredPin = ref('')

function submitPin() {
  if (enteredPin.value === pinCode) {
    savePinCode(gameId, enteredPin.value)
    visible.value = false
    enteredPin.value = ''
    toast.add({
      severity: 'success',
      summary: t('editor_added'),
      life: 2000,
    })
    emit('saved')
  } else {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('invalid_pin'),
      life: 2000,
    })
  }
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="t('enter_pin')"
    modal
    :draggable="false"
    class="m-4 w-80"
  >
    <p class="text-surface-600 dark:text-surface-300 mb-4 text-sm">
      {{ t('enter_pin_description') }}
    </p>
    <form @submit.prevent="submitPin">
      <InputText
        v-model="enteredPin"
        class="w-full text-center font-mono text-xl tracking-widest"
        maxlength="4"
        inputmode="numeric"
        pattern="[0-9]*"
        autofocus
      />
    </form>
    <template #footer>
      <div class="flex gap-2">
        <SecondaryButton :label="t('cancel')" @click="visible = false" />
        <Button :label="t('ok')" @click="submitPin" />
      </div>
    </template>
  </Dialog>
</template>
