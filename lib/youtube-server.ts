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

export type ScheduleVideoInput = {
  videoId: string;
  scheduledAt: string;
};

export type PublishVideoInput = {
  videoId: string;
  privacyStatus: Exclude<YouTubePrivacy, 'private'>;
};

function requiredEnv(name: 'YOUTUBE_OAUTH_CLIENT_ID' | 'YOUTUBE_OAUTH_CLIENT_SECRET' | 'YOUTUBE_OAUTH_REFRESH_TOKEN') {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: requiredEnv('YOUTUBE_OAUTH_CLIENT_ID'),
    client_secret: requiredEnv('YOUTUBE_OAUTH_CLIENT_SECRET'),
    refresh_token: requiredEnv('YOUTUBE_OAUTH_REFRESH_TOKEN'),
    grant_type: 'refresh_token',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  const data = await response.json() as TokenResponse;
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || `OAuth token refresh failed (${response.status}).`);
  }
  return data.access_token;
}

async function updateVideoStatus(videoId: string, status: Record<string, unknown>) {
  const accessToken = await getAccessToken();
  const response = await fetch('https://www.googleapis.com/youtube/v3/videos?part=status', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: videoId, status }),
    cache: 'no-store',
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

  return updateVideoStatus(videoId, {
    privacyStatus: 'private',
    publishAt: scheduledDate.toISOString(),
  });
}

export async function publishYouTubeVideo(input: PublishVideoInput) {
  const videoId = input.videoId.trim();
  if (!/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) throw new Error('YouTube動画IDが正しくありません。');
  return updateVideoStatus(videoId, { privacyStatus: input.privacyStatus });
}
