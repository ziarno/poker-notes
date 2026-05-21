<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { Random } from 'meteor/random'
import { useToast } from 'primevue/usetoast'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { createGame } from '@/api/methods/games.methods.ts'
import { NewPlayer } from '@/types'
import InputNewPlayer from '@/ui/components/InputNewPlayer.vue'
import InputNumberStep from '@/ui/components/InputNumberStep.vue'
import NavigationHeader from '@/ui/components/NavigationHeader.vue'
import { getCreatorId } from '@/utils/creatorId.utils.ts'
import { generatePinCode, savePinCode } from '@/utils/pinCode.utils.ts'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

const formData = ref<{
  title: string
  buyIn: number
  players: NewPlayer[]
}>({
  title: '',
  buyIn: 50,
  players: [],
})

const pot = computed(() =>
  formData.value.players.reduce((sum, p) => sum + (p.in || 0), 0)
)

function addPlayer(player: NewPlayer) {
  formData.value.players.push(player)
}
function removePlayer(index: number) {
  formData.value.players.splice(index, 1)
}

async function onSubmit() {
  if (!formData.value.title) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error_no_title'),
      life: 1000,
    })
    return
  }
  if (!formData.value.players.length) {
    toast.add({
      severity: 'error',
      summary: t('error'),
      detail: t('error_no_players'),
      life: 1000,
    })
    return
  }
  // we generate the _id on the FE because it will be a different id
  // after the user gets back online and calls this method, so the method
  // remembered by jam:offline in IndexDB should include the id
  const _id = Random.id(8)
  const pinCode = generatePinCode()
  // cloneDeep is needed for jam:offline - it removes Proxied objects create by Vue.
  // Proxies can't be saved in IndexedDB and vue creates proxies for refs.
  // In this case, the players array was Proxies
  const gameData = cloneDeep(formData.value)
  await createGame({ ...gameData, _id, pinCode, creatorId: getCreatorId() })
  savePinCode(_id, pinCode)
  router.replace(`/${_id}`)
}

watch(
  () => formData.value.buyIn,
  () => {
    formData.value.players.forEach((player: NewPlayer) => {
      player.in = formData.value.buyIn
    })
  }
)
</script>

<template>
  <div class="px-[18px] pt-[18px] pb-6">
    <NavigationHeader :title="t('new_game')" />

    <form class="flex flex-col gap-[14px]" @submit.prevent="onSubmit">
      <div class="flex flex-col">
        <label
          for="title"
          class="text-ft-ink-50 mb-[6px] font-sans text-[13px] font-semibold
            tracking-[0.16em] uppercase"
          >{{ t('title') }}</label
        >
        <input
          id="title"
          class="border-ft-ink-10 bg-ft-surface text-ft-ink
            focus:border-ft-green w-full rounded-[14px] border p-[14px]
            font-sans text-[17px] font-semibold transition-colors outline-none"
          v-model="formData.title"
          autocomplete="off"
        />
      </div>

      <div class="flex flex-col">
        <label
          class="text-ft-ink-50 mb-[6px] font-sans text-[13px] font-semibold
            tracking-[0.16em] uppercase"
          >{{ t('buy_in') }}</label
        >
        <InputNumberStep v-model="formData.buyIn" :step="10" />
      </div>

      <div
        class="bg-ft-surface border-ft-ink-10 rounded-2xl border px-[14px] py-3"
      >
        <div class="mb-[10px] flex items-center justify-between">
          <div class="font-sans text-[15px] font-semibold">
            {{ t('players') }} · {{ formData.players.length }}
          </div>
          <div class="text-ft-green font-mono text-xs font-semibold">
            {{ t('pot').toLowerCase() }} {{ pot }}
          </div>
        </div>

        <div
          v-for="(player, i) in formData.players"
          :key="i"
          class="border-ft-ink-10 flex items-center gap-[10px] border-t py-2"
          :class="{ 'border-t-0': i === 0 }"
        >
          <span class="text-ft-ink-50 w-[18px] font-mono text-xs tabular-nums"
            >{{ i + 1 }}.</span
          >
          <span class="flex-1 font-sans text-sm font-medium capitalize">{{
            player.name
          }}</span>
          <InputNumberStep
            v-model="player.in"
            :min="formData.buyIn"
            :step="formData.buyIn"
            size="small"
          />
          <button
            type="button"
            class="text-ft-ink-50 hover:text-ft-red h-[26px] w-[26px]
              cursor-pointer rounded-full border-none bg-transparent text-lg
              leading-none"
            :aria-label="t('cancel')"
            @click="removePlayer(i)"
          >
            ×
          </button>
        </div>

        <div class="border-ft-ink-10 mt-[10px] border-t pt-[10px]">
          <InputNewPlayer
            :buy-in="formData.buyIn"
            :exclude-names="formData.players.map(p => p.name)"
            @add="addPlayer"
          />
        </div>
      </div>

      <div class="pt-1">
        <button
          type="submit"
          class="bg-ft-green inline-flex w-full cursor-pointer items-center
            justify-center gap-2 rounded-2xl border-none p-[15px] font-sans
            text-[16px] font-semibold text-white
            shadow-[0_6px_18px_-6px_var(--color-ft-green)] transition-transform
            hover:-translate-y-px"
        >
          {{ t('create_game') }}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  </div>
</template>
