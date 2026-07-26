'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { cloudConfigured, loadCloudEpisodes, saveCloudEpisodes, type SunsetDeckEpisode } from '@/lib/sunset-deck-cloud';
import styles from './sunset-deck.module.css';

type Status = SunsetDeckEpisode['status'];
type Episode = SunsetDeckEpisode;
type SyncState = 'loading' | 'saving' | 'cloud' | 'local' | 'error';

const seedEpisodes: Episode[] = [
  { id: 1, title: '世界が庭で生き延びた時代', subtitle: 'The Garden That Saved Humanity', series: 'WORLD GARDEN STORIES', status: 'review', duration: '09:20', progress: 86, updated: '本日 06:40', hook: 'もし明日、スーパーから食べ物が消えたら。あなたは何日、生きられますか。', note: '冒頭の引き込み、食育への着地、YUGAWA邸への接続を最終確認。' },
  { id: 2, title: '子どもの「好き嫌い」はどこから来る？', subtitle: 'How Taste Is Learned', series: 'FOOD EDUCATION', status: 'script', duration: '08:10', progress: 42, updated: '昨日 22:15', hook: '嫌いな野菜は、本当に味が嫌いなのでしょうか。', note: '味覚形成をストーリー中心で構成。' },
  { id: 3, title: 'なぜ人は土に触れると落ち着くのか', subtitle: 'The Memory of Soil', series: 'SUNSET DECK LAB', status: 'idea', duration: '07:40', progress: 18, updated: '昨日 18:30', hook: '人は、土から離れすぎたのかもしれません。', note: '科学・歴史・庭づくりを接続。' },
  { id: 4, title: 'ロストラータは、なぜ庭を変えるのか', subtitle: 'The Architecture of a Plant', series: 'SUNSET DECK STORIES', status: 'production', duration: '06:50', progress: 63, updated: '7月24日', hook: 'たった一本の植物が、家の印象を変える。', note: 'YUGAWA邸の実写素材を中心に編集。' },
  { id: 5, title: '世界で最初の家庭菜園', subtitle: 'Before the Word Garden', series: 'WORLD GARDEN STORIES', status: 'approved', duration: '08:35', progress: 100, updated: '7月23日', hook: '世界最初の庭は、美しい庭ではありませんでした。', note: '公開予約待ち。' },
];

const statusLabel: Record<Status, string> = { idea: '企画', script: '台本', production: '制作中', review: '承認待ち', approved: '承認済み' };

function toEmbedUrl(url?: string) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (parsed.pathname.startsWith('/embed/')) return url;
    }
    return url;
  } catch {
    return '';
  }
}

function syncLabel(syncState: SyncState) {
  if (syncState === 'loading') return '○ 読み込み中';
  if (syncState === 'saving') return '○ 保存中';
  if (syncState === 'cloud') return '● クラウド同期済み';
  if (syncState === 'error') return '△ クラウド接続エラー';
  return '● 端末に保存済み';
}

