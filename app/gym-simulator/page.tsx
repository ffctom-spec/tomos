'use client';

import { useMemo, useState } from 'react';

type EquipmentMethod = 'buy' | 'lease';

const fmt = (n: number) => new Intl.NumberFormat('ja-JP').format(Math.round(n));

export default function GymSimulatorPage() {
  const [method, setMethod] = useState<EquipmentMethod>('buy');
  const [gymFee, setGymFee] = useState(9800);
  const [members, setMembers] = useState(400);
  const [shopSpend, setShopSpend] = useState(1500);
  const [rent, setRent] = useState(80);
  const [labor, setLabor] = useState(100);
  const [ad, setAd] = useState(30);
  const [other, setOther] = useState(20);
  const [gaBase, setGaBase] = useState(50);
  const [gaPerStore, setGaPerStore] = useState(10);
  const [stores, setStores] = useState([1, 2, 4, 7, 11]);

  const result = useMemo(() => {
    const safeStores = stores.map((v, i) => Math.max(i === 0 ? 1 : stores[i - 1], Math.max(1, v)));
    const unitRevenue = (gymFee + shopSpend) * members;
    const unitCogs = shopSpend * members * 0.4;
    const baseOpex = (rent + labor + ad + other) * 10000;
    const capex = method === 'buy' ? 20000000 : 13000000;
    const depreciation = method === 'buy' ? 7000000 / 60 : 0;
    const lease = method === 'lease' ? 7000000 * 0.019 : 0;
    let cash = 0;
    const years = safeStores.map((storeCount, i) => {
      const prev = i === 0 ? 0 : safeStores[i - 1];
      const newStores = storeCount - prev;
      const revenue = unitRevenue * 12 * storeCount;
      const cogs = unitCogs * 12 * storeCount;
      const ga = (gaBase * 10000 + gaPerStore * 10000 * storeCount) * 12;
      const opex = (baseOpex + lease) * 12 * storeCount + ga;
      const dep = depreciation * 12 * storeCount;
      const profit = revenue - cogs - opex - dep;
      const cf = profit + dep - newStores * capex;
      cash += cf;
      return { storeCount, revenue, profit, cash, ga, dep };
    });
    const final = years[4];
    const minCash = Math.min(...years.map((y) => y.cash), 0);
    return { years, final, minCash, margin: final.revenue ? (final.profit / final.revenue) * 100 : 0 };
  }, [method, gymFee, members, shopSpend, rent, labor, ad, other, gaBase, gaPerStore, stores]);

  const updateStore = (index: number, value: number) => {
    setStores((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const Card = ({ label, value, accent = 'text-cyan-300' }: { label: string; value: string; accent?: string }) => (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`mt-1 text-xl font-black ${accent}`}>{value}</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#080c14] px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-cyan-800 bg-cyan-950/50 px-3 py-1 text-xs font-bold tracking-wider text-cyan-300">IPO MULTI-STORE STRATEGY</div>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">THE GYM 5ヶ年多店舗展開シミュレーター</h1>
            <p className="mt-2 text-sm text-slate-400">会費・会員数・家賃・出店ペースを変更し、連結売上・営業利益・累積キャッシュフローを確認できます。</p>
          </div>
          <div className="rounded-xl border border-amber-900/50 bg-slate-900 px-4 py-3 text-xs text-slate-400">機材参考価格：<b className="text-amber-300">EVOLGEAR一式 約698万円</b></div>
        </header>

        <div className="grid gap-8 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="mb-5 text-lg font-black text-cyan-300">1. 基準店舗モデル（1店舗あたり）</h2>
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3">
                <button onClick={() => setMethod('buy')} className={`rounded-lg border p-3 text-xs font-bold ${method === 'buy' ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300' : 'border-slate-800 text-slate-500'}`}>一括購入（CAPEX）<br/><span className="font-normal">初期投資大 / 固定費小</span></button>
                <button onClick={() => setMethod('lease')} className={`rounded-lg border p-3 text-xs font-bold ${method === 'lease' ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300' : 'border-slate-800 text-slate-500'}`}>5年リース（OPEX）<br/><span className="font-normal">初期投資小 / 固定費増</span></button>
              </div>
              <div className="space-y-4">
                {[
                  ['月会費単価（円）', gymFee, setGymFee, 6000, 30000, 200],
                  ['平均会員数（名）', members, setMembers, 200, 800, 10],
                  ['その他会員単価/月（物販等）', shopSpend, setShopSpend, 0, 5000, 100],
                ].map(([label, value, setter, min, max, step]) => (
                  <div key={String(label)}>
                    <div className="mb-1 flex justify-between text-sm"><span className="text-slate-300">{String(label)}</span><b className="text-cyan-300">{fmt(Number(value))}</b></div>
                    <input className="w-full accent-cyan-400" type="range" min={Number(min)} max={Number(max)} step={Number(step)} value={Number(value)} onChange={(e) => (setter as (v: number) => void)(Number(e.target.value))}/>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-800 pt-5">
                {[
                  ['店舗家賃/月（万円）', rent, setRent], ['店舗人件費/月（万円）', labor, setLabor], ['店舗広告費/月（万円）', ad, setAd], ['水道光熱他/月（万円）', other, setOther],
                ].map(([label, value, setter]) => <label key={String(label)} className="text-xs text-slate-400">{String(label)}<input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 p-2 font-bold text-slate-100" type="number" value={Number(value)} onChange={(e) => (setter as (v: number) => void)(Number(e.target.value))}/></label>)}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="mb-2 text-lg font-black text-amber-300">2. 出店ペース設定（5ヶ年）</h2>
              <p className="mb-4 text-xs text-slate-400">各年度末の累計店舗数を入力してください。</p>
              <div className="grid grid-cols-5 gap-2">{stores.map((v, i) => <label className="text-center text-xs text-slate-400" key={i}>{i + 1}年目<input className="mt-1 w-full rounded bg-slate-800 p-2 text-center font-bold text-slate-100" type="number" min="1" value={v} onChange={(e) => updateStore(i, Number(e.target.value))}/></label>)}</div>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-800 pt-5">
                <label className="text-xs text-slate-400">初期本部コスト/月（万円）<input className="mt-1 w-full rounded bg-slate-800 p-2 font-bold text-slate-100" type="number" value={gaBase} onChange={(e) => setGaBase(Number(e.target.value))}/></label>
                <label className="text-xs text-slate-400">追加本部経費/店舗/月（万円）<input className="mt-1 w-full rounded bg-slate-800 p-2 font-bold text-slate-100" type="number" value={gaPerStore} onChange={(e) => setGaPerStore(Number(e.target.value))}/></label>
              </div>
            </div>
          </section>

          <section className="space-y-6 lg:col-span-7">
            <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-6 md:p-8">
              <h2 className="mb-6 text-xl font-black">5ヶ年財務ロードマップ（連結予測）</h2>
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card label="5年目売上高" value={`${fmt(result.final.revenue / 10000)} 万円`} />
                <Card label="5年目営業利益" value={`${result.final.profit >= 0 ? '+' : ''}${fmt(result.final.profit / 10000)} 万円`} accent={result.final.profit >= 0 ? 'text-cyan-300' : 'text-rose-400'} />
                <Card label="最大資金調達必要額" value={`${fmt(Math.abs(result.minCash) / 10000)} 万円`} accent="text-rose-400" />
                <Card label="IPO可能性目安" value={result.final.profit / 10000 >= 10000 ? 'S判定' : result.final.profit / 10000 >= 5000 ? 'A判定' : '要事業改善'} accent={result.final.profit / 10000 >= 5000 ? 'text-emerald-300' : 'text-amber-300'} />
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50 p-2">
                <table className="w-full min-w-[650px] text-sm"><thead className="text-slate-400"><tr><th className="p-3 text-left">指標</th>{result.years.map((_, i) => <th key={i} className="p-3 text-right">{i + 1}年目</th>)}</tr></thead><tbody className="divide-y divide-slate-800">
                  {[
                    ['累計店舗数', (y: typeof result.years[number]) => `${y.storeCount} 店舗`, 'text-cyan-300'],
                    ['年間総売上高（万円）', (y: typeof result.years[number]) => fmt(y.revenue / 10000), 'text-slate-100'],
                    ['本部管理費（万円）', (y: typeof result.years[number]) => fmt(y.ga / 10000), 'text-amber-300'],
                    ['連結営業利益（万円）', (y: typeof result.years[number]) => fmt(y.profit / 10000), 'text-emerald-300'],
                    ['累積キャッシュフロー（万円）', (y: typeof result.years[number]) => fmt(y.cash / 10000), 'text-rose-300'],
                  ].map(([label, fn, color]) => <tr key={String(label)}><td className="p-3 text-slate-300">{String(label)}</td>{result.years.map((y, i) => <td key={i} className={`p-3 text-right font-bold ${String(color)}`}>{(fn as (x: typeof y) => string)(y)}</td>)}</tr>)}
                </tbody></table>
              </div>
              <p className="mt-4 text-xs text-slate-500">※簡易モデルです。実際の稼働開始月、保証金、原価、税金、減価償却、借入条件は別途精査が必要です。</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
