'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createKnowledgeLink, loadOperations, operationsCloudConfigured, saveAgentRun, savePeoplePlace, saveProductionTask, saveSoundAsset, type AgentRun, type PeoplePlace, type ProductionTask, type SoundAsset, type TaskStatus } from '@/lib/sunset-deck-operations-cloud';
import styles from './operations.module.css';

type Tab = 'Graph'|'People / Places'|'Production'|'Sound Library'|'AI Agents';
const seedEntities:PeoplePlace[]=[
  {id:'seed-yugawa',entityType:'Place',name:'YUGAWA Residence',role:'Living Laboratory',location:'Yokohama',storyValue:'庭・建築・食・音・AIを統合するブランド原点',relationshipStatus:'trusted'},
  {id:'seed-unzen',entityType:'Place',name:'Unzen / Isahaya',role:'Cultural Root',location:'Nagasaki',storyValue:'食・発酵・家族史・土地の記憶',relationshipStatus:'active'},
];
const seedTasks:ProductionTask[]=[
  {id:'seed-task-1',title:'庭の施工前素材を撮影',taskType:'field capture',status:'doing',priority:1,assignedAgent:'Chief Story Agent'},
  {id:'seed-task-2',title:'Season 1ブランドQA',taskType:'brand review',status:'review',priority:1,assignedAgent:'Chief Brand Agent'},
];
const seedSounds:SoundAsset[]=[
  {id:'seed-sound-1',title:'Sunset Deck Theme 01',artist:'Original / AI-assisted',mood:'Warm, cinematic, reflective',bpm:78,usageType:'opening',licenseStatus:'owned',notes:'Season 1仮テーマ'},
];
const seedRuns:AgentRun[]=[
  {id:'seed-run-1',agentName:'Executive Orchestrator',runType:'Morning Review',status:'completed',input:{scope:'Brand OS'},output:{priorities:3},createdAt:new Date().toISOString()},
  {id:'seed-run-2',agentName:'Chief Archive Agent',runType:'Graph Indexing',status:'needs_approval',input:{scope:'YUGAWA Residence'},output:{nodes:12,edges:19},createdAt:new Date().toISOString()},
];

function readLocal<T>(key:string,fallback:T):T { try { const value=localStorage.getItem(key); return value?JSON.parse(value):fallback; } catch { return fallback; } }

