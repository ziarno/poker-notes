import { Meteor } from 'meteor/meteor'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { VueMeteor } from 'vue-meteor-tracker'

import '@/api/collections'
import '@/api/methods'
import { Langs, pl } from '@/lang'
import App from '@/ui/App.vue'
import '@/ui/main.css'
import { router } from '@/ui/router'

Meteor.startup(() => {
  const app = createApp(App)
  const i18n = createI18n<typeof pl, Langs>({
    locale: pl._locale,
    messages: { pl },
  })

  app.use(i18n)
  app.use(PrimeVue, {
    unstyled: true,
  })
  app.use(router)
  app.use(VueMeteor)
  app.mount('#app')
})
