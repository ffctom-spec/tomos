'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './hq.module.css';

type OpportunityStatus = 'Act' | 'Explore' | 'Watch' | 'Archive';
type Opportunity = {
  id: number;
  title: string;
  type: string;
  status: OpportunityStatus;
  score: number;
  whyNow: string;
  nextAction: string;
  place: string;
};

const opportunities: Opportunity[] = [
  { id: 1, title: 'YUGAWA Residence Garden Transformation', type: 'Content / Place', status: 'Act', score: 94, whyNow: '施工前後の一次記録を残せる期間が短い。', nextAction: 'ロストラータ設置前の撮影リストを確定', place: 'Yokohama' },
  { id: 2, title: 'Unzen Fermentation Field Notes', type: 'Culture / Food', status: 'Explore', score: 88, whyNow: '長崎のルーツと食文化をブランド資産へ接続できる。', nextAction: '生産者候補と発酵テーマを整理', place: 'Nagasaki' },
  { id: 3, title: 'Sunset Sessions at Hayama', type: 'Sound / Community', status: 'Watch', score: 82, whyNow: '音楽・海・食・照明を統合する象徴企画になり得る。', nextAction: '小規模テスト開催条件を調査', place: 'Hayama' },
  { id: 4, title: 'AI for Better Living Newsletter', type: 'Knowledge / Growth', status: 'Act', score: 86, whyNow: '検索流入と信頼蓄積を同時に作れる。', nextAction: '第1号の編集テーマを決定', place: 'Global' },
];

const content = [
  { title: '世界が庭で生き延びた時代', series: 'Garden Stories', stage: 'Brand QA', progress: 86 },
  { title: 'ロストラータは、なぜ庭を変えるのか', series: 'Design Files', stage: 'Production', progress: 63 },
  { title: 'LAで学んだ、空間をつなぐ音楽', series: 'Sunset Sessions', stage: 'Research', progress: 28 },
  { title: '雲仙の食卓が教えてくれること', series: 'Unzen Stories', stage: 'Idea', progress: 14 },
];

const agents = [
  ['Executive Orchestrator', 'Running', '7 tasks'],
  ['Chief Intelligence Agent', 'Running', '12 signals'],
  ['Chief Brand Agent', 'Reviewing', '3 decisions'],
  ['Chief Story Agent', 'Drafting', '2 stories'],
  ['Chief Archive Agent', 'Indexing', '38 nodes'],
];

