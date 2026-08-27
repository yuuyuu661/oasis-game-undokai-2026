export const defaults = {
  settings: {
    title: 'みんなの運動会 2026',
    subtitle: '3チームで挑む、4日間のゲームフェス。',
    venue: 'Oasis オンライン会場',
    notice: '各日 21:00 スタート',
    teams: [
      { id: 'red', name: 'レッドチーム', points: 0, color: '#ed4e35' },
      { id: 'blue', name: 'ブルーチーム', points: 0, color: '#2868d7' },
      { id: 'yellow', name: 'イエローチーム', points: 0, color: '#e6a900' }
    ],
    updatedAt: new Date().toISOString()
  },
  events: [
    { id: 'd1m1', date: '2026-09-18', stage: 'main', title: '開会式', start: 0, duration: 20, status: 'scheduled', note: '全員メインステージへ集合' },
    { id: 'd1m2', date: '2026-09-18', stage: 'main', title: '応援合戦', start: 20, duration: 40, status: 'scheduled', note: '3チームの応援パフォーマンス' },
    { id: 'd1m3', date: '2026-09-18', stage: 'main', title: 'Overwatch 2', start: 65, duration: 70, status: 'scheduled', note: '' },
    { id: 'd1s1', date: '2026-09-18', stage: 'side', title: 'プロジェクトセカイ', start: 65, duration: 35, status: 'scheduled', note: '応援合戦終了後 START' },
    { id: 'd1s2', date: '2026-09-18', stage: 'side', title: '大乱闘スマッシュブラザーズ', start: 105, duration: 50, status: 'scheduled', note: '' },
    { id: 'd1s3', date: '2026-09-18', stage: 'side', title: 'オセロ', start: 160, duration: 30, status: 'scheduled', note: '' },
    { id: 'd1u1', date: '2026-09-18', stage: 'sub', title: 'どうぶつしょうぎ', start: 65, duration: 30, status: 'scheduled', note: '応援合戦終了後 START' },
    { id: 'd1u2', date: '2026-09-18', stage: 'sub', title: 'あぶりカルビゲーム', start: 100, duration: 30, status: 'scheduled', note: '' },
    { id: 'd1u3', date: '2026-09-18', stage: 'sub', title: 'モッツァレラゲーム ～Oasis Ver～', start: 135, duration: 35, status: 'scheduled', note: '' },
    { id: 'd2m1', date: '2026-09-19', stage: 'main', title: 'VALORANT', start: 0, duration: 90, status: 'scheduled', note: '' },
    { id: 'd2s1', date: '2026-09-19', stage: 'side', title: 'スプラトゥーン3', start: 0, duration: 55, status: 'scheduled', note: '' },
    { id: 'd2s2', date: '2026-09-19', stage: 'side', title: 'ポケユナバレー', start: 60, duration: 50, status: 'scheduled', note: '' },
    { id: 'd2u1', date: '2026-09-19', stage: 'sub', title: 'モバイルレジェンド', start: 0, duration: 60, status: 'scheduled', note: '' },
    { id: 'd2u2', date: '2026-09-19', stage: 'sub', title: 'めっちゃカメレオン', start: 65, duration: 40, status: 'scheduled', note: '' },
    { id: 'd3m1', date: '2026-09-20', stage: 'main', title: 'Apex Legends', start: 0, duration: 75, status: 'scheduled', note: '' },
    { id: 'd3m2', date: '2026-09-20', stage: 'main', title: 'ストリートファイター6', start: 80, duration: 60, status: 'scheduled', note: '' },
    { id: 'd3s1', date: '2026-09-20', stage: 'side', title: '第五人格', start: 0, duration: 65, status: 'scheduled', note: '' },
    { id: 'd3s2', date: '2026-09-20', stage: 'side', title: 'ブロスタ', start: 70, duration: 45, status: 'scheduled', note: '' },
    { id: 'd3u1', date: '2026-09-20', stage: 'sub', title: '荒野行動', start: 0, duration: 65, status: 'scheduled', note: '' },
    { id: 'd3u2', date: '2026-09-20', stage: 'sub', title: 'オアシスフィールド', start: 70, duration: 50, status: 'scheduled', note: '' },
    { id: 'd4m1', date: '2026-09-21', stage: 'main', title: 'ポケモンユナイト', start: 0, duration: 70, status: 'scheduled', note: '' },
    { id: 'd4m2', date: '2026-09-21', stage: 'main', title: 'Oasisクイズ', start: 75, duration: 45, status: 'scheduled', note: '' },
    { id: 'd4m3', date: '2026-09-21', stage: 'main', title: '閉会式', start: 125, duration: 30, status: 'scheduled', note: '最終結果発表・表彰' },
    { id: 'd4s1', date: '2026-09-21', stage: 'side', title: '麻雀', start: 0, duration: 90, status: 'scheduled', note: '' }
  ]
}
