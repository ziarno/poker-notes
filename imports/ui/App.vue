<script setup lang="ts">
import ConfirmDialog from '@volt/ConfirmDialog.vue'
import Toast from '@volt/Toast.vue'
</script>

<template>
  <div class="p-3 max-w-xl m-auto max-xs:pl-1 max-xs:pr-1">
    <router-view />
  </div>
  <ConfirmDialog />
  <Toast />
</template>
