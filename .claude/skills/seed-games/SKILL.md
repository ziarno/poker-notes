---
name: seed-games
description: Generate sample Poker Notes games (players, settle-up transfers, and chronological history) and insert them into the local dev MongoDB. Use when the user wants seed data, test games, sample games, or to populate the games list in development. Produces a mix of finished and in-progress games owned by the dev creatorId so they show up immediately in the running app.
---

# Seed Games

Populates the local dev database with realistic Poker Notes games so the games
list, game details, transfers, and history views have data to render.

## When to use

Use when the user asks to seed / generate / populate sample or test games, or
wants the games list filled in during development.

## How it works

- `seed-games.js` is a self-contained **mongosh** script. It generates games
  matching the `Game` shape (`imports/types/Game.type.ts`) and inserts them
  directly into the dev Mongo via `db.games.insertMany`.
- Every game is owned by `creatorId: "creator-id-dev"`. In development mode the
  frontend forces this same id (`DEV_CREATOR_ID` in
  `imports/utils/creatorId.utils.ts`), so seeded games appear in the running app
  for any browser with **no localStorage setup**.
- Each game gets:
  - 4–10 players, `buyIn` of 50 or 100, with occasional rebuys
    (`player_in_changed`) and mid-session joins (`player_added`).
  - A **mix of states**: ~55% finished (every player cashed out, outs sum to the
    pot, settle-up transfers fully clear all balances) and the rest in-progress
    (open buy-ins, maybe a loan or an early cash-out).
  - A chronological `history` whose end state matches `players` and `transfers`.

## Usage

Prerequisite: the dev server must be running (`meteor` / `npm start`) so Mongo is
up on port 3001 — or any local Mongo at `mongodb://127.0.0.1:3001/meteor`.

Run from the repo root. Default is 8 games:

```bash
mongosh "mongodb://127.0.0.1:3001/meteor" --quiet \
  .claude/skills/seed-games/seed-games.js
```

Choose how many games with `NUM_GAMES`:

```bash
mongosh "mongodb://127.0.0.1:3001/meteor" --quiet \
  --eval "globalThis.NUM_GAMES=20" \
  .claude/skills/seed-games/seed-games.js
```

The script prints the inserted count (finished vs in-progress) and the new game
ids. The app updates reactively — no restart needed.

## Removing seed data

All seeded games share the dev creatorId, so they're easy to clear:

```bash
mongosh "mongodb://127.0.0.1:3001/meteor" --quiet \
  --eval 'print("removed: " + db.games.deleteMany({ creatorId: "creator-id-dev" }).deletedCount)'
```

## Notes

- The script collision-checks `_id`s against existing games, mirroring the app's
  short-id scheme, so re-running it is safe.
- To change player names or game titles, edit the `NAMES` / `TITLES` arrays in
  `seed-games.js`.
- Production is unaffected: the dev creatorId override only applies when
  `Meteor.isDevelopment` is true.
