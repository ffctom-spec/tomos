'use client';

import { DragEvent, useEffect, useRef, useState } from 'react';
import { getAccessToken } from '@/lib/sunset-deck-auth';
import type { PrivacyStatus } from '@/lib/sunset-deck-cloud';

type Props = {
  episodeId: number;
  title: string;
  subtitle: string;
  series: string;
  hook: string;
  note: string;
  initialScheduledAt?: string;
  initialPrivacyStatus?: PrivacyStatus;
  onUploaded: (result: { videoId: string; scheduledAt?: string; privacyStatus: PrivacyStatus; previewUrl: string }) => void;
};

type UploadState = 'idle' | 'preparing' | 'uploading' | 'thumbnail' | 'publishing' | 'done' | 'error';

export default function YouTubeUploadPanel(props: Props) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(`${props.hook}\n\n${props.note}\n\nSUNSET DECK STUDIO`);
  const [tags, setTags] = useState(`${props.series},SUNSET DECK,庭,ガーデン,ドキュメンタリー`);
  const [scheduledAt, setScheduledAt] = useState(props.initialScheduledAt ? props.initialScheduledAt.slice(0, 16) : '');
  const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatus>(props.initialPrivacyStatus || 'public');
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('MP4をここへドロップ');
  const videoInput = useRef<HTMLInputElement>(null);
  const thumbInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVideoFile(null);
    setThumbnailFile(null);
    setTitle(props.title);
    setDescription(`${props.hook}\n\n${props.note}\n\nSUNSET DECK STUDIO`);
    setTags(`${props.series},SUNSET DECK,庭,ガーデン,ドキュメンタリー`);
    setScheduledAt(props.initialScheduledAt ? props.initialScheduledAt.slice(0, 16) : '');
    setPrivacyStatus(props.initialPrivacyStatus || 'public');
    setState('idle');
    setProgress(0);
    setMessage('MP4をここへドロップ');
  }, [props.episodeId]);

  function acceptVideo(file?: File) {
    if (!file) return;
    if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
      setState('error'); setMessage('MP4ファイルを選択してください。'); return;
    }
    setVideoFile(file); setState('idle'); setProgress(0); setMessage(`${file.name} ・ ${(file.size / 1024 / 1024).toFixed(1)}MB`);
  }

  function drop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault(); acceptVideo(event.dataTransfer.files?.[0]);
  }

  async function uploadWithProgress(url: string, token: string, file: File) {
    return new Promise<Record<string, unknown>>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', file.type || 'video/mp4');
      xhr.upload.onprogress = (event) => { if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100)); };
      xhr.onerror = () => reject(new Error('動画アップロード中に通信エラーが発生しました。'));
      xhr.onload = () => {
        let payload: Record<string, unknown> = {};
        try { payload = JSON.parse(xhr.responseText || '{}') as Record<string, unknown>; } catch { /* empty */ }
        if (xhr.status >= 200 && xhr.status < 300) resolve(payload);
        else reject(new Error(String((payload.error as { message?: string } | undefined)?.message || `YouTube upload failed (${xhr.status}).`)));
      };
      xhr.send(file);
    });
  }

  async function setThumbnail(videoId: string, token: string, file: File) {
    const response = await fetch(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${encodeURIComponent(videoId)}&uploadType=media`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': file.type || 'image/jpeg' }, body: file,
    });
    const payload = await response.json().catch(() => ({})) as { error?: { message?: string } };
    if (!response.ok) throw new Error(payload.error?.message || 'サムネイル設定に失敗しました。');
  }

  async function publishNow(videoId: string) {
    if (privacyStatus === 'private') return;
    const token = getAccessToken();
    const response = await fetch('/api/sunset-deck/youtube/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
      body: JSON.stringify({ action: 'publish_now', videoId, privacyStatus }),
    });
    const payload = await response.json() as { ok?: boolean; error?: string };
    if (!response.ok || !payload.ok) throw new Error(payload.error || '公開設定に失敗しました。');
  }

  async function startUpload() {
    if (!videoFile) { setState('error'); setMessage('先にMP4を選択してください。'); return; }
    if (!title.trim()) { setState('error'); setMessage('タイトルを入力してください。'); return; }
    const authToken = getAccessToken();
    if (!authToken) { setState('error'); setMessage('ログイン情報を確認してください。'); return; }
    try {
      setState('preparing'); setMessage('YouTubeアップロードを準備中…'); setProgress(0);
      const normalizedSchedule = scheduledAt ? new Date(scheduledAt).toISOString() : undefined;
      const initResponse = await fetch('/api/sunset-deck/youtube/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ title, description, tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean), fileSize: videoFile.size, contentType: videoFile.type || 'video/mp4', scheduledAt: normalizedSchedule }),
      });
      const init = await initResponse.json() as { ok?: boolean; uploadUrl?: string; accessToken?: string; error?: string };
      if (!initResponse.ok || !init.ok || !init.uploadUrl || !init.accessToken) throw new Error(init.error || 'アップロード準備に失敗しました。');

      setState('uploading'); setMessage('YouTubeへアップロード中…');
      const uploaded = await uploadWithProgress(init.uploadUrl, init.accessToken, videoFile);
      const videoId = String(uploaded.id || '');
      if (!videoId) throw new Error('YouTube動画IDを取得できませんでした。');

      if (thumbnailFile) {
        setState('thumbnail'); setMessage('サムネイルを設定中…');
        await setThumbnail(videoId, init.accessToken, thumbnailFile);
      }
      if (!normalizedSchedule) {
        setState('publishing'); setMessage('公開範囲を反映中…');
        await publishNow(videoId);
      }
      const previewUrl = `https://www.youtube.com/watch?v=${videoId}`;
      props.onUploaded({ videoId, scheduledAt: normalizedSchedule, privacyStatus: normalizedSchedule ? 'private' : privacyStatus, previewUrl });
      setState('done'); setProgress(100); setMessage(normalizedSchedule ? 'アップロード・予約公開が完了しました。' : 'アップロード・公開設定が完了しました。');
    } catch (error) {
      setState('error'); setMessage(error instanceof Error ? error.message : 'アップロードに失敗しました。');
    }
  }

  const busy = ['preparing', 'uploading', 'thumbnail', 'publishing'].includes(state);
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <button type="button" onClick={() => videoInput.current?.click()} onDrop={drop} onDragOver={(e) => e.preventDefault()} style={{ minHeight: 130, border: '1px dashed #a68438', borderRadius: 14, background: '#f8f4e9', padding: 20, cursor: 'pointer', textAlign: 'center' }}>
        <strong style={{ display: 'block', fontSize: 18 }}>MP4をドラッグ＆ドロップ</strong><span style={{ display: 'block', marginTop: 8 }}>{message}</span>
      </button>
      <input ref={videoInput} type="file" accept="video/mp4,.mp4" hidden onChange={(e) => acceptVideo(e.target.files?.[0])} />
      {busy || state === 'done' ? <div><div style={{ height: 8, borderRadius: 8, background: '#e3dccd', overflow: 'hidden' }}><div style={{ width: `${progress}%`, height: '100%', background: '#9c7a2d', transition: 'width .2s' }} /></div><small>{progress}%</small></div> : null}
      <label>タイトル</label><input value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>説明文</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
      <label>タグ（カンマ区切り）</label><input value={tags} onChange={(e) => setTags(e.target.value)} />
      <button type="button" onClick={() => thumbInput.current?.click()} style={{ padding: 14 }}>サムネイルを選択{thumbnailFile ? `：${thumbnailFile.name}` : ''}</button>
      <input ref={thumbInput} type="file" accept="image/jpeg,image/png" hidden onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 12 }}><div><label>公開日時（空欄なら即時）</label><input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} /></div><div><label>公開範囲</label><select value={privacyStatus} onChange={(e) => setPrivacyStatus(e.target.value as PrivacyStatus)}><option value="public">公開</option><option value="unlisted">限定公開</option><option value="private">非公開</option></select></div></div>
      <button type="button" disabled={busy || !videoFile} onClick={startUpload} style={{ padding: 18, fontWeight: 700, background: '#9c7a2d', color: '#fff', border: 0, borderRadius: 10, cursor: busy ? 'wait' : 'pointer', opacity: busy || !videoFile ? .55 : 1 }}>アップロードして公開設定まで完了</button>
      {state === 'error' ? <p style={{ color: '#9b2c2c', margin: 0 }}>{message}</p> : null}
      {state === 'done' ? <p style={{ color: '#35633d', margin: 0 }}>{message}</p> : null}
    </div>
  );
}
