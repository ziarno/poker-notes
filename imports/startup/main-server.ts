import '../api/methods'
import '../api/publications'
import '../api/collections'
import { GamesCollection } from '@/api/collections'

Meteor.startup(async () => {
  const games = await GamesCollection.find({}).fetchAsync()
  if (games.length < 3) {
    await GamesCollection.insertAsync({
      title: 'Gra 1',
      players: [
        {
          name: 'Filip',
          in: 50,
          out: 150,
        },
        {
          name: 'Maciej',
          in: 50,
          out: 0,
        },
        {
          name: 'Robert',
          in: 50,
          out: 0,
        },
      ],
      date: new Date(),
      transfers: [],
    })
    await GamesCollection.insertAsync({
      title: 'Gra 2',
      players: [
        {
          name: 'Filip',
          in: 50,
          out: 150,
        },
        {
          name: 'Maciej',
          in: 50,
          out: 0,
        },
        {
          name: 'Robert',
          in: 50,
          out: 0,
        },
      ],
      date: new Date(),
      transfers: [],
    })
    await GamesCollection.insertAsync({
      title: 'Gra 3',
      players: [
        {
          name: 'Filip',
          in: 50,
          out: 150,
        },
        {
          name: 'Maciej',
          in: 50,
          out: 0,
        },
        {
          name: 'Robert',
          in: 50,
          out: 0,
        },
      ],
      date: new Date(),
      transfers: [],
    })
  }
})
