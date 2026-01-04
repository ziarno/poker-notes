import '../api/methods'
import '../api/collections'

import { Meteor } from 'meteor/meteor'
import { createApp } from 'vue'
import { VueMeteor } from 'vue-meteor-tracker'

import '../ui/main.css'
import App from '../ui/App.vue'
import { router } from '../ui/router'

Meteor.startup(() => {
  const app = createApp(App)
  app.use(router)
  app.use(VueMeteor)
  app.mount('#app')
})
