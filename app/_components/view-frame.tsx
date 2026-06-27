import type { ReactNode } from "react";

export function ViewFrame({
  eyebrow = "TOMOS Beta 0.2",
  title,
  detail,
  onBack,
  children,
}: {
  eyebrow?: string;
  title: string;
  detail?: string;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.25rem] border border-white/[0.12] bg-[#050505]/85 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-4 border-b border-white/10 pb-7">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
          {detail ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              {detail}
            </p>
          ) : null}
        </div>
        {onBack ? (
          <button
            className="min-h-11 shrink-0 rounded-xl border border-white/10 bg-black/60 px-4 text-sm text-zinc-200 transition hover:bg-white/10"
            onClick={onBack}
            type="button"
          >
            戻る
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function GlassCard({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const interactive = onClick
    ? "cursor-pointer transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.075]"
    : "";

  return (
    <article
      className={`rounded-2xl border border-white/[0.12] bg-[#070707]/75 p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] ${interactive} ${className}`}
      onClick={onClick}
    >
      {children}
    </article>
  );
}

export function PillButton({
  children,
  onClick,
  tone = "dark",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "light" | "dark" | "danger";
}) {
  const toneClass =
    tone === "light"
      ? "bg-white text-black hover:bg-zinc-200"
      : tone === "danger"
        ? "border border-red-300/20 bg-red-300/10 text-red-100 hover:bg-red-300/15"
        : "border border-white/10 bg-black/45 text-zinc-200 hover:bg-white/10";

  return (
    <button
      className={`min-h-11 rounded-xl px-4 text-sm transition ${toneClass}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
