// Seed generator for Poker Notes — run via mongosh against the dev DB.
//
//   mongosh "mongodb://127.0.0.1:3001/meteor" --quiet \
//     --eval "globalThis.NUM_GAMES=8" .claude/skills/seed-games/seed-games.js
//
// Produces a mix of finished (settled) and in-progress games, each with
// players, settle-up transfers and a chronological history. All games are
// owned by CREATOR_ID so they appear in the app when it runs in development
// mode (see imports/utils/creatorId.utils.ts -> DEV_CREATOR_ID).

const NUM_GAMES = globalThis.NUM_GAMES || 8
const CREATOR_ID = globalThis.CREATOR_ID || 'creator-id-dev'

// --- helpers ---------------------------------------------------------------

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = arr => arr[randInt(0, arr.length - 1)]
const chance = p => Math.random() < p

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function gameId(length) {
  let id = ''
  for (let i = 0; i < length; i++) id += pick(ALPHABET.split(''))
  return id
}

function uniqueGameId() {
  // Mirror the app's collision-checked scheme (start at length 4).
  let length = 4
  for (let attempts = 0; ; attempts++) {
    const candidate = gameId(length)
    if (!db.games.findOne({ _id: candidate }, { _id: 1 })) return candidate
    if (attempts > 0 && attempts % 8 === 0) length++
  }
}

const NAMES = [
  'Adam', 'Bartek', 'Czarek', 'Darek', 'Ewa', 'Filip', 'Gosia', 'Heniek',
  'Iwona', 'Jacek', 'Kamil', 'Lena', 'Marek', 'Natalia', 'Olek', 'Piotr',
  'Rafał', 'Sławek', 'Tomek', 'Ula', 'Wojtek', 'Zosia',
]

const TITLES = [
  'Czwartkowy pokerek', 'Domówka u Filipa', 'Gierka', 'Turniej piwniczny',
  'Sobotnia rozgrywka', 'Pokerowa noc', 'Liga garażowa', 'Wieczór kawalerski',
]

// Distribute `total` (a multiple of 5) across `n` players as random
// multiples of 5 that sum exactly to `total`.
function distributeChips(total, n) {
  const units = total / 5
  const shares = new Array(n).fill(1) // everyone gets at least 5
  let remaining = units - n
  while (remaining > 0) {
    shares[randInt(0, n - 1)]++
    remaining--
  }
  return shares.map(s => s * 5)
}

// Greedy settle-up: debtors pay creditors. Balances sum to 0, so it clears.
function settleTransfers(players) {
  const debtors = players
    .filter(p => p.out - p.in < 0)
    .map(p => ({ name: p.name, amount: p.in - p.out }))
  const creditors = players
    .filter(p => p.out - p.in > 0)
    .map(p => ({ name: p.name, amount: p.out - p.in }))

  const transfers = []
  let di = 0
  let ci = 0
  while (di < debtors.length && ci < creditors.length) {
    const d = debtors[di]
    const c = creditors[ci]
    const value = Math.min(d.amount, c.amount)
    if (value > 0) transfers.push({ from: d.name, to: c.name, value })
    d.amount -= value
    c.amount -= value
    if (d.amount === 0) di++
    if (c.amount === 0) ci++
  }
  return transfers
}

// --- game builder ----------------------------------------------------------

function buildGame() {
  const buyIn = pick([50, 100])
  const playerCount = randInt(4, 10)
  const names = shuffle(NAMES).slice(0, playerCount)
  const finished = chance(0.55)

  // A monotonically increasing clock for history timestamps.
  const start = new Date(Date.now() - randInt(1, 40) * 24 * 3600 * 1000)
  let clock = start.getTime()
  const tick = () => {
    clock += randInt(1, 9) * 60 * 1000
    return new Date(clock)
  }

  // Founders are created with the game (no history event); a few players may
  // join mid-session (player_added event).
  const lateCount = chance(0.4) ? randInt(1, 2) : 0
  const founders = names.slice(0, playerCount - lateCount)
  const late = names.slice(playerCount - lateCount)

  const players = names.map(name => ({ name, in: buyIn, out: null }))
  const byName = Object.fromEntries(players.map(p => [p.name, p]))
  const history = []

  for (const name of late) {
    history.push({
      type: 'player_added',
      timestamp: tick(),
      playerName: name,
      in: buyIn,
    })
  }

  // Rebuys: some players buy in again (player_in_changed).
  for (const p of players) {
    const rebuys = chance(0.35) ? randInt(1, 2) : 0
    for (let i = 0; i < rebuys; i++) {
      const oldValue = p.in
      p.in += buyIn
      history.push({
        type: 'player_in_changed',
        timestamp: tick(),
        playerName: p.name,
        oldValue,
        newValue: p.in,
      })
    }
  }

  if (finished) {
    // Cash out everyone; outs sum to the total pot (zero-sum).
    const total = players.reduce((s, p) => s + p.in, 0)
    const outs = distributeChips(total, players.length)
    players.forEach((p, i) => (p.out = outs[i]))

    for (const p of players) {
      history.push({
        type: 'player_out_changed',
        timestamp: tick(),
        playerName: p.name,
        newValue: p.out,
        balance: p.out - p.in,
      })
    }

    const transfers = settleTransfers(players)
    for (const t of transfers) {
      history.push({ type: 'transfer_added', timestamp: tick(), transfer: t })
    }
    return finalize(players, transfers, history, buyIn, start)
  }

  // In-progress: maybe one player cashed out early, plus a loan or two.
  const transfers = []
  if (chance(0.5)) {
    const [a, b] = shuffle(names)
    const value = buyIn * randInt(1, 2)
    transfers.push({ from: a, to: b, value })
    history.push({
      type: 'transfer_added',
      timestamp: tick(),
      transfer: { from: a, to: b, value },
    })
  }
  if (chance(0.3)) {
    const p = byName[pick(founders)]
    p.out = p.in - buyIn // dropped out roughly even / down a buy-in
    if (p.out < 0) p.out = 0
    history.push({
      type: 'player_out_changed',
      timestamp: tick(),
      playerName: p.name,
      newValue: p.out,
      balance: p.out - p.in,
    })
  }
  return finalize(players, transfers, history, buyIn, start)
}

function finalize(players, transfers, history, buyIn, start) {
  return {
    _id: uniqueGameId(),
    creatorId: CREATOR_ID,
    pinCode: String(randInt(1000, 9999)),
    title: `${pick(TITLES)} ${randInt(1, 99)}`,
    buyIn,
    date: start,
    players,
    transfers,
    history,
  }
}

// --- run -------------------------------------------------------------------

const docs = []
for (let i = 0; i < NUM_GAMES; i++) docs.push(buildGame())
const finishedCount = docs.filter(g =>
  g.players.every(p => p.out !== null)
).length

db.games.insertMany(docs)

print(
  `Inserted ${docs.length} games (creatorId="${CREATOR_ID}"): ` +
    `${finishedCount} finished, ${docs.length - finishedCount} in-progress.`
)
print('Game ids: ' + docs.map(g => g._id).join(', '))
