const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const sessionKey = 'sunset-deck-auth-session';

export type SunsetDeckSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: {
    id: string;
    email?: string;
  };
};

export const authConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function authHeaders(): HeadersInit {
  return {
    apikey: supabaseAnonKey || '',
    Authorization: `Bearer ${supabaseAnonKey || ''}`,
    'Content-Type': 'application/json',
  };
}

function normalizeSession(payload: Record<string, unknown>): SunsetDeckSession {
  const user = payload.user as Record<string, unknown>;
  const expiresIn = Number(payload.expires_in || 3600);
  return {
    access_token: String(payload.access_token || ''),
    refresh_token: String(payload.refresh_token || ''),
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    user: {
      id: String(user?.id || ''),
      email: user?.email ? String(user.email) : undefined,
    },
  };
}

export function getStoredSession(): SunsetDeckSession | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(sessionKey);
  if (!stored) return null;
  try {
    const session = JSON.parse(stored) as SunsetDeckSession;
    return session.access_token && session.user?.id ? session : null;
  } catch {
    localStorage.removeItem(sessionKey);
    return null;
  }
}

export function getAccessToken(): string | null {
  return getStoredSession()?.access_token || null;
}

export function clearSession() {
  if (typeof window !== 'undefined') localStorage.removeItem(sessionKey);
}

function storeSession(session: SunsetDeckSession) {
  localStorage.setItem(sessionKey, JSON.stringify(session));
  return session;
}

export async function signInWithPassword(email: string, password: string): Promise<SunsetDeckSession> {
  if (!authConfigured) throw new Error('Supabase authentication is not configured.');
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(String(payload.msg || payload.error_description || 'ログインできませんでした。'));
  return storeSession(normalizeSession(payload));
}

export async function refreshSession(session: SunsetDeckSession): Promise<SunsetDeckSession> {
  if (!authConfigured) throw new Error('Supabase authentication is not configured.');
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) {
    clearSession();
    throw new Error('セッションの有効期限が切れました。');
  }
  return storeSession(normalizeSession(payload));
}

export async function ensureSession(): Promise<SunsetDeckSession | null> {
  const session = getStoredSession();
  if (!session) return null;
  const now = Math.floor(Date.now() / 1000);
  if (session.expires_at - now > 120) return session;
  return refreshSession(session);
}

export async function signOut() {
  const token = getAccessToken();
  if (token && authConfigured) {
    await fetch(`${supabaseUrl}/auth/v1/logout`, {
      method: 'POST',
      headers: { ...authHeaders(), Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }
  clearSession();
}
