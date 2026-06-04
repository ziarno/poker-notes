export * from './accessToGameIds.utils.ts'
export * from './api.utils.ts'
export * from './creatorId.utils.ts'
export * from './date.utils.ts'
export * from './game.utils.ts'
export * from './gameId.utils.ts'
export * from './gameSettlement.utils.ts'
export * from './number.utils.ts'
export * from './pinCode.utils.ts'
export * from './string.utils.ts'

// This barrel is CLIENT-ONLY. Do not import it from server-side code
// (api/methods, api/publications, …) — it is a runtime module that Vite
// co-bundles with the client Vue graph, so pulling it into the Meteor server
// (SSR) bundle drags in client-only deps (e.g. vue-meteor-tracker) and crashes
// the boot. Server code should import the specific util file it needs instead.
//
// oddsWorker.utils.ts is also intentionally NOT re-exported here: it uses
// `new Worker(...)` + `import.meta.url`, which breaks the server bundle (the
// test suite imports this barrel server-side). Import it directly where needed.
