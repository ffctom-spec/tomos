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

export type BroadcastStatus = "Ready" | "Preparing" | "Approved";

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
  whyNow: string[];
  hotWords: string[];
  aiInsight: string;
  suggestedLead: string;
  suggestedStructure: string[];
  whySelected: string[];
  trendSources: string[];
  similarWinningContent: Array<{
    title: string;
    channel: "YouTube" | "Instagram" | "Blog";
    reason: string;
    estimatedSignal: string;
  }>;
  contentOpportunities: string[];
  productOpportunities: string[];
  confidenceScore: number;
  expectedImpact: {
    aio: number;
    seo: number;
    sns: number;
    saves: number;
    productPath: number;
  };
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

export type AiProvider = "openai" | "gemini";

export type AiConsoleRequest = {
  provider: AiProvider;
  prompt: string;
};

export type AiConsoleResponse = {
  provider: AiProvider;
  mode: "live" | "mock";
  model: string;
  output: string;
};

export type AiReviewRequest = {
  content: string;
  brand: string;
  channel: string;
};

export type AiReviewScore = {
  label: string;
  score: number;
  note: string;
};

export type AiReviewResponse = {
  mode: "live" | "mock";
  model: string;
  summary: string;
  scores: AiReviewScore[];
  rewrite: string;
  nextActions: string[];
};

export type CreativeBriefRequest = {
  topic: string;
  context: string;
  objective: string;
  audience: string;
  tone: string;
  channel: string;
  postType: string;
  structure: string;
  asset: string;
  brand: string;
};

export type CreativeBriefResponse = {
  mode: "live" | "mock";
  model: string;
  demandHypothesis: {
    reasons: string[];
    audience: string;
    saveReason: string;
    opportunityScore: number;
    disclaimer: string;
  };
  founderContext: {
    coreMessage: string;
    readerAction: string;
    saveReason: string;
    emotionalValue: string;
    brandMeaning: string;
    assumedContext: string;
  };
  knowledgeConfidence: {
    easyToUse: string[];
    conditional: string[];
    needsVerification: string[];
    saferPhrases: string[];
  };
  creativeAngles: Array<{
    name: string;
    title: string;
    intent: string;
    audience: string;
    saveReason: string;
    format: string;
    visualDirection: string;
    seriesPotential: string;
    firstSlideCopy: string;
  }>;
  concept: {
    summary: string;
    conclusion: string;
    visualDirection: string;
    carouselPlan: string[];
    reelHook: string;
    firstSlideCopy: string;
    subtitle: string;
    reelCuts: string[];
    telopIdeas: string[];
  };
  titleOptions: string[];
  leadOptions: string[];
  finalPost: {
    title: string;
    lead: string;
    body: string;
    cta: string;
    hashtags: string[];
    productPath: string;
    aioFaq: string[];
    instagramCaption: string;
    channelFormat: string;
  };
  aiComment: string;
};

export type ReviewReference = {
  id: string;
  title: string;
  thumbnail: string;
  channel: "YouTube" | "Instagram" | "Blog" | "Pinterest";
  publishedAt: string;
  url: string;
  rating: "★★★★★" | "★★★★☆" | "★★★☆☆";
  aiEvaluation: string;
  whyAiLikesThis: string[];
};

export type InstagramTopPost = {
  id: string;
  title: string;
  saves: number;
  reach: number;
  engagementRate: string;
};

export type InstagramAnalytics = {
  connectionStatus: "connected" | "mock" | "disconnected";
  account: string;
  accountRequirement: string;
  lastSync: string;
  followers: number;
  reach: number;
  impressions: number;
  saves: number;
  engagementRate: string;
  snsHealthScore: number;
  topPosts: InstagramTopPost[];
};

export type IntegrationStatus = {
  id: string;
  name: string;
  status: "Connected" | "API-ready" | "Planned";
  detail: string;
};

export type IntegrationApiResponse = {
  id: string;
  name: string;
  ok: boolean;
  mode: "live" | "mock";
  message: string;
  checkedAt: string;
  metrics?: Record<string, string | number>;
  items?: Array<Record<string, string | number>>;
};

export type PortalView =
  | "command"
  | "brief"
  | "approvals"
  | "approval-detail"
  | "content-creation"
  | "brands"
  | "brand-detail"
  | "broadcast"
  | "broadcast-detail"
  | "content-review"
  | "sns-health"
  | "commerce"
  | "product"
  | "knowledge"
  | "knowledge-detail"
  | "integrations";

export type PortalViewConfig = {
  label: string;
  level: 1 | 2 | 3;
  parent?: PortalView;
};

export type PortalNavigationItem = {
  label: string;
  view: PortalView;
};