export default function SunsetDeckOS() {
  const [episodes, setEpisodes] = useState<Episode[]>(seedEpisodes);
  const [activeId, setActiveId] = useState(1);
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [note, setNote] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>('loading');
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const stored = localStorage.getItem('sunset-deck-episodes');
      let localEpisodes = seedEpisodes;
      if (stored) {
        try { localEpisodes = JSON.parse(stored); } catch { localEpisodes = seedEpisodes; }
      }
      if (!cancelled) setEpisodes(localEpisodes);

      if (cloudConfigured) {
        try {
          const cloudEpisodes = await loadCloudEpisodes();
          if (!cancelled && cloudEpisodes?.length) {
            setEpisodes(cloudEpisodes);
            localStorage.setItem('sunset-deck-episodes', JSON.stringify(cloudEpisodes));
          }
          if (!cancelled) setSyncState('cloud');
        } catch {
          if (!cancelled) setSyncState('error');
        }
      } else if (!cancelled) {
        setSyncState('local');
      }

      if (!cancelled) setHydrated(true);
    }

    hydrate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setSyncState('saving');
    const timer = window.setTimeout(async () => {
      localStorage.setItem('sunset-deck-episodes', JSON.stringify(episodes));
      if (!cloudConfigured) {
        setSyncState('local');
        return;
      }
      try {
        await saveCloudEpisodes(episodes);
        setSyncState('cloud');
      } catch {
        setSyncState('error');
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [episodes, hydrated]);

  const active = episodes.find((e) => e.id === activeId) ?? episodes[0];
  const visible = filter === 'all' ? episodes : episodes.filter((e) => e.status === filter);
  const reviewCount = episodes.filter((e) => e.status === 'review').length;
  const approvedCount = episodes.filter((e) => e.status === 'approved').length;
  const avgProgress = episodes.length ? Math.round(episodes.reduce((sum, e) => sum + e.progress, 0) / episodes.length) : 0;
  const morningQueue = useMemo(() => episodes.filter((e) => ['review', 'production'].includes(e.status)).slice(0, 3), [episodes]);
  const embedUrl = toEmbedUrl(active?.previewUrl);

  useEffect(() => {
    if (!active) return;
    setNote(active.note);
    setPreviewUrl(active.previewUrl ?? '');
  }, [active?.id, active?.note, active?.previewUrl]);

  function updateActive(patch: Partial<Episode>) {
    if (!active) return;
    setEpisodes((current) => current.map((e) => e.id === active.id ? { ...e, ...patch, updated: 'たった今' } : e));
  }

  function changeStatus(status: Status) {
    if (!active) return;
    updateActive({ status, progress: status === 'approved' ? 100 : active.progress });
  }

  function saveReview() {
    if (!active) return;
    updateActive({ note: note.trim() || active.note, previewUrl: previewUrl.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), episodes }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sunset-deck-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.episodes)) setEpisodes(parsed.episodes);
      } catch { window.alert('バックアップファイルを読み込めませんでした。'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  if (!active) return null;

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div><p className={styles.eyebrow}>SUNSET DECK</p><h1>STUDIO OS</h1></div>
        <nav>
          <button className={styles.navActive}>Overview</button><button>Episodes</button>
          <button>Review Queue <span>{reviewCount}</span></button><button>Assets</button><button>Publishing</button>
        </nav>
        <div className={styles.sidebarBottom}>
          <p>PRODUCTION MODE</p><strong>Autopilot + Approval</strong><small>あなたはデザインと物語だけを判断</small>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>MORNING CONTROL DESK</p><h2>おはようございます、トムさん。</h2><p>通勤中に、再生・修正・承認まで完了できます。</p></div>
          <div className={styles.headerActions}>
            <span className={styles.syncBadge}>{syncLabel(syncState)}</span>
            <button onClick={exportData} className={styles.ghost}>バックアップ</button>
            <button onClick={() => importRef.current?.click()} className={styles.ghost}>復元</button>
            <input ref={importRef} type="file" accept="application/json" onChange={importData} hidden />
          </div>
        </header>

        <section className={styles.metrics}>
          <article><span>承認待ち</span><strong>{reviewCount}</strong><small>最優先で確認</small></article>
          <article><span>承認済み</span><strong>{approvedCount}</strong><small>公開可能</small></article>
          <article><span>制作進捗</span><strong>{avgProgress}%</strong><small>全エピソード平均</small></article>
          <article><span>プレビュー登録</span><strong>{episodes.filter((e) => e.previewUrl).length}</strong><small>再生可能な動画</small></article>
        </section>

        <section className={styles.morningBrief}>
          <div className={styles.sectionTitle}><div><p className={styles.eyebrow}>MORNING REVIEW</p><h3>今朝、見るもの</h3></div><span>最大3本</span></div>
          <div className={styles.queue}>{morningQueue.map((item, index) => (
            <button key={item.id} onClick={() => setActiveId(item.id)} className={activeId === item.id ? styles.queueActive : ''}>
              <b>0{index + 1}</b><span><strong>{item.title}</strong><small>{statusLabel[item.status]} ・ {item.previewUrl ? '再生可能' : 'URL待ち'}</small></span><em>→</em>
            </button>
          ))}</div>
        </section>

        <div className={styles.mainGrid}>
          <section className={styles.library}>
            <div className={styles.sectionTitle}>
              <div><p className={styles.eyebrow}>CONTENT PIPELINE</p><h3>YouTube動画リスト</h3></div>
              <div className={styles.filters}>{(['all', 'review', 'production', 'script', 'idea', 'approved'] as const).map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={filter === item ? styles.filterActive : ''}>{item === 'all' ? 'すべて' : statusLabel[item]}</button>
              ))}</div>
            </div>
            <div className={styles.episodeList}>{visible.map((item) => (
              <button key={item.id} onClick={() => setActiveId(item.id)} className={active.id === item.id ? styles.episodeActive : ''}>
                <div className={styles.thumb}><span>EP.0{item.id}</span><b>{item.previewUrl ? '▶ READY' : `${item.progress}%`}</b></div>
                <div className={styles.episodeCopy}><small>{item.series}</small><strong>{item.title}</strong><span>{item.subtitle}</span></div>
                <div className={styles.episodeMeta}><span className={`${styles.badge} ${styles[item.status]}`}>{statusLabel[item.status]}</span><small>{item.updated}</small></div>
              </button>
            ))}</div>
          </section>

          <aside className={styles.reviewPanel}>
            <p className={styles.eyebrow}>REVIEW CONSOLE</p><h3>{active.title}</h3><span className={styles.subTitle}>{active.subtitle}</span>
            {embedUrl ? (
              embedUrl.includes('youtube.com/embed/') ? <iframe className={styles.videoFrame} src={embedUrl} title={active.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <video className={styles.videoFrame} src={embedUrl} controls playsInline />
            ) : <div className={styles.videoMock}><div className={styles.play}>▶</div><small>PREVIEW URLを登録してください</small></div>}
            <label>プレビューURL</label>
            <input className={styles.urlInput} value={previewUrl} onChange={(e) => setPreviewUrl(e.target.value)} placeholder="YouTube限定公開URL または MP4 URL" inputMode="url" />
            <label>冒頭フック</label><blockquote>{active.hook}</blockquote>
            <label>制作メモ／修正指示</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="ストーリー補足、UI修正、ナレーション指示を入力" />
            <button onClick={saveReview} className={styles.secondary}>{saved ? '保存しました' : 'URLと修正指示を保存'}</button>
            <div className={styles.actions}><button onClick={() => changeStatus('production')}>差し戻す</button><button onClick={() => changeStatus('approved')} className={styles.approve}>承認する</button></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
