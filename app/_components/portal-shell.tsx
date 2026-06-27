import {
  navItems,
  statCards,
  toolCards,
  workflows,
  type ToolCard,
  type WorkflowItem,
} from "@/app/_lib/portal-data";

const accentClasses: Record<ToolCard["accent"], string> = {
  cyan: "from-cyan-300 to-white",
  violet: "from-violet-300 to-white",
  emerald: "from-emerald-300 to-white",
};

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white text-sm font-semibold text-black shadow-[0_0_30px_rgba(255,255,255,0.12)]">
        PB
      </div>
      <div>
        <p className="text-sm font-semibold tracking-[0.24em] text-white">
          PLAN B
        </p>
        <p className="text-xs text-zinc-500">AI command portal</p>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex w-full flex-col justify-between border-b border-white/10 bg-black/70 px-5 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
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

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Workspace
        </p>
        <p className="mt-3 text-sm font-medium text-white">Personal Lab</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-white" />
        </div>
        <p className="mt-3 text-xs text-zinc-500">67% monthly capacity</p>
      </div>
    </aside>
  );
}

function StatusDot({ status }: { status: WorkflowItem["status"] }) {
  const color =
    status === "Running"
      ? "bg-emerald-300"
      : status === "Queued"
        ? "bg-amber-300"
        : "bg-zinc-400";

  return <span className={`size-2 rounded-full ${color}`} />;
}

function ToolCardView({ tool }: { tool: ToolCard }) {
  return (
    <article className="group rounded-lg border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-zinc-900/90">
      <div
        className={`h-24 rounded-lg bg-gradient-to-br ${accentClasses[tool.accent]} opacity-90`}
      />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            {tool.tag}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            {tool.title}
          </h3>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
          {tool.metric}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-zinc-400">{tool.description}</p>
    </article>
  );
}

export function PortalShell() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_38%)]" />
      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-zinc-500">Today / AI Portal</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Build the next move.
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="min-h-11 rounded-full border border-white/10 px-4 text-sm text-zinc-300 transition hover:bg-white/[0.06]">
                Import
              </button>
              <button className="min-h-11 rounded-full bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-200">
                New agent
              </button>
            </div>
          </header>

          <section className="grid gap-4 py-6 md:grid-cols-3">
            {statCards.map((stat) => (
              <div
                className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
                key={stat.label}
              >
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-zinc-500">{stat.delta}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Featured agents</h2>
                <a className="text-sm text-zinc-500 hover:text-white" href="#">
                  View all
                </a>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {toolCards.map((tool) => (
                  <ToolCardView key={tool.title} tool={tool} />
                ))}
              </div>
            </div>

            <aside className="p-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Live workflows</h2>
                <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                  Online
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {workflows.map((workflow) => (
                  <div
                    className="rounded-lg border border-white/10 bg-black/30 p-4"
                    key={workflow.title}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">
                          {workflow.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {workflow.detail}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                        <StatusDot status={workflow.status} />
                        {workflow.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-white/10 bg-white text-black">
                <div className="border-b border-black/10 px-4 py-3">
                  <p className="text-sm font-semibold">Quick prompt</p>
                </div>
                <p className="px-4 py-4 text-sm leading-6 text-zinc-700">
                  新しい事業アイデアを、調査・仮説・実行タスクに分解して。
                </p>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
