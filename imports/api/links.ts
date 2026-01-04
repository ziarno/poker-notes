import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import type { Link } from '/imports/types'

export const LinksCollection: Mongo.Collection<Link> = new Mongo.Collection<Link>('links')

if (Meteor.isServer) {
  Meteor.publish('links', function (): Mongo.Cursor<Link> {
    return LinksCollection.find({})
  })
}
