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

  function updateControl<Key extends keyof CockpitControls>(
    key: Key,
    value: CockpitControls[Key],
  ) {
    const nextControls = { ...controls, [key]: value };
    setControls(nextControls);
    setSelectedOriginId(getRecommendedOrigin(nextControls).id);
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
            </div>
            <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
              Brand & Market Command Cockpit
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400">
              世界・日本・ブランドの接点から、次の成長ルートを選ぶ。
            </p>
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
