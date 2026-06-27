"use client";

import { useMemo, useState } from "react";
import {
  activityTimeline,
  aiEngines,
  approvalItems,
  automationRules,
  broadcastIdeas,
  commerceAnalytics,
  contentReview,
  decisionLogs,
  executiveBrief,
  knowledgeVaultItems,
  navItems,
  productOpportunities,
  snsHealth,
  userBrands,
} from "@/app/_lib/portal-data";
import type {
  ActivityTimelineItem,
  AiConsoleResponse,
  AiProvider,
  ApprovalItem,
  ApprovalStatus,
  BroadcastIdea,
  ContentReview,
  DecisionLog,
  EngineStatus,
  PublicStatus,
} from "@/app/_lib/portal-types";

const statusStyles: Record<EngineStatus, string> = {
  Running: "bg-emerald-300/10 text-emerald-200",
  Monitoring: "bg-cyan-300/10 text-cyan-200",
  Queued: "bg-amber-300/10 text-amber-200",
  Learning: "bg-violet-300/10 text-violet-200",
  "Waiting approval": "bg-white text-black",
  Paused: "bg-zinc-300/10 text-zinc-300",
};

const publicStatusStyles: Record<PublicStatus, string> = {
  Private: "bg-zinc-300/10 text-zinc-200",
  Draft: "bg-amber-300/10 text-amber-200",
  Approved: "bg-emerald-300/10 text-emerald-200",
  Published: "bg-cyan-300/10 text-cyan-200",
};

const approvalLabels: Record<ApprovalStatus, string> = {
  Pending: "未判断",
  Approved: "承認済み",
  "Revision requested": "修正依頼",
  "On hold": "保留",
  Rejected: "却下",
};

function SectionHeading({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {detail ? <p className="text-sm text-zinc-500">{detail}</p> : null}
    </div>
  );
}

function MetricBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full bg-white" style={{ width: `${value}%` }} />
    </div>
  );
}

function addOperationLog(
  previous: ActivityTimelineItem[],
  title: string,
  detail: string,
  engine: string,
) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;

  return [{ id: `local-${now.getTime()}`, time, title, detail, engine }, ...previous];
}

