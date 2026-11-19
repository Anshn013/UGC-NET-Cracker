import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

type ModelId = 'islm' | 'solow' | 'monopoly' | 'phillips';

const MODEL_TABS: { id: ModelId; label: string; unitLabel: string }[] = [
  { id: 'islm', label: 'IS-LM & Policy Effectiveness', unitLabel: 'Unit 2 · Macro' },
  { id: 'solow', label: 'Solow–Swan Steady State', unitLabel: 'Unit 8 · Growth' },
  { id: 'monopoly', label: 'Monopoly & Deadweight Loss', unitLabel: 'Unit 1 · Micro' },
  { id: 'phillips', label: 'Phillips Curve & NAIRU', unitLabel: 'Unit 2 · Macro' },
];

export const ModelLab: React.FC = () => {
  const [activeModel, setActiveModel] = useState<ModelId>('islm');

  // 1. IS-LM Parameters
  const [govSpending, setGovSpending] = useState(200); // G (baseline 200)
  const [moneySupply, setMoneySupply] = useState(300); // M/P (baseline 300)
  const [investSens, setInvestSens] = useState(20); // b
  const [moneyInterestSens, setMoneyInterestSens] = useState(25); // h (higher = flatter LM / liquidity trap)
  const mpc = 0.75;
  const taxRate = 0.2;
  const kIncome = 0.5; // k in L = kY - hr
  const c0 = 100;
  const i0 = 150;

  // IS: Y = [A - b*r] / (1 - c(1-t)), where A = c0 + i0 + G
  const alphaIS = 1 / (1 - mpc * (1 - taxRate)); // multiplier = 2.5
  const A_IS = c0 + i0 + govSpending;
  // Solve equilibrium:
  // IS: Y = alphaIS * (A_IS - b*r)  =>  r = (A_IS - Y/alphaIS) / b
  // LM: M/P = kY - h*r  =>  r = (kY - M/P) / h
  // Equilibrium Y*:
  const denomISLM = 1 / alphaIS + (investSens * kIncome) / moneyInterestSens;
  const eqY_ISLM = (A_IS + (investSens * moneySupply) / moneyInterestSens) / denomISLM;
  const eqR_ISLM = (kIncome * eqY_ISLM - moneySupply) / moneyInterestSens;
  // Baseline (G=200, M=300, b=20, h=25)
  const baseA = c0 + i0 + 200;
  const baseDenom = 1 / alphaIS + (20 * kIncome) / 25;
  const baseY = (baseA + (20 * 300) / 25) / baseDenom;
  const fiscalMultiplier = 1 / denomISLM;
  const monetaryMultiplier = (investSens / moneyInterestSens) / denomISLM;

  // 2. Solow-Swan Parameters: y = A * k^alpha
  const [savingsRate, setSavingsRate] = useState(0.28); // s
  const [popGrowth, setPopGrowth] = useState(0.02); // n
  const [depreciation, setDepreciation] = useState(0.05); // delta
  const [tfpA, setTfpA] = useState(2.2); // A
  const [alphaCap, setAlphaCap] = useState(0.35); // alpha
  // Steady state: s * A * k^alpha = (n + delta) * k  =>  k* = [(s*A)/(n+delta)]^(1/(1-alpha))
  const kStar = Math.pow((savingsRate * tfpA) / (popGrowth + depreciation), 1 / (1 - alphaCap));
  const yStar = tfpA * Math.pow(kStar, alphaCap);
  const cStar = (1 - savingsRate) * yStar;
  // Golden rule: alpha * A * k^(alpha-1) = n + delta => k_gold = [(alpha*A)/(n+delta)]^(1/(1-alpha))
  const kGold = Math.pow((alphaCap * tfpA) / (popGrowth + depreciation), 1 / (1 - alphaCap));
  const cGold = tfpA * Math.pow(kGold, alphaCap) - (popGrowth + depreciation) * kGold;

  // 3. Monopoly Parameters: P = a - bQ, MC = c
  const [demandIntercept, setDemandIntercept] = useState(100);
  const [demandSlope, setDemandSlope] = useState(1.0);
  const [marginalCost, setMarginalCost] = useState(20);
  const qMonopoly = Math.max(0, (demandIntercept - marginalCost) / (2 * demandSlope));
  const pMonopoly = demandIntercept - demandSlope * qMonopoly;
  const qCompetitive = Math.max(0, (demandIntercept - marginalCost) / demandSlope);
  const monopolyProfit = (pMonopoly - marginalCost) * qMonopoly;
  const lernerIndex = pMonopoly > 0 ? (pMonopoly - marginalCost) / pMonopoly : 0;
  const deadweightLoss = 0.5 * (pMonopoly - marginalCost) * (qCompetitive - qMonopoly);
  const consumerSurplusM = 0.5 * (demandIntercept - pMonopoly) * qMonopoly;

  // 4. Phillips Curve Parameters: pi = pi_e - beta*(u - u_n) + shock
  const [expectedInf, setExpectedInf] = useState(4.5);
  const [nairu, setNairu] = useState(5.0);
  const [betaPhillips, setBetaPhillips] = useState(1.2);
  const [supplyShock, setSupplyShock] = useState(0);
  const [actualUnemp, setActualUnemp] = useState(4.0);
  const actualInf = expectedInf - betaPhillips * (actualUnemp - nairu) + supplyShock;

  const resetActiveModel = () => {
    if (activeModel === 'islm') {
      setGovSpending(200);
      setMoneySupply(300);
      setInvestSens(20);
      setMoneyInterestSens(25);
    } else if (activeModel === 'solow') {
      setSavingsRate(0.28);
      setPopGrowth(0.02);
      setDepreciation(0.05);
      setTfpA(2.2);
      setAlphaCap(0.35);
    } else if (activeModel === 'monopoly') {
      setDemandIntercept(100);
      setDemandSlope(1.0);
      setMarginalCost(20);
    } else {
      setExpectedInf(4.5);
      setNairu(5.0);
      setBetaPhillips(1.2);
      setSupplyShock(0);
      setActualUnemp(4.0);
    }
  };

  // SVG Coordinate Helpers
  const W = 560;
  const H = 360;
  const PAD = { top: 28, right: 28, bottom: 48, left: 56 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Model Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">
            Interactive Economic Theory Lab · Comparative Statics
          </p>
          <h1 className="font-display text-3xl font-semibold text-slate-900">
            Economic Model & Curve Visualizer
          </h1>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/70 rounded-xl">
          {MODEL_TABS.map((tab) => {
            const isActive = activeModel === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveModel(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout (65% Stage / 35% Control & Concept Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Interactive Stage */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">
                {MODEL_TABS.find((t) => t.id === activeModel)?.label}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {MODEL_TABS.find((t) => t.id === activeModel)?.unitLabel} · Live Equilibrium Plot
              </p>
            </div>
            <button
              type="button"
              onClick={resetActiveModel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Live SVG Graph */}
          <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50">
            {activeModel === 'islm' && (() => {
              const maxY = 2000;
              const maxR = 25;
              const toX = (y: number) => PAD.left + (Math.max(0, Math.min(maxY, y)) / maxY) * plotW;
              const toY = (r: number) => PAD.top + plotH - (Math.max(0, Math.min(maxR, r)) / maxR) * plotH;

              const isR0 = A_IS / investSens;
              const isY0 = alphaIS * A_IS;
              const lmR0 = -moneySupply / moneyInterestSens;
              const lmRMaxY = (kIncome * maxY - moneySupply) / moneyInterestSens;

              // Baseline IS & LM
              const baseISR0 = baseA / 20;
              const baseISY0 = alphaIS * baseA;
              const baseLMR0 = -300 / 25;
              const baseLMRMax = (kIncome * maxY - 300) / 25;

              const eqClampedX = toX(eqY_ISLM);
              const eqClampedY = toY(eqR_ISLM);

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="IS-LM Equilibrium Curve Plot">
                  {/* Grid lines */}
                  {[0, 500, 1000, 1500, 2000].map((yv) => (
                    <g key={yv}>
                      <line x1={toX(yv)} y1={PAD.top} x2={toX(yv)} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={toX(yv)} y={PAD.top + plotH + 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                        {yv}
                      </text>
                    </g>
                  ))}
                  {[0, 5, 10, 15, 20, 25].map((rv) => (
                    <g key={rv}>
                      <line x1={PAD.left} y1={toY(rv)} x2={PAD.left + plotW} y2={toY(rv)} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={PAD.left - 10} y={toY(rv) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                        {rv}%
                      </text>
                    </g>
                  ))}

                  {/* Axes */}
                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    National Output / Income (Y)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Interest Rate (r %)
                  </text>

                  {/* Baseline dashed curves */}
                  <line x1={toX(0)} y1={toY(baseISR0)} x2={toX(baseISY0)} y2={toY(0)} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1={toX(0)} y1={toY(baseLMR0)} x2={toX(maxY)} y2={toY(baseLMRMax)} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />

                  {/* Active IS Curve */}
                  <line x1={toX(0)} y1={toY(isR0)} x2={toX(isY0)} y2={toY(0)} stroke="#1D4ED8" strokeWidth="2.5" />
                  <text x={toX(Math.min(isY0, maxY - 80))} y={toY(1.2)} className="fill-blue-700 text-xs font-semibold font-mono">
                    IS
                  </text>

                  {/* Active LM Curve */}
                  <line x1={toX(0)} y1={toY(lmR0)} x2={toX(maxY)} y2={toY(lmRMaxY)} stroke="#059669" strokeWidth="2.5" />
                  <text x={toX(maxY - 90)} y={toY(Math.min(maxR - 1.5, Math.max(1.5, lmRMaxY - 1)))} className="fill-emerald-700 text-xs font-semibold font-mono">
                    LM
                  </text>

                  {/* Equilibrium Projections & Dot */}
                  {eqR_ISLM >= 0 && eqR_ISLM <= maxR && eqY_ISLM >= 0 && eqY_ISLM <= maxY && (
                    <g>
                      <line x1={eqClampedX} y1={eqClampedY} x2={eqClampedX} y2={PAD.top + plotH} stroke="#0F172A" strokeWidth="1" strokeDasharray="3 3" />
                      <line x1={PAD.left} y1={eqClampedY} x2={eqClampedX} y2={eqClampedY} stroke="#0F172A" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx={eqClampedX} cy={eqClampedY} r="5.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
                      <text x={eqClampedX + 10} y={eqClampedY - 8} className="fill-slate-900 text-[11px] font-mono font-semibold">
                        E ({Math.round(eqY_ISLM)}, {eqR_ISLM.toFixed(1)}%)
                      </text>
                    </g>
                  )}
                </svg>
              );
            })()}

            {activeModel === 'solow' && (() => {
              const maxK = Math.max(80, Math.ceil(Math.max(kStar, kGold) * 1.35 / 10) * 10);
              const maxYVal = Math.max(12, tfpA * Math.pow(maxK, alphaCap) * 1.1);
              const toX = (k: number) => PAD.left + (k / maxK) * plotW;
              const toY = (v: number) => PAD.top + plotH - (Math.min(maxYVal, v) / maxYVal) * plotH;

              const steps = 60;
              const buildPath = (fn: (k: number) => number) =>
                Array.from({ length: steps + 1 }, (_, i) => {
                  const k = (i / steps) * maxK;
                  return `${i === 0 ? 'M' : 'L'} ${toX(k).toFixed(1)} ${toY(fn(k)).toFixed(1)}`;
                }).join(' ');

              const pathY = buildPath((k) => tfpA * Math.pow(k, alphaCap));
              const pathSF = buildPath((k) => savingsRate * tfpA * Math.pow(k, alphaCap));
              const pathDep = buildPath((k) => (popGrowth + depreciation) * k);

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Solow-Swan Growth Steady State Plot">
                  {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                    const kv = Math.round(frac * maxK);
                    return (
                      <g key={kv}>
                        <line x1={toX(kv)} y1={PAD.top} x2={toX(kv)} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth="1" />
                        <text x={toX(kv)} y={PAD.top + plotH + 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                          {kv}
                        </text>
                      </g>
                    );
                  })}
                  {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                    const yv = frac * maxYVal;
                    return (
                      <g key={frac}>
                        <line x1={PAD.left} y1={toY(yv)} x2={PAD.left + plotW} y2={toY(yv)} stroke="#E2E8F0" strokeWidth="1" />
                        <text x={PAD.left - 8} y={toY(yv) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                          {yv.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    Capital per Worker (k)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Output / Investment per Worker
                  </text>

                  <path d={pathY} fill="none" stroke="#475569" strokeWidth="2" />
                  <path d={pathSF} fill="none" stroke="#1D4ED8" strokeWidth="2.5" />
                  <path d={pathDep} fill="none" stroke="#DC2626" strokeWidth="2" />

                  <text x={toX(maxK * 0.86)} y={toY(tfpA * Math.pow(maxK * 0.86, alphaCap)) - 8} className="fill-slate-700 text-[11px] font-mono font-semibold">
                    y = f(k)
                  </text>
                  <text x={toX(maxK * 0.84)} y={toY(savingsRate * tfpA * Math.pow(maxK * 0.84, alphaCap)) - 8} className="fill-blue-700 text-[11px] font-mono font-semibold">
                    s·f(k)
                  </text>
                  <text x={toX(maxK * 0.72)} y={toY((popGrowth + depreciation) * maxK * 0.72) - 8} className="fill-red-700 text-[11px] font-mono font-semibold">
                    (n+δ)k
                  </text>

                  {/* Steady State k* */}
                  {kStar <= maxK && (
                    <g>
                      <line x1={toX(kStar)} y1={toY(yStar)} x2={toX(kStar)} y2={PAD.top + plotH} stroke="#0F172A" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx={toX(kStar)} cy={toY(savingsRate * yStar)} r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                      <text x={toX(kStar) + 6} y={PAD.top + plotH - 8} className="fill-blue-800 text-[11px] font-mono font-semibold">
                        k*={kStar.toFixed(1)}
                      </text>
                    </g>
                  )}

                  {/* Golden Rule k_gold */}
                  {kGold <= maxK && (
                    <g>
                      <line x1={toX(kGold)} y1={PAD.top + 16} x2={toX(kGold)} y2={PAD.top + plotH} stroke="#059669" strokeWidth="1.2" strokeDasharray="4 3" />
                      <text x={toX(kGold) + 4} y={PAD.top + 24} className="fill-emerald-700 text-[10px] font-mono font-semibold">
                        k_gold={kGold.toFixed(1)}
                      </text>
                    </g>
                  )}
                </svg>
              );
            })()}

            {activeModel === 'monopoly' && (() => {
              const maxQ = Math.max(100, demandIntercept / demandSlope);
              const maxP = Math.max(120, demandIntercept * 1.1);
              const toX = (q: number) => PAD.left + (Math.max(0, Math.min(maxQ, q)) / maxQ) * plotW;
              const toY = (p: number) => PAD.top + plotH - (Math.max(0, Math.min(maxP, p)) / maxP) * plotH;

              const qInterceptDemand = demandIntercept / demandSlope;
              const qInterceptMR = demandIntercept / (2 * demandSlope);

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Monopoly vs Competitive Welfare Plot">
                  {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                    const qv = Math.round(f * maxQ);
                    return (
                      <g key={qv}>
                        <line x1={toX(qv)} y1={PAD.top} x2={toX(qv)} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth="1" />
                        <text x={toX(qv)} y={PAD.top + plotH + 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                          {qv}
                        </text>
                      </g>
                    );
                  })}
                  {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                    const pv = Math.round(f * maxP);
                    return (
                      <g key={pv}>
                        <line x1={PAD.left} y1={toY(pv)} x2={PAD.left + plotW} y2={toY(pv)} stroke="#E2E8F0" strokeWidth="1" />
                        <text x={PAD.left - 8} y={toY(pv) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                          {pv}
                        </text>
                      </g>
                    );
                  })}

                  {/* Consumer Surplus Triangle */}
                  {qMonopoly > 0 && (
                    <polygon
                      points={`${toX(0)},${toY(demandIntercept)} ${toX(qMonopoly)},${toY(pMonopoly)} ${toX(0)},${toY(pMonopoly)}`}
                      fill="#DBEAFE"
                      opacity="0.7"
                    />
                  )}
                  {/* Monopoly Profit Rectangle */}
                  {qMonopoly > 0 && (
                    <rect
                      x={toX(0)}
                      y={toY(pMonopoly)}
                      width={Math.max(0, toX(qMonopoly) - toX(0))}
                      height={Math.max(0, toY(marginalCost) - toY(pMonopoly))}
                      fill="#D1FAE5"
                      opacity="0.7"
                    />
                  )}
                  {/* Deadweight Loss Triangle */}
                  {qCompetitive > qMonopoly && (
                    <polygon
                      points={`${toX(qMonopoly)},${toY(pMonopoly)} ${toX(qCompetitive)},${toY(marginalCost)} ${toX(qMonopoly)},${toY(marginalCost)}`}
                      fill="#FEE2E2"
                      stroke="#DC2626"
                      strokeWidth="1"
                      opacity="0.85"
                    />
                  )}

                  {/* Axes */}
                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    Quantity (Q)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Price / Cost (₹)
                  </text>

                  {/* Demand (AR) */}
                  <line x1={toX(0)} y1={toY(demandIntercept)} x2={toX(qInterceptDemand)} y2={toY(0)} stroke="#1D4ED8" strokeWidth="2.5" />
                  <text x={toX(qInterceptDemand * 0.85)} y={toY(demandIntercept * 0.15) - 6} className="fill-blue-700 text-[11px] font-mono font-semibold">
                    AR (D)
                  </text>

                  {/* MR */}
                  <line x1={toX(0)} y1={toY(demandIntercept)} x2={toX(qInterceptMR)} y2={toY(0)} stroke="#0284C7" strokeWidth="2" strokeDasharray="5 3" />
                  <text x={toX(qInterceptMR * 0.72)} y={toY(demandIntercept * 0.28) + 14} className="fill-sky-700 text-[11px] font-mono font-semibold">
                    MR
                  </text>

                  {/* MC */}
                  <line x1={PAD.left} y1={toY(marginalCost)} x2={PAD.left + plotW} y2={toY(marginalCost)} stroke="#DC2626" strokeWidth="2" />
                  <text x={PAD.left + plotW - 26} y={toY(marginalCost) - 6} className="fill-red-700 text-[11px] font-mono font-semibold">
                    MC
                  </text>

                  {/* Monopoly Point */}
                  {qMonopoly > 0 && (
                    <g>
                      <line x1={toX(qMonopoly)} y1={toY(pMonopoly)} x2={toX(qMonopoly)} y2={PAD.top + plotH} stroke="#0F172A" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx={toX(qMonopoly)} cy={toY(pMonopoly)} r="5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
                      <text x={toX(qMonopoly) + 8} y={toY(pMonopoly) - 6} className="fill-slate-900 text-[11px] font-mono font-semibold">
                        Pm={pMonopoly.toFixed(1)}, Qm={qMonopoly.toFixed(1)}
                      </text>
                    </g>
                  )}
                </svg>
              );
            })()}

            {activeModel === 'phillips' && (() => {
              const maxU = 12;
              const minInf = -4;
              const maxInf = 14;
              const toX = (u: number) => PAD.left + (u / maxU) * plotW;
              const toY = (inf: number) => PAD.top + plotH - ((Math.max(minInf, Math.min(maxInf, inf)) - minInf) / (maxInf - minInf)) * plotH;

              const srpcY = (u: number) => expectedInf - betaPhillips * (u - nairu) + supplyShock;
              const uStart = 1;
              const uEnd = 11;

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Short-run vs Long-run Phillips Curve">
                  {[0, 2, 4, 6, 8, 10, 12].map((uv) => (
                    <g key={uv}>
                      <line x1={toX(uv)} y1={PAD.top} x2={toX(uv)} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={toX(uv)} y={PAD.top + plotH + 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                        {uv}%
                      </text>
                    </g>
                  ))}
                  {[-4, 0, 4, 8, 12].map((iv) => (
                    <g key={iv}>
                      <line x1={PAD.left} y1={toY(iv)} x2={PAD.left + plotW} y2={toY(iv)} stroke={iv === 0 ? '#94A3B8' : '#E2E8F0'} strokeWidth="1" />
                      <text x={PAD.left - 8} y={toY(iv) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                        {iv}%
                      </text>
                    </g>
                  ))}

                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    Unemployment Rate (u %)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Inflation Rate (π %)
                  </text>

                  {/* Vertical LRPC (NAIRU) */}
                  <line x1={toX(nairu)} y1={PAD.top} x2={toX(nairu)} y2={PAD.top + plotH} stroke="#059669" strokeWidth="2.5" />
                  <text x={toX(nairu) + 6} y={PAD.top + 16} className="fill-emerald-700 text-[11px] font-mono font-semibold">
                    LRPC (NAIRU={nairu.toFixed(1)}%)
                  </text>

                  {/* SRPC */}
                  <line x1={toX(uStart)} y1={toY(srpcY(uStart))} x2={toX(uEnd)} y2={toY(srpcY(uEnd))} stroke="#1D4ED8" strokeWidth="2.5" />
                  <text x={toX(uEnd) - 36} y={toY(srpcY(uEnd)) - 8} className="fill-blue-700 text-[11px] font-mono font-semibold">
                    SRPC
                  </text>

                  {/* Actual Economy Dot */}
                  <circle cx={toX(actualUnemp)} cy={toY(actualInf)} r="5.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={toX(actualUnemp) + 10} y={toY(actualInf) - 8} className="fill-slate-900 text-[11px] font-mono font-semibold">
                    (u={actualUnemp.toFixed(1)}%, π={actualInf.toFixed(1)}%)
                  </text>
                </svg>
              );
            })()}
          </div>

          {/* Live Readout Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {activeModel === 'islm' && (
              <>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Equilibrium Y*</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {Math.round(eqY_ISLM)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Interest Rate r*</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {eqR_ISLM.toFixed(2)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Fiscal Multiplier</p>
                  <p className="font-mono text-base font-semibold text-blue-700 tabular-nums mt-0.5">
                    {fiscalMultiplier.toFixed(2)}×
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">ΔY vs Baseline</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {eqY_ISLM - baseY >= 0 ? '+' : ''}
                    {Math.round(eqY_ISLM - baseY)} (k_M {monetaryMultiplier.toFixed(2)})
                  </p>
                </div>
              </>
            )}

            {activeModel === 'solow' && (
              <>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Steady-State k*</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {kStar.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Output per Worker y*</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {yStar.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Consumption c*</p>
                  <p className="font-mono text-base font-semibold text-blue-700 tabular-nums mt-0.5">
                    {cStar.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Golden Rule k_gold</p>
                  <p className="font-mono text-base font-semibold text-emerald-700 tabular-nums mt-0.5">
                    {kGold.toFixed(2)} (c={cGold.toFixed(2)})
                  </p>
                </div>
              </>
            )}

            {activeModel === 'monopoly' && (
              <>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Monopoly Price / Qty</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    ₹{pMonopoly.toFixed(1)} / {qMonopoly.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Lerner Index (L)</p>
                  <p className="font-mono text-base font-semibold text-blue-700 tabular-nums mt-0.5">
                    {lernerIndex.toFixed(3)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Deadweight Loss</p>
                  <p className="font-mono text-base font-semibold text-red-700 tabular-nums mt-0.5">
                    ₹{deadweightLoss.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Profit / CS</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {monopolyProfit.toFixed(0)} / {consumerSurplusM.toFixed(0)}
                  </p>
                </div>
              </>
            )}

            {activeModel === 'phillips' && (
              <>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Actual Inflation (π)</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {actualInf.toFixed(2)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Expected Inflation (πe)</p>
                  <p className="font-mono text-base font-semibold text-blue-700 tabular-nums mt-0.5">
                    {expectedInf.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Unemployment Gap</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {(actualUnemp - nairu).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Sacrifice Ratio (1/β)</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {(1 / betaPhillips).toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Parameter Controls & Exam Takeaways */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <h3 className="font-display text-lg font-semibold text-slate-900">
              Parameter Controls
            </h3>

            {activeModel === 'islm' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-g" className="text-slate-700">Government Spending (G)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{govSpending} units</span>
                  </div>
                  <input id="sl-g" type="range" min={50} max={500} step={10} value={govSpending} onChange={(e) => setGovSpending(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-m" className="text-slate-700">Real Money Supply (M/P)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{moneySupply} units</span>
                  </div>
                  <input id="sl-m" type="range" min={100} max={600} step={10} value={moneySupply} onChange={(e) => setMoneySupply(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-b" className="text-slate-700">Investment Interest Sensitivity (b)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{investSens}</span>
                  </div>
                  <input id="sl-b" type="range" min={2} max={45} step={1} value={investSens} onChange={(e) => setInvestSens(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-h" className="text-slate-700">Money Demand Sensitivity (h)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{moneyInterestSens}</span>
                  </div>
                  <input id="sl-h" type="range" min={5} max={100} step={5} value={moneyInterestSens} onChange={(e) => setMoneyInterestSens(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
              </div>
            )}

            {activeModel === 'solow' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-s" className="text-slate-700">Savings Rate (s)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{(savingsRate * 100).toFixed(0)}%</span>
                  </div>
                  <input id="sl-s" type="range" min={0.08} max={0.6} step={0.01} value={savingsRate} onChange={(e) => setSavingsRate(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-n" className="text-slate-700">Population Growth (n)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{(popGrowth * 100).toFixed(1)}%</span>
                  </div>
                  <input id="sl-n" type="range" min={0.0} max={0.06} step={0.005} value={popGrowth} onChange={(e) => setPopGrowth(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-d" className="text-slate-700">Depreciation Rate (δ)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{(depreciation * 100).toFixed(1)}%</span>
                  </div>
                  <input id="sl-d" type="range" min={0.02} max={0.12} step={0.005} value={depreciation} onChange={(e) => setDepreciation(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-a" className="text-slate-700">Capital Share (α) & TFP (A)</label>
                    <span className="font-mono text-slate-900 tabular-nums">α={alphaCap.toFixed(2)} · A={tfpA.toFixed(1)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input id="sl-a" type="range" min={0.2} max={0.55} step={0.01} value={alphaCap} onChange={(e) => setAlphaCap(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                    <input aria-label="Total Factor Productivity A" type="range" min={1.2} max={3.5} step={0.1} value={tfpA} onChange={(e) => setTfpA(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}

            {activeModel === 'monopoly' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-int" className="text-slate-700">Demand Intercept (a)</label>
                    <span className="font-mono text-slate-900 tabular-nums">₹{demandIntercept}</span>
                  </div>
                  <input id="sl-int" type="range" min={60} max={140} step={2} value={demandIntercept} onChange={(e) => setDemandIntercept(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-slp" className="text-slate-700">Demand Slope (b in P = a − bQ)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{demandSlope.toFixed(2)}</span>
                  </div>
                  <input id="sl-slp" type="range" min={0.5} max={2.0} step={0.1} value={demandSlope} onChange={(e) => setDemandSlope(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-mc" className="text-slate-700">Constant Marginal Cost (MC)</label>
                    <span className="font-mono text-slate-900 tabular-nums">₹{marginalCost}</span>
                  </div>
                  <input id="sl-mc" type="range" min={5} max={70} step={1} value={marginalCost} onChange={(e) => setMarginalCost(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
              </div>
            )}

            {activeModel === 'phillips' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-pie" className="text-slate-700">Expected Inflation (πe)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{expectedInf.toFixed(1)}%</span>
                  </div>
                  <input id="sl-pie" type="range" min={0} max={10} step={0.5} value={expectedInf} onChange={(e) => setExpectedInf(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-un" className="text-slate-700">Natural Rate / NAIRU (u_n)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{nairu.toFixed(1)}%</span>
                  </div>
                  <input id="sl-un" type="range" min={3} max={8} step={0.5} value={nairu} onChange={(e) => setNairu(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-u" className="text-slate-700">Current Unemployment (u)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{actualUnemp.toFixed(1)}%</span>
                  </div>
                  <input id="sl-u" type="range" min={1.5} max={10.5} step={0.5} value={actualUnemp} onChange={(e) => setActualUnemp(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-shk" className="text-slate-700">Supply Shock (ε) & Slope (β)</label>
                    <span className="font-mono text-slate-900 tabular-nums">ε={supplyShock.toFixed(1)}% · β={betaPhillips.toFixed(1)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input id="sl-shk" type="range" min={-3} max={5} step={0.5} value={supplyShock} onChange={(e) => setSupplyShock(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                    <input aria-label="Phillips slope beta" type="range" min={0.4} max={2.5} step={0.1} value={betaPhillips} onChange={(e) => setBetaPhillips(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exam Concept Callout */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-900">
              NTA UGC NET Concept Verification
            </p>
            {activeModel === 'islm' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                Slide <strong>h</strong> upward toward 100 to simulate a near-Liquidity Trap: notice the monetary multiplier shrinks toward 0 while fiscal multiplier approaches 2.5×. Slide <strong>h</strong> down to 5 (Classical zone) and fiscal crowding out dominates.
              </p>
            )}
            {activeModel === 'solow' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare <strong>s = {(savingsRate * 100).toFixed(0)}%</strong> with Capital Share <strong>α = {(alphaCap * 100).toFixed(0)}%</strong>. By the Solow Golden Rule, steady-state consumption c* reaches its maximum exactly when s = α (here k* = k_gold). If s &gt; α, the economy is dynamically inefficient!
              </p>
            )}
            {activeModel === 'monopoly' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                Notice the Lerner Index <strong>L = (P − MC)/P = {lernerIndex.toFixed(3)}</strong> equals 1/|e_d|. Because Q_m = Q_c / 2 for linear demand and constant MC, Deadweight Loss equals exactly one-quarter of the competitive total surplus.
              </p>
            )}
            {activeModel === 'phillips' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                Pushing unemployment below NAIRU ({nairu.toFixed(1)}%) temporarily raises inflation above πe. Once expectations adapt upward, the SRPC shifts right—leaving unemployment back at NAIRU with permanently higher inflation (Friedman–Phelps hypothesis).
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
