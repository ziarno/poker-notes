<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import SuitWatermark from '@/ui/components/SuitWatermark.vue'
import ThemeToggle from '@/ui/components/ThemeToggle.vue'

const { t } = useI18n()
const router = useRouter()

const sentinel = ref<HTMLElement>()
const isStuck = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!sentinel.value) return
  const root = document.getElementById('main-scroll')
  observer = new IntersectionObserver(
    ([entry]) => {
      isStuck.value = !entry?.isIntersecting
    },
    { root, threshold: 0 }
  )
  observer.observe(sentinel.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="sentinel" class="h-px" aria-hidden="true"></div>
  <section
    :class="[
      `from-ft-green to-ft-green-deep mt-2 mb-4 overflow-hidden
      bg-gradient-to-br px-[18px] py-[18px] max-[420px]:px-3 max-[420px]:py-3
      text-white shadow-[0_8px_24px_-10px_var(--color-ft-green)]
      dark:from-[#0f4d3a] dark:to-[#0a2c22]
      dark:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.85)] dark:ring-1
      dark:ring-white/[0.06] dark:ring-inset sticky top-0 z-20
      transition-[margin,border-radius] duration-300 ease-out`,
      isStuck ? 'mx-0 rounded-none' : 'mx-[18px] rounded-[18px]',
    ]"
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
        <ThemeToggle variant="banner" />
        <span
          class="font-[Jqkas] text-[34px] max-[420px]:text-[26px] leading-none"
          >{{ t('poker_notes') }}</span
        >
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button
          class="text-ft-green-ink dark:text-ft-green-deep inline-flex
            cursor-pointer items-center gap-[6px] rounded-full border-none
            bg-white/95 px-[14px] py-[10px] font-sans text-[15px] font-semibold
            shadow-[0_2px_0_rgba(0,0,0,0.1)]"
          @click="router.push('/new')"
        >
          <i class="pi pi-plus text-[13px]"></i>
          <span>{{ t('new_game') }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
