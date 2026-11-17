"use client";

import React from "react";
import { DailyTargets, DailyTotals } from "@/types";

interface NutritionRingsProps {
  totals: DailyTotals;
  targets: DailyTargets;
  healthScore: number;
}

export const NutritionRings: React.FC<NutritionRingsProps> = ({
  totals,
  targets,
  healthScore,
}) => {
  // SVG Ring Geometry
  const size = 260;
  const strokeWidth = 16;
  const center = size / 2;

  // Calorie Ring (Outer)
  const rCalories = 105;
  const cCalories = 2 * Math.PI * rCalories;
  const pctCalories = Math.min(1.5, totals.calories / (targets.calories || 2000));
  const offsetCalories = cCalories * (1 - Math.min(1, pctCalories));

  // Protein Ring (Middle)
  const rProtein = 82;
  const cProtein = 2 * Math.PI * rProtein;
  const pctProtein = Math.min(1.5, totals.protein / (targets.protein || 100));
  const offsetProtein = cProtein * (1 - Math.min(1, pctProtein));

  // Hydration Ring (Inner)
  const rWater = 59;
  const cWater = 2 * Math.PI * rWater;
  const pctWater = Math.min(1.5, totals.waterMl / (targets.waterMl || 2500));
  const offsetWater = cWater * (1 - Math.min(1, pctWater));

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[-90deg] drop-shadow-xl"
        >
          <defs>
            {/* Calories Gradient */}
            <linearGradient id="calorieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2D55" />
              <stop offset="100%" stopColor="#FF9500" />
            </linearGradient>

            {/* Protein Gradient */}
            <linearGradient id="proteinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E073" />
              <stop offset="100%" stopColor="#30D158" />
            </linearGradient>

            {/* Hydration Gradient */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C7BE" />
              <stop offset="100%" stopColor="#32ADE6" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Rings */}
          <circle
            cx={center}
            cy={center}
            r={rCalories}
            fill="none"
            stroke="rgba(255, 45, 85, 0.15)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={rProtein}
            fill="none"
            stroke="rgba(0, 224, 115, 0.15)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={rWater}
            fill="none"
            stroke="rgba(0, 199, 190, 0.15)"
            strokeWidth={strokeWidth}
          />

          {/* Active Calories Ring */}
          <circle
            cx={center}
            cy={center}
            r={rCalories}
            fill="none"
            stroke="url(#calorieGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={cCalories}
            strokeDashoffset={offsetCalories}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            filter="url(#glowEffect)"
          />

          {/* Active Protein Ring */}
          <circle
            cx={center}
            cy={center}
            r={rProtein}
            fill="none"
            stroke="url(#proteinGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={cProtein}
            strokeDashoffset={offsetProtein}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            filter="url(#glowEffect)"
          />

          {/* Active Hydration Ring */}
          <circle
            cx={center}
            cy={center}
            r={rWater}
            fill="none"
            stroke="url(#waterGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={cWater}
            strokeDashoffset={offsetWater}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            filter="url(#glowEffect)"
          />
        </svg>

        {/* Center Daily Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Health Score
          </span>
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {healthScore}
          </span>
          <span className="text-[10px] text-primary font-medium tracking-wide">
            Optimal
          </span>
        </div>
      </div>

      {/* Ring Legends */}
      <div className="grid grid-cols-3 gap-3 mt-4 w-full text-center">
        {/* Calories Legend */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-red-500/20">
          <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-semibold mb-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400" />
            Calories
          </div>
          <div className="text-sm font-bold text-white font-mono">
            {totals.calories} <span className="text-[11px] font-normal text-slate-400">/ {targets.calories}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {Math.round(pctCalories * 100)}% met
          </div>
        </div>

        {/* Protein Legend */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-green-500/20">
          <div className="flex items-center justify-center gap-1.5 text-xs text-green-400 font-semibold mb-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
            Protein
          </div>
          <div className="text-sm font-bold text-white font-mono">
            {totals.protein.toFixed(0)}g <span className="text-[11px] font-normal text-slate-400">/ {targets.protein}g</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {Math.round(pctProtein * 100)}% met
          </div>
        </div>

        {/* Hydration Legend */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-cyan-500/20">
          <div className="flex items-center justify-center gap-1.5 text-xs text-cyan-400 font-semibold mb-0.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
            Water
          </div>
          <div className="text-sm font-bold text-white font-mono">
            {(totals.waterMl / 1000).toFixed(1)}L <span className="text-[11px] font-normal text-slate-400">/ {(targets.waterMl / 1000).toFixed(1)}L</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {Math.round(pctWater * 100)}% met
          </div>
        </div>
      </div>
    </div>
  );
};
