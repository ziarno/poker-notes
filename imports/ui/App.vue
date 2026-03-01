<script setup lang="ts">
import ConfirmDialog from '@volt/ConfirmDialog.vue'
import Toast from '@volt/Toast.vue'
import { subscribe } from 'vue-meteor-tracker'

import { accessToGameIds } from '@/utils/accessToGameIds.utils.ts'
import { getCreatorId } from '@/utils/creatorId.utils.ts'
import CardKeyboard from '@/ui/components/CardKeyboard.vue'
import TabBar from '@/ui/components/TabBar.vue'
import Router from '@/ui/views/Router.vue'

subscribe('games', getCreatorId(), accessToGameIds.value)
</script>

<template>
  <div class="flex h-dvh flex-col">
    <div id="main-scroll" class="flex-1 overflow-y-auto">
      <Router />
    </div>
    <TabBar />
  </div>
  <CardKeyboard />
  <ConfirmDialog />
  <Toast />
</template>