export default function OperationsPage(){
  const [tab,setTab]=useState<Tab>('Graph');
  const [entities,setEntities]=useState<PeoplePlace[]>(seedEntities);
  const [tasks,setTasks]=useState<ProductionTask[]>(seedTasks);
  const [sounds,setSounds]=useState<SoundAsset[]>(seedSounds);
  const [runs,setRuns]=useState<AgentRun[]>(seedRuns);
  const [nodes,setNodes]=useState<Record<string,unknown>[]>([]);
  const [edges,setEdges]=useState<Record<string,unknown>[]>([]);
  const [sync,setSync]=useState<'loading'|'cloud'|'local'|'saving'|'error'>('loading');

  useEffect(()=>{ let cancelled=false; async function hydrate(){
    setEntities(readLocal('sd-entities',seedEntities)); setTasks(readLocal('sd-tasks',seedTasks)); setSounds(readLocal('sd-sounds',seedSounds)); setRuns(readLocal('sd-runs',seedRuns));
    try { const data=await loadOperations(); if(cancelled)return; if(data){ if(data.entities.length)setEntities(data.entities); if(data.tasks.length)setTasks(data.tasks); if(data.sounds.length)setSounds(data.sounds); if(data.runs.length)setRuns(data.runs); setNodes(data.nodes); setEdges(data.edges); } setSync(operationsCloudConfigured?'cloud':'local'); } catch { setSync('error'); }
  } hydrate(); return()=>{cancelled=true}; },[]);
  useEffect(()=>localStorage.setItem('sd-entities',JSON.stringify(entities)),[entities]);
  useEffect(()=>localStorage.setItem('sd-tasks',JSON.stringify(tasks)),[tasks]);
  useEffect(()=>localStorage.setItem('sd-sounds',JSON.stringify(sounds)),[sounds]);
  useEffect(()=>localStorage.setItem('sd-runs',JSON.stringify(runs)),[runs]);

  const graphNodes=useMemo(()=>[
    ...entities.map(item=>({id:item.id,title:item.name,type:item.entityType,detail:item.storyValue})),
    ...tasks.map(item=>({id:item.id,title:item.title,type:'Task',detail:item.assignedAgent})),
    ...sounds.map(item=>({id:item.id,title:item.title,type:'Sound',detail:item.mood})),
  ],[entities,tasks,sounds]);

  async function createEntity(e:FormEvent<HTMLFormElement>){e.preventDefault();const d=new FormData(e.currentTarget);const item:PeoplePlace={id:crypto.randomUUID(),entityType:String(d.get('type')) as PeoplePlace['entityType'],name:String(d.get('name')),role:String(d.get('role')),location:String(d.get('location')),storyValue:String(d.get('story')),relationshipStatus:'discovered'};setEntities(v=>[item,...v]);e.currentTarget.reset();setSync('saving');try{await savePeoplePlace(item);await createKnowledgeLink({type:item.entityType,title:item.name,summary:item.storyValue},{type:'Brand',title:'SUNSET DECK',summary:'Life Design Company'},'contributes_to');setSync(operationsCloudConfigured?'cloud':'local')}catch{setSync('error')}}
  async function createTask(e:FormEvent<HTMLFormElement>){e.preventDefault();const d=new FormData(e.currentTarget);const item:ProductionTask={id:crypto.randomUUID(),title:String(d.get('title')),taskType:String(d.get('taskType')),status:'backlog',priority:Number(d.get('priority')||3),assignedAgent:String(d.get('agent'))};setTasks(v=>[item,...v]);e.currentTarget.reset();try{await saveProductionTask(item)}catch{setSync('error')}}
  async function moveTask(item:ProductionTask,status:TaskStatus){const next={...item,status};setTasks(v=>v.map(x=>x.id===item.id?next:x));try{await saveProductionTask(next)}catch{setSync('error')}}
  async function createSound(e:FormEvent<HTMLFormElement>){e.preventDefault();const d=new FormData(e.currentTarget);const item:SoundAsset={id:crypto.randomUUID(),title:String(d.get('title')),artist:String(d.get('artist')),mood:String(d.get('mood')),bpm:Number(d.get('bpm')||0)||undefined,usageType:String(d.get('usage')),licenseStatus:String(d.get('license')) as SoundAsset['licenseStatus'],notes:String(d.get('notes'))};setSounds(v=>[item,...v]);e.currentTarget.reset();try{await saveSoundAsset(item)}catch{setSync('error')}}
  async function runAgent(name:string,runType:string){const item:AgentRun={id:crypto.randomUUID(),agentName:name,runType,status:'running',input:{source:'manual'},output:{},createdAt:new Date().toISOString()};setRuns(v=>[item,...v]);await saveAgentRun(item).catch(()=>setSync('error'));window.setTimeout(async()=>{const done={...item,status:'needs_approval' as const,output:{summary:`${runType} completed`,generatedAt:new Date().toISOString()}};setRuns(v=>v.map(x=>x.id===item.id?done:x));await saveAgentRun(done).catch(()=>setSync('error'));},900)}

  return <main className={styles.shell}>
    <aside className={styles.sidebar}><div><p>SUNSET DECK</p><h1>OPS</h1><span>Brand OS v2</span></div><nav>{(['Graph','People / Places','Production','Sound Library','AI Agents'] as Tab[]).map(item=><button key={item} onClick={()=>setTab(item)} className={tab===item?styles.active:''}>{item}</button>)}</nav><Link href="/sunset-deck/hq">← CEO Desk</Link></aside>
    <section className={styles.workspace}><header><div><p>LIVE OPERATING LAYER · {sync.toUpperCase()}</p><h2>{tab}</h2><span>Everything becomes a reusable brand asset.</span></div><div className={styles.metrics}><b>{graphNodes.length}</b><small>nodes</small><b>{tasks.filter(x=>x.status!=='done').length}</b><small>open tasks</small><b>{runs.filter(x=>x.status==='needs_approval').length}</b><small>approvals</small></div></header>

    {tab==='Graph'&&<section className={styles.graph}><div className={styles.graphCanvas}>{graphNodes.map((node,index)=><article key={node.id} className={styles.node} style={{transform:`translate(${(index%4)*12}px,${Math.floor(index/4)*8}px)`}}><small>{node.type}</small><strong>{node.title}</strong><span>{node.detail}</span></article>)}</div><aside><h3>Knowledge Graph</h3><p>People、Place、Task、Soundをブランド資産として接続します。クラウド上のノードは {nodes.length}、エッジは {edges.length} 件です。</p><ul><li>SUNSET DECK → YUGAWA Residence</li><li>YUGAWA Residence → Garden Stories</li><li>Unzen → Food / Culture / Family History</li></ul></aside></section>}

    {tab==='People / Places'&&<><form className={styles.form} onSubmit={createEntity}><select name="type"><option>Person</option><option>Place</option><option>Organization</option></select><input name="name" required placeholder="Name"/><input name="role" placeholder="Role / Meaning"/><input name="location" placeholder="Location"/><textarea name="story" required placeholder="Why this matters to the brand"/><button>Add entity</button></form><div className={styles.cards}>{entities.map(item=><article key={item.id}><small>{item.entityType} · {item.location}</small><h3>{item.name}</h3><b>{item.role}</b><p>{item.storyValue}</p><em>{item.relationshipStatus}</em></article>)}</div></>}

    {tab==='Production'&&<><form className={styles.form} onSubmit={createTask}><input name="title" required placeholder="Task"/><input name="taskType" placeholder="Task type"/><select name="priority"><option value="1">P1</option><option value="2">P2</option><option value="3">P3</option><option value="4">P4</option><option value="5">P5</option></select><select name="agent"><option>Executive Orchestrator</option><option>Chief Story Agent</option><option>Chief Brand Agent</option><option>Chief Archive Agent</option></select><button>Add task</button></form><div className={styles.board}>{(['backlog','ready','doing','review','done','blocked'] as TaskStatus[]).map(status=><section key={status}><h3>{status.toUpperCase()}</h3>{tasks.filter(x=>x.status===status).map(item=><article key={item.id}><small>P{item.priority} · {item.taskType}</small><strong>{item.title}</strong><span>{item.assignedAgent}</span><select value={item.status} onChange={e=>moveTask(item,e.target.value as TaskStatus)}>{(['backlog','ready','doing','review','done','blocked'] as TaskStatus[]).map(s=><option key={s}>{s}</option>)}</select></article>)}</section>)}</div></>}

    {tab==='Sound Library'&&<><form className={styles.form} onSubmit={createSound}><input name="title" required placeholder="Track title"/><input name="artist" placeholder="Artist / Source"/><input name="mood" required placeholder="Mood"/><input name="bpm" type="number" placeholder="BPM"/><input name="usage" placeholder="Usage"/><select name="license"><option>research</option><option>cleared</option><option>owned</option><option>restricted</option></select><textarea name="notes" placeholder="Notes"/><button>Add sound</button></form><div className={styles.cards}>{sounds.map(item=><article key={item.id}><small>{item.licenseStatus} · {item.bpm||'—'} BPM</small><h3>{item.title}</h3><b>{item.artist}</b><p>{item.mood}</p><em>{item.usageType}</em></article>)}</div></>}

    {tab==='AI Agents'&&<><div className={styles.agentActions}>{[['Executive Orchestrator','Morning Review'],['Chief Intelligence Agent','Opportunity Scan'],['Chief Brand Agent','Brand QA'],['Chief Story Agent','Story Draft'],['Chief Archive Agent','Graph Indexing']].map(([name,type])=><button key={name} onClick={()=>runAgent(name,type)}><strong>{name}</strong><span>Run {type}</span></button>)}</div><div className={styles.runList}>{runs.map(run=><article key={run.id}><i className={styles[run.status]}/><div><strong>{run.agentName}</strong><span>{run.runType} · {new Date(run.createdAt).toLocaleString('ja-JP')}</span></div><b>{run.status}</b><pre>{JSON.stringify(run.output)}</pre></article>)}</div></>}
    </section>
  </main>
}
