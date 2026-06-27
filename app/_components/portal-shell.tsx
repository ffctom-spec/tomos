"use client";

import { useEffect, useMemo, useState } from "react";
import { ApprovalCenterView, ApprovalDetailView } from "@/app/_components/approval-center";
import { BrandDetailView, BrandPortfolioView } from "@/app/_components/brand-portfolio";
import { BroadcastCenterView, BroadcastDetailView } from "@/app/_components/broadcast-center";
import { CommerceAnalyticsView } from "@/app/_components/commerce-analytics";
import { CommandCenter } from "@/app/_components/command-center";
import { ContentCreationFlow } from "@/app/_components/content-creation-flow";
import { ContentReviewView } from "@/app/_components/content-review";
import { ExecutiveBriefView } from "@/app/_components/executive-brief";
import { IntegrationsPanel } from "@/app/_components/integrations-panel";
import { KnowledgeDetailView, KnowledgeVaultView } from "@/app/_components/knowledge-vault";
import { ProductOpportunityView } from "@/app/_components/product-opportunity";
import { SnsHealthView } from "@/app/_components/sns-health";
import { GlassCard } from "@/app/_components/view-frame";
import {
  activityTimeline,
  aiEngines,
  approvalItems,
  broadcastIdeas as initialBroadcastIdeas,
  commerceAnalytics,
  contentReview,
  executiveBrief,
  instagramAnalytics,
  integrationStatuses,
  knowledgeVaultItems,
  productOpportunities,
  snsHealth,
  userBrands,
} from "@/app/_lib/portal-data";
import {
  getInstagramAnalytics,
  reviewContentWithAI,
  syncIntegrationDemoData,
  testIntegrationApi,
} from "@/app/_lib/api-client";
import { createTimelineLog } from "@/app/_lib/portal-helpers";
import {
  getParentView,
  isDetailView,
  portalNavigationItems,
  portalQuickActions,
} from "@/app/_lib/view-config";
import type {
  ActivityTimelineItem,
  AiReviewResponse,
  ApprovalItem,
  ApprovalStatus,
  BroadcastIdea,
  DecisionLog,
  InstagramAnalytics,
  IntegrationStatus,
  KnowledgeVaultItem,
  PortalView,
  UserBrand,
} from "@/app/_lib/portal-types";

