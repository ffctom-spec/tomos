import { NextRequest, NextResponse } from 'next/server';
import { publishYouTubeVideo, scheduleYouTubeVideo } from '@/lib/youtube-server';
import { decryptRefreshToken, YOUTUBE_TOKEN_COOKIE } from '@/lib/youtube-oauth-cookie';

export const runtime = 'nodejs';

type RequestBody = {
  action?: 'schedule' | 'publish_now';
  videoId?: string;
  scheduledAt?: string;
  privacyStatus?: 'public' | 'unlisted';
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

  let body: RequestBody;
  try { body = await request.json() as RequestBody; }
  catch { return NextResponse.json({ ok: false, error: 'リクエスト形式が正しくありません。' }, { status: 400 }); }

  try {
    if (body.action === 'schedule') {
      if (!body.videoId || !body.scheduledAt) throw new Error('動画IDと公開予約日時を入力してください。');
      const video = await scheduleYouTubeVideo({ videoId: body.videoId, scheduledAt: body.scheduledAt, refreshToken: refreshToken || undefined });
      return NextResponse.json({ ok: true, action: 'scheduled', video });
    }
    if (body.action === 'publish_now') {
      if (!body.videoId || !body.privacyStatus) throw new Error('動画IDと公開範囲を入力してください。');
      const video = await publishYouTubeVideo({ videoId: body.videoId, privacyStatus: body.privacyStatus, refreshToken: refreshToken || undefined });
      return NextResponse.json({ ok: true, action: 'published', video });
    }
    return NextResponse.json({ ok: false, error: '未対応の操作です。' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'YouTube APIの操作に失敗しました。';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
