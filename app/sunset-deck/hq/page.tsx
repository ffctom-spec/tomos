'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { cloudConfigured, loadCloudEpisodes, saveCloudEpisodes, type SunsetDeckEpisode } from '@/lib/sunset-deck-cloud';
import { createOpportunity, hqCloudConfigured, loadOpportunities, saveDecision, saveOpportunity, type BrandOpportunity, type OpportunityStatus, type OpportunityType } from '@/lib/sunset-deck-hq-cloud';
import styles from './hq.module.css';

const seedOpportunities: BrandOpportunity[] = [
  createOpportunity({ title: 'YUGAWA Residence Garden Transformation', type: 'Content', status: 'Act', score: 94, brandFit: 10, strategicValue: 10, contentPotential: 10, revenuePotential: 7, timing: 10, confidence: 9, effort: 5, risk: 2, longTermAssetValue: 10, whyNow: '施工前後の一次記録を残せる期間が短い。', nextAction: 'ロストラータ設置前の撮影リストを確定', place: 'Yokohama' }),
  createOpportunity({ title: 'Unzen Fermentation Field Notes', type: 'Culture', status: 'Explore', brandFit: 10, strategicValue: 9, contentPotential: 9, revenuePotential: 7, timing: 6, confidence: 7, effort: 7, risk: 3, longTermAssetValue: 10, whyNow: '長崎のルーツと食文化をブランド資産へ接続できる。', nextAction: '生産者候補と発酵テーマを整理', place: 'Nagasaki' }),
  createOpportunity({ title: 'Sunset Sessions at Hayama', type: 'Collaboration', status: 'Watch', brandFit: 9, strategicValue: 8, contentPotential: 9, revenuePotential: 6, timing: 5, confidence: 6, effort: 8, risk: 5, longTermAssetValue: 9, whyNow: '音楽・海・食・照明を統合する象徴企画になり得る。', nextAction: '小規模テスト開催条件を調査', place: 'Hayama' }),
  createOpportunity({ title: 'AI for Better Living Newsletter', type: 'Technology', status: 'Act', brandFit: 8, strategicValue: 9, contentPotential: 9, revenuePotential: 7, timing: 9, confidence: 8, effort: 4, risk: 2, longTermAssetValue: 9, whyNow: '検索流入と信頼蓄積を同時に作れる。', nextAction: '第1号の編集テーマを決定', place: 'Global' }),
];

const fallbackEpisodes: SunsetDeckEpisode[] = [
  { id: 1, title: '世界が庭で生き延びた時代', subtitle: 'The Garden That Saved Humanity', series: 'Garden Stories', status: 'review', duration: '09:20', progress: 86, updated: '本日', hook: 'もし明日、スーパーから食べ物が消えたら。', note: 'Brand QA待ち' },
  { id: 4, title: 'ロストラータは、なぜ庭を変えるのか', subtitle: 'The Architecture of a Plant', series: 'Design Files', status: 'production', duration: '06:50', progress: 63, updated: '本日', hook: '一本の植物が、家の印象を変える。', note: '実写素材を収集中' },
];

const agents = [
  ['Executive Orchestrator', 'Running', 'Priorities synchronized'],
  ['Chief Intelligence Agent', 'Running', 'Radar scoring active'],
  ['Chief Brand Agent', 'Reviewing', 'Decision drafts ready'],
  ['Chief Story Agent', 'Drafting', 'Opportunity → Content'],
  ['Chief Archive Agent', 'Indexing', 'Graph schema online'],
];

function stageLabel(status: SunsetDeckEpisode['status']) {
  return { idea: 'Idea', script: 'Script', production: 'Production', review: 'Brand QA', approved: 'Approved' }[status];
}

