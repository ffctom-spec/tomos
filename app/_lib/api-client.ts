import {
  activityTimeline,
  aiEngines,
  approvalItems,
  broadcastIdeas,
  commerceAnalytics,
  contentReview,
  decisionLogs,
  executiveBrief,
  knowledgeVaultItems,
  productOpportunities,
  snsHealth,
  systemHealth,
  automationRules,
  userBrands,
} from "@/app/_lib/portal-data";

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
