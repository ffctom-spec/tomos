'use client';

import { useMemo, useState } from 'react';
import { storyboards } from './storyboards';
import styles from './storyboard-deck.module.css';

type Props = {
  episodeId: number;
  title: string;
  subtitle: string;
  series: string;
  status: string;
  onApprove: () => void;
  onReturn: () => void;
};

export default function StoryboardDeck({ episodeId, title, subtitle, series, status, onApprove, onReturn }: Props) {
  const deck = storyboards[episodeId] || storyboards[1];
  const [activeSceneId, setActiveSceneId] = useState(deck.scenes[0]?.id || 1);
  const [tab, setTab] = useState<'scenario' | 'discovery'>('scenario');
  const scene = useMemo(() => deck.scenes.find((item) => item.id === activeSceneId) || deck.scenes[0], [activeSceneId, deck.scenes]);
  const missingCount = deck.scenes.reduce((sum, item) => sum + (item.missing?.length || 0), 0);

  return (
    <section className={styles.deck}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>{series}</p>
          <h2>EP.{String(episodeId).padStart(2, '0')}　{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
          <p className={styles.logline}>{deck.logline}</p>
          <div className={styles.meta}>
            <span>{deck.scenes.length} scenes</span><span>{missingCount ? `不足素材 ${missingCount}` : '素材準備完了'}</span><span>{status}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => window.print()}>PDFで保存</button>
          <button onClick={() => document.documentElement.requestFullscreen?.()}>全画面</button>
        </div>
      </header>

      <nav className={styles.tabs}>
        <button className={tab === 'scenario' ? styles.activeTab : ''} onClick={() => setTab('scenario')}>シナリオ・絵コンテ</button>
        <button className={tab === 'discovery' ? styles.activeTab : ''} onClick={() => setTab('discovery')}>AIO・検索・おすすめ設計</button>
      </nav>

      {tab === 'scenario' ? (
        <div className={styles.body}>
          <aside className={styles.sceneRail}>
            {deck.scenes.map((item) => (
              <button key={item.id} className={item.id === scene.id ? styles.activeScene : ''} onClick={() => setActiveSceneId(item.id)}>
                <span className={styles.sceneNo}>{String(item.id).padStart(2, '0')}</span>
                <div><strong>{item.title}</strong><small>{item.timecode}</small></div>
                {item.missing?.length ? <em>素材待ち</em> : <em className={styles.ready}>準備済み</em>}
              </button>
            ))}
          </aside>

          <article className={styles.scenePage}>
            <div className={styles.sceneHeading}>
              <div><span>{String(scene.id).padStart(2, '0')}</span><h3>{scene.title}</h3></div>
              <time>{scene.timecode}</time>
            </div>
            <div className={styles.visualMock}>
              <span>VISUAL DIRECTION</span>
              <strong>{scene.visual}</strong>
            </div>
            <div className={styles.scriptGrid}>
              <section><h4>映像指示</h4><p>{scene.visual}</p></section>
              <section><h4>ナレーション</h4><p className={styles.narration}>{scene.narration}</p></section>
              <section><h4>画面テキスト</h4><p>{scene.onScreen}</p></section>
              <section><h4>BGM・効果音</h4><p>{scene.audio}</p></section>
            </div>
            <div className={styles.productionGrid}>
              <section><h4>シーンの目的</h4><p>{scene.purpose}</p></section>
              <section><h4>使用素材</h4><ul>{scene.assets.map((asset) => <li key={asset}>{asset}</li>)}</ul></section>
              <section className={scene.missing?.length ? styles.missing : ''}><h4>不足素材</h4>{scene.missing?.length ? <ul>{scene.missing.map((asset) => <li key={asset}>{asset}</li>)}</ul> : <p>なし</p>}</section>
            </div>
          </article>
        </div>
      ) : (
        <div className={styles.discovery}>
          <div className={styles.discoveryHero}>
            <p className={styles.kicker}>DISCOVERY PACKAGE</p>
            <h3>検索に見つかり、クリックされ、最後まで見られるための設計</h3>
            <p>保証ではなく、YouTube検索・関連動画・Google動画検索・AI回答で理解されやすい情報構造を、制作前から揃えます。</p>
          </div>
          <div className={styles.discoveryGrid}>
            <section><h4>検索型タイトル</h4><p>{deck.searchableTitle}</p></section>
            <section><h4>おすすめ型タイトル</h4><p>{deck.curiosityTitle}</p></section>
            <section className={styles.wide}><h4>冒頭2行の説明文</h4><p>{deck.description}</p></section>
            <section><h4>検索キーワード</h4><div className={styles.chips}>{deck.keywords.map((item) => <span key={item}>{item}</span>)}</div></section>
            <section><h4>視聴者の質問</h4><ul>{deck.questions.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section className={styles.wide}><h4>動画チャプター</h4><pre>{deck.chapters.join('\n')}</pre></section>
            <section><h4>推薦シグナル設計</h4><ul><li>タイトルとサムネイルの約束を冒頭25秒で回収</li><li>各章に新しい疑問と答えを配置</li><li>シリーズ名・映像トーン・終端導線を統一</li></ul></section>
            <section><h4>AIO理解設計</h4><ul><li>主題を1文で明示</li><li>質問形式の論点を本文で直接回答</li><li>固有名詞・時代・場所・因果関係をナレーション化</li></ul></section>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <button onClick={onReturn}>差し戻す</button>
        <button className={styles.approve} onClick={onApprove}>最終承認して動画制作へ →</button>
      </footer>
    </section>
  );
}
