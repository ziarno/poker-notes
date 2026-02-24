<script setup lang="ts">
import ConfirmDialog from '@volt/ConfirmDialog.vue'
import Toast from '@volt/Toast.vue'
import { subscribe } from 'vue-meteor-tracker'

import { useCardKeyboard } from '@/composables/useCardKeyboard'
import CardKeyboard from '@/ui/components/CardKeyboard.vue'
import TabBar from '@/ui/components/TabBar.vue'
import Router from '@/ui/views/Router.vue'

subscribe('games')

const { visible, handleSelect } = useCardKeyboard()
</script>

<template>
  <div class="flex h-dvh flex-col">
    <div id="main-scroll" class="flex-1 overflow-y-auto">
      <Router />
    </div>
    <TabBar v-if="false" />
  </div>
  <CardKeyboard v-model:visible="visible" @select="handleSelect" />
  <ConfirmDialog />
  <Toast />
</template>
