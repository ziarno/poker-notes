import { Methods } from 'meteor/jam:method'

Methods.configure({
  before: [], // global before function(s) that will run before all methods
  after: [], // global after function(s) that will run after all methods
  serverOnly: false, // globally make all methods serverOnly, aka disable Optimistic UI, by setting to true
  open: true, // by default all methods will be protected by authentication, override it for all methods by setting this to true
  loggedOutError: new Meteor.Error('logged-out', 'You must be logged in'), // customize the logged out error
  options: {
    returnStubValue: true, // make it possible to get the ID of an inserted item on the client before the server finishes
    throwStubExceptions: true, // don't call the server method if the client stub throws an error, so that we don't end up doing validations twice
  },
})
