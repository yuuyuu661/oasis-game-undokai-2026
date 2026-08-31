import fs from 'node:fs/promises'
import path from 'node:path'
import pg from 'pg'
import { defaults } from './defaults.js'

const file = path.resolve('data/local.json')
let pool

function normalizeState(state) {
  if (!state || state.settings?.schemaVersion >= 5) return state
  const savedTeams = new Map((state.settings?.teams || []).map(team => [team.id, team]))
  const teams = defaults.settings.teams.map(team => ({ ...team, points: Number(savedTeams.get(team.id)?.points || 0) }))
  const defaultEvents = new Map(defaults.events.map(event => [event.id, event]))
  const events = (state.events || defaults.events).map(event => {
    const next = defaultEvents.get(event.id)
    return next ? { ...next, ...event, title: next.title, details: event.details || next.details } : event
  })
  return { ...state, settings: { ...state.settings, ...defaults.settings, teams }, events }
}

async function getPool() {
  if (!process.env.DATABASE_URL) return null
  if (!pool) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false })
    await pool.query('CREATE TABLE IF NOT EXISTS app_state (id integer PRIMARY KEY, payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())')
  }
  return pool
}

export async function readState() {
  const db = await getPool()
  if (db) {
    const result = await db.query('SELECT payload FROM app_state WHERE id = 1')
    if (result.rows[0]) return normalizeState(result.rows[0].payload)
    await db.query('INSERT INTO app_state (id, payload) VALUES (1, $1)', [defaults])
    return structuredClone(defaults)
  }
  try { return normalizeState(JSON.parse(await fs.readFile(file, 'utf8'))) }
  catch {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify(defaults, null, 2))
    return structuredClone(defaults)
  }
}

export async function writeState(state) {
  const db = await getPool()
  const payload = { ...state, settings: { ...state.settings, updatedAt: new Date().toISOString() } }
  if (db) await db.query('INSERT INTO app_state (id, payload, updated_at) VALUES (1, $1, now()) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()', [payload])
  else {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify(payload, null, 2))
  }
  return payload
}
