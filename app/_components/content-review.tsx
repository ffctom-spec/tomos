import type { AiReviewResponse } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

export function ContentReviewView({
  content,
  brand,
  channel,
  result,
  status,
  onBack,
  onContentChange,
  onBrandChange,
  onChannelChange,
  onReview,
  onApply,
}: {
  content: string;
  brand: string;
  channel: string;
  result: AiReviewResponse | null;
  status: "idle" | "loading" | "error";
  onBack: () => void;
  onContentChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onChannelChange: (value: string) => void;
  onReview: () => void;
  onApply: () => void;
}) {
  return (
    <ViewFrame title="Content Review AI" detail="記事・リード文・SNS投稿・動画台本をAIレビュー" onBack={onBack}>
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <GlassCard>
          <label className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            入力欄
          </label>
          <textarea
            className="mt-3 min-h-44 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-7 text-white outline-none focus:border-white/30"
            onChange={(event) => onContentChange(event.target.value)}
            value={content}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-zinc-500">
              ブランド選択
              <select
                className="mt-2 min-h-11 w-full rounded-full border border-white/10 bg-black px-4 text-sm text-white"
                onChange={(event) => onBrandChange(event.target.value)}
                value={brand}
              >
                {["VERDNA", "YUGAWA Residence", "PAJOUR", "titi&joji"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-zinc-500">
              媒体選択
              <select
                className="mt-2 min-h-11 w-full rounded-full border border-white/10 bg-black px-4 text-sm text-white"
                onChange={(event) => onChannelChange(event.target.value)}
                value={channel}
              >
                {["Instagram", "YouTube", "Threads", "Blog", "Knowledge Cast"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <PillButton tone="light" onClick={onReview}>
              {status === "loading" ? "レビュー中" : "AIレビュー実行"}
            </PillButton>
            <PillButton onClick={onApply}>リライト適用</PillButton>
            <PillButton>承認</PillButton>
          </div>
          {status === "error" ? (
            <p className="mt-3 rounded-2xl bg-red-300/10 p-3 text-sm text-red-100">
              レビューに失敗しました。環境変数またはAPI routeを確認してください。
            </p>
          ) : null}
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            レビュー結果
          </p>
          {result ? (
            <>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{result.summary}</p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {result.scores.map((score) => (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={score.label}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{score.label}</p>
                      <span className="text-sm text-zinc-300">{score.score}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-zinc-500">{score.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-zinc-500">Before</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{content}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-black">
                  <p className="text-xs text-zinc-500">After</p>
                  <p className="mt-2 text-sm leading-6">{result.rewrite}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm leading-7 text-zinc-500">
              AIレビュー実行後、ブランド適合性、読みやすさ、保存されやすさ、
              AIO引用適性、SEO、SNS拡散性、CV導線、商品導線を表示します。
            </p>
          )}
        </GlassCard>
      </div>
    </ViewFrame>
  );
}
