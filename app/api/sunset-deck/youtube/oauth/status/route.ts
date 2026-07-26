import { NextRequest, NextResponse } from 'next/server';
import { decryptRefreshToken, YOUTUBE_TOKEN_COOKIE } from '@/lib/youtube-oauth-cookie';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const connected = Boolean(
    decryptRefreshToken(request.cookies.get(YOUTUBE_TOKEN_COOKIE)?.value) ||
    process.env.YOUTUBE_OAUTH_REFRESH_TOKEN?.trim()
  );
  return NextResponse.json({ connected });
}
