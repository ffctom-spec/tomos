"use client";

import { useMemo, useState } from "react";
import type {
  ActivityTimelineItem,
  AiEngine,
  ApprovalItem,
  ExecutiveBriefItem,
  PortalView,
} from "@/app/_lib/portal-types";

type GrowthModel =
  | "Premium Brand"
  | "Niche Authority"
  | "Demand Capture"
  | "Commerce Growth";
type MarketFocus = "Japan First" | "Asia Focus" | "Global Signal";
type BusinessPriority = "Brand" | "Reach" | "Profit" | "Community";
type OperatingScale = "Small & High Quality" | "Balanced" | "Scale Up";
type RouteMode =
  | "Content Signal"
  | "Supply Route"
  | "Market Entry"
  | "Product Opportunity";

type CockpitControls = {
  growth: GrowthModel;
  market: MarketFocus;
  priority: BusinessPriority;
  scale: OperatingScale;
  route: RouteMode;
};

type OriginNode = {
  id: string;
  label: string;
  short: string;
  role: string;
  opportunity: string;
  risk: "Low" | "Medium" | "High";
  action: string;
  x: number;
  y: number;
  score: number;
  brandFit: number;
  confidence: number;
  route: RouteMode;
  focus: MarketFocus[];
  priority: BusinessPriority[];
};

type PriorityDecision = {
  id: string;
  title: string;
  importance: string;
  deadline: string;
  action: string;
  kpi: string;
  whyNow: string;
  recommendation: string;
  risk: string;
  options: string[];
  relatedPost: string;
  relatedProduct: string;
  calendarSlot: string;
};

type ProductRankItem = {
  id: string;
  name: string;
  channel: string;
  revenue: string;
  margin: string;
  yesterday: string;
  week: string;
  rankMove: string;
  aiScore: number;
};

type LanguageMode = "en" | "ja";

const origins: OriginNode[] = [
  {
    id: "california",
    label: "California",
    short: "CA",
    role: "Creative / Lifestyle Signal",
    opportunity: "Premium garden lifestyle",
    risk: "Low",
    action: "保存型Carouselへ変換",
    x: 18,
    y: 44,
    score: 82,
    brandFit: 91,
    confidence: 78,
    route: "Content Signal",
    focus: ["Japan First", "Global Signal"],
    priority: ["Brand", "Reach", "Community"],
  },
  {
    id: "shenzhen",
    label: "Shenzhen",
    short: "SZ",
    role: "Production & Supply Route",
    opportunity: "Fast product validation",
    risk: "Medium",
    action: "小ロット検証へ進む",
    x: 69,
    y: 55,
    score: 88,
    brandFit: 68,
    confidence: 74,
    route: "Supply Route",
    focus: ["Asia Focus"],
    priority: ["Profit"],
  },
  {
    id: "netherlands",
    label: "Netherlands",
    short: "NL",
    role: "Design / Plant Market Reference",
    opportunity: "Editorial product story",
    risk: "Low",
    action: "ブランド資料へ転換",
    x: 48,
    y: 35,
    score: 78,
    brandFit: 88,
    confidence: 72,
    route: "Market Entry",
    focus: ["Japan First", "Global Signal"],
    priority: ["Brand", "Community"],
  },
  {
    id: "southeast-asia",
    label: "Southeast Asia",
    short: "SEA",
    role: "Demand / Commerce Signal",
    opportunity: "Outdoor living demand",
    risk: "Medium",
    action: "商品導線を検証",
    x: 66,
    y: 67,
    score: 84,
    brandFit: 73,
    confidence: 70,
    route: "Product Opportunity",
    focus: ["Asia Focus"],
    priority: ["Reach", "Profit"],
  },
  {
    id: "europe",
    label: "Europe",
    short: "EU",
    role: "Premium Category Signal",
    opportunity: "High trust positioning",
    risk: "Medium",
    action: "比較表とFAQへ展開",
    x: 52,
    y: 43,
    score: 76,
    brandFit: 84,
    confidence: 69,
    route: "Content Signal",
    focus: ["Global Signal"],
    priority: ["Brand", "Community"],
  },
];

const initialControls: CockpitControls = {
  growth: "Premium Brand",
  market: "Japan First",
  priority: "Brand",
  scale: "Small & High Quality",
  route: "Content Signal",
};

const priorityDecisions: PriorityDecision[] = [
  {
    id: "carousel-soil",
    title: "0円土づくりCarouselを今日出すか",
    importance: "High",
    deadline: "Today",
    action: "保存型投稿として下書き化",
    kpi: "Save / AIO",
    whyNow: "低コストで始められる土づくりは、保存理由を作りやすいScenarioです。",
    recommendation: "California SignalをVERDNAの暮らし寄りCarouselへ変換。",
    risk: "効果を断定せず、土を見直す入口として表現する必要があります。",
    options: ["Carouselで出す", "Storyで反応を見る", "今日は保留"],
    relatedPost: "0円でできる土壌改良",
    relatedProduct: "土 / 鉢 / ガーデングッズ",
    calendarSlot: "10:00-11:00",
  },
  {
    id: "product-route",
    title: "鉢・土のProduct Routeを検証するか",
    importance: "Medium",
    deadline: "24H",
    action: "商品導線の比較表を作る",
    kpi: "Commerce",
    whyNow: "コンテンツから商品比較へ接続できるScenarioです。",
    recommendation: "小さく高品質な導線だけを検証。",
    risk: "実仕入れ・在庫・送料・規約は未確認です。",
    options: ["比較表を作る", "商品候補だけ保存", "見送る"],
    relatedPost: "腐葉土・培養土・堆肥の違い",
    relatedProduct: "培養土 / 鉢",
    calendarSlot: "14:30-15:00",
  },
  {
    id: "short-title",
    title: "YouTube Shortのタイトルを調整するか",
    importance: "Medium",
    deadline: "3H",
    action: "冒頭3秒を強くする",
    kpi: "Reach",
    whyNow: "短尺は最初の判断が強いほど反応を見やすいScenarioです。",
    recommendation: "保存版ではなく発見型の短いタイトルへ変更。",
    risk: "動画素材が弱い場合はCarousel優先。",
    options: ["Short案を作る", "Carouselへ変更", "保留"],
    relatedPost: "肥料を買う前に",
    relatedProduct: "なし",
    calendarSlot: "16:00-16:30",
  },
];

