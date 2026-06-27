import {
  activityTimeline,
  aiEngines,
  automationRules,
  decisionLogs,
  executiveApprovals,
  navItems,
  systemHealth,
  type EngineStatus,
} from "@/app/_lib/portal-data";

const statusStyles: Record<EngineStatus, string> = {
  Running: "bg-emerald-300/10 text-emerald-200",
  Monitoring: "bg-cyan-300/10 text-cyan-200",
  Queued: "bg-amber-300/10 text-amber-200",
  "Waiting approval": "bg-white text-black",
  Learning: "bg-violet-300/10 text-violet-200",
  Paused: "bg-zinc-300/10 text-zinc-300",
};

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded-lg border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(214,214,214,0.82))] text-base font-semibold text-black shadow-[0_0_32px_rgba(255,255,255,0.16)]">
        T
      </div>
      <div>
        <p className="text-sm font-semibold tracking-[0.3em] text-white">
          TOMOS
        </p>
        <p className="text-xs tracking-[0.18em] text-zinc-500">
          AI Brand Operating System
        </p>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex w-full flex-col justify-between border-b border-white/10 bg-black/80 px-5 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
      <div>
        <BrandMark />
        <nav className="mt-8 grid gap-1.5">
          {navItems.map((item) => (
            <a
              className={`flex min-h-11 items-center justify-between rounded-lg px-3 text-sm transition ${
                item.active
                  ? "border border-white/10 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
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

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Operating Mode
        </p>
        <p className="mt-3 text-sm font-medium text-white">
          24h Always-On / Approval-first
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[87%] rounded-full bg-white" />
        </div>
        <p className="mt-3 text-xs leading-5 text-zinc-500">
          AIが常時リサーチ・分析・提案・改善し、ユーザーはExecutive Approvalだけ判断。
        </p>
      </div>
    </aside>
  );
}

function SectionHeading({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {detail ? <p className="text-sm text-zinc-500">{detail}</p> : null}
    </div>
  );
}

function StatusBadge({ status }: { status: EngineStatus }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function PortalShell() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_72%_8%,rgba(255,255,255,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_38%)]" />
      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <header className="border-b border-white/10 pb-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  TOMOS / 24h AI Brand Operating System
                </p>
                <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  AIが24時間動き、あなたは承認だけする。
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
                  TOMOSは単なるDashboardではなく、Research、AIO、SNS、Commerce、
                  Content Review、Knowledge Vault、Learning Loopを常時回すCommand Centerです。
                  AIがBroadcast Missionを選び、根拠を示し、Executive Approvalへ集約します。
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {["Command Center", "Private Workspace", "Always-On AI", "Executive Approval"].map(
                  (signal) => (
                    <div
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300"
                      key={signal}
                    >
                      {signal}
                    </div>
                  ),
                )}
              </div>
            </div>
          </header>

          <section className="grid gap-4 py-6 md:grid-cols-3 2xl:grid-cols-6">
            {systemHealth.map((item) => (
              <div
                className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
                key={item.label}
              >
                <p className="text-sm text-zinc-500">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {item.value}
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {item.detail}
                </p>
              </div>
            ))}
          </section>

          <section className="py-2">
            <SectionHeading
              title="Always-On AI Engine"
              detail="AIが24時間稼働している状態をエンジン単位で可視化"
            />
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {aiEngines.map((engine) => (
                <article
                  className="rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30"
                  key={engine.name}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white">
                      {engine.name}
                    </h3>
                    <StatusBadge status={engine.status} />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">
                    {engine.signal}
                  </p>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-xs text-zinc-500">
                      Last run: {engine.lastRun}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {engine.output}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-6 py-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <SectionHeading
                title="24h Activity Timeline"
                detail="過去24時間にAIが実行したOperating Log"
              />
              <div className="grid gap-3">
                {activityTimeline.map((item) => (
                  <article
                    className="grid gap-3 rounded-lg border border-white/10 bg-black/30 p-4 md:grid-cols-[72px_1fr]"
                    key={`${item.time}-${item.title}`}
                  >
                    <p className="text-sm font-semibold text-white">
                      {item.time}
                    </p>
                    <div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                          {item.engine}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {item.detail}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading
                title="Executive Approval Queue"
                detail="ユーザーが見るべき承認判断だけを集約"
              />
              <div className="grid gap-3">
                {executiveApprovals.map((item) => (
                  <article
                    className="rounded-lg border border-white/10 bg-zinc-950/80 p-5"
                    key={item.title}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
                            {item.priority}
                          </span>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                            {item.type}
                          </span>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                            {item.brand}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                          {item.reason}
                        </p>
                      </div>
                      <div className="grid min-w-64 grid-cols-2 gap-2">
                        {["承認", "修正依頼", "保留", "却下"].map((action) => (
                          <button
                            className={`min-h-10 rounded-full px-4 text-sm transition ${
                              action === "承認"
                                ? "bg-white text-black hover:bg-zinc-200"
                                : "border border-white/10 text-zinc-300 hover:bg-white/[0.06]"
                            }`}
                            key={action}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_390px]">
            <div>
              <SectionHeading
                title="AI Decision Log"
                detail="AIがなぜその提案をしたのかを説明"
              />
              <div className="grid gap-3">
                {decisionLogs.map((log) => (
                  <article
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
                    key={log.title}
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {log.title}
                    </h3>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {[
                        ["根拠", log.basis],
                        ["想定効果", log.expectedEffect],
                        ["リスク", log.risk],
                        ["次のアクション", log.nextAction],
                      ].map(([label, value]) => (
                        <div
                          className="rounded-lg border border-white/10 bg-black/30 p-4"
                          key={label}
                        >
                          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                            {label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-zinc-300">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-white/10 bg-zinc-950/80 p-5">
              <SectionHeading
                title="Automation Rules"
                detail="将来的な自動Operatingルール"
              />
              <div className="grid gap-3">
                {automationRules.map((rule) => (
                  <article
                    className="rounded-lg border border-white/10 bg-black/30 p-4"
                    key={rule.title}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{rule.title}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {rule.cadence}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                        {rule.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {rule.target}
                    </p>
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