export function PortalShell() {
  const [activeView, setActiveView] = useState<PortalView>("command");
  const [previousView, setPreviousView] = useState<PortalView>("command");
  const [approvals, setApprovals] = useState<ApprovalItem[]>(approvalItems);
  const [broadcastIdeas, setBroadcastIdeas] =
    useState<BroadcastIdea[]>(initialBroadcastIdeas);
  const [timeline, setTimeline] =
    useState<ActivityTimelineItem[]>(activityTimeline);
  const [logs, setLogs] = useState<DecisionLog[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<UserBrand | null>(null);
  const [selectedBroadcast, setSelectedBroadcast] =
    useState<BroadcastIdea | null>(null);
  const [selectedKnowledge, setSelectedKnowledge] =
    useState<KnowledgeVaultItem | null>(null);
  const [instagram, setInstagram] =
    useState<InstagramAnalytics>(instagramAnalytics);
  const [reviewContent, setReviewContent] = useState(contentReview.before);
  const [reviewBrand, setReviewBrand] = useState("VERDNA");
  const [reviewChannel, setReviewChannel] = useState("Instagram");
  const [reviewResult, setReviewResult] = useState<AiReviewResponse | null>(null);
  const [reviewStatus, setReviewStatus] =
    useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    let mounted = true;

    getInstagramAnalytics()
      .then((data) => {
        if (mounted) setInstagram(data);
      })
      .catch(() => {
        if (mounted) setInstagram(instagramAnalytics);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const pending = useMemo(
    () => approvals.filter((item) => item.status === "Pending").length,
    [approvals],
  );

  function navigate(view: PortalView) {
    setPreviousView(activeView);
    setActiveView(view);
  }

  function goBack() {
    if (isDetailView(activeView)) {
      setActiveView(previousView);
      return;
    }
    setActiveView(getParentView(activeView));
  }

  function logAction(title: string, detail: string, engine = "Executive Approval") {
    setTimeline((items) => [createTimelineLog(title, detail, engine), ...items]);
    setLogs((items) => [
      {
        id: `log-${Date.now()}`,
        title,
        basis: detail,
        expectedEffect: "次のAI Operatingに反映されます。",
        risk: "Beta 0.2ではローカルstateのみ反映。",
        nextAction: "必要に応じて次の詳細画面へ進む。",
      },
      ...items,
    ]);
  }

  function updateApproval(id: string, status: ApprovalStatus) {
    const target = approvals.find((item) => item.id === id);
    setApprovals((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    if (target) {
      logAction(
        `${target.type}を${status}`,
        `${target.brand} / ${target.title} のステータスを変更。`,
      );
    }
  }

  function approveAndStartCreation(item: ApprovalItem) {
    const approvedItem: ApprovalItem = { ...item, status: "Approved" };

    setApprovals((items) =>
      items.map((approval) =>
        approval.id === item.id ? approvedItem : approval,
      ),
    );
    setSelectedApproval(approvedItem);
    logAction(
      "承認完了・投稿作成を開始",
      `${item.brand} / ${item.title} をApprovedへ変更し、Content Creation Flowを開始。`,
    );
    setPreviousView("approval-detail");
    setActiveView("content-creation");
  }

  function selectApproval(item: ApprovalItem) {
    setSelectedApproval(item);
    setPreviousView("approvals");
    setActiveView("approval-detail");
  }

  function selectBrand(brand: UserBrand) {
    setSelectedBrand(brand);
    setPreviousView("brands");
    setActiveView("brand-detail");
  }

  function selectBroadcast(idea: BroadcastIdea) {
    setSelectedBroadcast(idea);
    setPreviousView("broadcast");
    setActiveView("broadcast-detail");
  }

  function approveBroadcast(id: string) {
    const target = broadcastIdeas.find((item) => item.id === id);
    if (!target || target.status === "Approved") return;

    setBroadcastIdeas((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: "Approved" } : item,
      ),
    );
    setSelectedBroadcast((current) =>
      current?.id === id ? { ...current, status: "Approved" } : current,
    );
    logAction(
      "Broadcast制作承認",
      `${target.title}を${target.suggestedBrand}向けにApprovedへ変更。`,
      "Broadcast Center",
    );
  }

  function createFromBroadcast(idea: BroadcastIdea) {
    const approval: ApprovalItem = {
      id: `broadcast-${idea.id}`,
      type: "Broadcast Mission",
      title: idea.title,
      brand: idea.suggestedBrand,
      reason: `${idea.aiInsight}\n\nSuggested Lead: ${idea.suggestedLead}\n\nRecommended Format: ${idea.suggestedStructure.join(" / ")}`,
      status: "Approved",
    };

    setSelectedBroadcast(idea);
    setSelectedApproval(approval);
    logAction(
      "Broadcast Missionから投稿作成を開始",
      `${idea.suggestedBrand} / ${idea.title} をContent Creation Flowへ送信。`,
      "Broadcast Center",
    );
    setPreviousView(activeView);
    setActiveView("content-creation");
  }

  function addBroadcastOpportunity(title: string) {
    const idea: BroadcastIdea = {
      id: `similar-${title}-${Date.now()}`,
      title,
      priority: "Medium",
      aioScore: 82,
      snsPotential: 84,
      productFit: 76,
      suggestedBrand: reviewBrand,
      status: "Ready",
      whyNow: ["Content Review AIが類似関心テーマとして検出", "検索・SNS・Knowledge Vaultへ展開可能"],
      hotWords: [title, "家庭菜園", "自然農法", "保存版"],
      aiInsight: "現在のレビュー文脈と近く、Broadcast候補として展開できます。",
      suggestedLead: `${title}について、初心者にもわかりやすく整理します。\n保存しやすいポイントから紹介します。`,
      suggestedStructure: ["Hook", "Problem", "Solution", "Knowledge", "Product", "CTA"],
      whySelected: ["類似関心が高い", "FAQ化しやすい", "SNS展開しやすい"],
      trendSources: ["Google Trends", "YouTube", "Instagram", "Pinterest", "Reddit", "Search Console"],
      similarWinningContent: [
        {
          title: `${title}の基本ガイド`,
          channel: "Blog",
          reason: "検索意図が明確",
          estimatedSignal: "Mock: AIO fit",
        },
      ],
      contentOpportunities: ["YouTube", "Knowledge Cast", "Instagram Carousel", "Blog"],
      productOpportunities: ["PDFガイド", "ガーデングッズ", "関連商品"],
      confidenceScore: 82,
      expectedImpact: { aio: 82, seo: 80, sns: 84, saves: 78, productPath: 76 },
    };

    setBroadcastIdeas((items) => [idea, ...items]);
    logAction(
      "Broadcast候補を追加",
      `${title}をContent IntelligenceからBroadcast Centerへ追加。`,
      "Content Review AI",
    );
  }

  function selectKnowledge(item: KnowledgeVaultItem) {
    setSelectedKnowledge(item);
    setPreviousView("knowledge");
    setActiveView("knowledge-detail");
  }

  async function runReview() {
    setReviewStatus("loading");
    setReviewResult(null);

    try {
      const result = await reviewContentWithAI({
        content: reviewContent,
        brand: reviewBrand,
        channel: reviewChannel,
      });
      setReviewResult(result);
      setReviewStatus("idle");
      logAction(
        "AIレビュー実行",
        `${reviewBrand} / ${reviewChannel} を ${result.model} (${result.mode}) でレビュー。`,
        "Content Review AI",
      );
    } catch {
      setReviewStatus("error");
    }
  }

  function applyRewrite() {
    if (!reviewResult) return;
    setReviewContent(reviewResult.rewrite);
    logAction("リライト適用", "Content Review AIのAfter文を入力欄へ適用。");
  }

  async function testIntegration(integration: IntegrationStatus) {
    try {
      const result = await testIntegrationApi(integration.id);
      logAction(
        `${integration.name} APIテスト ${result.ok ? "成功" : "失敗"}`,
        `${result.mode.toUpperCase()} / ${result.message}`,
        "Integrations Hub",
      );
    } catch (error) {
      logAction(
        `${integration.name} APIテスト失敗`,
        error instanceof Error ? error.message : "Integration API test failed",
        "Integrations Hub",
      );
    }
  }

  async function syncDemoData(integration: IntegrationStatus) {
    try {
      const result = await syncIntegrationDemoData(integration.id);
      logAction(
        `${integration.name} demo sync ${result.ok ? "完了" : "失敗"}`,
        `${result.mode.toUpperCase()} / ${result.message}`,
        "Integrations Hub",
      );
    } catch (error) {
      logAction(
        `${integration.name} demo sync失敗`,
        error instanceof Error ? error.message : "Integration demo sync failed",
        "Integrations Hub",
      );
    }
  }

  function renderActiveView() {
    switch (activeView) {
      case "brief":
        return (
          <ExecutiveBriefView
            brief={executiveBrief}
            onBack={goBack}
            onLog={logAction}
          />
        );
      case "approvals":
        return (
          <ApprovalCenterView
            approvals={approvals}
            onBack={goBack}
            onSelect={selectApproval}
            onUpdate={updateApproval}
          />
        );
      case "approval-detail":
        return selectedApproval ? (
          <ApprovalDetailView
            item={selectedApproval}
            onBack={goBack}
            onApproveNext={approveAndStartCreation}
            onUpdate={updateApproval}
          />
        ) : null;
      case "content-creation":
        return selectedApproval ? (
          <ContentCreationFlow
            approval={selectedApproval}
            instagramConnected={instagram.connectionStatus === "connected"}
            onBack={goBack}
            onCreativeBriefGenerated={() => {
              logAction(
                "Founder context analyzed",
                `${selectedApproval.title} の背景メモから投稿意図とブランド文脈をAI解釈。`,
                "Content Creation Flow",
              );
              logAction(
                "AI Creative Brief generated",
                "投稿案を生成。AI需要仮説、投稿コンセプト、投稿例をPublish Reviewへ反映。",
                "Content Creation Flow",
              );
              logAction(
                "AI Creative Angles generated",
                "3つの投稿切り口とSeries Opportunityを生成。",
                "Content Creation Flow",
              );
              logAction(
                "投稿案を生成",
                `${selectedApproval.title} の投稿案をAI Creative Briefとして生成。`,
                "Content Creation Flow",
              );
            }}
            onPhotoAssetSelected={(fileName) =>
              logAction(
                "Photo asset selected",
                `${fileName} をContent Creation Flowのブラウザ内プレビューに追加。`,
                "Content Creation Flow",
              )
            }
            onDistributionPlanCreated={() =>
              logAction(
                "AI distribution plan created",
                "配信順、最優先フォーマット、期待行動をAI運用仮説として生成。",
                "Content Creation Flow",
              )
            }
            onPostSimulationGenerated={() =>
              logAction(
                "AI post simulation generated",
                "AI Command Scoreと7日間のAI推定パフォーマンスを生成。",
                "Content Creation Flow",
              )
            }
            onSeriesRolloutPlanned={() =>
              logAction(
                "Series rollout planned",
                "7-Day Content RolloutとTopic Recognition Planを生成。",
                "Content Creation Flow",
              )
            }
            onSeriesOpportunityAdded={(title) =>
              logAction(
                "Series opportunity added",
                `${title} を次の投稿候補として追加。`,
                "Content Creation Flow",
              )
            }
            onConversationStarterSelected={(starter) =>
              logAction(
                "Conversation starter selected",
                `${starter} を投稿文に追加。`,
                "Content Creation Flow",
              )
            }
            onDraftSaved={() =>
              logAction(
                "Instagram draft prepared",
                instagram.connectionStatus === "connected"
                  ? "Instagram Draft Ready。実投稿は行わず、下書き連携準備のみ完了。"
                  : "Instagram未接続です。TOMOS内の下書きとして保存しました。",
                "Content Creation Flow",
              )
            }
          />
        ) : null;
      case "brands":
        return (
          <BrandPortfolioView
            brands={userBrands}
            onBack={goBack}
            onSelect={selectBrand}
          />
        );
      case "brand-detail":
        return selectedBrand ? (
          <BrandDetailView
            brand={selectedBrand}
            onBack={goBack}
            onNavigate={navigate}
          />
        ) : null;
      case "broadcast":
        return (
          <BroadcastCenterView
            ideas={broadcastIdeas}
            onBack={goBack}
            onCreateContent={createFromBroadcast}
            onSelect={selectBroadcast}
            onApprove={approveBroadcast}
          />
        );
      case "broadcast-detail":
        return selectedBroadcast ? (
          <BroadcastDetailView
            idea={selectedBroadcast}
            onBack={goBack}
            onCreateContent={createFromBroadcast}
            onApprove={approveBroadcast}
          />
        ) : null;
      case "content-review":
        return (
          <ContentReviewView
            brand={reviewBrand}
            channel={reviewChannel}
            content={reviewContent}
            result={reviewResult}
            status={reviewStatus}
            onApply={applyRewrite}
            onBack={goBack}
            onBrandChange={setReviewBrand}
            onChannelChange={setReviewChannel}
            onContentChange={setReviewContent}
            onAddOpportunity={addBroadcastOpportunity}
            onReview={runReview}
          />
        );
      case "sns-health":
        return (
          <SnsHealthView
            instagram={instagram}
            items={snsHealth}
            onBack={goBack}
            onNavigateIntegrations={() => navigate("integrations")}
          />
        );
      case "commerce":
        return (
          <CommerceAnalyticsView
            items={commerceAnalytics}
            onBack={goBack}
            onProduct={() => navigate("product")}
          />
        );
      case "product":
        return (
          <ProductOpportunityView
            items={productOpportunities}
            onAction={(title) => logAction(title, "Product Opportunityで状態変更。")}
            onBack={goBack}
          />
        );
      case "knowledge":
        return (
          <KnowledgeVaultView
            items={knowledgeVaultItems}
            onBack={goBack}
            onSelect={selectKnowledge}
          />
        );
      case "knowledge-detail":
        return selectedKnowledge ? (
          <KnowledgeDetailView item={selectedKnowledge} onBack={goBack} />
        ) : null;
      case "integrations":
        return (
          <IntegrationsPanel
            integrations={integrationStatuses}
            onAction={(title) => logAction(title, "Integration操作を記録。", "Integrations")}
            onBack={goBack}
            onSyncDemo={syncDemoData}
            onTestApi={testIntegration}
          />
        );
      case "command":
      default:
        return (
          <CommandCenter
            approvals={approvals}
            brief={executiveBrief}
            engines={aiEngines}
            timeline={timeline}
            onNavigate={navigate}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-14%,rgba(255,255,255,0.10),transparent_30%),linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.016)_1px,transparent_1px),repeating-linear-gradient(110deg,rgba(255,255,255,0.015)_0_1px,transparent_1px_8px)] bg-[length:auto,64px_64px,64px_64px,180px_180px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col pb-28 md:px-6 lg:flex-row lg:gap-6 lg:pb-8">
        <aside className="hidden w-72 shrink-0 py-6 lg:block">
          <div className="sticky top-6 border border-white/[0.14] bg-[#030303]/90 p-5 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center border border-white bg-white text-base font-semibold text-black">
                T
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.3em]">TOMOS</p>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Beta 0.2 / Intelligence Deck
                </p>
              </div>
            </div>
            <nav className="mt-8 grid gap-2">
              {portalNavigationItems.map(({ label, view }) => (
                <button
                  className={`min-h-11 border px-4 text-left text-sm transition ${
                    activeView === view
                      ? "border-white bg-white text-black"
                      : "border border-white/10 bg-black/45 text-zinc-300 hover:bg-white/10"
                  }`}
                  key={view}
                  onClick={() => navigate(view)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </nav>
            <GlassCard className="mt-6">
              <p className="text-xs text-zinc-500">Pending Approvals</p>
              <p className="mt-2 text-3xl font-semibold">{pending}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                承認後はActivity Timelineへ記録。
              </p>
            </GlassCard>
          </div>
        </aside>

        <main className="w-full min-w-0 px-4 pt-5 sm:px-6 md:pt-6 lg:px-0">
          {renderActiveView()}

          <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_360px]">
            <GlassCard>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Activity Timeline</h2>
                <span className="text-xs text-zinc-500">local state</span>
              </div>
              <div className="grid gap-3">
                {timeline.slice(0, 5).map((item) => (
                  <div className="grid grid-cols-[64px_1fr] gap-3" key={item.id}>
                    <p className="text-sm font-medium text-zinc-300">{item.time}</p>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {item.engine} / {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Decision Log</h2>
                <span className="text-xs text-zinc-500">{logs.length}</span>
              </div>
              <div className="grid gap-3">
                {(logs.length ? logs.slice(0, 3) : [
                  {
                    id: "empty",
                    title: "No action yet",
                    basis: "ボタンを押すとここに操作ログが追加されます。",
                  },
                ]).map((log) => (
                  <div className="border border-white/10 bg-white/[0.04] p-4" key={log.id}>
                    <p className="text-sm font-medium">{log.title}</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      {log.basis}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/80 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-2xl lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-2">
          {portalQuickActions.map(({ label, view }) => (
            <button
              className={`min-h-14 border border-white/10 px-1 text-[11px] transition ${
                activeView === view
                  ? "bg-white text-black"
                  : "bg-white/[0.06] text-zinc-300"
              }`}
              key={view}
              onClick={() => navigate(view)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
