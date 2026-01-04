import { Meteor } from 'meteor/meteor'
import { Game } from '/imports/types/Game.type.ts'
import { GamesCollection } from '/imports/api/collections/games.collection.ts'

Meteor.publish('games', function (limit = 20): Mongo.Cursor<Game> {
  return GamesCollection.find({}, { limit })
})
