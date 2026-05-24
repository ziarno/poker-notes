<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    /** Animation length in milliseconds. */
    duration?: number
    /** Optional formatter for the displayed value. */
    format?: (value: number) => string | number
  }>(),
  {
    duration: 1000,
    format: (value: number) => Math.round(value),
  }
)

const displayed = ref(props.value)

let frame: number | null = null

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const animateTo = (to: number) => {
  if (frame !== null) cancelAnimationFrame(frame)

  const from = displayed.value
  if (from === to || props.duration <= 0) {
    displayed.value = to
    return
  }

  const start = performance.now()

  const step = (now: number) => {
    const progress = Math.min((now - start) / props.duration, 1)
    displayed.value = from + (to - from) * easeOutCubic(progress)

    if (progress < 1) {
      frame = requestAnimationFrame(step)
    } else {
      frame = null
    }
  }

  frame = requestAnimationFrame(step)
}

watch(
  () => props.value,
  to => animateTo(to)
)

onUnmounted(() => {
  if (frame !== null) cancelAnimationFrame(frame)
})
</script>

<template>
  <span>{{ props.format(displayed) }}</span>
</template>
