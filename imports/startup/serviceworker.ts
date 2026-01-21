Meteor.startup(async () => {
  try {
    await navigator.serviceWorker.register('/sw.js')
  } catch (error) {
    console.error('Service Worker registration failed:', error)
  }
})
