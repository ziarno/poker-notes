Meteor.startup(async () => {
  try {
    if (Meteor.isProduction) {
      await navigator.serviceWorker.register('/sw.js')
    }
  } catch (error) {
    console.error('Service Worker registration failed:', error)
  }
})
