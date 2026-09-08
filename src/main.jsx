import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { Rnd } from 'react-rnd'
import './styles.css'
import { applyCalculatedTeamPoints } from '../shared/scoring.js'

const DAYS = [
  ['2026-09-18', '9.18', 'FRI'], ['2026-09-19', '9.19', 'SAT'],
  ['2026-09-20', '9.20', 'SUN'], ['2026-09-21', '9.21', 'MON']
]
const STAGES = [
  ['main', 'メインステージ', 'MAIN'], ['side', 'サイドステージ', 'SIDE'], ['sub', 'サブステージ', 'SUB']
]
const STATUS = {
  scheduled: ['開始前', 'status-before'], live: ['進行中', 'status-live'], delayed: ['遅延', 'status-delay'], done: ['終了', 'status-done']
}
const PX_PER_MIN = 2
const BOARD_MINUTES = 210

function timeText(minutes) {
  const total = 21 * 60 + Number(minutes)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}
function durationText(n) { return n < 60 ? `${n}分` : `${Math.floor(n / 60)}時間${n % 60 ? `${n % 60}分` : ''}` }
function publicStartText(event, index) {
  if (event.date === DAYS[0][0] && index === 0 && event.stage !== 'main') return '応援合戦終了後'
  return index === 0 ? '21:00' : '前競技終了後'
}
function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span> }

function Header({ admin, onAdmin, settings }) {
  return <>
    <header className="topbar">
      <a className="brand" href="#top" aria-label="運動会トップ">
        <span className="brand-mark"><i /><i /><i /></span>
        <span>OASIS <b>UNDOKAI</b></span>
      </a>
      <nav aria-label="ページ内メニュー">
        <a href="#schedule">タイムテーブル</a><a href="#guide">ご案内</a>
        <button className={admin ? 'admin-button active' : 'admin-button'} onClick={onAdmin}>
          <Icon>⚙</Icon>{admin ? '運営モード中' : '運営ページ'}
        </button>
      </nav>
    </header>
    <section className="hero" id="top">
      <div className="hero-copy">
        <span className="eyebrow"><i /> OASIS GAME FESTIVAL</span>
        <h1>{settings.title}</h1>
        {settings.subtitle && <p>{settings.subtitle}</p>}
        <div className="hero-meta"><span><Icon>◷</Icon> 9.18 FRI — 9.21 MON</span><span><Icon>▶</Icon> 毎晩 21:00 START</span></div>
      </div>
      <div className="hero-art oasis-emblem" aria-hidden="true" />
    </section>
  </>
}

function Login({ onClose, onSuccess }) {
  const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const r = await fetch('/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await r.json(); if (!r.ok) throw new Error(data.error)
      onSuccess(data.token)
    } catch (e) { setError(e.message || 'ログインできませんでした') } finally { setBusy(false) }
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <div className="login-card" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <button className="close" onClick={onClose} aria-label="閉じる">×</button><span className="lock">⚑</span>
      <p className="eyebrow">STAFF ONLY</p><h2 id="login-title">運営ページ</h2><p>タイムテーブルの編集には<br />運営パスワードが必要です。</p>
      <form onSubmit={submit}><label>運営パスワード<input autoFocus type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="パスワードを入力" /></label>{error && <p className="error">{error}</p>}<button className="primary" disabled={busy}>{busy ? '確認中…' : '運営モードに入る'} <span>→</span></button></form>
    </div>
  </div>
}

function DayTabs({ day, setDay, events }) {
  return <div className="day-tabs">{DAYS.map(([key, date, weekday], i) => {
    const total = events.filter(e => e.date === key).length
    return <button key={key} className={day === key ? 'selected' : ''} onClick={() => setDay(key)}><small>DAY {i + 1}</small><b>{date}</b><span>{weekday}</span><em>{total} PROGRAMS</em></button>
  })}</div>
}

