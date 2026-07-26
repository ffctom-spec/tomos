'use client';

import styles from './youtube-safety.module.css';

type Props = {
  title: string;
};

const checks = [
  ['独自性', '台本・構成・映像にSUNSET DECK独自の視点、物語、編集意図がある'],
  ['大量生成防止', '同じテンプレートや同じ素材構成を短期間に大量投稿しない'],
  ['AI開示', '現実と誤認されるAI映像・音声はYouTube Studioで「AIコンテンツ」を申告する'],
  ['事実確認', '日付・数字・歴史・科学情報は一次情報または信頼できる資料で確認する'],
  ['権利確認', '画像・映像・音声・BGM・人物の顔や声について商用利用権を確認する'],
  ['視聴価値', '冒頭の約束、物語の進行、結論があり、最後まで見る理由を作る'],
];

export default function YouTubeSafetyPanel({ title }: Props) {
  return (
    <section className={styles.panel}>
      <div className={styles.heading}>
        <div>
          <p>YOUTUBE AI SAFETY</p>
          <h3>公開前・収益化安全チェック</h3>
          <span>{title}</span>
        </div>
        <strong>2026 STANDARD</strong>
      </div>

      <div className={styles.policyGrid}>
        <article><b>01</b><div><strong>透明性</strong><span>現実的なAI生成・改変は隠さず申告</span></div></article>
        <article><b>02</b><div><strong>オリジナリティ</strong><span>自動生成の垂れ流しではなく独自の物語を追加</span></div></article>
        <article><b>03</b><div><strong>視聴者価値</strong><span>教育・発見・感情のいずれかを必ず残す</span></div></article>
      </div>

      <div className={styles.checklist}>
        {checks.map(([label, text]) => (
          <label key={label}>
            <input type="checkbox" />
            <span><strong>{label}</strong><small>{text}</small></span>
          </label>
        ))}
      </div>

      <div className={styles.rule}>
        <strong>SUNSET DECK運用原則</strong>
        <p>AIは制作速度を上げるために使用し、企画意図・物語・検証・最終責任は人間が持つ。公開本数より、一本ごとの独自性と完成度を優先する。</p>
      </div>
    </section>
  );
}
