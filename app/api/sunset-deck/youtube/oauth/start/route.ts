import { NextRequest, NextResponse } from 'next/server';
import { createOAuthState, YOUTUBE_STATE_COOKIE } from '@/lib/youtube-oauth-cookie';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID?.trim();
  if (!clientId) return NextResponse.json({ error: 'YOUTUBE_OAUTH_CLIENT_ID is not configured.' }, { status: 500 });

  const state = createOAuthState();
  const redirectUri = new URL('/api/sunset-deck/youtube/oauth/callback', request.nextUrl.origin).toString();
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.force-ssl');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  url.searchParams.set('include_granted_scopes', 'true');
  url.searchParams.set('state', state);

  const response = NextResponse.redirect(url);
  response.cookies.set(YOUTUBE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  return response;
}
