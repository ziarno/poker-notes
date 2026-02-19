<script setup lang="ts">
import ConfirmDialog from '@volt/ConfirmDialog.vue'
import Toast from '@volt/Toast.vue'
import { subscribe } from 'vue-meteor-tracker'

import TabBar from '@/ui/components/TabBar.vue'
import Router from '@/ui/views/Router.vue'

subscribe('games')
</script>

<template>
  <div class="flex h-dvh flex-col">
    <div class="flex-1 overflow-y-auto">
      <Router />
    </div>
    <TabBar />
  </div>
  <ConfirmDialog />
  <Toast />
</template>
