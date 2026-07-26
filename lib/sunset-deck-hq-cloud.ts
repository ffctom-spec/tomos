import { getAccessToken, getStoredSession } from '@/lib/sunset-deck-auth';

export type OpportunityStatus = 'Act' | 'Explore' | 'Watch' | 'Archive' | 'Ignore';
export type OpportunityType = 'Trend' | 'Business' | 'People' | 'Place' | 'Investment' | 'Content' | 'Sponsor' | 'Collaboration' | 'Technology' | 'Culture';

export type BrandOpportunity = {
  id: string;
  title: string;
  type: OpportunityType;
  status: OpportunityStatus;
  place: string;
  whyNow: string;
  nextAction: string;
  brandFit: number;
  strategicValue: number;
  contentPotential: number;
  revenuePotential: number;
  timing: number;
  confidence: number;
  effort: number;
  risk: number;
  longTermAssetValue: number;
  score: number;
  createdAt: string;
  updatedAt: string;
};

export type BrandDecision = {
  id: string;
  title: string;
  context: string;
  recommendation: string;
  status: 'draft' | 'approved' | 'rejected';
  opportunityId?: string;
  createdAt: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const studioId = process.env.NEXT_PUBLIC_SUNSET_DECK_STUDIO_ID || 'sunset-deck';

export const hqCloudConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function headers(prefer?: string): HeadersInit {
  const accessToken = getAccessToken();
  return {
    apikey: supabaseAnonKey || '',
    Authorization: `Bearer ${accessToken || supabaseAnonKey || ''}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

function scoreOpportunity(item: Omit<BrandOpportunity, 'score' | 'id' | 'createdAt' | 'updatedAt'>) {
  const upside = item.brandFit * 1.5 + item.strategicValue * 1.4 + item.contentPotential + item.revenuePotential + item.timing + item.confidence + item.longTermAssetValue * 1.6;
  const drag = item.effort * .7 + item.risk;
  return Math.max(0, Math.min(100, Math.round((upside - drag) / 7)));
}

export function createOpportunity(input: Partial<BrandOpportunity> & Pick<BrandOpportunity, 'title' | 'type' | 'whyNow' | 'nextAction'>): BrandOpportunity {
  const now = new Date().toISOString();
  const base = {
    status: input.status || 'Explore',
    place: input.place || 'Global',
    brandFit: input.brandFit ?? 8,
    strategicValue: input.strategicValue ?? 8,
    contentPotential: input.contentPotential ?? 8,
    revenuePotential: input.revenuePotential ?? 5,
    timing: input.timing ?? 7,
    confidence: input.confidence ?? 7,
    effort: input.effort ?? 5,
    risk: input.risk ?? 3,
    longTermAssetValue: input.longTermAssetValue ?? 8,
    title: input.title,
    type: input.type,
    whyNow: input.whyNow,
    nextAction: input.nextAction,
  };
  return { ...base, id: crypto.randomUUID(), score: scoreOpportunity(base), createdAt: now, updatedAt: now };
}

function fromOpportunityRow(row: Record<string, unknown>): BrandOpportunity {
  return {
    id: String(row.id), title: String(row.title || ''), type: row.type as OpportunityType,
    status: row.status as OpportunityStatus, place: String(row.place || 'Global'),
    whyNow: String(row.why_now || ''), nextAction: String(row.next_action || ''),
    brandFit: Number(row.brand_fit || 0), strategicValue: Number(row.strategic_value || 0),
    contentPotential: Number(row.content_potential || 0), revenuePotential: Number(row.revenue_potential || 0),
    timing: Number(row.timing || 0), confidence: Number(row.confidence || 0), effort: Number(row.effort || 0),
    risk: Number(row.risk || 0), longTermAssetValue: Number(row.long_term_asset_value || 0), score: Number(row.score || 0),
    createdAt: String(row.created_at || ''), updatedAt: String(row.updated_at || ''),
  };
}

function toOpportunityRow(item: BrandOpportunity) {
  const userId = getStoredSession()?.user.id;
  if (!userId) throw new Error('Authentication required.');
  return {
    id: item.id, studio_id: studioId, owner_id: userId, title: item.title, type: item.type, status: item.status,
    place: item.place, why_now: item.whyNow, next_action: item.nextAction, brand_fit: item.brandFit,
    strategic_value: item.strategicValue, content_potential: item.contentPotential, revenue_potential: item.revenuePotential,
    timing: item.timing, confidence: item.confidence, effort: item.effort, risk: item.risk,
    long_term_asset_value: item.longTermAssetValue, score: item.score, created_at: item.createdAt, updated_at: new Date().toISOString(),
  };
}

export async function loadOpportunities(): Promise<BrandOpportunity[] | null> {
  if (!hqCloudConfigured || !getAccessToken()) return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/sunset_deck_opportunities?studio_id=eq.${encodeURIComponent(studioId)}&select=*&order=score.desc`, { headers: headers(), cache: 'no-store' });
  if (!response.ok) throw new Error(`Opportunity load failed: ${response.status}`);
  return ((await response.json()) as Record<string, unknown>[]).map(fromOpportunityRow);
}

export async function saveOpportunity(item: BrandOpportunity): Promise<void> {
  if (!hqCloudConfigured || !getAccessToken()) return;
  const response = await fetch(`${supabaseUrl}/rest/v1/sunset_deck_opportunities?on_conflict=id`, {
    method: 'POST', headers: headers('resolution=merge-duplicates,return=minimal'), body: JSON.stringify(toOpportunityRow(item)),
  });
  if (!response.ok) throw new Error(`Opportunity save failed: ${response.status}`);
}

export async function saveDecision(decision: BrandDecision): Promise<void> {
  if (!hqCloudConfigured || !getAccessToken()) return;
  const userId = getStoredSession()?.user.id;
  if (!userId) return;
  const response = await fetch(`${supabaseUrl}/rest/v1/sunset_deck_decisions?on_conflict=id`, {
    method: 'POST', headers: headers('resolution=merge-duplicates,return=minimal'),
    body: JSON.stringify({ id: decision.id, studio_id: studioId, owner_id: userId, title: decision.title, context: decision.context, recommendation: decision.recommendation, status: decision.status, opportunity_id: decision.opportunityId || null, created_at: decision.createdAt }),
  });
  if (!response.ok) throw new Error(`Decision save failed: ${response.status}`);
}
