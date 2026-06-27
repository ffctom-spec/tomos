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
  InstagramAnalytics,
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
