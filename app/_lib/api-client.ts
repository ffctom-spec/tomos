import {
  activityTimeline,
  aiEngines,
  approvalItems,
  broadcastIdeas,
  commerceAnalytics,
  contentReview,
  decisionLogs,
  executiveBrief,
  instagramAnalytics,
  integrationStatuses,
  knowledgeVaultItems,
  productOpportunities,
  snsHealth,
  systemHealth,
  automationRules,
  userBrands,
} from "@/app/_lib/portal-data";
import type {
  AiReviewRequest,
  AiReviewResponse,
  CreativeBriefRequest,
  CreativeBriefResponse,
  InstagramAnalytics,
  IntegrationApiResponse,
  IntegrationStatus,
} from "@/app/_lib/portal-types";

export async function getExecutiveBrief() {
  return executiveBrief;
}

export async function getAiEngines() {
  return aiEngines;
}

export async function getApprovalItems() {
  return approvalItems;
}

export async function getUserBrands() {
  return userBrands;
}

export async function getBroadcastIdeas() {
  return broadcastIdeas;
}

export async function getSnsHealth() {
  return snsHealth;
}

export async function getCommerceAnalytics() {
  return commerceAnalytics;
}

export async function getProductOpportunities() {
  return productOpportunities;
}

export async function getActivityTimeline() {
  return activityTimeline;
}

export async function getDecisionLogs() {
  return decisionLogs;
}

export async function getContentReview() {
  return contentReview;
}

export async function getKnowledgeVaultItems() {
  return knowledgeVaultItems;
}

export async function getSystemHealth() {
  return systemHealth;
}

export async function getAutomationRules() {
  return automationRules;
}

export async function reviewContentWithAI(
  payload: AiReviewRequest,
): Promise<AiReviewResponse> {
  const response = await fetch("/api/ai/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("AI review request failed");
  }

  return response.json() as Promise<AiReviewResponse>;
}

export async function generateCreativeBrief(
  payload: CreativeBriefRequest,
): Promise<CreativeBriefResponse> {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Creative brief generation failed");
  }

  return response.json() as Promise<CreativeBriefResponse>;
}

export async function getInstagramAnalytics(): Promise<InstagramAnalytics> {
  const response = await fetch("/api/integrations/instagram");

  if (!response.ok) {
    throw new Error("Instagram analytics request failed");
  }

  return response.json() as Promise<InstagramAnalytics>;
}

export async function getIntegrationStatus(): Promise<IntegrationStatus[]> {
  return integrationStatuses;
}

export async function getMockInstagramAnalytics() {
  return instagramAnalytics;
}

function getIntegrationEndpoint(id: string) {
  switch (id) {
    case "openai":
      return "/api/ai/review";
    case "youtube":
      return "/api/integrations/youtube";
    case "instagram":
      return "/api/integrations/instagram";
    case "github":
      return "/api/github/issues";
    default:
      return null;
  }
}

function getNestedIntegrationResponse(
  value: unknown,
): IntegrationApiResponse | null {
  if (
    value &&
    typeof value === "object" &&
    "integration" in value &&
    value.integration &&
    typeof value.integration === "object"
  ) {
    return value.integration as IntegrationApiResponse;
  }

  return null;
}

export async function testIntegrationApi(
  id: string,
): Promise<IntegrationApiResponse> {
  if (id === "openai") {
    const result = await reviewContentWithAI({
      content: "TOMOS API接続テスト。AIO、SNS、CV導線を短く評価してください。",
      brand: "TOMOS",
      channel: "Content Review AI",
    });

    return {
      id: "openai",
      name: "OpenAI",
      ok: true,
      mode: result.mode,
      message: `${result.model} でContent Review APIが応答しました。`,
      checkedAt: new Date().toISOString(),
      metrics: Object.fromEntries(
        result.scores.slice(0, 5).map((score) => [score.label, score.score]),
      ),
    };
  }

  const endpoint = getIntegrationEndpoint(id);

  if (!endpoint) {
    return {
      id,
      name: id,
      ok: true,
      mode: "mock",
      message: "このIntegrationはまだAPI route未設定です。",
      checkedAt: new Date().toISOString(),
    };
  }

  const response = await fetch(endpoint);

  if (!response.ok) {
    return {
      id,
      name: id,
      ok: false,
      mode: "live",
      message: `API request failed: ${response.status}`,
      checkedAt: new Date().toISOString(),
    };
  }

  const data = (await response.json()) as unknown;
  const nested = getNestedIntegrationResponse(data);

  if (nested) {
    return nested;
  }

  return data as IntegrationApiResponse;
}

export async function syncIntegrationDemoData(
  id: string,
): Promise<IntegrationApiResponse> {
  const result = await testIntegrationApi(id);

  return {
    ...result,
    message: `${result.message} Demo sync dataをActivity Timelineへ反映しました。`,
    checkedAt: new Date().toISOString(),
  };
}
