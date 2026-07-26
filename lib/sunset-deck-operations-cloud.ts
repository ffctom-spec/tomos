import { getAccessToken, getStoredSession } from '@/lib/sunset-deck-auth';

export type EntityType = 'Person' | 'Place' | 'Organization';
export type RelationshipStatus = 'discovered' | 'active' | 'trusted' | 'archive';
export type TaskStatus = 'backlog' | 'ready' | 'doing' | 'review' | 'done' | 'blocked';
export type AgentRunStatus = 'queued' | 'running' | 'needs_approval' | 'completed' | 'failed';

export type PeoplePlace = { id:string; entityType:EntityType; name:string; role:string; location:string; storyValue:string; relationshipStatus:RelationshipStatus; };
export type ProductionTask = { id:string; title:string; taskType:string; status:TaskStatus; priority:number; assignedAgent:string; episodeId?:number; opportunityId?:string; dueAt?:string; outputUrl?:string; };
export type SoundAsset = { id:string; title:string; artist:string; mood:string; bpm?:number; usageType:string; licenseStatus:'research'|'cleared'|'owned'|'restricted'; sourceUrl?:string; notes:string; };
export type AgentRun = { id:string; agentName:string; runType:string; status:AgentRunStatus; input:Record<string,unknown>; output:Record<string,unknown>; relatedEntityType?:string; relatedEntityId?:string; createdAt:string; };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const studioId = process.env.NEXT_PUBLIC_SUNSET_DECK_STUDIO_ID || 'sunset-deck';
export const operationsCloudConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function headers(prefer?: string): HeadersInit {
  const token = getAccessToken();
  return { apikey: supabaseAnonKey || '', Authorization: `Bearer ${token || supabaseAnonKey || ''}`, 'Content-Type':'application/json', ...(prefer ? { Prefer: prefer } : {}) };
}
function ownerId() { const id = getStoredSession()?.user.id; if (!id) throw new Error('Authentication required.'); return id; }
async function loadTable(table:string) {
  if (!operationsCloudConfigured || !getAccessToken()) return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?studio_id=eq.${encodeURIComponent(studioId)}&select=*&order=created_at.desc`, { headers:headers(), cache:'no-store' });
  if (!response.ok) throw new Error(`${table} load failed: ${response.status}`);
  return response.json() as Promise<Record<string,unknown>[]>;
}
async function saveRow(table:string, row:Record<string,unknown>) {
  if (!operationsCloudConfigured || !getAccessToken()) return;
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?on_conflict=id`, { method:'POST', headers:headers('resolution=merge-duplicates,return=minimal'), body:JSON.stringify({ studio_id:studioId, owner_id:ownerId(), ...row, updated_at:new Date().toISOString() }) });
  if (!response.ok) throw new Error(`${table} save failed: ${response.status}`);
}

export async function loadOperations() {
  const [entities,tasks,sounds,runs,nodes,edges] = await Promise.all([
    loadTable('sunset_deck_people_places'), loadTable('sunset_deck_production_tasks'), loadTable('sunset_deck_sound_assets'), loadTable('sunset_deck_agent_runs'), loadTable('sunset_deck_knowledge_nodes'), loadTable('sunset_deck_knowledge_edges')
  ]);
  if (!entities && !tasks && !sounds && !runs) return null;
  return {
    entities:(entities||[]).map(r=>({ id:String(r.id), entityType:r.entity_type as EntityType, name:String(r.name||''), role:String(r.role||''), location:String(r.location||''), storyValue:String(r.story_value||''), relationshipStatus:r.relationship_status as RelationshipStatus })),
    tasks:(tasks||[]).map(r=>({ id:String(r.id), title:String(r.title||''), taskType:String(r.task_type||''), status:r.status as TaskStatus, priority:Number(r.priority||3), assignedAgent:String(r.assigned_agent||''), episodeId:r.episode_id?Number(r.episode_id):undefined, opportunityId:r.opportunity_id?String(r.opportunity_id):undefined, dueAt:r.due_at?String(r.due_at):undefined, outputUrl:r.output_url?String(r.output_url):undefined })),
    sounds:(sounds||[]).map(r=>({ id:String(r.id), title:String(r.title||''), artist:String(r.artist||''), mood:String(r.mood||''), bpm:r.bpm?Number(r.bpm):undefined, usageType:String(r.usage_type||''), licenseStatus:r.license_status as SoundAsset['licenseStatus'], sourceUrl:r.source_url?String(r.source_url):undefined, notes:String(r.notes||'') })),
    runs:(runs||[]).map(r=>({ id:String(r.id), agentName:String(r.agent_name||''), runType:String(r.run_type||''), status:r.status as AgentRunStatus, input:(r.input||{}) as Record<string,unknown>, output:(r.output||{}) as Record<string,unknown>, relatedEntityType:r.related_entity_type?String(r.related_entity_type):undefined, relatedEntityId:r.related_entity_id?String(r.related_entity_id):undefined, createdAt:String(r.created_at||'') })),
    nodes:nodes||[], edges:edges||[]
  };
}

export const savePeoplePlace = (item:PeoplePlace) => saveRow('sunset_deck_people_places',{ id:item.id, entity_type:item.entityType, name:item.name, role:item.role, location:item.location, story_value:item.storyValue, relationship_status:item.relationshipStatus });
export const saveProductionTask = (item:ProductionTask) => saveRow('sunset_deck_production_tasks',{ id:item.id, title:item.title, task_type:item.taskType, status:item.status, priority:item.priority, assigned_agent:item.assignedAgent, episode_id:item.episodeId||null, opportunity_id:item.opportunityId||null, due_at:item.dueAt||null, output_url:item.outputUrl||null });
export const saveSoundAsset = (item:SoundAsset) => saveRow('sunset_deck_sound_assets',{ id:item.id, title:item.title, artist:item.artist, mood:item.mood, bpm:item.bpm||null, usage_type:item.usageType, license_status:item.licenseStatus, source_url:item.sourceUrl||null, notes:item.notes });
export const saveAgentRun = (item:AgentRun) => saveRow('sunset_deck_agent_runs',{ id:item.id, agent_name:item.agentName, run_type:item.runType, status:item.status, input:item.input, output:item.output, related_entity_type:item.relatedEntityType||null, related_entity_id:item.relatedEntityId||null, created_at:item.createdAt, started_at:item.status==='running'?new Date().toISOString():null, completed_at:item.status==='completed'?new Date().toISOString():null });

export async function createKnowledgeLink(source:{type:string;title:string;summary:string}, target:{type:string;title:string;summary:string}, relationship:string) {
  if (!operationsCloudConfigured || !getAccessToken()) return;
  const sourceId=crypto.randomUUID(), targetId=crypto.randomUUID();
  await Promise.all([
    saveRow('sunset_deck_knowledge_nodes',{ id:sourceId,node_type:source.type,title:source.title,summary:source.summary,metadata:{} }),
    saveRow('sunset_deck_knowledge_nodes',{ id:targetId,node_type:target.type,title:target.title,summary:target.summary,metadata:{} })
  ]);
  await saveRow('sunset_deck_knowledge_edges',{ id:crypto.randomUUID(),source_node_id:sourceId,target_node_id:targetId,relationship,weight:1 });
}
