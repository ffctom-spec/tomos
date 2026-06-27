import type { IntegrationApiResponse } from "@/app/_lib/portal-types";

export const runtime = "nodejs";

const mockResponse: IntegrationApiResponse = {
  id: "youtube",
  name: "YouTube",
  ok: true,
  mode: "mock",
  message: "YOUTUBE_API_KEY / YOUTUBE_CHANNEL_ID 未設定のためmock syncを返しています。",
  checkedAt: new Date().toISOString(),
  metrics: {
    subscribers: 12400,
    viewsLast28Days: 84200,
    ctr: "4.8%",
    retention: "58%",
    topOpportunity: "ロストラータを太く育てる方法",
  },
  items: [
    { title: "0円でできる土壌改良", status: "title-ready", score: 91 },
    { title: "アガベの発根で失敗しない条件", status: "script-ready", score: 88 },
  ],
};

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return Response.json(mockResponse);
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 300 } },
    );

    if (!response.ok) {
      return Response.json({
        ...mockResponse,
        ok: false,
        mode: "live",
        message: `YouTube API connection failed: ${response.status}`,
        checkedAt: new Date().toISOString(),
      } satisfies IntegrationApiResponse);
    }

    const data: {
      items?: Array<{
        snippet?: { title?: string };
        statistics?: {
          subscriberCount?: string;
          viewCount?: string;
          videoCount?: string;
        };
      }>;
    } = await response.json();
    const channel = data.items?.[0];

    return Response.json({
      id: "youtube",
      name: "YouTube",
      ok: true,
      mode: "live",
      message: `${channel?.snippet?.title ?? "YouTube channel"} と接続しました。`,
      checkedAt: new Date().toISOString(),
      metrics: {
        subscribers: channel?.statistics?.subscriberCount ?? "unknown",
        totalViews: channel?.statistics?.viewCount ?? "unknown",
        videos: channel?.statistics?.videoCount ?? "unknown",
      },
      items: mockResponse.items,
    } satisfies IntegrationApiResponse);
  } catch (error) {
    return Response.json({
      ...mockResponse,
      ok: false,
      mode: "live",
      message: error instanceof Error ? error.message : "YouTube API connection failed",
      checkedAt: new Date().toISOString(),
    } satisfies IntegrationApiResponse);
  }
}
