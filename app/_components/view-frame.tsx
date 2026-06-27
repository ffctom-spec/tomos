import type { ReactNode } from "react";

export function ViewFrame({
  eyebrow = "00 / TOMOS BETA 0.2",
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
    <section className="border border-white/[0.14] bg-[#040404]/90 p-5 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] backdrop-blur-2xl sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-white/[0.14] pb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
          {detail ? (
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
              {detail}
            </p>
          ) : null}
        </div>
        {onBack ? (
          <button
            className="min-h-11 shrink-0 border border-white/15 bg-black/70 px-4 text-sm text-zinc-200 transition hover:bg-white/10"
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
    ? "cursor-pointer transition hover:border-white/25 hover:bg-white/[0.06]"
    : "";

  return (
    <article
      className={`border border-white/[0.13] bg-[#060606]/85 p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] ${interactive} ${className}`}
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
        ? "border border-white/20 bg-white/5 text-zinc-100 hover:bg-white/10"
        : "border border-white/15 bg-black/55 text-zinc-200 hover:bg-white/10";

  return (
    <button
      className={`min-h-12 px-4 text-sm transition ${toneClass}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
