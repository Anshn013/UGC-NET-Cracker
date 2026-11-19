import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

type ModelId =
  | 'islm'
  | 'solow'
  | 'monopoly'
  | 'phillips'
  | 'lorenz'
  | 'taxinc'
  | 'sweezy'
  | 'jcurve'
  | 'kuznets';

const MODEL_TABS: { id: ModelId; label: string; unitLabel: string }[] = [
  { id: 'islm', label: 'IS–LM & Policy', unitLabel: 'Unit 2 · Macro' },
  { id: 'solow', label: 'Solow–Swan', unitLabel: 'Unit 8 · Growth' },
  { id: 'monopoly', label: 'Monopoly & DWL', unitLabel: 'Unit 1 · Micro' },
  { id: 'phillips', label: 'Phillips & NAIRU', unitLabel: 'Unit 2 · Macro' },
  { id: 'lorenz', label: 'Lorenz & Gini', unitLabel: 'Unit 8 · Inequality' },
  { id: 'taxinc', label: 'Tax & Laffer', unitLabel: 'Unit 6 · Public Econ' },
  { id: 'sweezy', label: 'Kinked Demand', unitLabel: 'Unit 1 · Oligopoly' },
  { id: 'jcurve', label: 'J-Curve & BoP', unitLabel: 'Unit 5 · International' },
  { id: 'kuznets', label: 'Kuznets Curve', unitLabel: 'Unit 8 & 9 · Growth/Env' },
];

