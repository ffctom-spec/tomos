import { instagramAnalytics } from "@/app/_lib/portal-data";

export const runtime = "nodejs";

export async function GET() {
  // Production replacement point:
  // Use Meta Instagram Graph API with INSTAGRAM_BUSINESS_ACCOUNT_ID and
  // encrypted META_ACCESS_TOKEN stored server-side. Fetch account insights,
  // media insights, reach, impressions, saves, engagement, and top posts.
  return Response.json(instagramAnalytics);
}