function TeamStandings({ settings, admin, setState }) {
  const teams = settings.teams || []
  const ranked = [...teams].sort((a, b) => b.points - a.points)
  function updateTeam(id, changes) {
    setState(s => ({ ...s, settings: { ...s.settings, teams: s.settings.teams.map(team => team.id === id ? { ...team, ...changes } : team) } }))
  }
  return <section className={admin ? 'team-board editing' : 'team-board'} aria-label="3チーム得点状況"><div className="score-label"><span>TEAM SCORE</span><h3>3チーム得点状況</h3><p>{admin ? '種目別スコアから自動集計されます' : '現在の総合順位'}</p></div>{(admin ? teams : ranked).map((team, i) => <article key={team.id} style={{ '--team-a': team.colors?.[0] || team.color, '--team-b': team.colors?.[1] || team.color }}><span className="rank">{admin ? 'TEAM' : `0${i + 1}`}</span>{admin ? <input aria-label={`${team.name}の名前`} value={team.name} onChange={e => updateTeam(team.id, { name: e.target.value })} /> : <h4>{team.name}</h4>}<div className="team-points"><b>{team.points}</b><span>PTS</span></div></article>)}</section>
}

function RichText({ text }) {
  return <div className="rich-text">{String(text || '').split('\n').map((line, index) => {
    const value = line.trim()
    if (!value) return <br key={index} />
    if (value.startsWith('### ')) return <h4 key={index}>{value.slice(4)}</h4>
    if (value.startsWith('## ')) return <h3 key={index}>{value.slice(3)}</h3>
    if (value.startsWith('# ')) return <h2 key={index}>{value.slice(2)}</h2>
    if (/^[-・]/.test(value)) return <p className="rule-item" key={index}>{value.replace(/^[-・]\s*/, '')}</p>
    if (/^\d+\./.test(value)) return <p className="rule-item numbered" key={index}>{value}</p>
    return <p key={index}>{value.replace(/\*\*/g, '')}</p>
  })}</div>
}

