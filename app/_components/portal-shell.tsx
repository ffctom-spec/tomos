"use client";

import { useMemo, useRef, useState } from "react";
import {
  activityTimeline,
  aiEngines,
  approvalItems,
  broadcastIdeas,
  executiveBrief,
  userBrands,
} from "@/app/_lib/portal-data";
import type {
  ActivityTimelineItem,
  AiConsoleResponse,
  AiProvider,
  ApprovalItem,
  ApprovalStatus,
  DecisionLog,
  EngineStatus,
} from "@/app/_lib/portal-types";

const statusStyles: Record<EngineStatus, string> = {
  Running: "bg-emerald-300/15 text-emerald-100 ring-emerald-300/20",
  Monitoring: "bg-sky-300/15 text-sky-100 ring-sky-300/20",
  Queued: "bg-amber-300/15 text-amber-100 ring-amber-300/20",
  Learning: "bg-violet-300/15 text-violet-100 ring-violet-300/20",
  "Waiting approval": "bg-white text-black ring-white/40",
  Paused: "bg-zinc-300/10 text-zinc-300 ring-zinc-300/15",
};

const approvalLabels: Record<ApprovalStatus, string> = {
  Pending: "承認待ち",
  Approved: "承認",
  "Revision requested": "修正依頼",
  "On hold": "保留",
  Rejected: "却下",
};

const todayBrief = [
  "今日一番重要な判断",
  "今日の売上チャンス",
  "今日作るべきKnowledge Cast",
  "今日伸びそうなテーマ",
  "今日やらない方がいいこと",
];

const quickPrompts = {
  Broadcast: "今日作るべきBroadcast Missionを1つだけ選び、承認判断の理由を短く出してください。",
  Review: "今日レビューすべきコンテンツの改善点を、ブランド適合性とAIO観点で要約してください。",
  Product: "今日の売上チャンスが高い商品候補を1つ選び、理由とリスクを出してください。",
  Approvals: "承認待ちの中から、今すぐ判断すべき項目を優先順位つきで示してください。",
  "Executive Brief": "今日のExecutive Briefを5行で再要約してください。",
};

const connectedServices = [
  "OpenAI",
  "Anthropic",
  "Google",
  "YouTube",
  "Instagram",
  "Threads",
  "Pinterest",
  "Shopify",
  "BASE",
  "Mercari",
  "Analytics",
  "Search Console",
  "GitHub",
  "Vercel",
  "Slack",
  "Notion",
  "Cron",
];

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

function SectionTitle({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Executive Mode
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
      </div>
      {detail ? <p className="text-xs text-zinc-500">{detail}</p> : null}
    </div>
  );
}

function HealthRing({ value }: { value: number }) {
  return (
    <div className="relative grid size-24 place-items-center rounded-full bg-[conic-gradient(white_0deg,white_352deg,rgba(255,255,255,0.12)_352deg)] p-1 shadow-[0_0_40px_rgba(255,255,255,0.12)]">
      <div className="grid size-full place-items-center rounded-full bg-black">
        <div className="text-center">
          <p className="text-3xl font-semibold tracking-tight">{value}%</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Health
          </p>
        </div>
      </div>
    </div>
  );
}

