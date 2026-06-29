"use client";

import Link from "next/link";
import { projects } from "@/src/data/projects";
import { DxShell, Panel, ProgressBar, StatusBadge } from "./dx-shell";

export function DashboardClient() {
  const activeProjects = projects.filter((project) => project.status !== "完了");
  const tasks = projects.flatMap((project) =>
    project.tasks.map((task) => ({ ...task, project: project.name, projectId: project.id })),
  );
  const pendingTasks = tasks.filter((task) => !task.done);
  const pendingApproval = projects.filter((project) => project.status === "確認待ち").length;
  const revenue = projects.reduce((sum, project) => {
    const value = Number(project.revenue.replace(/[¥,]/g, ""));
    return sum + (Number.isNaN(value) ? 0 : value);
  }, 0);
  const today = new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "full",
  }).format(new Date());

  return (
    <DxShell>
      <div className="grid gap-6">
        <section className="border border-white/[0.14] bg-[#030303]/90 p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            Dashboard / TOMOS Control Portal
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div>
              <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
                Good morning, TOM
              </h1>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                {today}。案件、顧客、タスク、承認待ちを一画面で判断します。
              </p>
            </div>
            <Link
              className="grid min-h-14 place-items-center border border-white bg-white px-5 text-sm font-medium text-black"
              href="/projects"
            >
              Projectsを開く
            </Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Active Projects", String(activeProjects.length), "進行中・確認待ちを含む"],
            ["This Week Tasks", String(pendingTasks.length), "未完了タスク"],
            ["Pending Approval", String(pendingApproval), "確認待ち案件"],
            ["Monthly Revenue", `¥${revenue.toLocaleString()}`, "Mock project value"],
          ].map(([label, value, note]) => (
            <Panel key={label}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                {label}
              </p>
              <p className="mt-4 text-4xl font-semibold">{value}</p>
              <p className="mt-3 text-xs text-zinc-500">{note}</p>
            </Panel>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <Panel>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  Priority Projects
                </p>
                <h2 className="mt-2 text-2xl font-semibold">今日見るべき案件</h2>
              </div>
              <Link className="text-sm text-zinc-400 hover:text-white" href="/projects">
                すべて見る
              </Link>
            </div>
            <div className="grid gap-3">
              {projects.slice(0, 4).map((project) => (
                <Link
                  className="grid gap-4 border border-white/10 bg-black/35 p-4 transition hover:border-white/35 md:grid-cols-[1fr_140px_120px]"
                  href={`/projects/${project.id}`}
                  key={project.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="mt-2 text-sm text-zinc-500">
                      {project.client} / {project.category}
                    </p>
                    <div className="mt-4">
                      <ProgressBar value={project.progress} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">担当者</p>
                    <p className="mt-2 text-sm">{project.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">締切</p>
                    <p className="mt-2 text-sm">{project.dueDate}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Panel>

          <div className="grid gap-6">
            <Panel>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Today&apos;s Tasks
              </p>
              <div className="mt-4 grid gap-3">
                {pendingTasks.slice(0, 4).map((task) => (
                  <Link
                    className="border border-white/10 bg-black/35 p-3 text-sm hover:border-white/35"
                    href={`/projects/${task.projectId}`}
                    key={task.id}
                  >
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {task.project} / {task.due}
                    </p>
                  </Link>
                ))}
              </div>
            </Panel>

            <Panel>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Upcoming Deadlines
              </p>
              <div className="mt-4 grid gap-3">
                {projects.slice(0, 4).map((project) => (
                  <div className="grid grid-cols-[1fr_auto] gap-3 text-sm" key={project.id}>
                    <span className="truncate text-zinc-300">{project.name}</span>
                    <span className="text-zinc-500">{project.dueDate}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Recent Activity
              </p>
              <div className="mt-4 grid gap-3">
                {projects.slice(0, 3).map((project) => (
                  <div className="border-l border-white/20 pl-3 text-sm" key={project.id}>
                    <p>{project.activity[0]?.action}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {project.client} / {project.activity[0]?.time}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>
      </div>
    </DxShell>
  );
}
