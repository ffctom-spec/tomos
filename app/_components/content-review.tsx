import { useState } from "react";
import type { AiReviewResponse, ReviewReference } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

const reviewReferences = [
  {
    id: "ref-youtube-soil",
    title: "How to Improve Garden Soil Naturally",
    thumbnail: "YT",
    channel: "YouTube",
    publishedAt: "2026/06/20",
    url: "https://www.youtube.com/",
    rating: "★★★★★",
    aiEvaluation: "初心者向けのFAQ構成が強く、8〜10分解説と相性が高い。",
    whyAiLikesThis: ["FAQ構成", "タイトルが具体的", "コメント数が多い"],
  },
  {
    id: "ref-instagram-natural",
    title: "Natural Garden Tips",
    thumbnail: "IG",
    channel: "Instagram",
    publishedAt: "2026/06/18",
    url: "https://www.instagram.com/",
    rating: "★★★★☆",
    aiEvaluation: "画像比較が多く、保存されやすいカルーセル構成。",
    whyAiLikesThis: ["画像が多い", "保存率が高い", "比較表あり"],
  },
  {
    id: "ref-blog-beginner",
    title: "Beginner Garden Soil Guide",
    thumbnail: "BG",
    channel: "Blog",
    publishedAt: "2026/06/14",
    url: "https://www.google.com/search?q=beginner+garden+soil+guide",
    rating: "★★★★☆",
    aiEvaluation: "検索意図が明確で、AIO引用ブロックに変換しやすい。",
    whyAiLikesThis: ["タイトルが具体的", "FAQ構成", "比較表あり"],
  },
  {
    id: "ref-pinterest-layout",
    title: "Garden Layout",
    thumbnail: "PI",
    channel: "Pinterest",
    publishedAt: "2026/06/10",
    url: "https://www.pinterest.com/",
    rating: "★★★★☆",
    aiEvaluation: "視覚保存されやすく、Pinterest導線に展開可能。",
    whyAiLikesThis: ["画像が多い", "保存率が高い", "CTAが明確"],
  },
] satisfies ReviewReference[];

const improvementItems = [
  "タイトル改善",
  "リード改善",
  "FAQ追加",
  "比較表追加",
  "CTA追加",
  "商品導線追加",
  "ハッシュタグ改善",
  "アイキャッチ改善",
];

const rewriteTargets = [
  "Instagram向け",
  "YouTube向け",
  "Blog向け",
  "Knowledge Cast向け",
  "Podcast向け",
  "Pinterest向け",
];

const similarOpportunities = ["コンポスト", "腐葉土", "木酢液", "ロストラータ", "アガベ"];

const workflowSteps = [
  ["STEP1", "ブランド", ["VERDNA", "YUGAWA Residence", "PAJOUR", "titi&joji"]],
  ["STEP2", "目的", ["認知", "保存", "販売", "AIO", "SEO"]],
  ["STEP3", "媒体", ["Instagram", "YouTube", "Blog", "Podcast", "Knowledge Cast"]],
  ["STEP4", "テーマ", ["土壌改良", "発根", "ドライガーデン", "商品導線"]],
  ["STEP5", "AIレビュー", ["Run Review"]],
  ["STEP6", "Approve", ["Approve", "Rewrite", "Publish"]],
] as const;

function StarMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

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
  onAddOpportunity,
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
  onAddOpportunity: (title: string) => void;
}) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [rewriteTarget, setRewriteTarget] = useState("Instagram向け");
  const [workflowSelections, setWorkflowSelections] = useState<Record<string, string>>({
    STEP1: brand,
    STEP2: "保存",
    STEP3: channel,
    STEP4: "土壌改良",
    STEP5: "Run Review",
    STEP6: "Approve",
  });

  function toggleChecklist(item: string) {
    setCheckedItems((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }

  function applyTargetRewrite(target: string) {
    setRewriteTarget(target);
    onContentChange(
      `${target}リライト:\n${content}\n\nAI提案: 冒頭に結論を置き、FAQ・比較・CTAを加えて、ユーザーがApproveしやすい構成にします。`,
    );
  }

  return (
    <ViewFrame
      title="Content Intelligence Mode"
      detail="AIが検索・分析・学習し、ユーザーはApprove / Rewrite / Publishだけで運用します。"
      onBack={onBack}
    >
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
            <PillButton>Approve</PillButton>
          </div>
          {status === "error" ? (
            <p className="mt-3 rounded-2xl bg-red-300/10 p-3 text-sm text-red-100">
              レビューに失敗しました。環境変数またはAPI routeを確認してください。
            </p>
          ) : null}
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            AI Decision Support
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

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Reference Center
          </p>
          <h2 className="mt-2 text-2xl font-semibold">AIが参考にした情報</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            現在はMock Data。将来はGoogle / YouTube / Instagram / Pinterest / Redditから取得します。
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {reviewReferences.map((reference) => (
              <a
                className="rounded-2xl border border-white/10 bg-black/35 p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
                href={reference.url}
                key={reference.id}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex items-start gap-3">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-sm font-semibold text-black">
                    {reference.thumbnail}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-500">{reference.channel}</p>
                    <h3 className="mt-1 text-sm font-semibold text-white">{reference.title}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{reference.publishedAt}</p>
                    <p className="mt-2 text-sm text-zinc-200">{reference.rating}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-zinc-500">
                  AI評価: {reference.aiEvaluation}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {reference.whyAiLikesThis.map((reason) => (
                    <span
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400"
                      key={reason}
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            AI Search Intelligence
          </p>
          <h2 className="mt-2 text-2xl font-semibold">検索・競合・引用性</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <StarMetric label="検索需要" value="★★★★☆" />
            <StarMetric label="競合" value="★★☆☆☆" />
            <StarMetric label="AIO" value="★★★★★" />
            <StarMetric label="SNS" value="★★★★☆" />
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              AI Brain
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["検索", "分析", "学習", "Knowledge Vault", "ブランド", "投稿", "分析", "再学習"].map((step) => (
                <span
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400"
                  key={step}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Improvement Checklist
          </p>
          <h2 className="mt-2 text-2xl font-semibold">押すだけで改善</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {improvementItems.map((item) => {
              const checked = checkedItems.includes(item);
              return (
                <button
                  className={`min-h-12 rounded-2xl border px-4 text-left text-sm transition ${
                    checked
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-black/35 text-zinc-300 hover:bg-white/[0.06]"
                  }`}
                  key={item}
                  onClick={() => toggleChecklist(item)}
                  type="button"
                >
                  {checked ? "✓" : "□"} {item}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            One Click Rewrite
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{rewriteTarget}</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {rewriteTargets.map((target) => (
              <PillButton
                key={target}
                onClick={() => applyTargetRewrite(target)}
                tone={rewriteTarget === target ? "light" : "dark"}
              >
                {target}
              </PillButton>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Knowledge Asset
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Knowledge Vaultへ蓄積</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {["FAQ", "比較表", "Podcast", "Knowledge Cast", "Pinterest", "商品導線", "関連記事", "タグ"].map((asset) => (
              <span
                className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-sm text-zinc-300"
                key={asset}
              >
                {asset}
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Learning Brain
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">今回学習</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-400">
                {["初心者向けタイトルが有効", "画像比較が強い", "FAQ追加で引用率向上", "保存率向上"].map((item) => (
                  <li key={item}>・{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">次回改善案</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-400">
                {["比較表を追加", "Before/After画像", "PDF化"].map((item) => (
                  <li key={item}>・{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Similar Opportunity
          </p>
          <h2 className="mt-2 text-2xl font-semibold">類似テーマをBroadcast候補へ</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {similarOpportunities.map((opportunity) => (
              <button
                className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white hover:text-black"
                key={opportunity}
                onClick={() => onAddOpportunity(opportunity)}
                type="button"
              >
                + {opportunity}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Smart Workflow
          </p>
          <h2 className="mt-2 text-2xl font-semibold">選択式UI</h2>
          <div className="mt-5 grid gap-3">
            {workflowSteps.map(([step, label, options]) => (
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4" key={step}>
                <p className="text-xs text-zinc-500">
                  {step} / {label}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {options.map((option) => {
                    const selected = workflowSelections[step] === option;
                    return (
                      <button
                        className={`rounded-full px-3 py-1 text-xs transition ${
                          selected
                            ? "bg-white text-black"
                            : "border border-white/10 text-zinc-400 hover:bg-white/[0.06]"
                        }`}
                        key={option}
                        onClick={() =>
                          setWorkflowSelections((current) => ({
                            ...current,
                            [step]: option,
                          }))
                        }
                        type="button"
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-4">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Future API Connections
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Google Search API", "YouTube Data API", "Instagram Graph API", "Pinterest API", "Reddit API", "OpenAI API", "Anthropic API", "Google Gemini API"].map((api) => (
            <span
              className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-zinc-400"
              key={api}
            >
              {api}
            </span>
          ))}
        </div>
      </GlassCard>
    </ViewFrame>
  );
}
