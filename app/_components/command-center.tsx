import type {
  ActivityTimelineItem,
  AiEngine,
  ApprovalItem,
  ExecutiveBriefItem,
  PortalView,
} from "@/app/_lib/portal-types";
import { GlassCard, PillButton } from "@/app/_components/view-frame";

export function CommandCenter({
  approvals,
  brief,
  engines,
  timeline,
  onNavigate,
}: {
  approvals: ApprovalItem[];
  brief: ExecutiveBriefItem[];
  engines: AiEngine[];
  timeline: ActivityTimelineItem[];
  onNavigate: (view: PortalView) => void;
}) {
  const pending = approvals.filter((item) => item.status === "Pending").length;

  return (
    <div className="grid gap-5">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-400">TOMOS Beta 0.2</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
              Command Center
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
              Private AI Brand Operating System。ユーザーは作業者ではなく承認者です。
            </p>
          </div>
          <div className="grid size-24 place-items-center rounded-full bg-[conic-gradient(white_0deg,white_352deg,rgba(255,255,255,0.12)_352deg)] p-1">
            <div className="grid size-full place-items-center rounded-full bg-black">
              <div className="text-center">
                <p className="text-3xl font-semibold">98%</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Health
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Pending Approvals", String(pending)],
            ["Today’s Brief", "5"],
            ["AI Engines", String(engines.length)],
            ["Timeline", String(timeline.length)],
          ].map(([label, value]) => (
            <GlassCard key={label}>
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <GlassCard onClick={() => onNavigate("brief")}>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Today’s Brief
          </p>
          <h2 className="mt-3 text-2xl font-semibold">{brief[0]?.value}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            {brief[0]?.detail}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Quick Actions
          </p>
          <div className="mt-4 grid gap-2">
            {[
              ["承認待ちを見る", "approvals"],
              ["今日の配信を見る", "broadcast"],
              ["SNS状況を見る", "sns-health"],
              ["商品機会を見る", "product"],
              ["連携設定を見る", "integrations"],
            ].map(([label, view]) => (
              <PillButton
                key={label}
                onClick={() => onNavigate(view as PortalView)}
              >
                {label}
              </PillButton>
            ))}
          </div>
        </GlassCard>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">AI Engines</h2>
          <button
            className="text-sm text-zinc-500"
            onClick={() => onNavigate("integrations")}
            type="button"
          >
            API-ready
          </button>
        </div>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:px-0">
          {engines.slice(0, 5).map((engine) => (
            <GlassCard className="min-w-40" key={engine.id}>
              <p className="text-lg font-semibold">
                {engine.name.replace(" Engine", "").replace(" Intelligence", "")}
              </p>
              <p className="mt-3 text-sm text-zinc-500">{engine.status}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
