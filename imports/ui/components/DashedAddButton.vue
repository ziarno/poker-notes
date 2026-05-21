<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    icon?: string
    block?: boolean
  }>(),
  {
    icon: 'pi-plus',
    block: false,
  }
)
</script>

<template>
  <button
    type="button"
    class="border-ft-ink-30 text-ft-ink-70 font-sans hover:text-ft-ink
      hover:border-ft-ink-50 inline-flex cursor-pointer items-center
      justify-center gap-2 rounded-xl border border-dashed bg-transparent
      px-[14px] py-[10px] text-[15px] font-medium"
    :class="{ 'w-full flex-1': block }"
  >
    <i :class="`pi ${icon} text-[13px]`"></i>
    <span>{{ label }}</span>
  </button>
</template>
