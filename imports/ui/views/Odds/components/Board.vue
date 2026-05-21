<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <div class="mb-2 pt-[10px] pb-[6px]">
    <div
      class="relative flex h-[160px] items-center justify-center rounded-[80px]
        bg-[radial-gradient(ellipse_at_50%_30%,var(--color-ft-green-mid)_0%,var(--color-ft-green)_55%,var(--color-ft-green-deep)_100%)]
        shadow-[inset_0_0_0_5px_var(--color-ft-wood),inset_0_0_0_6px_var(--color-ft-wood-dark),inset_0_3px_10px_rgba(0,0,0,0.5),0_10px_22px_-10px_rgba(15,92,69,0.6)]"
    >
      <div
        class="pointer-events-none absolute inset-[10px] rounded-[72px] border
          border-dashed border-white/12"
        aria-hidden="true"
      ></div>
      <div
        v-if="label"
        class="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2
          font-mono text-[11px] tracking-[0.34em] text-white/45"
      >
        {{ label }}
      </div>
      <div class="flex items-center justify-center">
        <slot />
      </div>
      <div
        class="pointer-events-none absolute bottom-[10px] font-mono text-[12px]
          tracking-[0.18em] text-white/22"
        aria-hidden="true"
      >
        ♠
      </div>
    </div>
  </div>
</template>
