"use client";

import React, { useState } from "react";
import { BodyMeasurement, UserProfile } from "@/types";
import { predict30DayWeight } from "@/lib/utils/nutrition-calc";
import {
  Scale,
  TrendingDown,
  Sparkles,
  Plus,
  Target,
  Ruler,
  Calendar,
  CheckCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

interface BodyProgressTrackerProps {
  user: UserProfile;
  measurements: BodyMeasurement[];
  onAddMeasurement: (measurement: BodyMeasurement) => void;
}

export const BodyProgressTracker: React.FC<BodyProgressTrackerProps> = ({
  user,
  measurements,
  onAddMeasurement,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [weight, setWeight] = useState(user.weightKg);
  const [bodyFat, setBodyFat] = useState(24.1);
  const [waist, setWaist] = useState(70.2);
  const [hip, setHip] = useState(95.0);
  const [chest, setChest] = useState(87.0);
  const [biceps, setBiceps] = useState(27.2);
  const [thighs, setThighs] = useState(53.8);
  const [notes, setNotes] = useState("");

  const latest = measurements[measurements.length - 1];
  const first = measurements[0];
  const totalWeightLost = first && latest ? parseFloat((first.weightKg - latest.weightKg).toFixed(1)) : 0;
  const totalWaistLost = first && latest && first.waistCm && latest.waistCm
    ? parseFloat((first.waistCm - latest.waistCm).toFixed(1))
    : 0;

  // AI 30-day projection based on -450 kcal daily deficit
  const prediction = predict30DayWeight(user.weightKg, -450);

  const handleSave = () => {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    const newM: BodyMeasurement = {
      id: "bm-" + Date.now(),
      date: "Today",
      weightKg: Number(weight),
      bodyFatPct: Number(bodyFat),
      waistCm: Number(waist),
      hipCm: Number(hip),
      chestCm: Number(chest),
      bicepsCm: Number(biceps),
      thighsCm: Number(thighs),
      notes: notes || undefined,
    };

    onAddMeasurement(newM);
    setIsAdding(false);
  };

  // SVG Trend Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 180;
  const padding = 35;
  const minW = 61.0;
  const maxW = 65.5;

  const points = measurements.map((m, idx) => {
    const x = padding + (idx / Math.max(1, measurements.length - 1)) * (chartWidth - padding * 2);
    const y =
      chartHeight -
      padding -
      ((m.weightKg - minW) / (maxW - minW)) * (chartHeight - padding * 2);
    return { x, y, weight: m.weightKg, date: m.date };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  return (
    <div className="space-y-5">
      {/* KPI Cards Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Current Weight</span>
            <Scale className="w-4 h-4 text-fitness-green" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {latest?.weightKg || user.weightKg}{" "}
            <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[11px] text-fitness-green mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            -{totalWeightLost} kg total
          </div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Goal Weight</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {user.targetWeightKg}{" "}
            <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">
            {(user.weightKg - user.targetWeightKg).toFixed(1)} kg to target
          </div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Body Fat %</span>
            <span className="text-xs font-bold text-amber-400">%</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {latest?.bodyFatPct || 24.1}%
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            -2.1% in 30 days
          </div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Waist Reduction</span>
            <Ruler className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {latest?.waistCm || 70.2}{" "}
            <span className="text-xs font-normal text-slate-400">cm</span>
          </div>
          <div className="text-[11px] text-purple-400 mt-1">
            -{totalWaistLost} cm lost
          </div>
        </div>
      </div>

      {/* SVG Trend Graph Card */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-fitness-green" />
              Weight Progression Trend (Past 30 Days)
            </h3>
            <p className="text-xs text-muted-foreground">Steady downward trajectory with muscle mass preserved</p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fitness-green hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-md shadow-fitness-green/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Log Weigh-In
          </button>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 drop-shadow-md"
          >
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E073" />
                <stop offset="100%" stopColor="#00C7BE" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[62, 63, 64, 65].map((w) => {
              const y =
                chartHeight -
                padding -
                ((w - minW) / (maxW - minW)) * (chartHeight - padding * 2);
              return (
                <g key={w}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding - 6}
                    y={y + 3}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {w}kg
                  </text>
                </g>
              );
            })}

            {/* Trend Line */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Dots & Tooltips */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="#0B0F19"
                  stroke="#00E073"
                  strokeWidth="2.5"
                />
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {p.weight}
                </text>
                <text
                  x={p.x}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                >
                  {p.date}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* AI 30-Day Forward Prediction Banner */}
      <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-cyan-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-fitness-green">
            <Sparkles className="w-4 h-4" />
            AI Predictive Intelligence Engine
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-fitness-green/10 text-fitness-green border border-fitness-green/30 text-[10px] font-bold">
            {prediction.goalProbabilityPct}% Confidence
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Projected Weight (30 Days)</span>
            <span className="text-xl font-black text-white font-mono">
              {prediction.projectedWeightKg} kg
            </span>
            <span className="text-[10px] text-fitness-green block mt-0.5">
              {prediction.projectedChangeKg} kg projected change
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Caloric Deficit Trend</span>
            <span className="text-xl font-black text-cyan-400 font-mono">
              -450 kcal / day
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Sustainable fat loss zone
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Metabolic Adaptability</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              Optimal (1.0)
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Thyroid & leptin unsuppressed
            </span>
          </div>
        </div>
      </div>

      {/* Log Measurement Form Modal / Inline */}
      {isAdding && (
        <div className="glass-panel p-5 rounded-3xl border border-fitness-green/30 space-y-4 animate-fadeIn">
          <h4 className="text-sm font-bold text-white">Log Full Body Measurements</h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Body Fat (%)</label>
              <input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Waist (cm)</label>
              <input
                type="number"
                step="0.1"
                value={waist}
                onChange={(e) => setWaist(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Hip (cm)</label>
              <input
                type="number"
                step="0.1"
                value={hip}
                onChange={(e) => setHip(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Chest (cm)</label>
              <input
                type="number"
                step="0.1"
                value={chest}
                onChange={(e) => setChest(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Biceps (cm)</label>
              <input
                type="number"
                step="0.1"
                value={biceps}
                onChange={(e) => setBiceps(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Thighs (cm)</label>
              <input
                type="number"
                step="0.1"
                value={thighs}
                onChange={(e) => setThighs(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Notes</label>
              <input
                type="text"
                placeholder="e.g. Fasted morning weigh-in"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-fitness-green text-slate-950 font-bold text-xs shadow-md shadow-fitness-green/20"
            >
              Save Measurement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
