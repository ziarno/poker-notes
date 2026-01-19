<script setup lang="ts">
import ConfirmDialog from '@volt/ConfirmDialog.vue'
import Toast from '@volt/Toast.vue'
</script>

<template>
  <div class="max-xs:pl-1 max-xs:pr-1 dark:bg-surface-900 m-auto max-w-xl p-3">
    <router-view />
  </div>
  <ConfirmDialog />
  <Toast />
</template>
