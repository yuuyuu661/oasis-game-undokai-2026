import fs from 'node:fs/promises'
import path from 'node:path'
import pg from 'pg'
import { defaults } from './defaults.js'

const file = path.resolve('data/local.json')
let pool

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
    if (result.rows[0]) return result.rows[0].payload
    await db.query('INSERT INTO app_state (id, payload) VALUES (1, $1)', [defaults])
    return structuredClone(defaults)
  }
  try { return JSON.parse(await fs.readFile(file, 'utf8')) }
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
