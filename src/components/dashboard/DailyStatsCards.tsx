"use client";

import React from "react";
import { DailyTargets, DailyTotals } from "@/types";
import { Flame, Target, Zap, HeartPulse } from "lucide-react";

interface DailyStatsCardsProps {
  totals: DailyTotals;
  targets: DailyTargets;
}

export const DailyStatsCards: React.FC<DailyStatsCardsProps> = ({
  totals,
  targets,
}) => {
  const proteinPct = Math.min(100, Math.round((totals.protein / (targets.protein || 1)) * 100));
  const carbsPct = Math.min(100, Math.round((totals.carbs / (targets.carbs || 1)) * 100));
  const fatPct = Math.min(100, Math.round((totals.fat / (targets.fat || 1)) * 100));
  const fiberPct = Math.min(100, Math.round((totals.fiber / (targets.fiber || 1)) * 100));
  const sugarPct = Math.min(100, Math.round((totals.sugar / (targets.sugarLimit || 1)) * 100));

  return (
    <div className="space-y-4">
      {/* 4 Summary Stat Mini-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Consumed */}
        <div className="glass-card p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Consumed</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {totals.calories}
            <span className="text-xs text-muted-foreground font-normal ml-1">kcal</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target: {targets.calories} kcal
          </div>
        </div>

        {/* Burned */}
        <div className="glass-card p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Burned</span>
            <Zap className="w-4 h-4 text-fitness-red" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {totals.caloriesBurned}
            <span className="text-xs text-muted-foreground font-normal ml-1">kcal</span>
          </div>
          <div className="text-[11px] text-fitness-green mt-1">
            Apple Health Active
          </div>
        </div>

        {/* Net Intake */}
        <div className="glass-card p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Net Caloric Intake</span>
            <HeartPulse className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {totals.netCalories}
            <span className="text-xs text-muted-foreground font-normal ml-1">kcal</span>
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">
            {targets.calories - totals.netCalories > 0
              ? `${targets.calories - totals.netCalories} kcal deficit`
              : "Calorie surplus"}
          </div>
        </div>

        {/* Remaining */}
        <div className="glass-card p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Remaining Target</span>
            <Target className="w-4 h-4 text-fitness-green" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {totals.remainingCalories}
            <span className="text-xs text-muted-foreground font-normal ml-1">kcal</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Budget for dinner
          </div>
        </div>
      </div>

      {/* Macronutrient Detailed Progress Bars */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fitness-green animate-pulse" />
            Macronutrient & Fiber Balance
          </h3>
          <span className="text-xs text-muted-foreground">
            Daily Budget Breakdown
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Protein */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Protein
              </span>
              <span className="text-slate-300 font-mono">
                <strong>{totals.protein.toFixed(1)}g</strong> / {targets.protein}g ({proteinPct}%)
              </span>
            </div>
            <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${proteinPct}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Carbohydrates
              </span>
              <span className="text-slate-300 font-mono">
                <strong>{totals.carbs.toFixed(1)}g</strong> / {targets.carbs}g ({carbsPct}%)
              </span>
            </div>
            <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${carbsPct}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Dietary Fats
              </span>
              <span className="text-slate-300 font-mono">
                <strong>{totals.fat.toFixed(1)}g</strong> / {targets.fat}g ({fatPct}%)
              </span>
            </div>
            <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${fatPct}%` }}
              />
            </div>
          </div>

          {/* Fiber & Sugar Sub-Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            {/* Fiber */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-purple-400 font-medium">Dietary Fiber</span>
                <span className="text-slate-400 text-[11px] font-mono">
                  {totals.fiber.toFixed(1)}g / {targets.fiber}g
                </span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full"
                  style={{ width: `${fiberPct}%` }}
                />
              </div>
            </div>

            {/* Sugar Limit */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-rose-400 font-medium">Sugar Limit</span>
                <span className="text-slate-400 text-[11px] font-mono">
                  {totals.sugar.toFixed(1)}g / {targets.sugarLimit}g
                </span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-400 h-full rounded-full"
                  style={{ width: `${sugarPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
