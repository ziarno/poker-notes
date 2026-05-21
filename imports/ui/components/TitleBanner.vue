<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import SuitWatermark from '@/ui/components/SuitWatermark.vue'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <section
    class="from-ft-green to-ft-green-deep relative mx-[18px] mt-2 mb-4
      overflow-hidden rounded-[18px] bg-gradient-to-br px-[18px] py-[18px]
      text-white shadow-[0_8px_24px_-10px_var(--color-ft-green)]"
  >
    <!-- Background suit decorations -->
    <div
      class="pointer-events-none absolute inset-y-0 left-3 flex items-center
        gap-3"
      aria-hidden="true"
    >
      <SuitWatermark
        suit="spades"
        :size="160"
        :opacity="0.18"
        color="#ffffff"
      />
    </div>

    <div class="relative flex items-center justify-between gap-3">
      <div class="inline-flex items-center gap-[10px]">
        <span
          class="inline-flex items-center justify-center bg-white/12 text-white
            shadow-[inset_0_-2px_0_rgba(0,0,0,.18),0_1px_2px_rgba(0,0,0,.1)]"
          style="
            width: 42px;
            height: 42px;
            border-radius: 9px;
            font-size: 18px;
            line-height: 1;
          "
          aria-hidden="true"
          >♠</span
        >
        <span class="font-[Poker] text-[34px] leading-none">{{
          t('poker_notes')
        }}</span>
      </div>
      <button
        class="text-ft-green-ink inline-flex cursor-pointer items-center
          gap-[6px] rounded-full border-none bg-white/95 px-[14px] py-[10px]
          font-sans text-[15px] font-semibold shadow-[0_2px_0_rgba(0,0,0,0.1)]"
        @click="router.push('/new')"
      >
        <i class="pi pi-plus text-[13px]"></i>
        <span>{{ t('new_game') }}</span>
      </button>
    </div>
  </section>
</template>
