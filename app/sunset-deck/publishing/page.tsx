'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getAccessToken } from '@/lib/sunset-deck-auth';
import {
  cloudConfigured,
  loadCloudEpisodes,
  saveCloudEpisodes,
  type PrivacyStatus,
  type PublishState,
  type SunsetDeckEpisode,
} from '@/lib/sunset-deck-cloud';
import styles from './publishing.module.css';

const publishLabels: Record<PublishState, string> = {
  not_ready: '準備前',
  ready: '公開準備完了',
  scheduled: '公開予約済み',
  published: '公開済み',
  failed: 'エラー',
};

const privacyLabels: Record<PrivacyStatus, string> = {
  private: '非公開',
  unlisted: '限定公開',
  public: '公開',
};

function localDateTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export default function PublishingPage() {
  const [episodes, setEpisodes] = useState<SunsetDeckEpisode[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [syncLabel, setSyncLabel] = useState('読み込み中');
  const [apiLabel, setApiLabel] = useState('');
  const [apiBusy, setApiBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const stored = localStorage.getItem('sunset-deck-episodes');
      let local: SunsetDeckEpisode[] = [];
      if (stored) {
        try { local = JSON.parse(stored) as SunsetDeckEpisode[]; } catch { local = []; }
      }
      if (!cancelled) setEpisodes(local);
      if (cloudConfigured) {
        try {
          const cloud = await loadCloudEpisodes();
          if (!cancelled && cloud) {
            setEpisodes(cloud);
            localStorage.setItem('sunset-deck-episodes', JSON.stringify(cloud));
          }
          if (!cancelled) setSyncLabel('クラウド同期済み');
        } catch {
          if (!cancelled) setSyncLabel('端末データを表示');
        }
      } else if (!cancelled) setSyncLabel('端末データを表示');
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const active = episodes.find((episode) => episode.id === activeId) ?? episodes[0];
  const scheduled = useMemo(() => episodes.filter((episode) => episode.publishState === 'scheduled'), [episodes]);
  const ready = useMemo(() => episodes.filter((episode) => episode.status === 'approved' && !['scheduled', 'published'].includes(episode.publishState || 'not_ready')), [episodes]);

  useEffect(() => {
    if (active && activeId === null) setActiveId(active.id);
    setApiLabel('');
  }, [active, activeId]);

  async function updateActive(patch: Partial<SunsetDeckEpisode>) {
    if (!active) return;
    const next = episodes.map((episode) => episode.id === active.id ? { ...episode, ...patch, updated: 'たった今' } : episode);
    setEpisodes(next);
    localStorage.setItem('sunset-deck-episodes', JSON.stringify(next));
    setSyncLabel('保存中');
    try {
      await saveCloudEpisodes(next);
      setSyncLabel(cloudConfigured ? 'クラウド同期済み' : '端末に保存済み');
    } catch {
      setSyncLabel('端末に保存済み');
    }
  }

  async function callYouTube(action: 'schedule' | 'publish_now') {
    if (!active?.youtubeVideoId) return setApiLabel('YouTube動画IDを入力してください。');
    if (action === 'schedule' && !active.scheduledAt) return setApiLabel('公開予約日時を入力してください。');
    if (active.status !== 'approved') return setApiLabel('動画承認後に実行できます。');

    const accessToken = getAccessToken();
    if (!accessToken) return setApiLabel('Studio OSへ再ログインしてください。');

    setApiBusy(true);
    setApiLabel(action === 'schedule' ? 'YouTubeへ公開予約を登録中…' : 'YouTubeへ公開設定を反映中…');
    try {
      const response = await fetch('/api/sunset-deck/youtube/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          action,
          videoId: active.youtubeVideoId,
          scheduledAt: active.scheduledAt,
          privacyStatus: active.privacyStatus === 'unlisted' ? 'unlisted' : 'public',
        }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || 'YouTube APIの操作に失敗しました。');

      if (action === 'schedule') {
        await updateActive({ publishState: 'scheduled', privacyStatus: 'public', publishError: undefined });
        setApiLabel('YouTubeへの公開予約が完了しました。予約時点では非公開で、指定日時に公開されます。');
      } else {
        await updateActive({ publishState: 'published', publishedAt: new Date().toISOString(), publishError: undefined });
        setApiLabel('YouTubeの公開設定を反映しました。');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'YouTube APIの操作に失敗しました。';
      await updateActive({ publishState: 'failed', publishError: message });
      setApiLabel(message);
    } finally {
      setApiBusy(false);
    }
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <div>
          <p>SUNSET DECK</p>
          <h1>PUBLISHING</h1>
          <Link href="/sunset-deck">← Studio OSへ戻る</Link>
        </div>
        <small>承認済み動画をYouTube公開予約へ送る管理画面</small>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>YOUTUBE RELEASE DESK</p>
            <h2>公開コントロール</h2>
            <span>公開日時と公開範囲をYouTubeへ直接反映します。</span>
          </div>
          <strong>{syncLabel}</strong>
        </header>

        <section className={styles.metrics}>
          <article><span>公開準備</span><b>{ready.length}</b></article>
          <article><span>予約済み</span><b>{scheduled.length}</b></article>
          <article><span>公開済み</span><b>{episodes.filter((e) => e.publishState === 'published').length}</b></article>
        </section>

        <div className={styles.grid}>
          <section className={styles.listPanel}>
            <h3>公開キュー</h3>
            <div className={styles.list}>
              {episodes.map((episode) => (
                <button key={episode.id} onClick={() => setActiveId(episode.id)} className={episode.id === active?.id ? styles.active : ''}>
                  <span>EP.0{episode.id}</span>
                  <div><strong>{episode.title}</strong><small>{publishLabels[episode.publishState || 'not_ready']}</small></div>
                  <em>{episode.scheduledAt ? new Date(episode.scheduledAt).toLocaleString('ja-JP') : '日時未設定'}</em>
                </button>
              ))}
            </div>
          </section>

          {active && <aside className={styles.editor}>
            <p className={styles.eyebrow}>RELEASE SETTINGS</p>
            <h3>{active.title}</h3>
            <span className={styles.subtitle}>{active.subtitle}</span>

            <label>YouTube動画ID</label>
            <input value={active.youtubeVideoId || ''} onChange={(event) => updateActive({ youtubeVideoId: event.target.value.trim() })} placeholder="例: dQw4w9WgXcQ" />

            <label>公開範囲</label>
            <select value={active.privacyStatus || 'private'} onChange={(event) => updateActive({ privacyStatus: event.target.value as PrivacyStatus })}>
              {Object.entries(privacyLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>

            <label>公開予約日時</label>
            <input type="datetime-local" value={localDateTime(active.scheduledAt)} onChange={(event) => updateActive({ scheduledAt: event.target.value ? new Date(event.target.value).toISOString() : undefined })} />

            <label>公開状態</label>
            <select value={active.publishState || 'not_ready'} onChange={(event) => updateActive({ publishState: event.target.value as PublishState })}>
              {Object.entries(publishLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>

            <button className={styles.primary} onClick={() => callYouTube('schedule')} disabled={apiBusy || !active.scheduledAt || active.status !== 'approved'}>{apiBusy ? '処理中…' : 'YouTubeへ公開予約'}</button>
            <button onClick={() => callYouTube('publish_now')} disabled={apiBusy || active.status !== 'approved' || active.privacyStatus === 'private'}>今すぐ公開設定を反映</button>
            {active.status !== 'approved' && <small className={styles.warning}>動画承認後に公開操作できます。</small>}
            {active.publishError && <small className={styles.warning}>{active.publishError}</small>}
            {apiLabel && <small className={styles.warning}>{apiLabel}</small>}
          </aside>}
        </div>
      </section>
    </main>
  );
}