export default function SunsetDeckHQ() {
  const [opportunities, setOpportunities] = useState<BrandOpportunity[]>(seedOpportunities);
  const [episodes, setEpisodes] = useState<SunsetDeckEpisode[]>(fallbackEpisodes);
  const [filter, setFilter] = useState<'All' | OpportunityStatus>('All');
  const [selectedId, setSelectedId] = useState(seedOpportunities[0].id);
  const [syncState, setSyncState] = useState<'loading' | 'cloud' | 'local' | 'saving' | 'error'>('loading');
  const [showCreate, setShowCreate] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const localOpps = localStorage.getItem('sunset-deck-opportunities');
      const localEpisodes = localStorage.getItem('sunset-deck-episodes');
      if (localOpps) try { setOpportunities(JSON.parse(localOpps)); } catch {}
      if (localEpisodes) try { setEpisodes(JSON.parse(localEpisodes)); } catch {}
      try {
        const [cloudOpps, cloudEpisodes] = await Promise.all([loadOpportunities(), loadCloudEpisodes()]);
        if (cancelled) return;
        if (cloudOpps?.length) setOpportunities(cloudOpps);
        if (cloudEpisodes?.length) setEpisodes(cloudEpisodes);
        setSyncState((hqCloudConfigured || cloudConfigured) ? 'cloud' : 'local');
      } catch { if (!cancelled) setSyncState('error'); }
    }
    hydrate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { localStorage.setItem('sunset-deck-opportunities', JSON.stringify(opportunities)); }, [opportunities]);
  useEffect(() => { localStorage.setItem('sunset-deck-episodes', JSON.stringify(episodes)); }, [episodes]);

  const visible = useMemo(() => filter === 'All' ? opportunities : opportunities.filter((item) => item.status === filter), [filter, opportunities]);
  const selected = opportunities.find((item) => item.id === selectedId) || visible[0] || opportunities[0];
  const activeOpportunities = opportunities.filter((item) => item.status === 'Act').length;
  const reviewCount = episodes.filter((item) => item.status === 'review').length;
  const avgProgress = episodes.length ? Math.round(episodes.reduce((sum, item) => sum + item.progress, 0) / episodes.length) : 0;
  const brandHealth = Math.round((Math.min(100, avgProgress) + Math.min(100, opportunities.reduce((sum, item) => sum + item.score, 0) / Math.max(opportunities.length, 1))) / 2);

  async function updateOpportunity(status: OpportunityStatus) {
    if (!selected) return;
    const updated = { ...selected, status, updatedAt: new Date().toISOString() };
    setOpportunities((current) => current.map((item) => item.id === updated.id ? updated : item));
    setSyncState('saving');
    try { await saveOpportunity(updated); setSyncState(hqCloudConfigured ? 'cloud' : 'local'); }
    catch { setSyncState('error'); }
  }

  async function addOpportunity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const item = createOpportunity({
      title: String(data.get('title') || ''), type: String(data.get('type') || 'Content') as OpportunityType,
      place: String(data.get('place') || 'Global'), whyNow: String(data.get('whyNow') || ''),
      nextAction: String(data.get('nextAction') || ''), status: 'Explore',
    });
    setOpportunities((current) => [item, ...current]);
    setSelectedId(item.id); setShowCreate(false); setSyncState('saving');
    try { await saveOpportunity(item); setSyncState(hqCloudConfigured ? 'cloud' : 'local'); }
    catch { setSyncState('error'); }
  }

  async function generateContent() {
    if (!selected) return;
    const nextId = episodes.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    const episode: SunsetDeckEpisode = {
      id: nextId, title: selected.title, subtitle: `From ${selected.place} to Today's Life`, series: selected.type === 'Culture' ? 'Unzen Stories' : selected.type === 'Technology' ? 'AI for Better Living' : 'Field Notes',
      status: 'idea', duration: '07:00', progress: 10, updated: 'たった今', hook: selected.whyNow,
      note: `Opportunity Radarから生成。次のアクション: ${selected.nextAction}`, publishState: 'not_ready', privacyStatus: 'private',
    };
    const nextEpisodes = [episode, ...episodes];
    setEpisodes(nextEpisodes); setMessage('Content Masterへ企画を生成しました。');
    const decision = { id: crypto.randomUUID(), title: `${selected.title}をコンテンツ資産化`, context: selected.whyNow, recommendation: selected.nextAction, status: 'draft' as const, opportunityId: selected.id, createdAt: new Date().toISOString() };
    try { await Promise.all([saveCloudEpisodes(nextEpisodes), saveDecision(decision)]); } catch { setSyncState('error'); }
    window.setTimeout(() => setMessage(''), 2400);
  }

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div><p className={styles.kicker}>SUNSET DECK</p><h1>HQ</h1><span>Brand Operating System</span></div>
        <nav>{['CEO DESK', 'Opportunity Radar', 'Content Master', 'Production', 'Brand DNA', 'Knowledge Graph', 'People / Places', 'Sound Library', 'AI Agent Center', 'Business HQ', 'Archive'].map((item, index) => <button key={item} className={index === 0 ? styles.activeNav : ''}>{item}<em>{index === 1 ? opportunities.length : index === 2 ? episodes.length : index === 8 ? '5' : ''}</em></button>)}</nav>
        <div className={styles.sidebarFooter}><p>NORTH STAR</p><strong>20年後のブランド価値を高めるか。</strong><Link href="/sunset-deck">Open Studio OS →</Link></div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.header}>
          <div><p className={styles.kicker}>LIVE BRAND SYSTEM · {syncState.toUpperCase()}</p><h2>CEO DESK</h2><span>Design a Life Worth Remembering.</span></div>
          <div className={styles.headerActions}><button>Morning Review</button><button className={styles.primary} onClick={() => setShowCreate(true)}>Create Opportunity</button></div>
        </header>

        {message && <div className={styles.toast}>{message}</div>}
        {showCreate && <form className={styles.createPanel} onSubmit={addOpportunity}><div><p className={styles.kicker}>NEW SIGNAL</p><h3>Opportunityを登録</h3></div><input name="title" required placeholder="機会のタイトル"/><select name="type" defaultValue="Content">{['Trend','Business','People','Place','Investment','Content','Sponsor','Collaboration','Technology','Culture'].map((type) => <option key={type}>{type}</option>)}</select><input name="place" placeholder="Place / Global"/><textarea name="whyNow" required placeholder="Why now"/><textarea name="nextAction" required placeholder="Next action"/><div><button type="button" onClick={() => setShowCreate(false)}>Cancel</button><button className={styles.primary}>Save</button></div></form>}

        <section className={styles.northStar}><div><p>TODAY'S NORTH STAR</p><h3>信頼を生む一次記録を、ひとつ残す。</h3></div><div><p>TODAY'S MISSION</p><strong>{selected ? selected.nextAction : '20年後にも残る資産を増やす。'}</strong></div></section>

        <section className={styles.metricGrid}>{[['Brand Health', String(brandHealth), `${activeOpportunities} opportunities require action`], ['Knowledge Assets', String(opportunities.length + episodes.length), 'Connected operating records'], ['Content Pipeline', String(episodes.length), `${reviewCount} need review`], ['Cloud State', syncState === 'cloud' ? 'Live' : 'Local', hqCloudConfigured ? 'Supabase connected' : 'Safe local fallback']].map(([label, value, note]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</section>

        <div className={styles.dashboardGrid}><section className={styles.panel}><div className={styles.panelHeader}><div><p>EXECUTIVE PRIORITIES</p><h3>Top Actions</h3></div><span>AI ranked</span></div><ol className={styles.actionList}>{opportunities.filter((item) => item.status === 'Act').sort((a,b) => b.score-a.score).slice(0,3).map((item,index) => <li key={item.id}><b>0{index+1}</b><div><strong>{item.nextAction}</strong><span>{item.title}</span></div><em>{item.score}</em></li>)}</ol></section><section className={styles.panel}><div className={styles.panelHeader}><div><p>AI RECOMMENDATION</p><h3>今、最も価値が高い判断</h3></div><span className={styles.live}>LIVE</span></div>{selected && <div className={styles.recommendation}><span>{selected.score} / 100</span><h4>{selected.title}</h4><p>{selected.whyNow}</p><button onClick={generateContent}>Decision Draft + Contentを生成 →</button></div>}</section></div>

        <section className={styles.panel}><div className={styles.panelHeader}><div><p>OPPORTUNITY RADAR</p><h3>意思決定候補</h3></div><div className={styles.filters}>{(['All','Act','Explore','Watch','Archive'] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? styles.filterActive : ''}>{item}</button>)}</div></div><div className={styles.radarGrid}><div className={styles.opportunityList}>{visible.map((item) => <button key={item.id} onClick={() => setSelectedId(item.id)} className={selected?.id === item.id ? styles.selectedOpportunity : ''}><span className={styles.score}>{item.score}</span><div><strong>{item.title}</strong><small>{item.type} · {item.place}</small></div><em>{item.status}</em></button>)}</div>{selected && <article className={styles.opportunityDetail}><p>WHY NOW</p><h4>{selected.title}</h4><span>{selected.whyNow}</span><hr/><p>NEXT ACTION</p><strong>{selected.nextAction}</strong><div className={styles.statusActions}>{(['Act','Explore','Watch','Archive'] as const).map((status) => <button key={status} onClick={() => updateOpportunity(status)}>{status}</button>)}</div><button onClick={generateContent}>企画書を生成</button></article>}</div></section>

        <div className={styles.dashboardGrid}><section className={styles.panel}><div className={styles.panelHeader}><div><p>CONTENT MASTER</p><h3>実データ制作資産</h3></div><Link href="/sunset-deck">Studio OS →</Link></div><div className={styles.contentList}>{episodes.slice(0,8).map((item) => <article key={item.id}><div><strong>{item.title}</strong><span>{item.series} · {stageLabel(item.status)}</span></div><div className={styles.progress}><i style={{ width: `${item.progress}%` }}/></div><b>{item.progress}%</b></article>)}</div></section><section className={styles.panel}><div className={styles.panelHeader}><div><p>AI AGENT CENTER</p><h3>Autonomous Activity</h3></div><span className={styles.live}>5 ACTIVE</span></div><div className={styles.agentList}>{agents.map(([name,state,output]) => <article key={name}><i/><div><strong>{name}</strong><span>{state}</span></div><b>{output}</b></article>)}</div></section></div>

        <section className={styles.brandStrip}><div><p>BRAND DNA</p><h3>Beautiful · Useful · Timeless · Human · Global · Trustworthy · Distinctive · Sustainable</h3></div><div><span>MISSION</span><strong>Design a Life Worth Remembering.</strong></div><div><span>ROLE</span><strong>Life Curator</strong></div></section>
      </section>
    </main>
  );
}
