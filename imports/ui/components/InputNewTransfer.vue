<script setup lang="ts">
import Button from '@volt/Button.vue'
import SecondaryButton from '@volt/SecondaryButton.vue'
import Select from '@volt/Select.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { POT_KEY_NAME } from '@/constants/transfers.const.ts'
import { Game, Transfer } from '@/types'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'

const { game } = defineProps<{
  game: Game
}>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'add', transfer: Transfer): void
  (e: 'cancel'): void
}>()

const getDefaultValue = () => ({
  from: { key: '', name: '' },
  to: { key: '', name: '' },
  value: game.buyIn,
})

const formData = ref(getDefaultValue())
const menuItems = computed(() => [
  {
    key: POT_KEY_NAME,
    name: t('pot').toUpperCase(),
  },
  ...game.players.map(p => ({
    key: p.name,
    name: p.name,
  })),
])
const optionsFrom = computed(() =>
  menuItems.value.filter(p => p.key !== formData.value.to.key)
)
const optionsTo = computed(() =>
  menuItems.value.filter(p => p.key !== formData.value.from.key)
)

const onSubmit = () => {
  if (!formData.value.to || !formData.value.from || !formData.value.value) {
    return
  }
  emit('add', {
    from: formData.value.from.key,
    to: formData.value.to.key,
    value: formData.value.value,
  })
  Object.assign(formData.value, getDefaultValue())
}
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="flex w-full justify-between space-x-2"
  >
    <Select
      optionLabel="name"
      v-model="formData.from"
      :options="optionsFrom"
      class="shrink-1 grow-1 basis-0 overflow-hidden"
    />
    <Select
      optionLabel="name"
      v-model="formData.to"
      :options="optionsTo"
      class="shrink-1 grow-1 basis-0 overflow-hidden"
    />
    <InputNumberStep v-model="formData.value" />
    <Button @click="onSubmit" icon="pi pi-check" />
    <SecondaryButton @click="emit('cancel')" outlined icon="pi pi-times" />
  </form>
</template>