export function PortalShell() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(approvalItems);
  const [broadcasts, setBroadcasts] = useState<BroadcastIdea[]>(broadcastIdeas);
  const [review, setReview] = useState<ContentReview>(contentReview);
  const [timeline, setTimeline] =
    useState<ActivityTimelineItem[]>(activityTimeline);
  const [logs, setLogs] = useState<DecisionLog[]>(decisionLogs);
  const [aiProvider, setAiProvider] = useState<AiProvider>("openai");
  const [aiPrompt, setAiPrompt] = useState(
    "今日のExecutive Approvalから、最優先で承認すべきBroadcast Missionを1つ選んでください。",
  );
  const [aiResponse, setAiResponse] = useState<AiConsoleResponse | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "error">("idle");

  const counts = useMemo(
    () => ({
      pending: approvals.filter((item) => item.status === "Pending").length,
      approved: approvals.filter((item) => item.status === "Approved").length,
      hold: approvals.filter((item) => item.status === "On hold").length,
      rejected: approvals.filter((item) => item.status === "Rejected").length,
    }),
    [approvals],
  );

  function updateApproval(id: string, status: ApprovalStatus) {
    const target = approvals.find((item) => item.id === id);
    setApprovals((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    if (!target) return;

    setLogs((items) => [
      {
        id: `decision-${Date.now()}`,
        title: `${target.title}を${approvalLabels[status]}に変更`,
        basis: `ユーザーが${target.type}に対して${approvalLabels[status]}を選択。`,
        expectedEffect:
          status === "Approved"
            ? "AIが次の制作・配信・資産化ステップへ進みます。"
            : "AIが状態に応じて次の提案を調整します。",
        risk: "Demo Modeのため状態はブラウザ内のみで保持されます。",
        nextAction:
          status === "Approved"
            ? "配信準備、Knowledge Vault化、Learning Loop監視へ進む。"
            : "修正案または再提案を生成する。",
      },
      ...items,
    ]);
  }

  function approveBroadcast(id: string) {
    const target = broadcasts.find((item) => item.id === id);
    setBroadcasts((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: "Preparing" } : item,
      ),
    );
    if (!target) return;

    setTimeline((items) =>
      addOperationLog(
        items,
        "Broadcast Mission配信準備",
        `${target.title}を${target.suggestedBrand}向けに配信準備中へ変更。`,
        "Broadcast Center",
      ),
    );
    setLogs((items) => [
      {
        id: `broadcast-${Date.now()}`,
        title: `${target.title}を配信準備中に変更`,
        basis: `AIO ${target.aioScore} / SNS ${target.snsPotential} / Product ${target.productFit}`,
        expectedEffect: "媒体別ドラフト、FAQ、商品導線の生成が始まる。",
        risk: "公開はまだ行われません。ユーザー承認後のみ外部公開されます。",
        nextAction: "Content FactoryでYouTube、Instagram、Blog、FAQへ展開。",
      },
      ...items,
    ]);
  }

  function applyRewrite() {
    setReview((item) => ({ ...item, before: item.after, status: "Applied" }));
    setLogs((items) => [
      {
        id: `rewrite-${Date.now()}`,
        title: "Content Review AIのリライトを適用",
        basis: "ブランド適合性、読みやすさ、AIO引用適性が改善されたため。",
        expectedEffect: "保存率、SEO、AI引用、商品導線の改善。",
        risk: "表現が強くなりすぎる場合は再レビューが必要。",
        nextAction: "適用済みリード文をApproval Centerへ送る。",
      },
      ...items,
    ]);
  }

  async function submitAiConsole() {
    setAiStatus("loading");
    setAiResponse(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: aiProvider,
          prompt: aiPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("AI Console request failed");
      }

      const data = (await response.json()) as AiConsoleResponse;
      setAiResponse(data);
      setAiStatus("idle");
      setTimeline((items) =>
        addOperationLog(
          items,
          `${data.provider === "openai" ? "GPT" : "Gemini"}連携テスト`,
          `${data.model} / ${data.mode} modeでTOMOS指令を処理。`,
          "Mobile AI Console",
        ),
      );
    } catch {
      setAiStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_72%_8%,rgba(255,255,255,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_38%)]" />
      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <aside className="flex w-full flex-col justify-between border-b border-white/10 bg-black/80 px-5 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg border border-white/15 bg-white text-base font-semibold text-black">
                T
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.3em] text-white">
                  TOMOS
                </p>
                <p className="text-xs tracking-[0.18em] text-zinc-500">
                  Beta 0.1 / API-ready Demo
                </p>
              </div>
            </div>
            <nav className="mt-8 grid gap-1.5">
              {navItems.map((item) => (
                <a
                  className={`flex min-h-11 items-center justify-between rounded-lg px-3 text-sm transition ${
                    item.active
                      ? "border border-white/10 bg-white/[0.08] text-white"
                      : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                  }`}
                  href="#"
                  key={item.label}
                >
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-zinc-400">
                      {item.badge}
                    </span>
                  ) : null}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              Private Workspace
            </p>
            <p className="mt-3 text-sm font-medium text-white">
              Login required in production
            </p>
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              API接続前のMVPです。操作状態はブラウザ内のみで反映されます。
            </p>
          </div>
        </aside>

        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <header className="border-b border-white/10 pb-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  TOMOS Beta 0.1 / API-ready Demo
                </p>
                <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  TOMOS Command Center
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
                  Private AI Brand Operating System。ユーザー所有ブランドをAIが24時間Operatingし、
                  ユーザーは承認、修正依頼、保留、却下だけで運用します。
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Private AI Brand Operating System",
                  "Login required",
                  "Always-on AI Engines",
                  "Approval-first Workflow",
                ].map((signal) => (
                  <div
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300"
                    key={signal}
                  >
                    {signal}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              Demo Mode: API連携前のMVPです。操作状態はブラウザ内でのみ反映されます。
            </div>
          </header>

          <section className="py-6">
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    iPhone 16 Pro Ready / GPT + Gemini
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Mobile AI Console
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                    iPhoneからTOMOSへ指示し、GPTまたはGeminiでExecutive Brief、Broadcast Mission、
                    Approval判断のたたき台を生成します。APIキー未設定時はmockで安全に動作します。
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-full border border-white/10 bg-black/40 p-1">
                  {[
                    ["openai", "GPT"],
                    ["gemini", "Gemini"],
                  ].map(([provider, label]) => (
                    <button
                      className={`min-h-10 rounded-full px-5 text-sm transition ${
                        aiProvider === provider
                          ? "bg-white text-black"
                          : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                      key={provider}
                      onClick={() => setAiProvider(provider as AiProvider)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
                <textarea
                  className="min-h-32 w-full resize-none rounded-lg border border-white/10 bg-black/40 p-4 text-base leading-7 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                  onChange={(event) => setAiPrompt(event.target.value)}
                  value={aiPrompt}
                />
                <div className="flex flex-col gap-3">
                  <button
                    className="min-h-12 rounded-full bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                    disabled={aiStatus === "loading"}
                    onClick={submitAiConsole}
                    type="button"
                  >
                    {aiStatus === "loading" ? "AIに接続中" : "TOMOSへ送信"}
                  </button>
                  <div className="rounded-lg border border-white/10 bg-black/30 p-4 text-xs leading-5 text-zinc-500">
                    ProductionではOPENAI_API_KEYまたはGEMINI_API_KEYをVercel環境変数に設定します。
                    現在はキー未設定でも画面が破綻しないAPI-ready MVPです。
                  </div>
                </div>
              </div>
              {aiStatus === "error" ? (
                <div className="mt-4 rounded-lg border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
                  AI Consoleの呼び出しに失敗しました。APIキー、モデル名、Vercel環境変数を確認してください。
                </div>
              ) : null}
              {aiResponse ? (
                <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
                      {aiResponse.provider === "openai" ? "GPT" : "Gemini"}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                      {aiResponse.mode}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                      {aiResponse.model}
                    </span>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-300">
                    {aiResponse.output}
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="grid gap-4 py-6 md:grid-cols-3 2xl:grid-cols-6">
            {[
              { label: "Active engines", value: "11/11", detail: "mock data / API-ready" },
              { label: "Pending approvals", value: String(counts.pending), detail: "Executive Approval" },
              { label: "Approved today", value: String(counts.approved), detail: "local state" },
              { label: "On hold", value: String(counts.hold), detail: "local state" },
              { label: "Rejected", value: String(counts.rejected), detail: "local state" },
              { label: "System Health", value: "Beta", detail: "0.1 api-ready demo" },
            ].map((item) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={item.label}>
                <p className="text-sm text-zinc-500">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight">{item.value}</p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">{item.detail}</p>
              </div>
            ))}
          </section>

          <section className="py-2">
            <SectionHeading title="Today's Executive Brief" detail="毎朝ユーザーが見る経営ブリーフ / Mock data" />
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {executiveBrief.map((item) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={item.label}>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                  <h3 className="mt-3 text-lg font-semibold">{item.value}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="py-6">
            <SectionHeading title="Always-On AI Engines" detail="11 engines / API-ready" />
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {aiEngines.map((engine) => (
                <article className="rounded-lg border border-white/10 bg-zinc-950/80 p-5" key={engine.id}>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold">{engine.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[engine.status]}`}>{engine.status}</span>
                  </div>
                  <p className="mt-4 text-xs text-zinc-500">Last run: {engine.lastRun}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">Next action: {engine.nextAction}</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">Output: {engine.output}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_390px]">
            <div>
              <SectionHeading title="Approval Center" detail="操作可能MVP" />
              <div className="grid gap-3">
                {approvals.map((item) => (
                  <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={item.id}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">{approvalLabels[item.status]}</span>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{item.type}</span>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{item.brand}</span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-500">{item.reason}</p>
                      </div>
                      <div className="grid min-w-64 grid-cols-2 gap-2">
                        {[
                          ["承認", "Approved"],
                          ["修正依頼", "Revision requested"],
                          ["保留", "On hold"],
                          ["却下", "Rejected"],
                        ].map(([label, status]) => (
                          <button
                            className={`min-h-10 rounded-full px-4 text-sm transition ${status === "Approved" ? "bg-white text-black hover:bg-zinc-200" : "border border-white/10 text-zinc-300 hover:bg-white/[0.06]"}`}
                            key={status}
                            onClick={() => updateApproval(item.id, status as ApprovalStatus)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside>
              <SectionHeading title="Your Brand Portfolio" detail="sample registered brands" />
              <div className="grid gap-3">
                {userBrands.map((brand) => (
                  <article className="rounded-lg border border-white/10 bg-zinc-950/80 p-4" key={brand.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{brand.name}</h3>
                        <p className="mt-1 text-xs text-zinc-500">{brand.domain}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs ${publicStatusStyles[brand.publicStatus]}`}>{brand.publicStatus}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-lg border border-white/10 bg-black/30 p-3">AIO<br /><span className="text-white">{brand.aioScore}</span></div>
                      <div className="rounded-lg border border-white/10 bg-black/30 p-3">SNS<br /><span className="text-white">{brand.snsHealth}</span></div>
                      <div className="rounded-lg border border-white/10 bg-black/30 p-3">Assets<br /><span className="text-white">{brand.knowledgeAssets}</span></div>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-zinc-500">Commerce Potential: {brand.commercePotential} / Approval待ち: {brand.approvalsPending}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">次の推奨アクション: {brand.nextAction}</p>
                  </article>
                ))}
              </div>
            </aside>
          </section>

          <section className="py-6">
            <SectionHeading title="Broadcast Center" detail="承認すると配信準備中に変わります" />
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-5">
              {broadcasts.map((idea) => (
                <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={idea.id}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">{idea.priority}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{idea.status === "Preparing" ? "配信準備中" : "Ready"}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{idea.title}</h3>
                  <p className="mt-2 text-sm text-zinc-500">{idea.suggestedBrand}</p>
                  <div className="mt-4 grid gap-2 text-xs">
                    <p>AIO Score: {idea.aioScore}</p>
                    <p>SNS Potential: {idea.snsPotential}</p>
                    <p>Product Fit: {idea.productFit}</p>
                  </div>
                  <button
                    className="mt-4 min-h-10 w-full rounded-full bg-white px-4 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
                    disabled={idea.status === "Preparing"}
                    onClick={() => approveBroadcast(idea.id)}
                  >
                    {idea.status === "Preparing" ? "配信準備中" : "承認"}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_390px]">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <SectionHeading title="Content Review AI" detail={`Status: ${review.status}`} />
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{review.assetType}</p>
              <h3 className="mt-2 text-xl font-semibold">{review.title}</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Before</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{review.before}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white p-4 text-black">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">After</p>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">{review.after}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {review.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">{metric.label}</span>
                      <span className="text-zinc-300">{metric.value}</span>
                    </div>
                    <MetricBar value={metric.value} />
                  </div>
                ))}
              </div>
              <button
                className="mt-5 min-h-10 rounded-full bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-600 disabled:text-zinc-300"
                disabled={review.status === "Applied"}
                onClick={applyRewrite}
              >
                {review.status === "Applied" ? "Applied" : "リライト適用"}
              </button>
            </div>

            <aside>
              <SectionHeading title="SNS Health" detail="Mock data" />
              <div className="grid gap-3">
                {snsHealth.map((item) => (
                  <article className="rounded-lg border border-white/10 bg-zinc-950/80 p-4" key={item.channel}>
                    <p className="font-medium">{item.channel} / {item.metric}</p>
                    <p className="mt-1 text-2xl font-semibold">{item.value}</p>
                    <p className="mt-3 text-xs leading-5 text-zinc-500">改善ポイント: {item.issue}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">次のBroadcast Mission: {item.nextPost}</p>
                  </article>
                ))}
              </div>
            </aside>
          </section>

          <section className="grid gap-6 py-6 xl:grid-cols-[1fr_1fr]">
            <div>
              <SectionHeading title="Commerce Analytics" detail="API-ready mock" />
              <div className="grid gap-3">
                {commerceAnalytics.map((item) => (
                  <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={item.post}>
                    <h3 className="font-medium">{item.post}</h3>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      {[
                        ["流入数", item.traffic],
                        ["商品クリック", item.productClicks],
                        ["購入数", item.purchases],
                        ["CVR", item.cvr],
                        ["売上", item.revenue],
                      ].map(([label, value]) => (
                        <div className="rounded-lg border border-white/10 bg-black/30 p-3" key={label}>
                          <p className="text-zinc-500">{label}</p>
                          <p className="mt-1 text-zinc-100">{value}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-zinc-500">売れた理由: {item.soldReason}</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">売れなかった理由: {item.missedReason}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">次の改善案: {item.nextAction}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading title="Product Opportunity" detail="AI item expansion" />
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-[1.3fr_repeat(6,0.8fr)] bg-white/[0.06] px-4 py-3 text-xs text-zinc-400">
                    {["Item", "市場性", "適合", "利益", "AIO", "SNS", "推奨"].map((header) => <span key={header}>{header}</span>)}
                  </div>
                  {productOpportunities.map((item) => (
                    <div className="grid grid-cols-[1.3fr_repeat(6,0.8fr)] border-t border-white/10 px-4 py-3 text-sm text-zinc-300" key={item.item}>
                      <span className="font-medium text-white">{item.item}</span>
                      <span>{item.market}</span>
                      <span>{item.brandFit}</span>
                      <span>{item.profit}</span>
                      <span>{item.aioFit}</span>
                      <span>{item.snsLook}</span>
                      <span>{item.recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_390px]">
            <div>
              <SectionHeading title="Knowledge Vault" detail="知識資産化構造" />
              <div className="grid gap-3 md:grid-cols-3">
                {knowledgeVaultItems.map((item) => (
                  <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={item.title}>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside>
              <SectionHeading title="24h Activity Timeline" detail="local logs included" />
              <div className="grid gap-3">
                {timeline.map((item) => (
                  <article className="grid gap-3 rounded-lg border border-white/10 bg-black/30 p-4 md:grid-cols-[64px_1fr]" key={item.id}>
                    <p className="text-sm font-semibold text-white">{item.time}</p>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-zinc-500">{item.engine}</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">{item.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </section>

          <section className="grid gap-6 py-6 xl:grid-cols-[1fr_390px]">
            <div>
              <SectionHeading title="AI Decision Log" detail="latest operations are added here" />
              <div className="grid gap-3">
                {logs.map((log) => (
                  <article className="rounded-lg border border-white/10 bg-white/[0.04] p-5" key={log.id}>
                    <h3 className="text-lg font-semibold">{log.title}</h3>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {[
                        ["根拠", log.basis],
                        ["想定効果", log.expectedEffect],
                        ["リスク", log.risk],
                        ["次のアクション", log.nextAction],
                      ].map(([label, value]) => (
                        <div className="rounded-lg border border-white/10 bg-black/30 p-4" key={label}>
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                          <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <aside>
              <SectionHeading title="Automation Rules" detail="production plan" />
              <div className="grid gap-3">
                {automationRules.map((rule) => (
                  <article className="rounded-lg border border-white/10 bg-zinc-950/80 p-4" key={rule.title}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{rule.title}</p>
                        <p className="mt-1 text-xs text-zinc-500">{rule.cadence}</p>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{rule.status}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">{rule.target}</p>
                  </article>
                ))}
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