const productRanking: ProductRankItem[] = Array.from({ length: 20 }).map((_, index) => {
  const names = [
    "ドライガーデン用培養土",
    "ロストラータ向け鉢",
    "ガーデンライト",
    "アガベ管理PDF",
    "ガビオン素材",
  ];

  return {
    id: `product-${index + 1}`,
    name: names[index % names.length] ?? "Garden Product",
    channel: ["BASE", "Amazon", "Yahoo!ショッピング", "STORES"][index % 4] ?? "BASE",
    revenue: `¥${(128400 - index * 4200).toLocaleString()}`,
    margin: `${38 - (index % 7)}%`,
    yesterday: `${index % 3 === 0 ? "+" : "-"}¥${(800 + index * 120).toLocaleString()}`,
    week: `+¥${(6200 + index * 700).toLocaleString()}`,
    rankMove: index % 4 === 0 ? "↑2" : index % 5 === 0 ? "↓1" : "→",
    aiScore: 92 - index,
  };
});

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
  const [controls, setControls] = useState<CockpitControls>(initialControls);
  const [selectedOriginId, setSelectedOriginId] = useState("california");
  const [selectedStep, setSelectedStep] = useState(0);
  const [briefLevel, setBriefLevel] = useState<"cockpit" | "decisions" | "detail" | "commerce" | "product-detail" | "audience">("cockpit");
  const [selectedDecisionId, setSelectedDecisionId] = useState(priorityDecisions[0]?.id ?? "");
  const [selectedProductId, setSelectedProductId] = useState(productRanking[0]?.id ?? "");
  const [selectedCalendarSlot, setSelectedCalendarSlot] = useState("10:00-11:00");
  const [selectedSlotTask, setSelectedSlotTask] = useState("Instagram Carousel最終確認");
  const [language, setLanguage] = useState<LanguageMode>(() => {
    if (typeof window === "undefined") return "ja";

    const saved = window.localStorage.getItem("tomos-language");
    if (saved === "en" || saved === "ja") return saved;

    const locale = `${window.navigator.language} ${window.navigator.languages?.join(" ")} ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
    return locale.includes("ja") || locale.includes("Asia/Tokyo") ? "ja" : "en";
  });

  function changeLanguage(nextLanguage: LanguageMode) {
    setLanguage(nextLanguage);
    localStorage.setItem("tomos-language", nextLanguage);
  }

  const selectedOrigin = useMemo(
    () => origins.find((origin) => origin.id === selectedOriginId) ?? origins[0],
    [selectedOriginId],
  );

  const scores = useMemo(
    () => calculateScores(selectedOrigin, controls),
    [controls, selectedOrigin],
  );
  const flightPlan = useMemo(
    () => getFlightPlan(selectedOrigin, controls),
    [controls, selectedOrigin],
  );
  const selectedDecision =
    priorityDecisions.find((item) => item.id === selectedDecisionId) ?? priorityDecisions[0];

  function updateControl<Key extends keyof CockpitControls>(
    key: Key,
    value: CockpitControls[Key],
  ) {
    const nextControls = { ...controls, [key]: value };
    setControls(nextControls);
    setSelectedOriginId(getRecommendedOrigin(nextControls).id);
  }

  if (briefLevel === "decisions") {
    return (
      <PriorityDecisionDeck
        decisions={priorityDecisions}
        onBack={() => setBriefLevel("cockpit")}
        onSelect={(id) => {
          setSelectedDecisionId(id);
          setBriefLevel("detail");
        }}
      />
    );
  }

  if (briefLevel === "detail" && selectedDecision) {
    return (
      <DecisionDetailDeck
        decision={selectedDecision}
        onBack={() => setBriefLevel("decisions")}
        onCreateContent={() => onNavigate("broadcast")}
        onReviewProduct={() => onNavigate("product")}
      />
    );
  }

  if (briefLevel === "commerce") {
    return (
      <CommerceIntelligenceDeck
        products={productRanking}
        onBack={() => setBriefLevel("cockpit")}
        onOpenOpportunity={() => onNavigate("product")}
        onProduct={(id) => {
          setSelectedProductId(id);
          setBriefLevel("product-detail");
        }}
      />
    );
  }

  if (briefLevel === "product-detail") {
    const product = productRanking.find((item) => item.id === selectedProductId) ?? productRanking[0];

    return product ? (
      <ProductDetailDeck
        product={product}
        onBack={() => setBriefLevel("commerce")}
        onCreateContent={() => onNavigate("broadcast")}
        onOpportunity={() => onNavigate("product")}
      />
    ) : null;
  }

  if (briefLevel === "audience") {
    return (
      <AudienceIntelligenceDeck
        language={language}
        onBack={() => setBriefLevel("cockpit")}
        onCreateContent={() => onNavigate("broadcast")}
      />
    );
  }

  return (
    <div className="grid gap-5">
      <section className="border border-white/[0.14] bg-[#030303]/90 p-5 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">
                GLOBAL MIND / COMMAND COCKPIT
              </p>
              <span className="border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Scenario Mode
              </span>
              <span className="border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                TOMOS AI Estimate
              </span>
              <div className="flex border border-white/10">
                {(["en", "ja"] as LanguageMode[]).map((item) => (
                  <button
                    className={`px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${
                      language === item ? "bg-white text-black" : "text-zinc-500"
                    }`}
                    key={item}
                    onClick={() => changeLanguage(item)}
                    type="button"
                  >
                    {item === "ja" ? "日本語" : "EN"}
                  </button>
                ))}
              </div>
              <span className="border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Auto: {language === "ja" ? "Japan" : "Global"} / Locale Estimate
              </span>
            </div>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
              Brand & Market Command Cockpit
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400">
              世界・日本・ブランドの接点から、次の成長ルートを選ぶ。
            </p>
            <button
              className="mt-6 border border-white bg-white px-5 py-4 text-left text-black"
              onClick={() => setBriefLevel("decisions")}
              type="button"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                Today&apos;s Critical Decision
              </p>
              <p className="mt-2 text-lg font-semibold">{priorityDecisions[0]?.title}</p>
              <p className="mt-1 text-xs text-zinc-600">Open Priority Decisions</p>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
            <MetricPanel
              label="Opportunity"
              note="検証価値"
              value={scores.opportunity}
            />
            <MetricPanel label="Brand Fit" note="世界観一致" value={scores.brandFit} />
            <MetricPanel
              label="Risk"
              note={scores.riskNote}
              value={scores.risk}
            />
            <MetricPanel
              label="Confidence"
              note="Scenario"
              value={scores.confidence}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <GlobalRouteMap
              origins={origins}
              selectedOrigin={selectedOrigin}
              onSelect={setSelectedOriginId}
            />
          </div>

          <div className="xl:col-span-4">
            <PilotControls
              controls={controls}
              selectedOrigin={selectedOrigin}
              onChange={updateControl}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <JapanMarketPulse
              controls={controls}
              selectedOrigin={selectedOrigin}
            />
          </div>
          <div className="xl:col-span-5">
            <FlightPlan
              activeStep={selectedStep}
              steps={flightPlan}
              onSelect={setSelectedStep}
            />
          </div>
          <div className="xl:col-span-3">
            <NextDecision
              activeStep={flightPlan[selectedStep]}
              pending={pending}
              onNavigate={onNavigate}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <TodayOperationsPanel onNavigate={onNavigate} />
          </div>
          <div className="xl:col-span-4">
            <CalendarOpsPanel
              selectedSlot={selectedCalendarSlot}
              selectedTask={selectedSlotTask}
              onSelect={(slot, task) => {
                setSelectedCalendarSlot(slot);
                setSelectedSlotTask(task);
              }}
              onConnect={() => onNavigate("integrations")}
            />
          </div>
          <div className="xl:col-span-4">
            <WeatherOpsPanel />
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <PortfolioSnapshot onOpen={() => onNavigate("brands")} />
          </div>
          <div className="xl:col-span-5">
            <CommerceSnapshot onOpen={() => setBriefLevel("commerce")} />
          </div>
          <div className="xl:col-span-3">
            <MarketRadarSnapshot onOpen={() => setBriefLevel("audience")} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <MiniDeckPanel
          label="AI Engines"
          value={`${engines.filter((engine) => engine.status !== "Paused").length} Active`}
          detail="Operating / Mock state"
          action="Open Integrations"
          onClick={() => onNavigate("integrations")}
        />
        <MiniDeckPanel
          label="Executive Brief"
          value={brief[0]?.value ?? "Ready"}
          detail={brief[0]?.detail ?? "Scenario brief"}
          action="Review Brief"
          onClick={() => onNavigate("brief")}
        />
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {timeline.slice(0, 4).map((item) => (
          <div className="border border-white/10 bg-black/35 p-4" key={item.id}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {item.time}
            </p>
            <p className="mt-3 text-sm font-semibold">{item.title}</p>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
              {item.engine}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function GlobalRouteMap({
  origins,
  selectedOrigin,
  onSelect,
}: {
  origins: OriginNode[];
  selectedOrigin: OriginNode;
  onSelect: (id: string) => void;
}) {
  const japan = { x: 78, y: 48 };

  return (
    <section className="relative min-h-[520px] overflow-hidden border border-white/[0.14] bg-[#050505] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            GLOBAL ROUTE MAP
          </p>
          <h2 className="mt-2 text-3xl font-semibold">World → Japan → Brand</h2>
        </div>
        <p className="max-w-44 text-right text-[11px] uppercase tracking-[0.14em] text-zinc-600">
          Mock / Scenario / TOMOS AI Estimate
        </p>
      </div>

      <div className="relative h-[390px] border border-white/10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:44px_44px]">
        <svg
          aria-label="Abstract global route map"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M7 42 C18 18 35 20 43 38 C51 57 30 71 14 64 C3 59 0 49 7 42Z"
            fill="rgba(255,255,255,0.035)"
            stroke="rgba(255,255,255,0.08)"
          />
          <path
            d="M39 33 C47 17 67 19 76 34 C88 52 74 74 55 69 C40 65 32 47 39 33Z"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.08)"
          />
          <path
            d="M70 59 C80 48 96 52 98 68 C99 82 85 88 75 80 C67 73 64 66 70 59Z"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.07)"
          />
          {origins.map((origin) => {
            const active = origin.id === selectedOrigin.id;

            return (
              <line
                key={origin.id}
                stroke={active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.18)"}
                strokeDasharray={active ? "0" : "4 7"}
                strokeWidth={active ? 0.7 : 0.35}
                x1={origin.x}
                x2={japan.x}
                y1={origin.y}
                y2={japan.y}
              />
            );
          })}
          <circle cx={japan.x} cy={japan.y} fill="white" r="1.4" />
          <circle cx={japan.x} cy={japan.y} fill="none" r="4.5" stroke="rgba(255,255,255,0.35)" />
        </svg>

        {origins.map((origin) => {
          const active = origin.id === selectedOrigin.id;

          return (
            <button
              className={`absolute min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 border px-2 text-xs transition ${
                active
                  ? "border-white bg-white text-black"
                  : "border-white/20 bg-black/70 text-zinc-300 hover:border-white/50"
              }`}
              key={origin.id}
              onClick={() => onSelect(origin.id)}
              style={{ left: `${origin.x}%`, top: `${origin.y}%` }}
              title={`${origin.label}: ${origin.role}`}
              type="button"
            >
              {origin.short}
            </button>
          );
        })}

        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 border border-white bg-white px-3 py-2 text-xs font-semibold text-black"
          style={{ left: `${japan.x}%`, top: `${japan.y}%` }}
        >
          JAPAN
        </div>

        <div className="absolute bottom-4 left-4 max-w-xs border border-white/10 bg-black/75 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Selected Origin
          </p>
          <p className="mt-2 text-xl font-semibold">{selectedOrigin.label}</p>
          <p className="mt-2 text-xs leading-5 text-zinc-400">{selectedOrigin.role}</p>
          <p className="mt-2 text-xs text-zinc-500">Risk: {selectedOrigin.risk}</p>
        </div>

        <div className="absolute bottom-4 right-4 w-52 border border-white/10 bg-black/80 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Japan Control Point
          </p>
          <div className="mt-3 grid h-24 grid-cols-5 gap-px bg-white/10 p-px">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                className={index === 13 ? "bg-white" : "bg-black"}
                key={index}
              />
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold">Yokohama / Tokyo Bay</p>
        </div>
      </div>
    </section>
  );
}

function PriorityDecisionDeck({
  decisions,
  onBack,
  onSelect,
}: {
  decisions: PriorityDecision[];
  onBack: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <section className="border border-white/[0.14] bg-[#030303]/90 p-5 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">
            02 / EXECUTIVE BRIEF
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Priority Decisions
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            最大9件の重要判断 / Scenario / TOMOS AI Estimate
          </p>
        </div>
        <button
          className="min-h-11 border border-white/15 px-4 text-sm text-zinc-300"
          onClick={onBack}
          type="button"
        >
          Back
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {decisions.map((decision, index) => (
          <button
            className="border border-white/10 bg-black/35 p-5 text-left transition hover:border-white/40"
            key={decision.id}
            onClick={() => onSelect(decision.id)}
            type="button"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {String(index + 1).padStart(2, "0")} / {decision.importance}
            </p>
            <h2 className="mt-4 text-xl font-semibold leading-7">{decision.title}</h2>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <PulseBlock label="Deadline" value={decision.deadline} />
              <PulseBlock label="KPI" value={decision.kpi} />
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {decision.action}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

function DecisionDetailDeck({
  decision,
  onBack,
  onCreateContent,
  onReviewProduct,
}: {
  decision: PriorityDecision;
  onBack: () => void;
  onCreateContent: () => void;
  onReviewProduct: () => void;
}) {
  return (
    <section className="border border-white/[0.14] bg-[#030303]/90 p-5 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">
            03 / DECISION DETAIL
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight">
            {decision.title}
          </h1>
        </div>
        <button
          className="min-h-11 border border-white/15 px-4 text-sm text-zinc-300"
          onClick={onBack}
          type="button"
        >
          Back
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Why now", decision.whyNow],
            ["KPI impact", decision.kpi],
            ["AI recommendation", decision.recommendation],
            ["Risk", decision.risk],
            ["Related post", decision.relatedPost],
            ["Calendar slot", decision.calendarSlot],
          ].map(([label, value]) => (
            <div className="border border-white/10 bg-black/35 p-5" key={label}>
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {label}
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{value}</p>
            </div>
          ))}
        </div>
        <div className="border border-white/10 bg-black/35 p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Options
          </p>
          <div className="mt-4 grid gap-2">
            {decision.options.map((option) => (
              <button
                className="min-h-12 border border-white/15 px-4 text-left text-sm text-zinc-200 hover:bg-white/10"
                key={option}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-2">
            <button
              className="min-h-12 bg-white px-4 text-sm font-medium text-black"
              onClick={onCreateContent}
              type="button"
            >
              Create Content
            </button>
            <button
              className="min-h-12 border border-white/15 px-4 text-sm text-zinc-200"
              onClick={onReviewProduct}
              type="button"
            >
              Review Product
            </button>
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-600">
            Scenario / TOMOS AI Estimate. 実データ連携ではありません。
          </p>
        </div>
      </div>
    </section>
  );
}

function PilotControls({
  controls,
  selectedOrigin,
  onChange,
}: {
  controls: CockpitControls;
  selectedOrigin: OriginNode;
  onChange: <Key extends keyof CockpitControls>(
    key: Key,
    value: CockpitControls[Key],
  ) => void;
}) {
  return (
    <section className="border border-white/[0.14] bg-[#050505] p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        PILOT CONTROLS
      </p>
      <h2 className="mt-2 text-2xl font-semibold">あなたの事業方針を選ぶ</h2>

      <ControlGroup
        label="Growth Model"
        options={["Premium Brand", "Niche Authority", "Demand Capture", "Commerce Growth"]}
        value={controls.growth}
        onSelect={(value) => onChange("growth", value)}
      />
      <ControlGroup
        label="Market Focus"
        options={["Japan First", "Asia Focus", "Global Signal"]}
        value={controls.market}
        onSelect={(value) => onChange("market", value)}
      />
      <ControlGroup
        label="Business Priority"
        options={["Brand", "Reach", "Profit", "Community"]}
        value={controls.priority}
        onSelect={(value) => onChange("priority", value)}
      />
      <ControlGroup
        label="Operating Scale"
        options={["Small & High Quality", "Balanced", "Scale Up"]}
        value={controls.scale}
        onSelect={(value) => onChange("scale", value)}
      />
      <ControlGroup
        label="Selected Route"
        options={["Content Signal", "Supply Route", "Market Entry", "Product Opportunity"]}
        value={controls.route}
        onSelect={(value) => onChange("route", value)}
      />

      <div className="mt-5 border border-white/10 bg-black/35 p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          Next Move
        </p>
        <p className="mt-3 text-lg font-semibold">{selectedOrigin.action}</p>
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          Scenario / TOMOS AI Estimate
        </p>
      </div>
    </section>
  );
}

function ControlGroup<T extends string>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            className={`min-h-10 border px-3 text-xs transition ${
              value === option
                ? "border-white bg-white text-black"
                : "border-white/10 bg-black/45 text-zinc-400 hover:border-white/35"
            }`}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricPanel({
  label,
  note,
  value,
}: {
  label: string;
  note: string;
  value: number | string;
}) {
  const numericValue = typeof value === "number" ? value : null;

  return (
    <div className="border border-white/10 bg-black/35 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold">{value}</p>
      {numericValue ? (
        <div className="mt-3 h-px bg-white/10">
          <div
            className="h-px bg-white"
            style={{ width: `${Math.min(100, numericValue)}%` }}
          />
        </div>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-zinc-500">{note}</p>
    </div>
  );
}

function JapanMarketPulse({
  controls,
  selectedOrigin,
}: {
  controls: CockpitControls;
  selectedOrigin: OriginNode;
}) {
  return (
    <section className="border border-white/[0.14] bg-[#050505] p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        JAPAN MARKET PULSE
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <PulseBlock label="Yokohama" value="Home Base" />
        <PulseBlock label={`${selectedOrigin.label} Signal`} value={selectedOrigin.role} />
        <PulseBlock label="Japan Audience" value={controls.priority === "Profit" ? "Buyer Intent" : "Premium Garden / Home"} />
        <PulseBlock label="Next Route" value={controls.route === "Supply Route" ? "Product Test → Story" : "Carousel → Product Story"} />
      </div>
      <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
        Scenario / TOMOS AI Estimate
      </p>
    </section>
  );
}

function PulseBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/35 p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-5">{value}</p>
    </div>
  );
}

function FlightPlan({
  activeStep,
  steps,
  onSelect,
}: {
  activeStep: number;
  steps: Array<{ label: string; title: string; detail: string }>;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="border border-white/[0.14] bg-[#050505] p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        FLIGHT PLAN
      </p>
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {steps.map((step, index) => (
          <button
            className={`border p-4 text-left transition ${
              activeStep === index
                ? "border-white bg-white text-black"
                : "border-white/10 bg-black/35 text-zinc-300 hover:border-white/35"
            }`}
            key={step.label}
            onClick={() => onSelect(index)}
            type="button"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] opacity-70">
              {step.label}
            </p>
            <p className="mt-3 text-lg font-semibold">{step.title}</p>
            <p className="mt-2 text-xs leading-5 opacity-70">{step.detail}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function NextDecision({
  activeStep,
  pending,
  onNavigate,
}: {
  activeStep?: { title: string; detail: string };
  pending: number;
  onNavigate: (view: PortalView) => void;
}) {
  return (
    <section className="border border-white/[0.14] bg-[#050505] p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        NEXT DECISION
      </p>
      <h2 className="mt-3 text-2xl font-semibold">{activeStep?.title ?? "Act"}</h2>
      <p className="mt-2 text-xs leading-5 text-zinc-500">
        {activeStep?.detail ?? "次の一手を選択。"}
      </p>
      <div className="mt-5 grid gap-2">
        <button
          className="min-h-12 bg-white px-4 text-sm font-medium text-black"
          onClick={() => onNavigate("broadcast")}
          type="button"
        >
          Create Global Content Brief
        </button>
        <button
          className="min-h-12 border border-white/15 bg-black/45 px-4 text-sm text-zinc-200"
          onClick={() => onNavigate("product")}
          type="button"
        >
          Review Product Route
        </button>
        <button
          className="min-h-12 border border-white/15 bg-black/45 px-4 text-sm text-zinc-200"
          onClick={() => onNavigate("approvals")}
          type="button"
        >
          Pending Approvals / {pending}
        </button>
      </div>
    </section>
  );
}

function MiniDeckPanel({
  action,
  detail,
  label,
  onClick,
  value,
}: {
  action: string;
  detail: string;
  label: string;
  onClick: () => void;
  value: string;
}) {
  return (
    <button
      className="border border-white/10 bg-black/35 p-5 text-left transition hover:border-white/35"
      onClick={onClick}
      type="button"
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{detail}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-zinc-400">
        {action}
      </p>
    </button>
  );
}

function TodayOperationsPanel({ onNavigate }: { onNavigate: (view: PortalView) => void }) {
  return (
    <section className="border border-white/[0.14] bg-[#050505] p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        TODAY OPERATIONS
      </p>
      <div className="mt-4 grid gap-3">
        {[
          ["24H", "Instagram Carousel最終確認"],
          ["3H", "YouTube Shortの粗編集"],
          ["Today", "商品ページの価格比較確認"],
        ].map(([time, task]) => (
          <button
            className="grid grid-cols-[64px_1fr] gap-3 border border-white/10 bg-black/35 p-3 text-left"
            key={task}
            onClick={() => onNavigate("approvals")}
            type="button"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{time}</p>
            <p className="text-sm font-medium">{task}</p>
          </button>
        ))}
      </div>
      <details className="mt-4 border border-white/10 bg-black/30 p-3">
        <summary className="cursor-pointer text-xs uppercase tracking-[0.18em] text-zinc-500">
          Today Not Doing
        </summary>
        <div className="mt-3 grid gap-2 text-sm text-zinc-400">
          <p>YouTube長尺動画の本編集 — 粗編集後に判断。</p>
          <p>商品撮影の再レタッチ — 投稿素材を先に確定。</p>
          <p>新規LPの細部調整 — 今日の売上導線を優先。</p>
        </div>
      </details>
      <div className="mt-4 grid gap-2">
        {[
          ["10 min", "保存CTAを追加する"],
          ["15 min", "Story投票を作る"],
          ["20 min", "既存写真からCarousel 1枚目を選ぶ"],
        ].map(([time, win]) => (
          <button
            className="min-h-11 border border-white/10 px-3 text-left text-xs text-zinc-300 hover:bg-white/10"
            key={win}
            onClick={() => onNavigate("broadcast")}
            type="button"
          >
            Quick Win / {time} — {win}
          </button>
        ))}
      </div>
    </section>
  );
}

function CalendarOpsPanel({
  onConnect,
  onSelect,
  selectedSlot,
  selectedTask,
}: {
  onConnect: () => void;
  onSelect: (slot: string, task: string) => void;
  selectedSlot: string;
  selectedTask: string;
}) {
  const windows = [
    ["10:00-11:00", "Instagram Carousel最終確認", "25 min"],
    ["14:30-15:00", "YouTube Shortのタイトル調整", "20 min"],
    ["16:00-16:30", "Story投票の作成", "15 min"],
  ];

  return (
    <section className="border border-white/[0.14] bg-[#050505] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            CALENDAR OPS
          </p>
          <p className="mt-2 text-sm text-zinc-400">Google Calendar Not Connected</p>
        </div>
        <button className="border border-white/15 px-3 py-2 text-xs" onClick={onConnect} type="button">
          Connect
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        {windows.map(([slot, task, duration]) => (
          <button
            className={`border p-3 text-left ${
              selectedSlot === slot
                ? "border-white bg-white text-black"
                : "border-white/10 bg-black/35 text-zinc-300"
            }`}
            key={slot}
            onClick={() => onSelect(slot, task)}
            type="button"
          >
            <p className="text-sm font-semibold">{slot}</p>
            <p className="mt-1 text-xs opacity-70">Free Window / {duration}</p>
            <p className="mt-2 text-sm">{task}</p>
          </button>
        ))}
      </div>
      <p className="mt-4 border border-white/10 bg-black/35 p-3 text-sm">
        この枠で進める: {selectedSlot} / {selectedTask}
      </p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
        Mock Schedule / Setup Required
      </p>
    </section>
  );
}

function WeatherOpsPanel() {
  return (
    <section className="border border-white/[0.14] bg-[#050505] p-5">
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        WEATHER OPERATIONS
      </p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-4xl font-semibold">Yokohama</p>
          <p className="mt-2 text-sm text-zinc-500">Today / 24°C / Cloud → Rain</p>
        </div>
        <p className="text-right text-xs uppercase tracking-[0.16em] text-zinc-600">
          Mock Weather Scenario
        </p>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {[
          ["09:00", "晴れ", "10%"],
          ["12:00", "曇り", "20%"],
          ["15:00", "雨", "60%"],
          ["18:00", "雨", "70%"],
        ].map(([time, weather, rain]) => (
          <div className="border border-white/10 bg-black/35 p-3" key={time}>
            <p className="text-xs text-zinc-500">{time}</p>
            <p className="mt-2 text-sm font-semibold">{weather}</p>
            <p className="mt-1 text-xs text-zinc-500">{rain}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 border border-white/10 bg-black/35 p-3">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
          Best Outdoor Window
        </p>
        <p className="mt-2 text-lg font-semibold">09:00-12:00</p>
        <p className="mt-1 text-xs text-zinc-500">撮影・庭作業向き / 15:00以降注意</p>
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
        Weather Integration Not Connected
      </p>
    </section>
  );
}

function PortfolioSnapshot({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      className="border border-white/[0.14] bg-[#050505] p-5 text-left hover:border-white/40"
      onClick={onOpen}
      type="button"
    >
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        BRAND PORTFOLIO
      </p>
      <p className="mt-4 text-4xl font-semibold">86</p>
      <p className="mt-2 text-sm text-zinc-500">Brand Score / Mock Portfolio Data</p>
      <div className="mt-4 grid gap-2">
        <PulseBlock label="Revenue" value="¥128,400 / +0.8%" />
        <PulseBlock label="Next Action" value="VERDNA Carouselを商品導線へ接続" />
      </div>
    </button>
  );
}

function CommerceSnapshot({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      className="border border-white/[0.14] bg-[#050505] p-5 text-left hover:border-white/40"
      onClick={onOpen}
      type="button"
    >
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        COMMERCE INTELLIGENCE
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <MetricPanel label="Sales" note="+16.5% week" value="¥128k" />
        <MetricPanel label="Orders" note="Mock" value="42" />
        <MetricPanel label="CVR" note="Estimate" value="2.8%" />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-zinc-600">
        Open Shop Registry / Product Ranking
      </p>
    </button>
  );
}

function MarketRadarSnapshot({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      className="border border-white/[0.14] bg-[#050505] p-5 text-left hover:border-white/40"
      onClick={onOpen}
      type="button"
    >
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
        MARKET RADAR
      </p>
      <p className="mt-4 text-xl font-semibold">Dry Garden Signal</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Audience Scenario / Not live analytics
      </p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-zinc-600">
        Create Content
      </p>
    </button>
  );
}

function CommerceIntelligenceDeck({
  onBack,
  onOpenOpportunity,
  onProduct,
  products,
}: {
  onBack: () => void;
  onOpenOpportunity: () => void;
  onProduct: (id: string) => void;
  products: ProductRankItem[];
}) {
  const [shopName, setShopName] = useState("VERDNA Mock Store");
  const [platform, setPlatform] = useState("BASE");
  const [storeUrl, setStoreUrl] = useState("https://example.com/verdan-store");
  const [saved, setSaved] = useState(false);

  return (
    <section className="border border-white/[0.14] bg-[#030303]/90 p-5 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">
            06 / COMMERCE INTELLIGENCE
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Shop Registry / Product Ranking
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Mock / Setup Required / TOMOS AI Estimate
          </p>
        </div>
        <button className="min-h-11 border border-white/15 px-4 text-sm" onClick={onBack} type="button">
          Back
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="border border-white/10 bg-black/35 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Shop Registry
          </p>
          <label className="mt-4 grid gap-2 text-sm">
            Platform
            <select className="min-h-12 border border-white/10 bg-black px-3" onChange={(event) => setPlatform(event.target.value)} value={platform}>
              {["Amazon", "Yahoo!ショッピング", "BASE", "STORES", "Creema", "Other"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="mt-3 grid gap-2 text-sm">
            Shop Name
            <input className="min-h-12 border border-white/10 bg-black px-3" onChange={(event) => setShopName(event.target.value)} value={shopName} />
          </label>
          <label className="mt-3 grid gap-2 text-sm">
            Store URL
            <input className="min-h-12 border border-white/10 bg-black px-3" onChange={(event) => setStoreUrl(event.target.value)} value={storeUrl} />
          </label>
          <button className="mt-4 min-h-12 w-full bg-white px-4 text-sm font-medium text-black" onClick={() => setSaved(true)} type="button">
            Save Mock Shop
          </button>
          {saved ? (
            <p className="mt-3 border border-white/10 bg-white/10 p-3 text-sm">
              Saved: {platform} / {shopName}
            </p>
          ) : null}
        </div>

        <div className="border border-white/10 bg-black/35 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Product Performance Ranking
            </p>
            <button className="border border-white/15 px-3 py-2 text-xs" onClick={onOpenOpportunity} type="button">
              Product Opportunity
            </button>
          </div>
          <div className="grid gap-2">
            {products.map((product, index) => (
              <button
                className="grid gap-2 border border-white/10 bg-black/35 p-3 text-left hover:border-white/35 md:grid-cols-[48px_1fr_100px_80px_80px]"
                key={product.id}
                onClick={() => onProduct(product.id)}
                type="button"
              >
                <p className="text-sm text-zinc-500">#{index + 1}</p>
                <div>
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">{product.channel} / {product.rankMove}</p>
                </div>
                <p className="text-sm">{product.revenue}</p>
                <p className="text-sm text-zinc-400">{product.margin}</p>
                <p className="text-sm">AI {product.aiScore}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductDetailDeck({
  onBack,
  onCreateContent,
  onOpportunity,
  product,
}: {
  onBack: () => void;
  onCreateContent: () => void;
  onOpportunity: () => void;
  product: ProductRankItem;
}) {
  return (
    <section className="border border-white/[0.14] bg-[#030303]/90 p-5 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">
            PRODUCT DETAIL / Scenario only
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">{product.name}</h1>
        </div>
        <button className="min-h-11 border border-white/15 px-4 text-sm" onClick={onBack} type="button">
          Back
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricPanel label="Revenue" note={product.week} value={product.revenue} />
          <MetricPanel label="Margin" note="Mock" value={product.margin} />
          <MetricPanel label="AI Score" note={product.rankMove} value={product.aiScore} />
          {Array.from({ length: 20 }).map((_, index) => (
            <div className="border border-white/10 bg-black/35 p-3" key={index}>
              <p className="text-xs text-zinc-500">{String(index + 1).padStart(2, "0")}:00</p>
              <div className="mt-3 h-px bg-white/10">
                <div className="h-px bg-white" style={{ width: `${30 + ((index * 13) % 65)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="border border-white/10 bg-black/35 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            AI Next Actions
          </p>
          <div className="mt-4 grid gap-2">
            <button className="min-h-12 bg-white px-4 text-sm font-medium text-black" onClick={onCreateContent} type="button">
              商品紹介Carouselを作る
            </button>
            <button className="min-h-12 border border-white/15 px-4 text-sm" onClick={onCreateContent} type="button">
              YouTube Short案を作る
            </button>
            <button className="min-h-12 border border-white/15 px-4 text-sm" onClick={onOpportunity} type="button">
              Product Opportunityを確認する
            </button>
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500">
            実際の仕入れ・販売前に、規約・真贋・在庫・送料・税金・知的財産を確認してください。
          </p>
        </div>
      </div>
    </section>
  );
}

function AudienceIntelligenceDeck({
  language,
  onBack,
  onCreateContent,
}: {
  language: LanguageMode;
  onBack: () => void;
  onCreateContent: () => void;
}) {
  const [selectedInterest, setSelectedInterest] = useState("Dry Garden");
  const regionLabel =
    language === "ja"
      ? "Tokyo / Kanagawa / East Japan Scenario"
      : "Generic Regional Scenario / Local Market";
  const researchQuery =
    language === "ja"
      ? "ドライガーデン 関東 戸建て 外構 トレンド"
      : "dry garden outdoor living consumer trend";

  return (
    <section className="border border-white/[0.14] bg-[#030303]/90 p-5 sm:p-8">
      <div className="mb-8 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-zinc-500">
            07 / AUDIENCE INTELLIGENCE
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Interest Graph / TOMOS AI Estimate
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Audience Scenario / Not live audience analytics
          </p>
        </div>
        <button className="min-h-11 border border-white/15 px-4 text-sm" onClick={onBack} type="button">
          Back
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="relative min-h-[420px] border border-white/10 bg-black/35 p-5">
          <div className="absolute left-1/2 top-1/2 grid size-36 -translate-x-1/2 -translate-y-1/2 place-items-center border border-white bg-white text-center text-black">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">Core</p>
              <p className="mt-2 text-lg font-semibold">Dry Garden</p>
            </div>
          </div>
          {[
            ["アガベ・ユッカ・ロストラータ", 18, 20, 92],
            ["カリフォルニアモダン住宅", 66, 18, 88],
            ["アウトドアリビング", 76, 50, 83],
            ["省メンテナンスな庭", 55, 76, 86],
            ["鉢・照明・ガビオン", 20, 72, 80],
            ["インテリアと屋外空間", 12, 48, 77],
          ].map(([label, x, y, strength]) => (
            <button
              className={`absolute min-h-12 -translate-x-1/2 -translate-y-1/2 border px-3 text-xs ${
                selectedInterest === label
                  ? "border-white bg-white text-black"
                  : "border-white/15 bg-black/80 text-zinc-300"
              }`}
              key={String(label)}
              onClick={() => setSelectedInterest(String(label))}
              style={{ left: `${x}%`, top: `${y}%` }}
              type="button"
            >
              {label}
              <span className="ml-2 text-zinc-500">{strength}</span>
            </button>
          ))}
        </div>
        <div className="grid gap-4">
          <div className="border border-white/10 bg-black/35 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Audience Scenario
            </p>
            <p className="mt-3 text-lg font-semibold">
              Primary: 30-49 / Home & Garden
            </p>
            <p className="mt-2 text-sm text-zinc-500">{regionLabel}</p>
            <p className="mt-4 text-sm font-semibold">{selectedInterest}</p>
          </div>
          <div className="border border-white/10 bg-black/35 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              What They May Care About
            </p>
            <div className="mt-3 grid gap-2 text-sm text-zinc-400">
              <p>手間をかけずに庭を格好よく見せたい</p>
              <p>植物・鉢・照明を統一したい</p>
              <p>戸建てやベランダの印象を上げたい</p>
              <p>高価な植物を失敗させたくない</p>
            </div>
          </div>
          <button className="min-h-12 bg-white px-4 text-sm font-medium text-black" onClick={onCreateContent} type="button">
            Create Content Opportunity
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {[
          ["INDUSTRY SIGNAL", "省メンテナンスな庭の文脈を保存型投稿へ変換"],
          ["AUDIENCE INTEREST", "ドライガーデンと外構の統一感"],
          ["REGIONAL LIFESTYLE", "都市近郊の戸建て・庭づくりScenario"],
          ["PRODUCT OPPORTUNITY", "鉢・照明・用土の比較導線"],
        ].map(([type, title]) => (
          <div className="border border-white/10 bg-black/35 p-4" key={type}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {type}
            </p>
            <p className="mt-3 text-sm leading-6">{title}</p>
            <a
              className="mt-4 block text-xs uppercase tracking-[0.16em] text-zinc-400 hover:text-white"
              href={`https://www.google.com/search?q=${encodeURIComponent(researchQuery)}`}
              rel="noreferrer"
              target="_blank"
            >
              Open Research
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function calculateScores(origin: OriginNode, controls: CockpitControls) {
  let opportunity = origin.score;
  let brandFit = origin.brandFit;
  let confidence = origin.confidence;
  let risk: "Low" | "Medium" | "High" = origin.risk;

  if (origin.focus.includes(controls.market)) opportunity += 6;
  if (origin.priority.includes(controls.priority)) brandFit += 5;
  if (origin.route === controls.route) opportunity += 5;
  if (controls.growth === "Premium Brand") brandFit += 4;
  if (controls.growth === "Commerce Growth") opportunity += 5;
  if (controls.scale === "Scale Up" && origin.risk !== "Low") risk = "High";
  if (controls.scale === "Small & High Quality" && origin.risk === "Medium") risk = "Medium";
  if (controls.market === "Global Signal") confidence += 4;

  return {
    opportunity: Math.min(96, opportunity),
    brandFit: Math.min(98, brandFit),
    confidence: Math.min(94, confidence),
    risk,
    riskNote:
      risk === "Low"
        ? "小さく検証可能"
        : risk === "Medium"
          ? "条件確認が必要"
          : "供給・品質確認",
  };
}

function getRecommendedOrigin(controls: CockpitControls) {
  const candidates = origins
    .map((origin) => {
      let score = 0;
      if (origin.focus.includes(controls.market)) score += 3;
      if (origin.priority.includes(controls.priority)) score += 3;
      if (origin.route === controls.route) score += 4;
      if (controls.growth === "Premium Brand" && origin.brandFit > 85) score += 2;
      if (controls.growth === "Commerce Growth" && origin.score > 83) score += 2;

      return { origin, score };
    })
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.origin ?? origins[0];
}

function getFlightPlan(origin: OriginNode, controls: CockpitControls) {
  return [
    {
      label: "01 Observe",
      title: "Observe",
      detail: `${origin.label}の${origin.role}を投稿テーマへ変換`,
    },
    {
      label: "02 Shape",
      title: "Shape",
      detail:
        controls.priority === "Profit"
          ? "日本向けの商品導線と比較軸を設計"
          : "日本の保存型コンテンツへ編集",
    },
    {
      label: "03 Act",
      title: "Act",
      detail:
        controls.route === "Supply Route"
          ? "小ロット検証と商品ストーリーへ接続"
          : "VERDNAの投稿・相談導線へ接続",
    },
  ];
}
