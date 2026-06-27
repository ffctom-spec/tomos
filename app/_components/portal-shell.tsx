"use client";

import { useEffect, useMemo, useState } from "react";
import { ApprovalCenterView, ApprovalDetailView } from "@/app/_components/approval-center";
import { BrandDetailView, BrandPortfolioView } from "@/app/_components/brand-portfolio";
import { BroadcastCenterView, BroadcastDetailView } from "@/app/_components/broadcast-center";
import { CommerceAnalyticsView } from "@/app/_components/commerce-analytics";
import { CommandCenter } from "@/app/_components/command-center";
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
} from "@/app/_lib/api-client";
import type {
  ActivityTimelineItem,
  AiReviewResponse,
  ApprovalItem,
  ApprovalStatus,
  BroadcastIdea,
  DecisionLog,
  InstagramAnalytics,
  KnowledgeVaultItem,
  PortalView,
  UserBrand,
} from "@/app/_lib/portal-types";

const navItems: Array<[string, PortalView]> = [
  ["Command Center", "command"],
  ["Executive Brief", "brief"],
  ["Approval Center", "approvals"],
  ["Brand Portfolio", "brands"],
  ["Broadcast Center", "broadcast"],
  ["Content Review AI", "content-review"],
  ["SNS Health", "sns-health"],
  ["Commerce", "commerce"],
  ["Product", "product"],
  ["Knowledge Vault", "knowledge"],
  ["Integrations", "integrations"],
];

const quickActions: Array<[string, PortalView]> = [
  ["承認", "approvals"],
  ["配信", "broadcast"],
  ["SNS", "sns-health"],
  ["商品", "product"],
  ["連携", "integrations"],
];

function addTimelineLog(
  previous: ActivityTimelineItem[],
  title: string,
  detail: string,
  engine = "TOMOS",
) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;

  return [{ id: `local-${now.getTime()}`, time, title, detail, engine }, ...previous];
}

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
    if (
      activeView === "approval-detail" ||
      activeView === "brand-detail" ||
      activeView === "broadcast-detail" ||
      activeView === "knowledge-detail"
    ) {
      setActiveView(previousView);
      return;
    }
    setActiveView("command");
  }

  function logAction(title: string, detail: string, engine = "Executive Approval") {
    setTimeline((items) => addTimelineLog(items, title, detail, engine));
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
    setBroadcastIdeas((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: "Preparing" } : item,
      ),
    );
    if (target) {
      logAction(
        "Broadcast制作承認",
        `${target.title}を${target.suggestedBrand}向けに制作準備。`,
        "Broadcast Center",
      );
    }
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
            onUpdate={updateApproval}
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
            onSelect={selectBroadcast}
            onApprove={approveBroadcast}
          />
        );
      case "broadcast-detail":
        return selectedBroadcast ? (
          <BroadcastDetailView
            idea={selectedBroadcast}
            onBack={goBack}
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
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_34%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col pb-28 md:px-6 lg:flex-row lg:gap-6 lg:pb-8">
        <aside className="hidden w-72 shrink-0 py-6 lg:block">
          <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-white text-base font-semibold text-black">
                T
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.3em]">TOMOS</p>
                <p className="text-xs text-zinc-500">Beta 0.2 / UX Hierarchy</p>
              </div>
            </div>
            <nav className="mt-8 grid gap-2">
              {navItems.map(([label, view]) => (
                <button
                  className={`min-h-11 rounded-xl px-4 text-left text-sm transition ${
                    activeView === view
                      ? "bg-white text-black"
                      : "border border-white/10 bg-black/30 text-zinc-300 hover:bg-white/10"
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
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={log.id}>
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
          {quickActions.map(([label, view]) => (
            <button
              className={`min-h-14 rounded-2xl border border-white/10 px-1 text-[11px] transition ${
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