export const ModelLab: React.FC = () => {
  const [activeModel, setActiveModel] = useState<ModelId>('islm');

  // 1. IS-LM Parameters
  const [govSpending, setGovSpending] = useState(200);
  const [moneySupply, setMoneySupply] = useState(300);
  const [investSens, setInvestSens] = useState(20);
  const [moneyInterestSens, setMoneyInterestSens] = useState(25);
  const mpc = 0.75;
  const taxRate = 0.2;
  const kIncome = 0.5;
  const c0 = 100;
  const i0 = 150;

  const alphaIS = 1 / (1 - mpc * (1 - taxRate));
  const A_IS = c0 + i0 + govSpending;
  const denomISLM = 1 / alphaIS + (investSens * kIncome) / moneyInterestSens;
  const eqY_ISLM = (A_IS + (investSens * moneySupply) / moneyInterestSens) / denomISLM;
  const eqR_ISLM = (kIncome * eqY_ISLM - moneySupply) / moneyInterestSens;
  const baseA = c0 + i0 + 200;
  const baseDenom = 1 / alphaIS + (20 * kIncome) / 25;
  const baseY = (baseA + (20 * 300) / 25) / baseDenom;
  const fiscalMultiplier = 1 / denomISLM;
  const monetaryMultiplier = (investSens / moneyInterestSens) / denomISLM;

  // 2. Solow-Swan Parameters: y = A * k^alpha
  const [savingsRate, setSavingsRate] = useState(0.28);
  const [popGrowth, setPopGrowth] = useState(0.02);
  const [depreciation, setDepreciation] = useState(0.05);
  const [tfpA, setTfpA] = useState(2.2);
  const [alphaCap, setAlphaCap] = useState(0.35);
  const kStar = Math.pow((savingsRate * tfpA) / (popGrowth + depreciation), 1 / (1 - alphaCap));
  const yStar = tfpA * Math.pow(kStar, alphaCap);
  const cStar = (1 - savingsRate) * yStar;
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

  // 5. Lorenz Curve & Gini Parameter: L(p) = p^theta
  const [inequalityTheta, setInequalityTheta] = useState(2.2);
  const giniCoeff = (inequalityTheta - 1) / (inequalityTheta + 1);
  const bottom40Share = Math.pow(0.4, inequalityTheta) * 100;
  const top20Share = (1 - Math.pow(0.8, inequalityTheta)) * 100;

  // 6. Tax Incidence, Deadweight Loss & Laffer Curve Parameters
  const [perUnitTax, setPerUnitTax] = useState(16);
  const [demandElasSlope, setDemandElasSlope] = useState(0.8);
  const [supplyElasSlope, setSupplyElasSlope] = useState(1.2);
  const [lafferRate, setLafferRate] = useState(35);
  const buyerShareIncidence = supplyElasSlope / (demandElasSlope + supplyElasSlope);
  const sellerShareIncidence = 1 - buyerShareIncidence;
  const taxDWL =
    0.5 *
    Math.pow(perUnitTax, 2) *
    ((demandElasSlope * supplyElasSlope) / (demandElasSlope + supplyElasSlope));
  const lafferRevenueIndex = (4 * lafferRate * (100 - lafferRate)) / 100;

  // 7. Sweezy Kinked Demand Curve Parameters
  const [kinkPrice, setKinkPrice] = useState(50);
  const [kinkQty, setKinkQty] = useState(40);
  const [upperSlope, setUpperSlope] = useState(0.5); // flatter upper segment (elastic)
  const [lowerSlope, setLowerSlope] = useState(1.8); // steeper lower segment (inelastic)
  const [sweezyMC, setSweezyMC] = useState(28);
  const upperIntercept = kinkPrice + upperSlope * kinkQty;
  const lowerIntercept = kinkPrice + lowerSlope * kinkQty;
  const upperMRTop = upperIntercept;
  const upperMRAtK = upperIntercept - 2 * upperSlope * kinkQty;
  const lowerMRAtK = lowerIntercept - 2 * lowerSlope * kinkQty;
  const mrGapWidth = Math.max(0, upperMRAtK - lowerMRAtK);
  const mcInGap = sweezyMC >= lowerMRAtK && sweezyMC <= upperMRAtK;

  // 8. J-Curve Effect Parameters: NX(t) over time t = 0..12 quarters
  const [depreciationPct, setDepreciationPct] = useState(12); // % currency depreciation
  const [initialDipDepth, setInitialDipDepth] = useState(35); // short-run price/pass-through dip
  const [recoverySpeed, setRecoverySpeed] = useState(0.45); // volume response speed
  const nxAtTime = (t: number) => {
    // Starts at 0, dips initially due to price/contract lag, then rises as volumes adjust
    const dipTerm = -initialDipDepth * (depreciationPct / 12) * Math.exp(-recoverySpeed * t) * Math.sin(Math.min(Math.PI, (t / 4) * Math.PI));
    const gainTerm = (depreciationPct / 12) * 55 * (1 - Math.exp(-recoverySpeed * Math.max(0, t - 2.5)));
    return dipTerm + gainTerm;
  };
  const troughNX = Math.min(...Array.from({ length: 61 }, (_, i) => nxAtTime((i / 60) * 12)));
  const longRunNX = nxAtTime(12);

  // 9. Kuznets Curve Parameters: y(x) = peak * (1 - ((x - peakIncome)/peakIncome)^2)
  const [peakIncome, setPeakIncome] = useState(55); // turning point on x-axis (0..100)
  const [peakLevel, setPeakLevel] = useState(80); // max inequality / pollution index
  const [currentIncome, setCurrentIncome] = useState(35); // economy position on x-axis
  const kuznetsAt = (x: number) => {
    const norm = (x - peakIncome) / Math.max(20, peakIncome);
    return Math.max(5, peakLevel * (1 - 0.72 * norm * norm));
  };
  const currentIndicator = kuznetsAt(currentIncome);
  const kuznetsPhase =
    currentIncome < peakIncome - 4
      ? 'Rising Phase (Industrialization / Scale)'
      : currentIncome > peakIncome + 4
        ? 'Declining Phase (Post-Industrial / Abatement)'
        : 'Near Turning Point (Peak)';

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
    } else if (activeModel === 'phillips') {
      setExpectedInf(4.5);
      setNairu(5.0);
      setBetaPhillips(1.2);
      setSupplyShock(0);
      setActualUnemp(4.0);
    } else if (activeModel === 'lorenz') {
      setInequalityTheta(2.2);
    } else if (activeModel === 'taxinc') {
      setPerUnitTax(16);
      setDemandElasSlope(0.8);
      setSupplyElasSlope(1.2);
      setLafferRate(35);
    } else if (activeModel === 'sweezy') {
      setKinkPrice(50);
      setKinkQty(40);
      setUpperSlope(0.5);
      setLowerSlope(1.8);
      setSweezyMC(28);
    } else if (activeModel === 'jcurve') {
      setDepreciationPct(12);
      setInitialDipDepth(35);
      setRecoverySpeed(0.45);
    } else {
      setPeakIncome(55);
      setPeakLevel(80);
      setCurrentIncome(35);
    }
  };

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
            Interactive Economic Theory Lab · UGC NET Paper 2 Diagrams
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
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

      {/* Two-Zone Sandbox Layout */}
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

              const baseISR0 = baseA / 20;
              const baseISY0 = alphaIS * baseA;
              const baseLMR0 = -300 / 25;
              const baseLMRMax = (kIncome * maxY - 300) / 25;

              const eqClampedX = toX(eqY_ISLM);
              const eqClampedY = toY(eqR_ISLM);

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="IS-LM Equilibrium Curve Plot">
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

                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    National Output / Income (Y)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Interest Rate (r %)
                  </text>

                  <line x1={toX(0)} y1={toY(baseISR0)} x2={toX(baseISY0)} y2={toY(0)} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1={toX(0)} y1={toY(baseLMR0)} x2={toX(maxY)} y2={toY(baseLMRMax)} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />

                  <line x1={toX(0)} y1={toY(isR0)} x2={toX(isY0)} y2={toY(0)} stroke="#1D4ED8" strokeWidth="2.5" />
                  <text x={toX(Math.min(isY0, maxY - 80))} y={toY(1.2)} className="fill-blue-700 text-xs font-semibold font-mono">
                    IS
                  </text>

                  <line x1={toX(0)} y1={toY(lmR0)} x2={toX(maxY)} y2={toY(lmRMaxY)} stroke="#059669" strokeWidth="2.5" />
                  <text x={toX(maxY - 90)} y={toY(Math.min(maxR - 1.5, Math.max(1.5, lmRMaxY - 1)))} className="fill-emerald-700 text-xs font-semibold font-mono">
                    LM
                  </text>

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
              const maxK = Math.max(80, Math.ceil((Math.max(kStar, kGold) * 1.35) / 10) * 10);
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

                  {kStar <= maxK && (
                    <g>
                      <line x1={toX(kStar)} y1={toY(yStar)} x2={toX(kStar)} y2={PAD.top + plotH} stroke="#0F172A" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx={toX(kStar)} cy={toY(savingsRate * yStar)} r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                      <text x={toX(kStar) + 6} y={PAD.top + plotH - 8} className="fill-blue-800 text-[11px] font-mono font-semibold">
                        k*={kStar.toFixed(1)}
                      </text>
                    </g>
                  )}

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

                  {qMonopoly > 0 && (
                    <polygon
                      points={`${toX(0)},${toY(demandIntercept)} ${toX(qMonopoly)},${toY(pMonopoly)} ${toX(0)},${toY(pMonopoly)}`}
                      fill="#DBEAFE"
                      opacity="0.7"
                    />
                  )}
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
                  {qCompetitive > qMonopoly && (
                    <polygon
                      points={`${toX(qMonopoly)},${toY(pMonopoly)} ${toX(qCompetitive)},${toY(marginalCost)} ${toX(qMonopoly)},${toY(marginalCost)}`}
                      fill="#FEE2E2"
                      stroke="#DC2626"
                      strokeWidth="1"
                      opacity="0.85"
                    />
                  )}

                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    Quantity (Q)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Price / Cost (₹)
                  </text>

                  <line x1={toX(0)} y1={toY(demandIntercept)} x2={toX(qInterceptDemand)} y2={toY(0)} stroke="#1D4ED8" strokeWidth="2.5" />
                  <text x={toX(qInterceptDemand * 0.85)} y={toY(demandIntercept * 0.15) - 6} className="fill-blue-700 text-[11px] font-mono font-semibold">
                    AR (D)
                  </text>

                  <line x1={toX(0)} y1={toY(demandIntercept)} x2={toX(qInterceptMR)} y2={toY(0)} stroke="#0284C7" strokeWidth="2" strokeDasharray="5 3" />
                  <text x={toX(qInterceptMR * 0.72)} y={toY(demandIntercept * 0.28) + 14} className="fill-sky-700 text-[11px] font-mono font-semibold">
                    MR
                  </text>

                  <line x1={PAD.left} y1={toY(marginalCost)} x2={PAD.left + plotW} y2={toY(marginalCost)} stroke="#DC2626" strokeWidth="2" />
                  <text x={PAD.left + plotW - 26} y={toY(marginalCost) - 6} className="fill-red-700 text-[11px] font-mono font-semibold">
                    MC
                  </text>

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

                  <line x1={toX(nairu)} y1={PAD.top} x2={toX(nairu)} y2={PAD.top + plotH} stroke="#059669" strokeWidth="2.5" />
                  <text x={toX(nairu) + 6} y={PAD.top + 16} className="fill-emerald-700 text-[11px] font-mono font-semibold">
                    LRPC (NAIRU={nairu.toFixed(1)}%)
                  </text>

                  <line x1={toX(uStart)} y1={toY(srpcY(uStart))} x2={toX(uEnd)} y2={toY(srpcY(uEnd))} stroke="#1D4ED8" strokeWidth="2.5" />
                  <text x={toX(uEnd) - 36} y={toY(srpcY(uEnd)) - 8} className="fill-blue-700 text-[11px] font-mono font-semibold">
                    SRPC
                  </text>

                  <circle cx={toX(actualUnemp)} cy={toY(actualInf)} r="5.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={toX(actualUnemp) + 10} y={toY(actualInf) - 8} className="fill-slate-900 text-[11px] font-mono font-semibold">
                    (u={actualUnemp.toFixed(1)}%, π={actualInf.toFixed(1)}%)
                  </text>
                </svg>
              );
            })()}

            {activeModel === 'lorenz' && (() => {
              const toX = (p: number) => PAD.left + p * plotW;
              const toY = (inc: number) => PAD.top + plotH - inc * plotH;
              const steps = 60;
              const lorenzPath = Array.from({ length: steps + 1 }, (_, i) => {
                const p = i / steps;
                const inc = Math.pow(p, inequalityTheta);
                return `${i === 0 ? 'M' : 'L'} ${toX(p).toFixed(1)} ${toY(inc).toFixed(1)}`;
              }).join(' ');

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Lorenz Curve and Line of Equality">
                  {[0, 0.25, 0.5, 0.75, 1].map((v) => (
                    <g key={v}>
                      <line x1={toX(v)} y1={PAD.top} x2={toX(v)} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth="1" />
                      <line x1={PAD.left} y1={toY(v)} x2={PAD.left + plotW} y2={toY(v)} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={toX(v)} y={PAD.top + plotH + 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                        {Math.round(v * 100)}%
                      </text>
                      <text x={PAD.left - 8} y={toY(v) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                        {Math.round(v * 100)}%
                      </text>
                    </g>
                  ))}

                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    Cumulative Share of Population (%)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Cumulative Share of Income (%)
                  </text>

                  <line x1={toX(0)} y1={toY(0)} x2={toX(1)} y2={toY(1)} stroke="#64748B" strokeWidth="1.5" strokeDasharray="5 4" />
                  <text x={toX(0.58)} y={toY(0.64)} className="fill-slate-600 text-[11px] font-mono font-semibold">
                    45° Equality Line
                  </text>

                  <path d={lorenzPath} fill="none" stroke="#1D4ED8" strokeWidth="2.5" />
                  <text x={toX(0.66)} y={toY(Math.pow(0.66, inequalityTheta)) + 16} className="fill-blue-700 text-[11px] font-mono font-semibold">
                    Lorenz Curve (G={giniCoeff.toFixed(2)})
                  </text>
                </svg>
              );
            })()}

            {activeModel === 'taxinc' && (() => {
              const toX = (t: number) => PAD.left + (t / 100) * plotW;
              const toY = (rev: number) => PAD.top + plotH - (Math.max(0, Math.min(100, rev)) / 100) * plotH;
              const steps = 60;
              const lafferPath = Array.from({ length: steps + 1 }, (_, i) => {
                const t = (i / steps) * 100;
                const rev = (4 * t * (100 - t)) / 100;
                return `${i === 0 ? 'M' : 'L'} ${toX(t).toFixed(1)} ${toY(rev).toFixed(1)}`;
              }).join(' ');

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Laffer Curve Tax Rate vs Revenue">
                  {[0, 25, 50, 75, 100].map((tv) => (
                    <g key={tv}>
                      <line x1={toX(tv)} y1={PAD.top} x2={toX(tv)} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={toX(tv)} y={PAD.top + plotH + 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                        {tv}%
                      </text>
                    </g>
                  ))}
                  {[0, 25, 50, 75, 100].map((rv) => (
                    <g key={rv}>
                      <line x1={PAD.left} y1={toY(rv)} x2={PAD.left + plotW} y2={toY(rv)} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={PAD.left - 8} y={toY(rv) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                        {rv}
                      </text>
                    </g>
                  ))}

                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    Effective Tax Rate (%)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Tax Revenue Index
                  </text>

                  <path d={lafferPath} fill="none" stroke="#1D4ED8" strokeWidth="2.5" />
                  <line x1={toX(50)} y1={PAD.top} x2={toX(50)} y2={PAD.top + plotH} stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
                  <text x={toX(50) + 6} y={PAD.top + 14} className="fill-slate-600 text-[10px] font-mono">
                    Peak (50%)
                  </text>

                  <circle cx={toX(lafferRate)} cy={toY(lafferRevenueIndex)} r="5.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={toX(lafferRate) + 8} y={toY(lafferRevenueIndex) - 8} className="fill-slate-900 text-[11px] font-mono font-semibold">
                    t={lafferRate}%, Rev={lafferRevenueIndex.toFixed(1)}
                  </text>
                </svg>
              );
            })()}

            {activeModel === 'sweezy' && (() => {
              const maxQ = 100;
              const maxP = 120;
              const toX = (q: number) => PAD.left + (Math.max(0, Math.min(maxQ, q)) / maxQ) * plotW;
              const toY = (p: number) => PAD.top + plotH - (Math.max(0, Math.min(maxP, p)) / maxP) * plotH;

              const qEndUpper = Math.min(maxQ, upperIntercept / upperSlope);
              const pEndLower = Math.max(0, kinkPrice - lowerSlope * (maxQ - kinkQty));

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Sweezy Kinked Demand Curve">
                  {[0, 25, 50, 75, 100].map((qv) => (
                    <g key={qv}>
                      <line x1={toX(qv)} y1={PAD.top} x2={toX(qv)} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={toX(qv)} y={PAD.top + plotH + 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                        {qv}
                      </text>
                    </g>
                  ))}
                  {[0, 30, 60, 90, 120].map((pv) => (
                    <g key={pv}>
                      <line x1={PAD.left} y1={toY(pv)} x2={PAD.left + plotW} y2={toY(pv)} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={PAD.left - 8} y={toY(pv) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                        {pv}
                      </text>
                    </g>
                  ))}

                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    Output (Q)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Price / MR / MC (₹)
                  </text>

                  {/* Kinked Demand (D) */}
                  <line x1={toX(0)} y1={toY(upperIntercept)} x2={toX(kinkQty)} y2={toY(kinkPrice)} stroke="#1D4ED8" strokeWidth="2.5" />
                  <line x1={toX(kinkQty)} y1={toY(kinkPrice)} x2={toX(qEndUpper)} y2={toY(pEndLower)} stroke="#1D4ED8" strokeWidth="2.5" />
                  <text x={toX(10)} y={toY(upperIntercept - upperSlope * 10) - 8} className="fill-blue-700 text-[11px] font-mono font-semibold">
                    D (Kinked)
                  </text>

                  {/* MR with vertical gap at kinkQty */}
                  {upperMRTop <= maxP && (
                    <line x1={toX(0)} y1={toY(upperMRTop)} x2={toX(kinkQty)} y2={toY(upperMRAtK)} stroke="#0284C7" strokeWidth="2" strokeDasharray="4 3" />
                  )}
                  <line x1={toX(kinkQty)} y1={toY(upperMRAtK)} x2={toX(kinkQty)} y2={toY(lowerMRAtK)} stroke="#0284C7" strokeWidth="2.5" />
                  <line x1={toX(kinkQty)} y1={toY(lowerMRAtK)} x2={toX(maxQ)} y2={toY(lowerMRAtK - 2 * lowerSlope * (maxQ - kinkQty))} stroke="#0284C7" strokeWidth="2" strokeDasharray="4 3" />

                  {/* MC line */}
                  <line x1={PAD.left} y1={toY(sweezyMC)} x2={PAD.left + plotW} y2={toY(sweezyMC)} stroke="#DC2626" strokeWidth="2" />
                  <text x={PAD.left + plotW - 26} y={toY(sweezyMC) - 6} className="fill-red-700 text-[11px] font-mono font-semibold">
                    MC
                  </text>

                  {/* Kink Dot */}
                  <circle cx={toX(kinkQty)} cy={toY(kinkPrice)} r="5.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={toX(kinkQty) + 8} y={toY(kinkPrice) - 8} className="fill-slate-900 text-[11px] font-mono font-semibold">
                    Kink ({kinkQty}, ₹{kinkPrice})
                  </text>
                </svg>
              );
            })()}

            {activeModel === 'jcurve' && (() => {
              const maxT = 12;
              const minNX = -60;
              const maxNX = 60;
              const toX = (t: number) => PAD.left + (t / maxT) * plotW;
              const toY = (nx: number) => PAD.top + plotH - ((Math.max(minNX, Math.min(maxNX, nx)) - minNX) / (maxNX - minNX)) * plotH;

              const steps = 60;
              const pathNX = Array.from({ length: steps + 1 }, (_, i) => {
                const t = (i / steps) * maxT;
                return `${i === 0 ? 'M' : 'L'} ${toX(t).toFixed(1)} ${toY(nxAtTime(t)).toFixed(1)}`;
              }).join(' ');

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="J-Curve Trade Balance Adjustment">
                  {[0, 3, 6, 9, 12].map((tv) => (
                    <g key={tv}>
                      <line x1={toX(tv)} y1={PAD.top} x2={toX(tv)} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={toX(tv)} y={PAD.top + plotH + 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                        Q{tv}
                      </text>
                    </g>
                  ))}
                  {[-60, -30, 0, 30, 60].map((nv) => (
                    <g key={nv}>
                      <line x1={PAD.left} y1={toY(nv)} x2={PAD.left + plotW} y2={toY(nv)} stroke={nv === 0 ? '#64748B' : '#E2E8F0'} strokeWidth={nv === 0 ? '1.3' : '1'} strokeDasharray={nv === 0 ? '4 3' : undefined} />
                      <text x={PAD.left - 8} y={toY(nv) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                        {nv}
                      </text>
                    </g>
                  ))}

                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    Time After Depreciation (Quarters)
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Trade Balance (NX Index)
                  </text>

                  <path d={pathNX} fill="none" stroke="#1D4ED8" strokeWidth="2.5" />
                  <text x={toX(8.5)} y={toY(nxAtTime(8.5)) - 10} className="fill-blue-700 text-[11px] font-mono font-semibold">
                    J-Curve (NX)
                  </text>
                </svg>
              );
            })()}

            {activeModel === 'kuznets' && (() => {
              const toX = (x: number) => PAD.left + (x / 100) * plotW;
              const toY = (v: number) => PAD.top + plotH - (Math.max(0, Math.min(100, v)) / 100) * plotH;

              const steps = 60;
              const curvePath = Array.from({ length: steps + 1 }, (_, i) => {
                const x = (i / steps) * 100;
                return `${i === 0 ? 'M' : 'L'} ${toX(x).toFixed(1)} ${toY(kuznetsAt(x)).toFixed(1)}`;
              }).join(' ');

              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Kuznets Inverted-U Curve">
                  {[0, 25, 50, 75, 100].map((xv) => (
                    <g key={xv}>
                      <line x1={toX(xv)} y1={PAD.top} x2={toX(xv)} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={toX(xv)} y={PAD.top + plotH + 18} textAnchor="middle" className="fill-slate-500 text-[10px] font-mono">
                        {xv}
                      </text>
                    </g>
                  ))}
                  {[0, 25, 50, 75, 100].map((yv) => (
                    <g key={yv}>
                      <line x1={PAD.left} y1={toY(yv)} x2={PAD.left + plotW} y2={toY(yv)} stroke="#E2E8F0" strokeWidth="1" />
                      <text x={PAD.left - 8} y={toY(yv) + 3} textAnchor="end" className="fill-slate-500 text-[10px] font-mono">
                        {yv}
                      </text>
                    </g>
                  ))}

                  <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <line x1={PAD.left} y1={PAD.top + plotH} x2={PAD.left + plotW} y2={PAD.top + plotH} stroke="#334155" strokeWidth="1.5" />
                  <text x={PAD.left + plotW / 2} y={H - 8} textAnchor="middle" className="fill-slate-700 text-[11px] font-medium">
                    Per Capita Income / Development Index
                  </text>
                  <text x={16} y={PAD.top + plotH / 2} textAnchor="middle" transform={`rotate(-90 16 ${PAD.top + plotH / 2})`} className="fill-slate-700 text-[11px] font-medium">
                    Inequality / Emissions Index
                  </text>

                  <path d={curvePath} fill="none" stroke="#1D4ED8" strokeWidth="2.5" />
                  <line x1={toX(peakIncome)} y1={PAD.top} x2={toX(peakIncome)} y2={PAD.top + plotH} stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
                  <text x={toX(peakIncome) + 6} y={PAD.top + 14} className="fill-slate-600 text-[10px] font-mono">
                    Peak @ {peakIncome}
                  </text>

                  <circle cx={toX(currentIncome)} cy={toY(currentIndicator)} r="5.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={toX(currentIncome) + 8} y={toY(currentIndicator) - 8} className="fill-slate-900 text-[11px] font-mono font-semibold">
                    ({currentIncome}, {currentIndicator.toFixed(1)})
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

            {activeModel === 'lorenz' && (
              <>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Gini Coefficient</p>
                  <p className="font-mono text-base font-semibold text-blue-700 tabular-nums mt-0.5">
                    {giniCoeff.toFixed(3)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Bottom 40% Share</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {bottom40Share.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Top 20% Share</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {top20Share.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Curve Shape θ</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {inequalityTheta.toFixed(1)}
                  </p>
                </div>
              </>
            )}

            {activeModel === 'taxinc' && (
              <>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Buyer Tax Burden</p>
                  <p className="font-mono text-base font-semibold text-blue-700 tabular-nums mt-0.5">
                    {(buyerShareIncidence * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Seller Tax Burden</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {(sellerShareIncidence * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Tax DWL Index</p>
                  <p className="font-mono text-base font-semibold text-red-700 tabular-nums mt-0.5">
                    {taxDWL.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Laffer Revenue</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {lafferRevenueIndex.toFixed(1)} (at {lafferRate}%)
                  </p>
                </div>
              </>
            )}

            {activeModel === 'sweezy' && (
              <>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">MR Gap Span</p>
                  <p className="font-mono text-base font-semibold text-blue-700 tabular-nums mt-0.5">
                    ₹{mrGapWidth.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Upper / Lower MR</p>
                  <p className="font-mono text-xs font-semibold text-slate-900 tabular-nums mt-1">
                    {upperMRAtK.toFixed(0)} / {lowerMRAtK.toFixed(0)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Price Sticky?</p>
                  <p className="font-mono text-base font-semibold text-emerald-700 tabular-nums mt-0.5">
                    {mcInGap ? 'Yes (In Gap)' : 'Shift Likely'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Kink Price P*</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    ₹{kinkPrice}
                  </p>
                </div>
              </>
            )}

            {activeModel === 'jcurve' && (
              <>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Initial Dip Trough</p>
                  <p className="font-mono text-base font-semibold text-red-700 tabular-nums mt-0.5">
                    {troughNX.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Q12 Trade Balance</p>
                  <p className="font-mono text-base font-semibold text-emerald-700 tabular-nums mt-0.5">
                    {longRunNX >= 0 ? '+' : ''}
                    {longRunNX.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Depreciation</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {depreciationPct}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Adjustment Pace</p>
                  <p className="font-mono text-base font-semibold text-blue-700 tabular-nums mt-0.5">
                    {recoverySpeed.toFixed(2)}
                  </p>
                </div>
              </>
            )}

            {activeModel === 'kuznets' && (
              <>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Current Level</p>
                  <p className="font-mono text-base font-semibold text-blue-700 tabular-nums mt-0.5">
                    {currentIndicator.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Peak Turning Point</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    x = {peakIncome}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Peak Height</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {peakLevel}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500">Income Index</p>
                  <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                    {currentIncome}
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

            {activeModel === 'lorenz' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-th" className="text-slate-700">Inequality Curvature (θ ≥ 1)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{inequalityTheta.toFixed(1)}</span>
                  </div>
                  <input id="sl-th" type="range" min={1.0} max={5.0} step={0.1} value={inequalityTheta} onChange={(e) => setInequalityTheta(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
              </div>
            )}

            {activeModel === 'taxinc' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-tax" className="text-slate-700">Per-Unit Tax (t)</label>
                    <span className="font-mono text-slate-900 tabular-nums">₹{perUnitTax}</span>
                  </div>
                  <input id="sl-tax" type="range" min={2} max={40} step={2} value={perUnitTax} onChange={(e) => setPerUnitTax(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-el-d" className="text-slate-700">Demand Responsiveness (higher = more elastic)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{demandElasSlope.toFixed(1)}</span>
                  </div>
                  <input id="sl-el-d" type="range" min={0.2} max={3.0} step={0.1} value={demandElasSlope} onChange={(e) => setDemandElasSlope(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-el-s" className="text-slate-700">Supply Responsiveness (higher = more elastic)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{supplyElasSlope.toFixed(1)}</span>
                  </div>
                  <input id="sl-el-s" type="range" min={0.2} max={3.0} step={0.1} value={supplyElasSlope} onChange={(e) => setSupplyElasSlope(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-laf" className="text-slate-700">Laffer Tax Rate (%)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{lafferRate}%</span>
                  </div>
                  <input id="sl-laf" type="range" min={0} max={100} step={5} value={lafferRate} onChange={(e) => setLafferRate(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
              </div>
            )}

            {activeModel === 'sweezy' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-kp" className="text-slate-700">Prevailing Kink Price (P*)</label>
                    <span className="font-mono text-slate-900 tabular-nums">₹{kinkPrice}</span>
                  </div>
                  <input id="sl-kp" type="range" min={30} max={80} step={2} value={kinkPrice} onChange={(e) => setKinkPrice(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-kq" className="text-slate-700">Kink Output (Q*)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{kinkQty}</span>
                  </div>
                  <input id="sl-kq" type="range" min={20} max={60} step={2} value={kinkQty} onChange={(e) => setKinkQty(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-us" className="text-slate-700">Upper Slope (Elastic) vs Lower Slope (Inelastic)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{upperSlope.toFixed(1)} / {lowerSlope.toFixed(1)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input id="sl-us" type="range" min={0.2} max={1.0} step={0.1} value={upperSlope} onChange={(e) => setUpperSlope(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                    <input aria-label="Lower demand slope" type="range" min={1.0} max={2.5} step={0.1} value={lowerSlope} onChange={(e) => setLowerSlope(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-smc" className="text-slate-700">Marginal Cost Level (MC)</label>
                    <span className="font-mono text-slate-900 tabular-nums">₹{sweezyMC}</span>
                  </div>
                  <input id="sl-smc" type="range" min={5} max={75} step={1} value={sweezyMC} onChange={(e) => setSweezyMC(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
              </div>
            )}

            {activeModel === 'jcurve' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-dep" className="text-slate-700">Currency Depreciation (%)</label>
                    <span className="font-mono text-slate-900 tabular-nums">{depreciationPct}%</span>
                  </div>
                  <input id="sl-dep" type="range" min={4} max={25} step={1} value={depreciationPct} onChange={(e) => setDepreciationPct(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-dip" className="text-slate-700">Short-Run Dip Intensity</label>
                    <span className="font-mono text-slate-900 tabular-nums">{initialDipDepth}</span>
                  </div>
                  <input id="sl-dip" type="range" min={10} max={55} step={5} value={initialDipDepth} onChange={(e) => setInitialDipDepth(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-rec" className="text-slate-700">Quantity Adjustment Speed</label>
                    <span className="font-mono text-slate-900 tabular-nums">{recoverySpeed.toFixed(2)}</span>
                  </div>
                  <input id="sl-rec" type="range" min={0.2} max={0.9} step={0.05} value={recoverySpeed} onChange={(e) => setRecoverySpeed(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
              </div>
            )}

            {activeModel === 'kuznets' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-ki" className="text-slate-700">Current Income / Development</label>
                    <span className="font-mono text-slate-900 tabular-nums">{currentIncome}</span>
                  </div>
                  <input id="sl-ki" type="range" min={5} max={95} step={1} value={currentIncome} onChange={(e) => setCurrentIncome(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-pk" className="text-slate-700">Turning Point Income</label>
                    <span className="font-mono text-slate-900 tabular-nums">{peakIncome}</span>
                  </div>
                  <input id="sl-pk" type="range" min={25} max={75} step={5} value={peakIncome} onChange={(e) => setPeakIncome(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <label htmlFor="sl-pl" className="text-slate-700">Peak Inequality / Pollution Height</label>
                    <span className="font-mono text-slate-900 tabular-nums">{peakLevel}</span>
                  </div>
                  <input id="sl-pl" type="range" min={40} max={95} step={5} value={peakLevel} onChange={(e) => setPeakLevel(Number(e.target.value))} className="w-full accent-blue-700 cursor-pointer" />
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
                Slide <strong>h</strong> upward toward 100 to simulate a near-Liquidity Trap: monetary policy loses traction while fiscal policy drives output. Slide <strong>h</strong> down toward 5 (Classical zone) and fiscal crowding out becomes stronger.
              </p>
            )}
            {activeModel === 'solow' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                Steady state occurs where <strong>s·f(k*) = (n + δ)k*</strong>. Golden Rule consumption is maximized where <strong>MP_k = n + δ</strong> (for Cobb–Douglas, when saving rate s equals capital share α).
              </p>
            )}
            {activeModel === 'monopoly' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                A profit-maximizing monopolist sets <strong>MR = MC</strong> and charges above marginal cost (<strong>P_m &gt; MC</strong>), creating deadweight loss and positive Lerner Index <strong>L = (P − MC)/P</strong>.
              </p>
            )}
            {activeModel === 'phillips' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                In the short run, keeping unemployment below <strong>NAIRU ({nairu.toFixed(1)}%)</strong> raises inflation above πe; in the long run, expectations adjust and the Long-Run Phillips Curve is vertical at NAIRU.
              </p>
            )}
            {activeModel === 'lorenz' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                The further the <strong>Lorenz curve</strong> bows away from the <strong>45° line of equality</strong>, the higher the <strong>Gini coefficient</strong> (0 = perfect equality, closer to 1 = greater inequality).
              </p>
            )}
            {activeModel === 'taxinc' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                The <strong>less price-elastic</strong> side bears more of the tax burden, deadweight loss rises with the square of the tax, and the <strong>Laffer curve</strong> shows revenue peaking before falling at punitive tax rates.
              </p>
            )}
            {activeModel === 'sweezy' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                In Sweezy’s oligopoly model, rivals ignore price rises (elastic upper demand) and match price cuts (inelastic lower demand), producing a <strong>vertical gap in MR</strong> that explains price stickiness when MC moves inside the gap.
              </p>
            )}
            {activeModel === 'jcurve' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                After currency depreciation, trade balance often dips first (price/pass-through & contract lags) before improving as export and import quantities respond over time (<strong>{kuznetsPhase ? 'Marshall–Lerner' : ''}</strong>).
              </p>
            )}
            {activeModel === 'kuznets' && (
              <p className="text-xs text-slate-600 leading-relaxed">
                Current stage: <strong>{kuznetsPhase}</strong>. Both the income Kuznets curve and the Environmental Kuznets Curve (for many flow pollutants) trace an inverted-U across development stages.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};