import { Methods } from 'meteor/jam:method'

Methods.configure({
  // Global before function(s) that will run before all methods
  before: [],
  // Global after function(s) that will run after all methods
  after: [],
  // Globally make all methods serverOnly, aka disable Optimistic UI, by setting to true
  serverOnly: false,
  // By default all methods will be protected by authentication, override it for all
  // methods by setting this to true
  open: true,
  // Customize the logged out error
  loggedOutError: new Meteor.Error('logged-out', 'You must be logged in'),
  options: {
    // Make it possible to get the ID of an inserted item on the client before the
    // server finishes
    returnStubValue: true,
    // Don't call the server method if the client stub throws an error, so that we
    // don't end up doing validations twice
    throwStubExceptions: true,
  },
})