export default function SunsetDeckHQ() {
  const [filter, setFilter] = useState<'All' | OpportunityStatus>('All');
  const [selected, setSelected] = useState(opportunities[0]);
  const visible = useMemo(() => filter === 'All' ? opportunities : opportunities.filter((item) => item.status === filter), [filter]);

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.kicker}>SUNSET DECK</p>
          <h1>HQ</h1>
          <span>Brand Operating System</span>
        </div>
        <nav>
          {['CEO DESK', 'Opportunity Radar', 'Content Master', 'Production', 'Brand DNA', 'Knowledge Graph', 'People / Places', 'Sound Library', 'AI Agent Center', 'Business HQ', 'Archive'].map((item, index) => (
            <button key={item} className={index === 0 ? styles.activeNav : ''}>{item}<em>{index === 1 ? '4' : index === 8 ? '5' : ''}</em></button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <p>NORTH STAR</p>
          <strong>20年後のブランド価値を高めるか。</strong>
          <Link href="/sunset-deck">Open Studio OS →</Link>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>SUNDAY · JULY 26, 2026</p>
            <h2>CEO DESK</h2>
            <span>Design a Life Worth Remembering.</span>
          </div>
          <div className={styles.headerActions}>
            <button>Morning Review</button>
            <button className={styles.primary}>Create Asset</button>
          </div>
        </header>

        <section className={styles.northStar}>
          <div><p>TODAY'S NORTH STAR</p><h3>信頼を生む一次記録を、ひとつ残す。</h3></div>
          <div><p>TODAY'S MISSION</p><strong>YUGAWA Residenceの庭づくりを、20年後にも残るブランド資産へ変換する。</strong></div>
        </section>

        <section className={styles.metricGrid}>
          {[['Brand Health', '84', '+4 this month'], ['Active Assets', '126', '18 compounding'], ['Content Pipeline', '12', '3 need review'], ['Trust Capital', 'Growing', 'High confidence']].map(([label, value, note]) => (
            <article key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>
          ))}
        </section>

        <div className={styles.dashboardGrid}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}><div><p>EXECUTIVE PRIORITIES</p><h3>Top 3 Actions</h3></div><span>Today</span></div>
            <ol className={styles.actionList}>
              <li><b>01</b><div><strong>庭の施工前素材を撮影する</strong><span>後から再現できない一次記録を優先</span></div><em>60 min</em></li>
              <li><b>02</b><div><strong>Season 1のブランドストーリーを固定</strong><span>Garden Storiesの核を承認可能な状態へ</span></div><em>30 min</em></li>
              <li><b>03</b><div><strong>Opportunity #004を企画化</strong><span>NewsletterをAIO資産として開始</span></div><em>25 min</em></li>
            </ol>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}><div><p>AI RECOMMENDATION</p><h3>今、最も価値が高い判断</h3></div><span className={styles.live}>LIVE</span></div>
            <div className={styles.recommendation}>
              <span>94 / 100</span>
              <h4>YUGAWA Residenceを「生活実験場」として正式に定義する</h4>
              <p>庭・建築・DIY・食・音・AIのすべてが一つの場所で接続され、今後のコンテンツ、商品、イベント、コミュニティの原型になります。</p>
              <button>Decision Draftを見る →</button>
            </div>
          </section>
        </div>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div><p>OPPORTUNITY RADAR</p><h3>意思決定候補</h3></div>
            <div className={styles.filters}>{(['All', 'Act', 'Explore', 'Watch', 'Archive'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? styles.filterActive : ''}>{item}</button>)}</div>
          </div>
          <div className={styles.radarGrid}>
            <div className={styles.opportunityList}>{visible.map((item) => <button key={item.id} onClick={() => setSelected(item)} className={selected.id === item.id ? styles.selectedOpportunity : ''}><span className={styles.score}>{item.score}</span><div><strong>{item.title}</strong><small>{item.type} · {item.place}</small></div><em>{item.status}</em></button>)}</div>
            <article className={styles.opportunityDetail}><p>WHY NOW</p><h4>{selected.title}</h4><span>{selected.whyNow}</span><hr/><p>NEXT ACTION</p><strong>{selected.nextAction}</strong><button>企画書を生成</button></article>
          </div>
        </section>

        <div className={styles.dashboardGrid}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}><div><p>CONTENT MASTER</p><h3>制作資産</h3></div><Link href="/sunset-deck">Studio OS →</Link></div>
            <div className={styles.contentList}>{content.map((item) => <article key={item.title}><div><strong>{item.title}</strong><span>{item.series} · {item.stage}</span></div><div className={styles.progress}><i style={{ width: `${item.progress}%` }} /></div><b>{item.progress}%</b></article>)}</div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHeader}><div><p>AI AGENT CENTER</p><h3>Autonomous Activity</h3></div><span className={styles.live}>5 ACTIVE</span></div>
            <div className={styles.agentList}>{agents.map(([name, state, output]) => <article key={name}><i/><div><strong>{name}</strong><span>{state}</span></div><b>{output}</b></article>)}</div>
          </section>
        </div>

        <section className={styles.brandStrip}>
          <div><p>BRAND DNA</p><h3>Beautiful · Useful · Timeless · Human · Global · Trustworthy · Distinctive · Sustainable</h3></div>
          <div><span>MISSION</span><strong>Design a Life Worth Remembering.</strong></div>
          <div><span>ROLE</span><strong>Life Curator</strong></div>
        </section>
      </section>
    </main>
  );
}
