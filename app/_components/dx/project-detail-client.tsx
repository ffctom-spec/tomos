"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "@/src/data/projects";
import { DxShell, Panel, ProgressBar, StatusBadge } from "./dx-shell";

type DetailTab = "Overview" | "Tasks" | "Files" | "Activity";

export function ProjectDetailClient({ project }: { project: Project }) {
  const [tab, setTab] = useState<DetailTab>("Overview");
  const [tasks, setTasks] = useState(project.tasks);

  const progress = useMemo(() => {
    if (!tasks.length) return project.progress;
    const done = tasks.filter((task) => task.done).length;
    return Math.round((done / tasks.length) * 100);
  }, [project.progress, tasks]);

  function toggleTask(id: string) {
    setTasks((items) =>
      items.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  return (
    <DxShell>
      <div className="grid gap-6">
        <section className="border border-white/[0.14] bg-[#030303]/90 p-6 sm:p-8">
          <Link className="text-sm text-zinc-500 hover:text-white" href="/projects">
            ← 案件一覧へ戻る
          </Link>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  Project Detail
                </p>
                <StatusBadge status={project.status} />
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
                {project.name}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
                {project.summary}
              </p>
            </div>
            <Panel>
              <div className="grid gap-4">
                <Info label="Client" value={project.client} />
                <Info label="Owner" value={project.owner} />
                <Info label="Due" value={project.dueDate} />
                <Info label="Revenue" value={project.revenue} />
                <ProgressBar value={progress} />
              </div>
            </Panel>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Panel>
            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["Overview", "Tasks", "Files", "Activity"] as DetailTab[]).map((item) => (
                <button
                  className={`min-h-12 border px-4 text-sm ${
                    tab === item ? "border-white bg-white text-black" : "border-white/10 text-zinc-400"
                  }`}
                  key={item}
                  onClick={() => setTab(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>

            {tab === "Overview" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <DetailBlock label="概要" value={project.summary} />
                <DetailBlock label="目的" value={project.goal} />
                <DetailBlock label="次のアクション" value={project.nextAction} />
                <DetailBlock label="カテゴリー" value={project.category} />
              </div>
            ) : null}

            {tab === "Tasks" ? (
              <div className="grid gap-3">
                {tasks.map((task) => (
                  <label
                    className="grid cursor-pointer grid-cols-[auto_1fr_auto] gap-3 border border-white/10 bg-black/35 p-4"
                    key={task.id}
                  >
                    <input
                      checked={task.done}
                      className="mt-1"
                      onChange={() => toggleTask(task.id)}
                      type="checkbox"
                    />
                    <span>
                      <span className={task.done ? "text-zinc-500 line-through" : "text-zinc-100"}>
                        {task.title}
                      </span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        {task.owner} / {task.due}
                      </span>
                    </span>
                    <span className="text-xs text-zinc-500">{task.done ? "完了" : "未完了"}</span>
                  </label>
                ))}
              </div>
            ) : null}

            {tab === "Files" ? (
              <div className="grid gap-3">
                {project.files.map((file) => (
                  <div className="grid grid-cols-[1fr_auto_auto] gap-3 border border-white/10 bg-black/35 p-4 text-sm" key={file.id}>
                    <span>{file.name}</span>
                    <span className="text-zinc-500">{file.type}</span>
                    <span className="text-zinc-500">{file.updatedAt}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === "Activity" ? (
              <div className="grid gap-4">
                {project.activity.map((item) => (
                  <div className="border-l border-white/20 pl-4" key={item.id}>
                    <p className="text-sm">{item.actor} が {item.action}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.time}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </Panel>

          <div className="grid gap-6">
            <Panel>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Next Action
              </p>
              <p className="mt-3 text-lg font-semibold">{project.nextAction}</p>
              <button className="mt-5 min-h-12 w-full bg-white px-4 text-sm font-medium text-black" type="button">
                確認済みにする
              </button>
            </Panel>
            <Panel>
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Project Health
              </p>
              <div className="mt-4 grid gap-3">
                <Info label="Priority" value={project.priority} />
                <Info label="Updated" value={project.updatedAt} />
                <Info label="Progress" value={`${progress}%`} />
              </div>
            </Panel>
          </div>
        </section>
      </div>
    </DxShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm text-zinc-200">{value}</p>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/35 p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-3 text-sm leading-7 text-zinc-300">{value}</p>
    </div>
  );
}
