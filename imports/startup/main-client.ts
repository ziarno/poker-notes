import '../api/methods'
import '../api/collections'

import { Meteor } from 'meteor/meteor'
import { createApp } from 'vue'
import { VueMeteor } from 'vue-meteor-tracker'

import '../ui/main.css'
import App from '../ui/App.vue'
import { router } from '../ui/router'
import { createI18n } from 'vue-i18n'
import { Langs, pl } from '/imports/lang'

Meteor.startup(() => {
  const app = createApp(App)
  const i18n = createI18n<typeof pl, Langs>({
    locale: pl._locale,
    messages: { pl },
  })
  app.use(i18n)
  app.use(router)
  app.use(VueMeteor)
  app.mount('#app')
})
