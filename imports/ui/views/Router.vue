<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const transitionName = ref('route-forward')
const router = useRouter()

router.beforeEach((to, from) => {
  transitionName.value =
    to.meta.depthForAnimation >= from.meta.depthForAnimation
      ? 'route-forward'
      : 'route-back'
})
</script>

<template>
  <div class="max-xs:pl-1 max-xs:pr-1 dark:bg-surface-900 m-auto max-w-xl p-3">
    <router-view v-slot="{ Component }">
      <Transition :name="transitionName" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </Transition>
    </router-view>
  </div>
</template>

<style>
:root {
  --route-slide-distance: 20px;
}

.route-forward-enter-active,
.route-forward-leave-active,
.route-back-enter-active,
.route-back-leave-active {
  transition:
    opacity 0.15s ease-in-out,
    transform 0.15s ease-in-out;
}

.route-forward-enter-from {
  opacity: 0;
  transform: translateX(var(--route-slide-distance));
}

.route-forward-leave-to {
  opacity: 0;
  transform: translateX(calc(-1 * var(--route-slide-distance)));
}

.route-back-enter-from {
  opacity: 0;
  transform: translateX(calc(-1 * var(--route-slide-distance)));
}

.route-back-leave-to {
  opacity: 0;
  transform: translateX(var(--route-slide-distance));
}
</style>
