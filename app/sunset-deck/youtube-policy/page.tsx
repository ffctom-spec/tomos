import Link from 'next/link';
import YouTubeSafetyPanel from '../YouTubeSafetyPanel';

export default function YouTubePolicyPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '32px', background: '#080a0d', color: '#f4f5f2' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Link href="/sunset-deck" style={{ color: '#aebba5', textDecoration: 'none', fontSize: 13 }}>← STUDIO OSへ戻る</Link>
        <div style={{ marginTop: 28, marginBottom: 12 }}>
          <p style={{ letterSpacing: '.18em', fontSize: 11, color: '#9fab95', margin: 0 }}>SUNSET DECK GOVERNANCE</p>
          <h1 style={{ fontSize: 'clamp(30px,5vw,58px)', margin: '8px 0 10px' }}>YouTube AI Content Standard</h1>
          <p style={{ color: '#9aa1a8', lineHeight: 1.8, maxWidth: 760 }}>AIを制作支援に使いながら、独自性・透明性・視聴者価値を守るための2026年運用基準です。全エピソードは公開前にこのチェックを通過させます。</p>
        </div>
        <YouTubeSafetyPanel title="全エピソード共通ルール" />
      </div>
    </main>
  );
}
