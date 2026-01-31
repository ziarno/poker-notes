<script setup lang="ts">
import ConfirmDialog from '@volt/ConfirmDialog.vue'
import Toast from '@volt/Toast.vue'
import { subscribe } from 'vue-meteor-tracker'

import Router from '@/ui/views/Router.vue'

subscribe('games')
</script>

<template>
  <Router />
  <ConfirmDialog />
  <Toast />
</template>
