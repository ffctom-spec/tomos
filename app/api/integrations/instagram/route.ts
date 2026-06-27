import { instagramAnalytics } from "@/app/_lib/portal-data";
import type { IntegrationApiResponse } from "@/app/_lib/portal-types";

export const runtime = "nodejs";

export async function GET() {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  // Production replacement point:
  // Store Meta tokens encrypted server-side per user, refresh tokens safely,
  // then fetch Instagram Graph API media/account insights for the signed-in user.
  if (!accessToken || !accountId) {
    return Response.json({
      ...instagramAnalytics,
      integration: {
        id: "instagram",
        name: "Instagram",
        ok: true,
        mode: "mock",
        message: "META_ACCESS_TOKEN / INSTAGRAM_BUSINESS_ACCOUNT_ID 未設定のためmock syncを返しています。",
        checkedAt: new Date().toISOString(),
        metrics: {
          followers: instagramAnalytics.followers,
          reach: instagramAnalytics.reach,
          impressions: instagramAnalytics.impressions,
          saves: instagramAnalytics.saves,
        },
      } satisfies IntegrationApiResponse,
    });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${accountId}?fields=username,followers_count,media_count&access_token=${accessToken}`,
      { next: { revalidate: 300 } },
    );

    if (!response.ok) {
      return Response.json({
        ...instagramAnalytics,
        connectionStatus: "disconnected",
        integration: {
          id: "instagram",
          name: "Instagram",
          ok: false,
          mode: "live",
          message: `Instagram Graph API connection failed: ${response.status}`,
          checkedAt: new Date().toISOString(),
        } satisfies IntegrationApiResponse,
      });
    }

    const data: {
      username?: string;
      followers_count?: number;
      media_count?: number;
    } = await response.json();

    return Response.json({
      ...instagramAnalytics,
      connectionStatus: "connected",
      account: data.username ? `@${data.username}` : instagramAnalytics.account,
      followers: data.followers_count ?? instagramAnalytics.followers,
      lastSync: new Date().toISOString(),
      integration: {
        id: "instagram",
        name: "Instagram",
        ok: true,
        mode: "live",
        message: "Instagram Graph APIへ接続しました。",
        checkedAt: new Date().toISOString(),
        metrics: {
          followers: data.followers_count ?? "unknown",
          mediaCount: data.media_count ?? "unknown",
        },
      } satisfies IntegrationApiResponse,
    });
  } catch (error) {
    return Response.json({
      ...instagramAnalytics,
      connectionStatus: "disconnected",
      integration: {
        id: "instagram",
        name: "Instagram",
        ok: false,
        mode: "live",
        message:
          error instanceof Error
            ? error.message
            : "Instagram Graph API connection failed",
        checkedAt: new Date().toISOString(),
      } satisfies IntegrationApiResponse,
    });
  }
}
