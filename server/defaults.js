import { eventDetails } from './event-details.js'

export const defaults = {
  settings: {
    schemaVersion: 8,
    title: '第4回 Oasis大運動会',
    subtitle: '',
    venue: 'Oasisライブステージ',
    notice: '各日 21:00 スタート',
    teams: [
      { id: 'red', name: 'フィジで破壊', points: 0, colors: ['#FFA6DA', '#A6F8FF'] },
      { id: 'blue', name: 'ワンちゃんあるよ', points: 0, colors: ['#04576C', '#F4F4F3'] },
      { id: 'yellow', name: 'おねんネッシー同好会', points: 0, colors: ['#7CCE3C', '#0ABFFF'] }
    ],
    updatedAt: new Date().toISOString()
  },
  events: [
    { id: 'd1m1', date: '2026-09-18', stage: 'main', title: '開会式', start: 0, duration: 20, status: 'scheduled', note: '全員メインステージへ集合' },
    { id: 'd1m2', date: '2026-09-18', stage: 'main', title: '応援合戦', start: 20, duration: 40, status: 'scheduled', note: '3チームの応援パフォーマンス', details: eventDetails.d1m2 },
    { id: 'd1m3', date: '2026-09-18', stage: 'main', title: 'Overwatch 2', start: 65, duration: 70, status: 'scheduled', note: '', details: eventDetails.d1m3 },
    { id: 'd1s1', date: '2026-09-18', stage: 'side', title: 'プロジェクトセカイ', start: 65, duration: 35, status: 'scheduled', note: '応援合戦終了後 START', details: eventDetails.d1s1 },
    { id: 'd1s2', date: '2026-09-18', stage: 'side', title: '大乱闘スマッシュブラザーズ', start: 105, duration: 50, status: 'scheduled', note: '', details: eventDetails.d1s2 },
    { id: 'd1s3', date: '2026-09-18', stage: 'side', title: 'オセロ', start: 160, duration: 30, status: 'scheduled', note: '', details: eventDetails.d1s3 },
    { id: 'd1u1', date: '2026-09-18', stage: 'sub', title: 'どうぶつしょうぎ', start: 65, duration: 30, status: 'scheduled', note: '応援合戦終了後 START', details: eventDetails.d1u1 },
    { id: 'd1u2', date: '2026-09-18', stage: 'sub', title: 'あぶりカルビゲーム', start: 100, duration: 30, status: 'scheduled', note: '', details: eventDetails.d1u2 },
    { id: 'd1u3', date: '2026-09-18', stage: 'sub', title: 'モッツァレラゲーム ～Oasis Ver～', start: 135, duration: 35, status: 'scheduled', note: '', details: eventDetails.d1u3 },
    { id: 'd2m1', date: '2026-09-19', stage: 'main', title: 'VALORANT', start: 0, duration: 90, status: 'scheduled', note: '', details: eventDetails.d2m1 },
    { id: 'd2s1', date: '2026-09-19', stage: 'side', title: 'スプラトゥーン3', start: 0, duration: 55, status: 'scheduled', note: '', details: eventDetails.d2s1 },
    { id: 'd2s2', date: '2026-09-19', stage: 'side', title: 'ポケユナバレー', start: 60, duration: 50, status: 'scheduled', note: '', details: eventDetails.d2s2 },
    { id: 'd2u1', date: '2026-09-19', stage: 'sub', title: 'モバイルレジェンド', start: 0, duration: 60, status: 'scheduled', note: '', details: eventDetails.d2u1 },
    { id: 'd2u2', date: '2026-09-19', stage: 'sub', title: 'めっちゃカメレオン', start: 65, duration: 40, status: 'scheduled', note: '', details: eventDetails.d2u2 },
    { id: 'd3m1', date: '2026-09-20', stage: 'main', title: 'Apex Legends', start: 0, duration: 75, status: 'scheduled', note: '', details: eventDetails.d3m1 },
    { id: 'd3m2', date: '2026-09-20', stage: 'main', title: 'ストリートファイター6', start: 80, duration: 60, status: 'scheduled', note: '', details: eventDetails.d3m2 },
    { id: 'd3s1', date: '2026-09-20', stage: 'side', title: '第五人格', start: 0, duration: 65, status: 'scheduled', note: '', details: eventDetails.d3s1 },
    { id: 'd3s2', date: '2026-09-20', stage: 'side', title: 'ブロスタ', start: 70, duration: 45, status: 'scheduled', note: '', details: eventDetails.d3s2 },
    { id: 'd3u1', date: '2026-09-20', stage: 'sub', title: '荒野行動', start: 0, duration: 65, status: 'scheduled', note: '', details: eventDetails.d3u1 },
    { id: 'd3u2', date: '2026-09-20', stage: 'sub', title: 'オアシスフィールド', start: 70, duration: 50, status: 'scheduled', note: '', details: eventDetails.d3u2 },
    { id: 'd4m1', date: '2026-09-21', stage: 'main', title: 'ポケモンユナイト', start: 0, duration: 70, status: 'scheduled', note: '', details: eventDetails.d4m1 },
    { id: 'd4m2', date: '2026-09-21', stage: 'main', title: 'Oasisクイズ', start: 75, duration: 45, status: 'scheduled', note: '', details: eventDetails.d4m2 },
    { id: 'd4m3', date: '2026-09-21', stage: 'main', title: '閉会式', start: 125, duration: 30, status: 'scheduled', note: '最終結果発表・表彰' },
    { id: 'd4s1', date: '2026-09-21', stage: 'side', title: '3人麻雀', start: 0, duration: 90, status: 'scheduled', note: '', details: eventDetails.d4s1 }
  ]
}
