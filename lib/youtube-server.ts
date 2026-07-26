type YouTubePrivacy = 'private' | 'unlisted' | 'public';

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

type YouTubeErrorBody = {
  error?: {
    code?: number;
    message?: string;
    errors?: Array<{ reason?: string; message?: string }>;
  };
};

export type ScheduleVideoInput = { videoId: string; scheduledAt: string; refreshToken?: string };
export type PublishVideoInput = { videoId: string; privacyStatus: Exclude<YouTubePrivacy, 'private'>; refreshToken?: string };
export type CreateUploadInput = {
  title: string;
  description: string;
  tags: string[];
  fileSize: number;
  contentType: string;
  scheduledAt?: string;
  refreshToken?: string;
};

function requiredEnv(name: 'YOUTUBE_OAUTH_CLIENT_ID' | 'YOUTUBE_OAUTH_CLIENT_SECRET') {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export async function getYouTubeAccessToken(refreshToken?: string) {
  const token = refreshToken?.trim() || process.env.YOUTUBE_OAUTH_REFRESH_TOKEN?.trim();
  if (!token) throw new Error('YouTubeチャンネルが接続されていません。');
  const body = new URLSearchParams({
    client_id: requiredEnv('YOUTUBE_OAUTH_CLIENT_ID'),
    client_secret: requiredEnv('YOUTUBE_OAUTH_CLIENT_SECRET'),
    refresh_token: token,
    grant_type: 'refresh_token',
  });
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body, cache: 'no-store',
  });
  const data = await response.json() as TokenResponse;
  if (!response.ok || !data.access_token) throw new Error(data.error_description || data.error || `OAuth token refresh failed (${response.status}).`);
  return data.access_token;
}

export async function createYouTubeUploadSession(input: CreateUploadInput) {
  if (!input.title.trim()) throw new Error('動画タイトルを入力してください。');
  if (!Number.isFinite(input.fileSize) || input.fileSize <= 0) throw new Error('動画ファイルが正しくありません。');
  const accessToken = await getYouTubeAccessToken(input.refreshToken);
  const status: Record<string, unknown> = { privacyStatus: 'private', selfDeclaredMadeForKids: false };
  if (input.scheduledAt) {
    const scheduled = new Date(input.scheduledAt);
    if (Number.isNaN(scheduled.getTime()) || scheduled.getTime() <= Date.now() + 60_000) throw new Error('公開予約日時は現在より1分以上先に設定してください。');
    status.publishAt = scheduled.toISOString();
  }
  const response = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Length': String(input.fileSize),
      'X-Upload-Content-Type': input.contentType || 'video/mp4',
    },
    body: JSON.stringify({ snippet: { title: input.title.trim(), description: input.description.trim(), tags: input.tags.slice(0, 30), categoryId: '22' }, status }),
    cache: 'no-store',
  });
  const error = await response.clone().json().catch(() => ({})) as YouTubeErrorBody;
  const uploadUrl = response.headers.get('location');
  if (!response.ok || !uploadUrl) throw new Error(error.error?.message || `YouTube upload session failed (${response.status}).`);
  return { uploadUrl, accessToken };
}

async function updateVideoStatus(videoId: string, status: Record<string, unknown>, refreshToken?: string) {
  const accessToken = await getYouTubeAccessToken(refreshToken);
  const response = await fetch('https://www.googleapis.com/youtube/v3/videos?part=status', {
    method: 'PUT', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: videoId, status }), cache: 'no-store',
  });
  const data = await response.json() as YouTubeErrorBody & Record<string, unknown>;
  if (!response.ok) {
    const reason = data.error?.errors?.[0]?.reason;
    throw new Error([reason, data.error?.message].filter(Boolean).join(': ') || `YouTube update failed (${response.status}).`);
  }
  return data;
}

export async function scheduleYouTubeVideo(input: ScheduleVideoInput) {
  const videoId = input.videoId.trim();
  if (!/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) throw new Error('YouTube動画IDが正しくありません。');
  const scheduledDate = new Date(input.scheduledAt);
  if (Number.isNaN(scheduledDate.getTime())) throw new Error('公開予約日時が正しくありません。');
  if (scheduledDate.getTime() <= Date.now() + 60_000) throw new Error('公開予約日時は現在より1分以上先に設定してください。');
  return updateVideoStatus(videoId, { privacyStatus: 'private', publishAt: scheduledDate.toISOString() }, input.refreshToken);
}

export async function publishYouTubeVideo(input: PublishVideoInput) {
  const videoId = input.videoId.trim();
  if (!/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) throw new Error('YouTube動画IDが正しくありません。');
  return updateVideoStatus(videoId, { privacyStatus: input.privacyStatus }, input.refreshToken);
}
