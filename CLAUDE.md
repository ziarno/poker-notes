# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Poker Notes is an offline-first, mobile-friendly web app for tracking home poker
games (buy-ins, transfers, settle-up) with a built-in Texas Hold'em odds
calculator. Backend and build are **Meteor 3**; the frontend is a **Vue 3** SPA
bundled by **Vite** (`jorgenvatle:vite`).

## Commands

- `meteor npm install` — install deps (runs `patch-package` via postinstall).
- `meteor` (or `npm start`) — dev server with HMR at http://localhost:3000.
- `npm run type-check` — `vue-tsc --noEmit`. **Types are not checked by the
  bundler**, so run this to catch type errors (`type-check:watch` for watch mode).
- `npm run format` / `npm run format:check` — Prettier (write / verify).
- `npm test` — full Mocha suite once (`meteortesting:mocha`). `npm run test-app`
  runs it in watch mode. Run a subset with `MOCHA_GREP="pattern" npm test`.
- `npm run build` then `npm run prod` — production build + run (needs a local
  MongoDB; see `README.md`).

## Architecture

- **Wiring**: Meteor `mainModule`s are `client/entry-meteor-client.ts` /
  `server/entry-meteor-server.ts` (Vite auto-import shims — keep them mostly
  empty). Real startup is `imports/startup/main-client.ts` (creates the Vue app:
  PrimeVue unstyled, `vue-i18n`, `vue-router`, `vue-meteor-tracker`) and
  `imports/startup/main-server.ts` (imports collections/methods/publications).
- **`imports/api/`** — the Meteor data layer. `collections/` (Mongo collections;
  the only domain collection is `GamesCollection`), `methods/` (`jam:method`
  `createMethod` mutations — all writes go through these), `publications/`
  (`games` for the list, `game` for one).
- **`imports/ui/`** — the Vue SPA. `router.ts` defines routes (`/` list, `/:id`
  details, `/new`, `/odds`); `App.vue` is the root and holds the top-level
  `games` subscription. Reactive reads use `vue-meteor-tracker`: `subscribe(...)`
  and `autorun(() => GamesCollection.find(...))`.
- **`src/volt/`** — PrimeVue "Volt" components: unstyled PrimeVue wrappers styled
  with Tailwind. Imported via the `@volt/*` alias.
- **Odds**: `imports/workers/oddsWorker.ts` runs `poker-odds-calc` in a Web Worker.
- **Access model**: there is no login UI. A per-browser `creatorId`
  (localStorage, `imports/utils/creatorId.utils.ts`) owns the games it creates;
  others get in via a per-game `pinCode` plus a local `accessToGameIds` list. The
  `games` publication filters by `creatorId` OR `accessToGameIds`.

## Offline-first (read before touching methods or data creation)

The app is offline-first via `jam:method` + `jam:offline`, with non-obvious
gotchas:

- A method's `run` executes as both a client stub and on the server, and the call
  resolves with the **stub's** value — so any value the client needs up front
  (e.g. an `_id` for a redirect) must be generated on the client and passed in,
  not created inside `run`. Use a `serverOnly` method when the server must decide
  a value before the client continues.
- `_id` collisions from documents created offline are silently dropped on sync.

Full mechanics, the game-ID scheme, and reasoning:
[.claude/docs/offline-first-methods.md](.claude/docs/offline-first-methods.md).

## Conventions

- **Path aliases** (tsconfig + Vite): `@/*` → `imports/*`, `@volt/*` →
  `src/volt/*`. Prefer them over relative paths.
- **Prettier** (`prettier.config.js`): no semicolons, single quotes, 2-space
  indent, width 80, `arrowParens: avoid`, and sorted imports (third-party → `@/`
  → relative, with blank-line separation).
- **TypeScript** is strict (`noUnusedLocals`, `noUncheckedIndexedAccess`, …) but
  only enforced via `npm run type-check`.
- **i18n**: YAML catalogs at `imports/lang/{en,pl}.yml`; the default locale is
  `pl`.
- `imports/types/meteor/jam_method.d.ts` vendors `jam:method` types (note: method
  return types are often not inferred — see the offline-first doc).
- `patches/` holds `patch-package` patches (currently PrimeVue), applied on install.
