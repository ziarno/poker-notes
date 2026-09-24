<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { getBoxToBoxArrow } from 'curved-arrows'
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'

import { PlayerColor } from '@/types'

// The "from" and "to" boxes as [x, y, width, height] each, in pixels relative
// to the parent the SVG covers.
export type ArrowBoxes = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

const { boxes, fromColor, toColor } = defineProps<{
  boxes: ArrowBoxes | null
  fromColor?: PlayerColor
  toColor?: PlayerColor
}>()

const ANIMATION_MS = 150
const HEAD_LENGTH = 9
const HEAD_HALF_WIDTH = 5
const GAP = 4
// How far the control points reach out horizontally. Half the gutter keeps
// the whole S-curve inside it.
const CONTROL_POINT_STRETCH = 28

const gradientId = useId()
const reducedMotion = usePreferredReducedMotion()
const current = ref<ArrowBoxes | null>(null)
let frame = 0

// Tweens the boxes rather than the path itself, since CSS transitions on the
// `d` attribute aren't supported everywhere (Safari).
watch(
  () => boxes,
  target => {
    cancelAnimationFrame(frame)
    const start = current.value
    if (!target || !start || reducedMotion.value === 'reduce') {
      current.value = target
      return
    }
    const startTime = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / ANIMATION_MS)
      const eased = 1 - (1 - progress) ** 3
      current.value = start.map(
        (from, i) => from + (target[i]! - from) * eased
      ) as ArrowBoxes
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  },
  { immediate: true }
)

onBeforeUnmount(() => cancelAnimationFrame(frame))

const arrow = computed(() => {
  if (!current.value) return null
  // The library offsets end points by twice the padding. The line stops short
  // of the "to" row to leave room for the head, which then reaches to GAP.
  const [sx, sy, c1x, c1y, c2x, c2y, ex, ey, ae] = getBoxToBoxArrow(
    ...current.value,
    {
      padStart: GAP / 2,
      padEnd: (HEAD_LENGTH + GAP) / 2,
      controlPointStretch: CONTROL_POINT_STRETCH,
      allowedStartSides: ['right'],
      allowedEndSides: ['left'],
    }
  )
  const radians = (ae * Math.PI) / 180
  return {
    start: { x: sx, y: sy },
    tip: {
      x: ex + Math.cos(radians) * HEAD_LENGTH,
      y: ey + Math.sin(radians) * HEAD_LENGTH,
    },
    path: `M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${ex},${ey}`,
    head: `translate(${ex},${ey}) rotate(${ae})`,
  }
})

const colorVars = (color?: PlayerColor) =>
  color
    ? { '--player-color': color.light, '--player-color-dark': color.dark }
    : undefined
</script>

<template>
  <svg
    class="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    aria-hidden="true"
  >
    <g v-if="arrow">
      <defs>
        <linearGradient
          :id="gradientId"
          gradientUnits="userSpaceOnUse"
          :x1="arrow.start.x"
          :y1="arrow.start.y"
          :x2="arrow.tip.x"
          :y2="arrow.tip.y"
        >
          <stop
            offset="0"
            class="ft-player-accent [stop-color:var(--accent)]"
            :style="colorVars(fromColor)"
          />
          <stop
            offset="1"
            class="ft-player-accent [stop-color:var(--accent)]"
            :style="colorVars(toColor)"
          />
        </linearGradient>
      </defs>
      <path
        :d="arrow.path"
        fill="none"
        :stroke="`url(#${gradientId})`"
        stroke-width="2.5"
      />
      <polygon
        :points="`0,${-HEAD_HALF_WIDTH} ${HEAD_LENGTH},0 0,${HEAD_HALF_WIDTH}`"
        :transform="arrow.head"
        class="ft-player-accent fill-(--accent)"
        :style="colorVars(toColor)"
      />
    </g>
  </svg>
</template>
