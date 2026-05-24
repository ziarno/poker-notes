# Offline-first methods & game IDs

Deep dive on the `jam:method` / `jam:offline` behaviors that shape how data is
created in this app, and the resulting game-ID scheme. Read this before touching
methods (`imports/api/methods/`) or anything that creates documents the client
needs immediately.

## Methods (`jam:method` + `jam:offline`)

Methods are defined with `createMethod` from `meteor/jam:method`. Two behaviors
are critical and easy to get wrong:

1. **A method's `run` executes twice when online**: once as an optimistic _stub_
   on the client (against Minimongo) and once for real on the server.
   `jam:method` resolves the call with the **stub's** return value
   (`returnStubValue`), so `await someMethod()` gives you the client
   simulation's result, **not** the server's.

2. **Offline support**: `jam:offline` queues method calls in IndexedDB while
   offline and replays them on reconnect. Kept collections
   (`Collection.keep(...)`, e.g. `GamesCollection` in
   `imports/api/collections/games.collection.ts`) stay readable offline.
   Duplicate `_id` errors are silently suppressed **during sync replay** (see
   `packages/jam_offline/client.js` and `lib/ddp.js`) — so a colliding `_id`
   created offline = a silently dropped document.

### Rule of thumb

Any value the client needs _before_ the server responds (an `_id` used in a
redirect, anything written optimistically) must be **decided on the client and
passed into the method**, so the stub and the server agree. Do not generate it
inside `run` — the client stub and server will produce different values, the
client navigates to the stub's value, and the real (server) document lives under
a different id.

When you genuinely need the server to decide a value before continuing, use a
**`serverOnly: true`** method: `jam:method` skips the client stub and sets
`returnStubValue: false`, so `await` resolves to the real server value. A
serverOnly method can't run offline, so branch on `Meteor.status().connected`.

## Game IDs

Game `_id`s are short, lowercase-letter strings (min 4 chars), generated to keep
the offline path working. The flow lives in
`imports/ui/views/NewGame/NewGame.view.vue` (`onSubmit`):

- **Online**: `await getAvailableGameId()` — a `serverOnly` method
  (`imports/api/methods/games.methods.ts`) that returns `generateUniqueGameId()`
  (`imports/api/methods/games.methods.utils.ts`): generates a 4-letter id,
  checks it against `GamesCollection`, retries on collision, and grows the
  length after repeated collisions as a safety valve. Short ids, no collisions.
- **Offline**: `generateGameId(OFFLINE_GAME_ID_LENGTH)`
  (`imports/utils/gameId.utils.ts`) — generated locally because the server is
  unreachable and the id is needed for the URL and the queued call. It can't be
  DB-checked, so it's longer to stay collision-safe on sync.

The chosen `_id` is then passed into `createGame`, which simply inserts it
(`_id: game._id`) so the optimistic and server inserts match. `createGame` must
never generate the id itself (see the methods gotcha above).

There is a tiny theoretical race: `getAvailableGameId` checks availability but
doesn't reserve, so two simultaneous online creators could in principle draw the
same id. Probability is ~1/456,976 per concurrent pair, and the server
`insertAsync` would reject the second on the duplicate key (online inserts are
not suppressed — only offline sync replays are), so it's left unhandled.
