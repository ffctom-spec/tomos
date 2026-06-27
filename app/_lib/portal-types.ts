export type EngineStatus =
  | "Running"
  | "Monitoring"
  | "Queued"
  | "Learning"
  | "Waiting approval"
  | "Paused";

export type PublicStatus = "Private" | "Draft" | "Approved" | "Published";

export type ApprovalStatus =
  | "Pending"
  | "Approved"
  | "Revision requested"
  | "On hold"
  | "Rejected";

export type BroadcastStatus = "Ready" | "Preparing";

export type AiEngine = {
  id: string;
  name: string;
  status: EngineStatus;
  lastRun: string;
  nextAction: string;
  output: string;
};

export type ExecutiveBriefItem = {
  label: string;
  value: string;
  detail: string;
};

export type ApprovalItem = {
  id: string;
  type: string;
  title: string;
  brand: string;
  reason: string;
  status: ApprovalStatus;
};

export type UserBrand = {
  id: string;
  name: string;
  domain: string;
  publicStatus: PublicStatus;
  aioScore: number;
  snsHealth: number;
  knowledgeAssets: number;
  commercePotential: string;
  approvalsPending: number;
  nextAction: string;
};

export type BroadcastIdea = {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  aioScore: number;
  snsPotential: number;
  productFit: number;
  suggestedBrand: string;
  status: BroadcastStatus;
};

export type ContentReviewMetric = {
  label: string;
  value: number;
};

export type ContentReview = {
  id: string;
  title: string;
  assetType: string;
  before: string;
  after: string;
  status: "Ready" | "Applied";
  metrics: ContentReviewMetric[];
};

export type SnsHealthItem = {
  channel: string;
  metric: string;
  value: string;
  issue: string;
  nextPost: string;
};

export type CommerceAnalyticsItem = {
  post: string;
  traffic: string;
  productClicks: string;
  purchases: string;
  cvr: string;
  revenue: string;
  soldReason: string;
  missedReason: string;
  nextAction: string;
};

export type ProductOpportunity = {
  item: string;
  market: number;
  brandFit: number;
  profit: number;
  aioFit: number;
  snsLook: number;
  recommendation: number;
};

export type KnowledgeVaultItem = {
  title: string;
  description: string;
};

export type ActivityTimelineItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
  engine: string;
};

export type DecisionLog = {
  id: string;
  title: string;
  basis: string;
  expectedEffect: string;
  risk: string;
  nextAction: string;
};

export type SystemHealthItem = {
  label: string;
  value: string;
  detail: string;
};

export type AutomationRule = {
  title: string;
  cadence: string;
  target: string;
  status: "Active" | "Draft" | "Paused";
};
