import { NextRequest, NextResponse } from 'next/server';
import { createYouTubeUploadSession } from '@/lib/youtube-server';
import { decryptRefreshToken, YOUTUBE_TOKEN_COOKIE } from '@/lib/youtube-oauth-cookie';

export const runtime = 'nodejs';

type RequestBody = {
  title?: string;
  description?: string;
  tags?: string[];
  fileSize?: number;
  contentType?: string;
  scheduledAt?: string;
};

async function authenticate(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  const token = authorization?.replace(/^Bearer\s+/i, '').trim();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !supabaseUrl || !anonKey) return false;
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  return response.ok;
}

export async function POST(request: NextRequest) {
  if (!(await authenticate(request))) return NextResponse.json({ ok: false, error: '認証が必要です。' }, { status: 401 });
  const refreshToken = decryptRefreshToken(request.cookies.get(YOUTUBE_TOKEN_COOKIE)?.value);
  if (!refreshToken && !process.env.YOUTUBE_OAUTH_REFRESH_TOKEN?.trim()) {
    return NextResponse.json({ ok: false, error: 'YouTubeチャンネルを接続してください。' }, { status: 409 });
  }
  try {
    const body = await request.json() as RequestBody;
    const session = await createYouTubeUploadSession({
      title: body.title || '',
      description: body.description || '',
      tags: Array.isArray(body.tags) ? body.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      fileSize: Number(body.fileSize || 0),
      contentType: body.contentType || 'video/mp4',
      scheduledAt: body.scheduledAt,
      refreshToken: refreshToken || undefined,
    });
    return NextResponse.json({ ok: true, ...session });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'YouTubeアップロードの準備に失敗しました。';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
