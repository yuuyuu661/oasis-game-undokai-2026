import crypto from 'node:crypto'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readState, writeState } from './store.js'

const app = express()
const port = Number(process.env.PORT || 3000)
const secret = process.env.SESSION_SECRET || 'local-development-session-secret'
const adminPassword = process.env.ADMIN_PASSWORD || ''
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
app.use(express.json({ limit: '1mb' }))

function sign(value) { return `${value}.${crypto.createHmac('sha256', secret).update(value).digest('hex')}` }
function authorized(req) {
  const token = req.headers.authorization?.replace(/^Bearer /, '')
  if (!token) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature || Number(expires) < Date.now()) return false
  const expected = sign(expires).split('.')[1]
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.get('/api/state', async (_req, res, next) => { try { res.json(await readState()) } catch (e) { next(e) } })
app.post('/api/login', (req, res) => {
  if (!adminPassword) return res.status(503).json({ error: '運営パスワードが未設定です' })
  const input = String(req.body?.password || '')
  const a = Buffer.from(input); const b = Buffer.from(adminPassword)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'パスワードが違います' })
  res.json({ token: sign(String(Date.now() + 1000 * 60 * 60 * 12)) })
})
app.put('/api/state', async (req, res, next) => {
  if (!authorized(req)) return res.status(401).json({ error: '再ログインしてください' })
  const { settings, events } = req.body || {}
  if (!settings || !Array.isArray(events) || events.length > 500) return res.status(400).json({ error: '保存内容が正しくありません' })
  try { res.json(await writeState({ settings, events })) } catch (e) { next(e) }
})

app.use(express.static(path.join(root, 'dist')))
app.get('/{*splat}', (_req, res) => res.sendFile(path.join(root, 'dist/index.html')))
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'サーバーでエラーが発生しました' }) })
app.listen(port, () => console.log(`Undokai server listening on ${port}`))
