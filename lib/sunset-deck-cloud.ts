export type SunsetDeckEpisode = {
  id: number;
  title: string;
  subtitle: string;
  series: string;
  status: 'idea' | 'script' | 'production' | 'review' | 'approved';
  duration: string;
  progress: number;
  updated: string;
  hook: string;
  note: string;
  previewUrl?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const studioId = process.env.NEXT_PUBLIC_SUNSET_DECK_STUDIO_ID || 'sunset-deck';

export const cloudConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function headers(prefer?: string): HeadersInit {
  return {
    apikey: supabaseAnonKey || '',
    Authorization: `Bearer ${supabaseAnonKey || ''}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

function fromRow(row: Record<string, unknown>): SunsetDeckEpisode {
  return {
    id: Number(row.episode_id),
    title: String(row.title || ''),
    subtitle: String(row.subtitle || ''),
    series: String(row.series || ''),
    status: row.status as SunsetDeckEpisode['status'],
    duration: String(row.duration || ''),
    progress: Number(row.progress || 0),
    updated: String(row.updated_label || ''),
    hook: String(row.hook || ''),
    note: String(row.note || ''),
    previewUrl: row.preview_url ? String(row.preview_url) : undefined,
  };
}

function toRow(episode: SunsetDeckEpisode) {
  return {
    studio_id: studioId,
    episode_id: episode.id,
    title: episode.title,
    subtitle: episode.subtitle,
    series: episode.series,
    status: episode.status,
    duration: episode.duration,
    progress: episode.progress,
    updated_label: episode.updated,
    hook: episode.hook,
    note: episode.note,
    preview_url: episode.previewUrl || null,
    updated_at: new Date().toISOString(),
  };
}

export async function loadCloudEpisodes(): Promise<SunsetDeckEpisode[] | null> {
  if (!cloudConfigured) return null;
  const url = `${supabaseUrl}/rest/v1/sunset_deck_episodes?studio_id=eq.${encodeURIComponent(studioId)}&select=*&order=episode_id.asc`;
  const response = await fetch(url, { headers: headers(), cache: 'no-store' });
  if (!response.ok) throw new Error(`Cloud load failed: ${response.status}`);
  const rows = (await response.json()) as Record<string, unknown>[];
  return rows.map(fromRow);
}

export async function saveCloudEpisodes(episodes: SunsetDeckEpisode[]): Promise<void> {
  if (!cloudConfigured) return;
  const url = `${supabaseUrl}/rest/v1/sunset_deck_episodes?on_conflict=studio_id,episode_id`;
  const response = await fetch(url, {
    method: 'POST',
    headers: headers('resolution=merge-duplicates,return=minimal'),
    body: JSON.stringify(episodes.map(toRow)),
  });
  if (!response.ok) throw new Error(`Cloud save failed: ${response.status}`);
}
