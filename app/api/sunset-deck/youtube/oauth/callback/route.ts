import { NextRequest, NextResponse } from 'next/server';
import { encryptRefreshToken, stateMatches, YOUTUBE_STATE_COOKIE, YOUTUBE_TOKEN_COOKIE } from '@/lib/youtube-oauth-cookie';

export const runtime = 'nodejs';

type TokenResponse = { refresh_token?: string; error?: string; error_description?: string };

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code') || '';
  const state = request.nextUrl.searchParams.get('state') || '';
  const expectedState = request.cookies.get(YOUTUBE_STATE_COOKIE)?.value;
  const destination = new URL('/sunset-deck/publishing', request.nextUrl.origin);

  if (!code || !stateMatches(expectedState, state)) {
    destination.searchParams.set('youtube', 'error');
    destination.searchParams.set('message', 'OAuth認証を確認できませんでした。');
    return NextResponse.redirect(destination);
  }

  const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    destination.searchParams.set('youtube', 'error');
    destination.searchParams.set('message', 'Google OAuth設定が不足しています。');
    return NextResponse.redirect(destination);
  }

  const redirectUri = new URL('/api/sunset-deck/youtube/oauth/callback', request.nextUrl.origin).toString();
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    cache: 'no-store',
  });
  const data = await response.json() as TokenResponse;

  if (!response.ok || !data.refresh_token) {
    destination.searchParams.set('youtube', 'error');
    destination.searchParams.set('message', data.error_description || data.error || 'リフレッシュトークンを取得できませんでした。');
    return NextResponse.redirect(destination);
  }

  const redirect = NextResponse.redirect(new URL('/sunset-deck/publishing?youtube=connected', request.nextUrl.origin));
  redirect.cookies.set(YOUTUBE_TOKEN_COOKIE, encryptRefreshToken(data.refresh_token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  redirect.cookies.delete(YOUTUBE_STATE_COOKIE);
  return redirect;
}
