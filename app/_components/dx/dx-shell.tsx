"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Clients", href: "#" },
  { label: "Tasks", href: "#" },
  { label: "Calendar", href: "#" },
  { label: "Assets", href: "#" },
  { label: "Settings", href: "#" },
];

export function DxShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-14%,rgba(255,255,255,0.10),transparent_30%),linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.016)_1px,transparent_1px)] bg-[length:auto,64px_64px,64px_64px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1540px] flex-col lg:flex-row">
        <aside className="border-b border-white/[0.12] bg-[#030303]/90 p-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
          <Link className="flex items-center gap-3" href="/">
            <div className="grid size-11 place-items-center bg-white text-base font-semibold text-black">
              T
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.3em]">TOMOS</p>
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Control Portal
              </p>
            </div>
          </Link>

          <nav className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : item.href !== "#" && pathname.startsWith(item.href);

              if (item.href === "#") {
                return (
                  <button
                    className="min-h-11 border border-white/10 bg-black/30 px-3 text-left text-sm text-zinc-500"
                    key={item.label}
                    type="button"
                  >
                    {item.label}
                    <span className="ml-2 text-[10px] uppercase tracking-[0.14em]">
                      準備中
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  className={`min-h-11 border px-3 py-3 text-sm transition ${
                    active
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-black/35 text-zinc-300 hover:border-white/35"
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/[0.12] bg-black/80 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  Private Workspace
                </p>
                <p className="mt-1 truncate text-sm text-zinc-300">
                  案件・顧客・タスクを一画面で判断するDXポータル
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="grid size-10 place-items-center border border-white/10 text-sm" type="button">
                  ⌕
                </button>
                <button className="grid size-10 place-items-center border border-white/10 text-sm" type="button">
                  ◌
                </button>
                <div className="hidden border border-white/10 px-3 py-2 sm:block">
                  <p className="text-sm font-medium">TOM / Admin</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                    ● Online
                  </p>
                </div>
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-white/[0.12] bg-[#050505]/85 p-5 ${className}`}>
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "完了"
      ? "bg-white text-black"
      : status === "確認待ち"
        ? "border-white/30 text-zinc-100"
        : status === "進行中"
          ? "border-white/20 text-zinc-300"
          : "border-white/10 text-zinc-500";

  return (
    <span className={`border px-3 py-1 text-xs ${tone}`}>
      {status}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div>
      <div className="h-px bg-white/10">
        <div className="h-px bg-white" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-2 text-xs text-zinc-500">{value}%</p>
    </div>
  );
}