export function PortalShell() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(approvalItems);
  const [timeline, setTimeline] =
    useState<ActivityTimelineItem[]>(activityTimeline);
  const [logs, setLogs] = useState<DecisionLog[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(
    null,
  );
  const [showAssistant, setShowAssistant] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [aiProvider, setAiProvider] = useState<AiProvider>("openai");
  const [aiPrompt, setAiPrompt] = useState(
    "今日の判断で、今すぐ承認すべきものを1つだけ教えてください。",
  );
  const [aiResponse, setAiResponse] = useState<AiConsoleResponse | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "loading" | "error">("idle");
  const touchStartX = useRef<number | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const counts = useMemo(
    () => ({
      pending: approvals.filter((item) => item.status === "Pending").length,
      approved: approvals.filter((item) => item.status === "Approved").length,
      hold: approvals.filter((item) => item.status === "On hold").length,
      rejected: approvals.filter((item) => item.status === "Rejected").length,
    }),
    [approvals],
  );

  const primaryBrand = userBrands[0];
  const kpis = [
    { label: "AIO Score", value: String(primaryBrand.aioScore), detail: "+8" },
    { label: "SNS Health", value: String(primaryBrand.snsHealth), detail: "Learning" },
    { label: "Revenue", value: "¥115K", detail: "+12%" },
    { label: "Knowledge Assets", value: String(primaryBrand.knowledgeAssets), detail: "+9" },
    { label: "Pending", value: String(counts.pending), detail: "Approval" },
  ];

  const visibleEngines = aiEngines.filter((engine) =>
    ["research", "aio", "sns", "commerce", "vault"].includes(engine.id),
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
        title: `${target.type}を${approvalLabels[status]}`,
        basis: `${target.brand} / ${target.title}`,
        expectedEffect:
          status === "Approved"
            ? "AIが配信準備、Knowledge Vault化、Learning Loopへ進みます。"
            : "AIが次の提案を再調整します。",
        risk: "Beta 0.2ではブラウザ内状態のみ更新されます。",
        nextAction:
          status === "Approved"
            ? "Broadcast Missionと公開前チェックへ進む。"
            : "保留または再提案としてExecutive Queueに残す。",
      },
      ...items,
    ]);
  }

  function approveBroadcast() {
    const target = broadcastIdeas[0];
    setTimeline((items) =>
      addOperationLog(
        items,
        "Broadcast Approved",
        `${target.title}を${target.suggestedBrand}向けに準備。`,
        "Executive Mode",
      ),
    );
  }

  function startLongPress(item: ApprovalItem) {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    longPressTimer.current = setTimeout(() => {
      setSelectedApproval(item);
    }, 520);
  }

  function clearLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  }

  function handleSwipe(item: ApprovalItem, endX: number) {
    if (touchStartX.current === null) return;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (delta > 64) {
      updateApproval(item.id, "Approved");
    }
    if (delta < -64) {
      updateApproval(item.id, "On hold");
    }
  }

  async function submitAiConsole(prompt = aiPrompt) {
    setAiStatus("loading");
    setAiResponse(null);
    setShowAssistant(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: aiProvider,
          prompt,
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
          `${data.provider === "openai" ? "GPT" : "Gemini"} Assistant`,
          `${data.model} / ${data.mode} modeでExecutive判断を生成。`,
          "AI Assistant",
        ),
      );
    } catch {
      setAiStatus("error");
    }
  }

  function handleQuickAction(label: keyof typeof quickPrompts) {
    const prompt = quickPrompts[label];
    setAiPrompt(prompt);
    if (label === "Broadcast") {
      approveBroadcast();
    }
    void submitAiConsole(prompt);
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_34%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 mx-auto h-8 w-36 rounded-b-[2rem] bg-black/80 shadow-[0_12px_50px_rgba(255,255,255,0.08)] ring-1 ring-white/10 sm:hidden" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col pb-28 md:px-6 lg:flex-row lg:gap-6 lg:pb-8">
        <aside className="hidden w-72 shrink-0 py-6 lg:block">
          <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-white text-base font-semibold text-black">
                T
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.3em]">TOMOS</p>
                <p className="text-xs text-zinc-500">Beta 0.2 / Operating Center</p>
              </div>
            </div>
            <div className="mt-8 grid gap-2">
              {["Executive Dashboard", "AI Engines", "Approval Queue", "KPI", "Timeline", "Integrations"].map(
                (item) => (
                  <div
                    className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300 first:bg-white first:text-black"
                    key={item}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Mode
              </p>
              <p className="mt-2 text-lg font-semibold">Operating Center</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Desktopは全体把握。MobileはExecutive判断だけに圧縮。
              </p>
            </div>
          </div>
        </aside>

        <main className="w-full min-w-0 px-4 pt-10 sm:px-6 md:pt-6 lg:px-0">
          <header className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-7 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">Good Morning,</p>
                <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-6xl">
                  Tom.
                </h1>
              </div>
              <button
                className="relative grid size-12 place-items-center rounded-full border border-white/10 bg-black/40 text-xl backdrop-blur-xl transition hover:bg-white/10"
                onClick={() => setShowNotifications((value) => !value)}
                type="button"
              >
                <span aria-hidden>⌁</span>
                <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-white text-[10px] font-semibold text-black">
                  {counts.pending}
                </span>
              </button>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-[1fr_140px] md:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  Today
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  2026/06/27
                </p>
                <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm text-zinc-300">
                  <span className="size-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
                  AIが24時間動作中
                </div>
              </div>
              <HealthRing value={98} />
            </div>
          </header>

          {showNotifications ? (
            <section className="mt-4 rounded-3xl border border-white/10 bg-zinc-950/90 p-5 backdrop-blur-2xl">
              <SectionTitle title="Notification Center" detail="live signals" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  ["未承認", `${counts.pending}件`],
                  ["AI提案", "12件"],
                  ["売上変化", "+12%"],
                  ["AIO急上昇", "土壌改良"],
                  ["SNS異常", "Shorts維持率"],
                ].map(([label, value]) => (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={label}>
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="mt-2 text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-5">
            <SectionTitle title="Today's Executive Brief" detail="5 decisions" />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {todayBrief.map((label, index) => {
                const item = executiveBrief[index];
                return (
                  <article
                    className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl"
                    key={label}
                  >
                    <p className="text-xs text-zinc-500">{label}</p>
                    <h3 className="mt-3 text-lg font-semibold leading-tight">
                      {item.value}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {item.detail}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-7">
            <SectionTitle title="Approval Queue" detail="右スワイプ承認 / 左スワイプ保留" />
            <div className="grid gap-3 xl:grid-cols-2">
              {approvals.slice(0, 5).map((item) => (
                <article
                  className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-1 backdrop-blur-xl"
                  key={item.id}
                  onTouchEnd={(event) =>
                    handleSwipe(item, event.changedTouches[0]?.clientX ?? 0)
                  }
                  onTouchStart={(event) => {
                    touchStartX.current = event.touches[0]?.clientX ?? null;
                    startLongPress(item);
                  }}
                  onPointerDown={() => startLongPress(item)}
                  onPointerUp={clearLongPress}
                  onPointerLeave={clearLongPress}
                >
                  <div className="absolute inset-y-0 left-0 grid w-24 place-items-center bg-emerald-300/15 text-xs text-emerald-100">
                    承認
                  </div>
                  <div className="absolute inset-y-0 right-0 grid w-24 place-items-center bg-amber-300/15 text-xs text-amber-100">
                    保留
                  </div>
                  <div className="relative rounded-[1.55rem] bg-black/80 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          {item.type}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold leading-tight">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-zinc-500">{item.brand}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
                        {approvalLabels[item.status]}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-zinc-400">
                      {item.reason}
                    </p>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {[
                        ["承認", "Approved"],
                        ["修正", "Revision requested"],
                        ["保留", "On hold"],
                        ["却下", "Rejected"],
                      ].map(([label, status]) => (
                        <button
                          className={`min-h-10 rounded-full text-xs transition ${
                            status === "Approved"
                              ? "bg-white text-black"
                              : "border border-white/10 text-zinc-300 hover:bg-white/10"
                          }`}
                          key={status}
                          onClick={() =>
                            updateApproval(item.id, status as ApprovalStatus)
                          }
                          type="button"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-center text-[11px] text-zinc-600">
                      swipe right approve / swipe left hold / long press detail
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-7">
            <SectionTitle title="AI Engines" detail="mobile horizontal" />
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
              {visibleEngines.map((engine) => (
                <article
                  className="min-w-40 snap-start rounded-3xl border border-white/10 bg-white/[0.045] p-5"
                  key={engine.id}
                >
                  <p className="text-2xl font-semibold">
                    {engine.name.replace(" Engine", "").replace(" Intelligence", "")}
                  </p>
                  <span
                    className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs ring-1 ${statusStyles[engine.status]}`}
                  >
                    {engine.status}
                  </span>
                  <p className="mt-4 text-xs leading-5 text-zinc-500">
                    {engine.lastRun}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-7">
            <SectionTitle title="Today's KPI" detail="5 signals only" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {kpis.map((item) => (
                <article
                  className="rounded-3xl border border-white/10 bg-white/[0.055] p-5"
                  key={item.label}
                >
                  <p className="text-xs text-zinc-500">{item.label}</p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-7 grid gap-5 lg:grid-cols-[1fr_380px]">
            <div>
              <SectionTitle title="Activity Timeline" detail="today" />
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                {[
                  ["06:00", "Research Complete", "Research Engine"],
                  ["08:00", "Executive Brief", "Approval Engine"],
                  ["10:00", "Instagram改善", "SNS Engine"],
                  ["13:00", "Knowledge Cast生成", "Knowledge Engine"],
                  ["16:00", "Commerce分析", "Commerce Engine"],
                  ...timeline.slice(0, 2).map((item) => [
                    item.time,
                    item.title,
                    item.engine,
                  ]),
                ].map(([time, title, engine], index) => (
                  <div className="grid grid-cols-[64px_24px_1fr] gap-3" key={`${time}-${title}-${index}`}>
                    <p className="pt-1 text-sm font-medium text-zinc-300">{time}</p>
                    <div className="flex flex-col items-center">
                      <span className="mt-1 size-2.5 rounded-full bg-white" />
                      <span className="h-full min-h-10 w-px bg-white/10" />
                    </div>
                    <div className="pb-5">
                      <p className="font-medium text-white">{title}</p>
                      <p className="mt-1 text-xs text-zinc-500">{engine}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="hidden lg:block">
              <SectionTitle title="Connected Future" detail="API-ready" />
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                <div className="flex flex-wrap gap-2">
                  {connectedServices.map((service) => (
                    <span
                      className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-400"
                      key={service}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                <SectionTitle title="Executive Log" detail="local" />
                <div className="grid gap-3">
                  {(logs.length ? logs.slice(0, 3) : [
                    {
                      id: "empty",
                      title: "No manual action yet",
                      basis: "Swipe or tap an approval to create a decision log.",
                    },
                  ]).map((log) => (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4" key={log.id}>
                      <p className="text-sm font-medium">{log.title}</p>
                      <p className="mt-2 text-xs leading-5 text-zinc-500">
                        {log.basis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>

          <section className="mt-7 rounded-3xl border border-white/10 bg-white/[0.045] p-5 lg:hidden">
            <SectionTitle title="Connected Future" detail="API-ready" />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {connectedServices.map((service) => (
                <span
                  className="shrink-0 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-400"
                  key={service}
                >
                  {service}
                </span>
              ))}
            </div>
          </section>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/75 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-2xl">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-2">
          {(Object.keys(quickPrompts) as Array<keyof typeof quickPrompts>).map(
            (label) => (
              <button
                className="min-h-14 rounded-2xl border border-white/10 bg-white/[0.06] px-1 text-[11px] text-zinc-300 transition hover:bg-white/10"
                key={label}
                onClick={() => handleQuickAction(label)}
                type="button"
              >
                <span className="block text-lg leading-none">+</span>
                {label}
              </button>
            ),
          )}
        </div>
      </nav>

      <button
        className="fixed bottom-28 right-5 z-50 grid size-14 place-items-center rounded-full bg-white text-lg font-semibold text-black shadow-[0_16px_70px_rgba(255,255,255,0.22)] transition hover:scale-105"
        onClick={() => setShowAssistant((value) => !value)}
        type="button"
      >
        T
      </button>

      {showAssistant ? (
        <div className="fixed inset-x-3 bottom-44 z-50 mx-auto max-w-md rounded-[2rem] border border-white/10 bg-zinc-950/95 p-4 shadow-2xl shadow-black backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                AI Assistant
              </p>
              <h2 className="mt-1 text-lg font-semibold">今日の判断を相談</h2>
            </div>
            <div className="grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-black/50 p-1">
              {[
                ["openai", "GPT"],
                ["gemini", "Gemini"],
              ].map(([provider, label]) => (
                <button
                  className={`rounded-full px-3 py-1 text-xs ${
                    aiProvider === provider
                      ? "bg-white text-black"
                      : "text-zinc-500"
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
          <textarea
            className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/50 p-4 text-sm leading-6 text-white outline-none focus:border-white/30"
            onChange={(event) => setAiPrompt(event.target.value)}
            value={aiPrompt}
          />
          <button
            className="mt-3 min-h-11 w-full rounded-full bg-white px-5 text-sm font-medium text-black disabled:bg-zinc-700 disabled:text-zinc-400"
            disabled={aiStatus === "loading"}
            onClick={() => void submitAiConsole()}
            type="button"
          >
            {aiStatus === "loading" ? "Thinking" : "Ask TOMOS"}
          </button>
          {aiStatus === "error" ? (
            <p className="mt-3 rounded-2xl bg-red-400/10 p-3 text-sm text-red-100">
              AI接続に失敗しました。環境変数を確認してください。
            </p>
          ) : null}
          {aiResponse ? (
            <div className="mt-3 max-h-56 overflow-y-auto rounded-2xl border border-white/10 bg-black/50 p-4">
              <p className="text-xs text-zinc-500">
                {aiResponse.provider} / {aiResponse.mode} / {aiResponse.model}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-200">
                {aiResponse.output}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {selectedApproval ? (
        <div className="fixed inset-0 z-[60] grid place-items-end bg-black/70 p-4 backdrop-blur-sm sm:place-items-center">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-zinc-950 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Approval Detail
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{selectedApproval.title}</h2>
            <p className="mt-2 text-sm text-zinc-500">{selectedApproval.type}</p>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              {selectedApproval.reason}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                className="min-h-11 rounded-full bg-white text-sm font-medium text-black"
                onClick={() => {
                  updateApproval(selectedApproval.id, "Approved");
                  setSelectedApproval(null);
                }}
                type="button"
              >
                承認
              </button>
              <button
                className="min-h-11 rounded-full border border-white/10 text-sm text-zinc-300"
                onClick={() => setSelectedApproval(null)}
                type="button"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