function EventDetailModal({ event, teams, onClose }) {
  useEffect(() => {
    const close = e => e.key === 'Escape' && onClose()
    const previousOverflow = document.body.style.overflow
    window.addEventListener('keydown', close)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', close)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])
  const details = event.details || {}
  return createPortal(<div className="event-detail-backdrop">
    <article className="event-detail" role="dialog" aria-modal="true" aria-labelledby="event-detail-title">
      <header><div><span className="eyebrow">PROGRAM GUIDE</span><h2 id="event-detail-title">{event.title}</h2></div><button className="close" onClick={onClose} aria-label="閉じる">×</button></header>
      <div className="detail-facts"><div><span>日時</span><b>{details.timing || `${event.date.replace('2026-', '').replace('-', '/')} ${timeText(event.start)}〜`}</b></div><div><span>場所</span><b>{details.venue || STAGES.find(([id]) => id === event.stage)?.[1]}</b></div>{details.format && <div><span>形式</span><b>{details.format}</b></div>}</div>
      {details.points && <div className="points-banner"><span>獲得ポイント</span><b>{details.points}</b></div>}
      {(details.mvp || details.results) && <section className="result-section"><div className="detail-section-title"><span>RESULT</span><h3>競技結果</h3></div>{details.mvp && <div className="mvp-card"><span>MVP</span><b>{details.mvp}</b></div>}<div className="result-grid">{teams.map(team => {
        const result = details.results?.[team.id] || {}
        return <article key={team.id} style={{ '--team-a': team.colors?.[0] || team.color, '--team-b': team.colors?.[1] || team.color }}><h4>{team.name}</h4><b>{result.score === '' || result.score == null ? '—' : result.score}<small> PTS</small></b>{(result.wins !== '' || result.losses !== '') && <p>{result.wins || 0}勝 / {result.losses || 0}敗</p>}{result.note && <em>{result.note}</em>}</article>
      })}</div></section>}
      {details.rules && <section className="rule-section"><div className="detail-section-title"><span>RULES & NOTES</span><h3>ルール・注意事項</h3></div><RichText text={details.rules} /></section>}
    </article>
  </div>, document.body)
}

function PublicSchedule({ events, day, teams }) {
  const [detailEvent, setDetailEvent] = useState(null)
  const dayEvents = events.filter(e => e.date === day).sort((a, b) => a.start - b.start)
  return <><div className="public-grid">{STAGES.map(([id, label, en]) => {
    const list = dayEvents.filter(e => e.stage === id)
    return <section className={`stage stage-${id}`} key={id}><header><span>{en}</span><h3>{label}</h3><em>{list.length} PROGRAMS</em></header>
      <div className="event-list">{list.length ? list.map((event, i) => <article className={`event-card ${STATUS[event.status][1]}`} key={event.id}>
        <div className="event-time"><b className={i > 0 || (event.date === DAYS[0][0] && event.stage !== 'main') ? 'relative-time' : ''}>{publicStartText(event, i)}</b></div><div className="event-info"><span className="order">PROGRAM {String(i + 1).padStart(2, '0')}</span><h4>{event.title}</h4>{event.note && <p>{event.note}</p>}{event.details && <button className="detail-link" onClick={() => setDetailEvent(event)}>ルール・結果を見る <span>→</span></button>}</div><span className="status-dot">{STATUS[event.status][0]}</span>
      </article>) : <div className="empty">競技を準備中です</div>}</div>
    </section>
  })}</div>{detailEvent && <EventDetailModal event={detailEvent} teams={teams} onClose={() => setDetailEvent(null)} />}</>
}

function AdminBoard({ state, setState, day, token, onLogout }) {
  const [selected, setSelected] = useState(null); const [saving, setSaving] = useState('');
  const dayEvents = state.events.filter(e => e.date === day)
  const selectedEvent = state.events.find(e => e.id === selected)
  function update(id, changes) { setState(s => ({ ...s, events: s.events.map(e => e.id === id ? { ...e, ...changes } : e) })) }
  function add(stage) { const id = crypto.randomUUID(); setState(s => ({ ...s, events: [...s.events, { id, date: day, stage, title: '新しい競技', start: 0, duration: 30, status: 'scheduled', note: '', details: { timing: '', venue: '', format: '', points: '', mvp: '', rules: '', results: {} } }] })); setSelected(id) }
  function remove() { setState(s => ({ ...s, events: s.events.filter(e => e.id !== selected) })); setSelected(null) }
  function moveEvent(id, y) { update(id, { start: Math.max(0, Math.round(y / PX_PER_MIN / 5) * 5) }) }
  function resizeEvent(id, height, y) { update(id, { start: Math.max(0, Math.round(y / PX_PER_MIN / 5) * 5), duration: Math.max(15, Math.round(height / PX_PER_MIN / 5) * 5) }) }
  function updateDetails(changes) {
    update(selected, { details: { timing: '', venue: '', format: '', points: '', mvp: '', rules: '', results: {}, ...(selectedEvent.details || {}), ...changes } })
  }
  function updateResult(teamId, changes) {
    const details = selectedEvent.details || {}
    updateDetails({ results: { ...(details.results || {}), [teamId]: { score: '', wins: '', losses: '', note: '', ...(details.results?.[teamId] || {}), ...changes } } })
  }
  async function save() {
    setSaving('保存中…'); const r = await fetch('/api/state', { method: 'PUT', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify(state) })
    if (r.ok) { setState(await r.json()); setSaving('保存しました') } else setSaving('保存に失敗しました')
    setTimeout(() => setSaving(''), 2200)
  }
  return <div className="admin-wrap"><div className="admin-toolbar"><div><span className="live-pill">● 運営モード</span><h2>タイムテーブル編集</h2><p>カードを上下にドラッグして開始時刻を変更。下端を伸ばして所要時間を調整できます。</p></div><div className="toolbar-actions"><span>{saving}</span><button className="ghost" onClick={onLogout}>終了</button><button className="primary compact" onClick={save}>変更を保存</button></div></div>
    <div className="editor-layout"><div className="timeline-editor"><div className="timeline-head"><div className="time-head">TIME</div>{STAGES.map(([id, label, en]) => <div key={id}><span>{en}</span><b>{label}</b><button onClick={() => add(id)} aria-label={`${label}に追加`}>＋</button></div>)}</div>
      <div className="timeline-body"><div className="time-axis">{Array.from({ length: 8 }, (_, i) => <span style={{ top: i * 30 * PX_PER_MIN }} key={i}>{timeText(i * 30)}</span>)}</div>{STAGES.map(([stage]) => <div className="timeline-lane" key={stage}>{Array.from({ length: 8 }, (_, i) => <i style={{ top: i * 30 * PX_PER_MIN }} key={i} />)}{dayEvents.filter(e => e.stage === stage).map(event => <Rnd key={event.id} className={`editable-event ${selected === event.id ? 'chosen' : ''} ${STATUS[event.status][1]}`} bounds="parent" enableResizing={{ bottom: true }} size={{ width: 'calc(100% - 16px)', height: event.duration * PX_PER_MIN }} position={{ x: 8, y: event.start * PX_PER_MIN }} minHeight={30} dragGrid={[1, 10]} resizeGrid={[1, 10]} onDragStart={() => setSelected(event.id)} onDragStop={(_, d) => moveEvent(event.id, d.y)} onResizeStart={() => setSelected(event.id)} onResizeStop={(_, __, ref, ___, position) => resizeEvent(event.id, ref.offsetHeight, position.y)} onClick={() => setSelected(event.id)}><small>{timeText(event.start)} · {durationText(event.duration)}</small><b>{event.title}</b><span>{STATUS[event.status][0]}</span></Rnd>)}</div>)}</div>
    </div>{selectedEvent ? <aside className="inspector"><div className="inspector-top"><span>PROGRAM EDIT</span><button onClick={() => setSelected(null)}>×</button></div><h3>競技を編集</h3><label>競技名<input value={selectedEvent.title} onChange={e => update(selected, { title: e.target.value })} /></label><div className="field-row"><label>開始時刻<input type="time" value={timeText(selectedEvent.start)} onChange={e => { const [h, m] = e.target.value.split(':').map(Number); update(selected, { start: Math.max(0, h * 60 + m - 1260) }) }} /></label><label>所要時間<input type="number" min="15" step="5" value={selectedEvent.duration} onChange={e => update(selected, { duration: Math.max(15, Number(e.target.value)) })} /></label></div><label>進行状態<select value={selectedEvent.status} onChange={e => update(selected, { status: e.target.value })}>{Object.entries(STATUS).map(([key, [label]]) => <option value={key} key={key}>{label}</option>)}</select></label><label>参加者へのメモ<textarea rows="3" value={selectedEvent.note} onChange={e => update(selected, { note: e.target.value })} placeholder="集合場所や注意事項など" /></label>
      <div className="inspector-divider"><span>公開する競技詳細</span></div><label>日時・開始条件<input value={selectedEvent.details?.timing || ''} onChange={e => updateDetails({ timing: e.target.value })} placeholder="例：9/18 応援合戦後" /></label><label>場所<input value={selectedEvent.details?.venue || ''} onChange={e => updateDetails({ venue: e.target.value })} placeholder="例：メインステージ" /></label><label>対戦形式<input value={selectedEvent.details?.format || ''} onChange={e => updateDetails({ format: e.target.value })} placeholder="例：5vs5／総当たり" /></label><label>獲得ポイント<textarea rows="2" value={selectedEvent.details?.points || ''} onChange={e => updateDetails({ points: e.target.value })} placeholder="例：1位 50pt／2位 30pt" /></label><label>MVP<input value={selectedEvent.details?.mvp || ''} onChange={e => updateDetails({ mvp: e.target.value })} placeholder="選手名・選定理由など" /></label>
      <div className="result-editor"><h4>チーム別スコア・勝敗</h4>{state.settings.teams.map(team => { const result = selectedEvent.details?.results?.[team.id] || {}; return <section key={team.id}><b>{team.name}</b><div className="result-fields"><label>スコア<input type="number" value={result.score ?? ''} onChange={e => updateResult(team.id, { score: e.target.value === '' ? '' : Number(e.target.value) })} /></label><label>勝<input type="number" min="0" value={result.wins ?? ''} onChange={e => updateResult(team.id, { wins: e.target.value === '' ? '' : Number(e.target.value) })} /></label><label>敗<input type="number" min="0" value={result.losses ?? ''} onChange={e => updateResult(team.id, { losses: e.target.value === '' ? '' : Number(e.target.value) })} /></label></div><label>結果メモ<input value={result.note || ''} onChange={e => updateResult(team.id, { note: e.target.value })} placeholder="順位・MAP結果など" /></label></section> })}</div>
      <label>ルール・注意事項<textarea className="rules-input" rows="16" value={selectedEvent.details?.rules || ''} onChange={e => updateDetails({ rules: e.target.value })} placeholder="見出しは ##、箇条書きは - で入力できます" /></label><button className="delete" onClick={remove}>この競技を削除</button></aside> : <aside className="inspector empty-inspector"><span>↖</span><h3>競技を選択</h3><p>編集したいカードを<br />クリックしてください。</p></aside>}</div>
  </div>
}

function Guide({ settings }) { return <section className="guide" id="guide"><div><span className="eyebrow">EVENT GUIDE</span><h2>参加されるみなさまへ</h2></div><div className="guide-cards"><article><Icon>◷</Icon><h3>競技の進行</h3><b>各日 21:00 START</b><p>各ステージの2競技目以降は開始時刻を設けず、前の競技が終了次第、順番に進行します。</p></article><article><Icon>⌖</Icon><h3>開催場所</h3><b>{settings.venue}</b><p>最大3競技が同時進行します。参加する競技のステージと進行状況を必ずご確認ください。</p></article><article><Icon>✓</Icon><h3>参加前の準備</h3><b>すぐ参加できる状態で</b><p>順番が近づいたら待機し、ゲームのアップデート・ログインは事前に済ませてください。</p></article><article><Icon>!</Icon><h3>掛け持ちについて</h3><b>別ステージは避ける</b><p>別ステージ同士は進行時間が重なる場合があります。同日の別ステージ競技への掛け持ちは避けて申請してください。</p></article></div></section> }

function App() {
  const [state, setState] = useState(null); const [day, setDay] = useState(DAYS[0][0]); const [login, setLogin] = useState(false); const [token, setToken] = useState(() => sessionStorage.getItem('adminToken'))
  useEffect(() => { fetch('/api/state').then(r => r.json()).then(setState).catch(() => setState({ settings: { title: '第4回 Oasis大運動会', subtitle: '読み込みに失敗しました', venue: '', teams: [] }, events: [] })) }, [])
  const complete = useMemo(() => state ? state.events.filter(e => e.status === 'done').length : 0, [state])
  const scoredState = useMemo(() => state ? applyCalculatedTeamPoints(state) : null, [state])
  if (!state) return <div className="loading"><span>UNDOKAI</span><b>準備中...</b></div>
  function loggedIn(next) { sessionStorage.setItem('adminToken', next); setToken(next); setLogin(false) }
  function logout() { sessionStorage.removeItem('adminToken'); setToken(null) }
  return <><Header admin={!!token} settings={state.settings} onAdmin={() => token ? document.querySelector('#schedule')?.scrollIntoView({ behavior: 'smooth' }) : setLogin(true)} /><main><section className="schedule" id="schedule"><div className="section-title"><div><span className="eyebrow">TIME TABLE</span><h2>{token ? '運営スケジュール' : 'タイムテーブル'}</h2></div><div className="progress"><span>全体の進捗</span><b>{complete}<small> / {state.events.length} 競技終了</small></b><i><em style={{ width: `${state.events.length ? complete / state.events.length * 100 : 0}%` }} /></i></div></div><DayTabs day={day} setDay={setDay} events={state.events} /><TeamStandings settings={scoredState.settings} admin={!!token} setState={setState} />{token ? <AdminBoard state={state} setState={setState} day={day} token={token} onLogout={logout} /> : <PublicSchedule events={state.events} day={day} teams={scoredState.settings.teams || []} />}</section><Guide settings={state.settings} /></main><footer><div className="brand"><span className="brand-mark"><i /><i /><i /></span><span>OASIS <b>UNDOKAI</b></span></div><p>3チームでつくる、最高の4日間。</p><small>© 2026 OASIS UNDOKAI PROJECT</small></footer>{login && <Login onClose={() => setLogin(false)} onSuccess={loggedIn} />}</>
}

createRoot(document.getElementById('root')).render(<App />)
