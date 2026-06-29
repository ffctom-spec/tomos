"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ProjectStatus } from "@/src/data/projects";
import { projects } from "@/src/data/projects";
import { DxShell, Panel, ProgressBar, StatusBadge } from "./dx-shell";

const statuses: Array<ProjectStatus | "すべて"> = ["すべて", "未着手", "進行中", "確認待ち", "完了"];

export function ProjectsClient() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "すべて">("すべて");
  const [view, setView] = useState<"card" | "table">("card");
  const [modalOpen, setModalOpen] = useState(false);
  const [createdName, setCreatedName] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchQuery = `${project.name} ${project.client} ${project.category}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchStatus = status === "すべて" || project.status === status;
      return matchQuery && matchStatus;
    });
  }, [query, status]);

  return (
    <DxShell>
      <div className="grid gap-6">
        <section className="border border-white/[0.14] bg-[#030303]/90 p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            Projects / Case Management
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
                案件一覧
              </h1>
              <p className="mt-4 text-sm text-zinc-400">
                クライアント、進捗、期限、担当者を横断して確認します。
              </p>
            </div>
            <button
              className="min-h-12 border border-white bg-white px-5 text-sm font-medium text-black"
              onClick={() => setModalOpen(true)}
              type="button"
            >
              New Project
            </button>
          </div>
        </section>

        <Panel>
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <input
              className="min-h-12 border border-white/10 bg-black/40 px-4 text-sm outline-none focus:border-white/40"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="案件名・クライアント・カテゴリーで検索"
              value={query}
            />
            <select
              className="min-h-12 border border-white/10 bg-black/40 px-4 text-sm"
              onChange={(event) => setStatus(event.target.value as ProjectStatus | "すべて")}
              value={status}
            >
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 border border-white/10">
              {(["card", "table"] as const).map((item) => (
                <button
                  className={`min-h-12 px-4 text-sm ${
                    view === item ? "bg-white text-black" : "text-zinc-400"
                  }`}
                  key={item}
                  onClick={() => setView(item)}
                  type="button"
                >
                  {item === "card" ? "カード" : "テーブル"}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        {createdName ? (
          <Panel>
            <p className="text-sm">
              新規案件「{createdName}」をローカルUI上で作成しました。DB接続後に保存処理へ差し替えます。
            </p>
          </Panel>
        ) : null}

        {view === "card" ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard id={project.id} key={project.id} />
            ))}
          </section>
        ) : (
          <Panel>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <tr className="border-b border-white/10">
                    {["プロジェクト", "クライアント", "カテゴリー", "ステータス", "進捗", "担当者", "更新日", "締切"].map((head) => (
                      <th className="py-3 pr-4 font-normal" key={head}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project) => (
                    <tr className="border-b border-white/10 hover:bg-white/[0.03]" key={project.id}>
                      <td className="py-4 pr-4">
                        <Link className="font-medium hover:text-white" href={`/projects/${project.id}`}>
                          {project.name}
                        </Link>
                      </td>
                      <td className="py-4 pr-4 text-zinc-400">{project.client}</td>
                      <td className="py-4 pr-4 text-zinc-500">{project.category}</td>
                      <td className="py-4 pr-4"><StatusBadge status={project.status} /></td>
                      <td className="py-4 pr-4"><ProgressBar value={project.progress} /></td>
                      <td className="py-4 pr-4 text-zinc-400">{project.owner}</td>
                      <td className="py-4 pr-4 text-zinc-500">{project.updatedAt}</td>
                      <td className="py-4 pr-4 text-zinc-300">{project.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      </div>

      {modalOpen ? (
        <NewProjectModal
          onClose={() => setModalOpen(false)}
          onCreate={(name) => {
            setCreatedName(name);
            setModalOpen(false);
          }}
        />
      ) : null}
    </DxShell>
  );
}

function ProjectCard({ id }: { id: string }) {
  const project = projects.find((item) => item.id === id);
  if (!project) return null;

  return (
    <Link className="block" href={`/projects/${project.id}`}>
      <Panel className="h-full transition hover:border-white/35">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold leading-7">{project.name}</h2>
            <p className="mt-2 text-sm text-zinc-500">{project.client}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-4 text-sm text-zinc-400">{project.category}</p>
        <div className="mt-5">
          <ProgressBar value={project.progress} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-zinc-500">担当者</p>
            <p className="mt-1">{project.owner}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">締切</p>
            <p className="mt-1">{project.dueDate}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">更新日</p>
            <p className="mt-1">{project.updatedAt}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Priority</p>
            <p className="mt-1">{project.priority}</p>
          </div>
        </div>
      </Panel>
    </Link>
  );
}

function NewProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("新規DXプロジェクト");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-white/15 bg-[#050505] p-5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
          New Project / Mock
        </p>
        <h2 className="mt-3 text-2xl font-semibold">新規案件を追加</h2>
        <label className="mt-5 grid gap-2 text-sm">
          プロジェクト名
          <input
            className="min-h-12 border border-white/10 bg-black/40 px-4 outline-none"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>
        <p className="mt-3 text-xs leading-5 text-zinc-500">
          今回はフロントエンド上のモック作成です。DB接続後に永続保存へ差し替えます。
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button className="min-h-12 border border-white/15 px-4 text-sm" onClick={onClose} type="button">
            キャンセル
          </button>
          <button className="min-h-12 bg-white px-4 text-sm font-medium text-black" onClick={() => onCreate(name)} type="button">
            作成
          </button>
        </div>
      </div>
    </div>
  );
}
