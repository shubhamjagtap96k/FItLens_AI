"use client";

import React, { useState } from "react";
import {
  UserProfile,
  MealLog,
  WorkoutLog,
  BodyMeasurement,
  DailyTotals,
} from "@/types";
import {
  exportDailyReportToCSV,
  exportMonthlyReportToExcel,
} from "@/lib/utils/export-helpers";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Sparkles,
  Award,
  TrendingDown,
  Flame,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

interface ReportsViewProps {
  user: UserProfile;
  meals: MealLog[];
  workouts: WorkoutLog[];
  totals: DailyTotals;
  measurements: BodyMeasurement[];
  healthScore: number;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  user,
  meals,
  workouts,
  totals,
  measurements,
  healthScore,
}) => {
  const [activeTab, setActiveTab] = useState<"DAILY" | "MONTHLY">("DAILY");

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportDailyReportToCSV(user, meals, workouts, {
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
      burned: totals.caloriesBurned,
      water: totals.waterMl,
    });
  };

  const handleExportExcel = () => {
    exportMonthlyReportToExcel(user, measurements);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Action Bar (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-3xl border border-slate-800 no-print">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Health Intelligence Reports</h2>
            <p className="text-xs text-muted-foreground">
              Dynamic AI analytics, macro adherence & longitudinal progress
            </p>
          </div>
        </div>

        {/* Tab Switcher & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab Selector */}
          <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex">
            <button
              onClick={() => setActiveTab("DAILY")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "DAILY"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Daily Report
            </button>
            <button
              onClick={() => setActiveTab("MONTHLY")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "MONTHLY"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly Report
            </button>
          </div>

          {/* Export Buttons */}
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-fitness-green" />
            PDF
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            title="Download Excel Sheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            Excel
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            title="Export CSV data"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            CSV
          </button>
        </div>
      </div>

      {/* ================= DAILY REPORT VIEW ================= */}
      {activeTab === "DAILY" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          {/* Report Top Meta Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-fitness-green">
                FitLens AI Daily Executive Summary
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Nutrition & Biometrics Ledger
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Member: <strong className="text-white">{user.name}</strong> • Goal:{" "}
                <strong className="text-white">{user.goal.replace("_", " ")}</strong> • Date:{" "}
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Health Score</span>
                <span className="text-3xl font-black text-fitness-green font-mono">
                  {healthScore}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-fitness-green/10 text-fitness-green">
                <Award className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Calorie & Macro KPI Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Calories Consumed</span>
              <span className="text-2xl font-black text-white font-mono">{totals.calories}</span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Target: {user.targets.calories} kcal
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Active Calories Burned</span>
              <span className="text-2xl font-black text-fitness-red font-mono">
                {totals.caloriesBurned}
              </span>
              <span className="text-[11px] text-fitness-green block mt-1">
                via Apple Health Sync
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Net Caloric Balance</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">{totals.netCalories}</span>
              <span className="text-[11px] text-cyan-400 block mt-1">
                -420 kcal Deficit Pace
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Hydration Level</span>
              <span className="text-2xl font-black text-blue-400 font-mono">
                {(totals.waterMl / 1000).toFixed(1)}L
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Goal: {(user.targets.waterMl / 1000).toFixed(1)}L
              </span>
            </div>
          </div>

          {/* Macro Breakdown Table */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Macronutrient Target Adherence
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-semibold block">Protein</span>
                <span className="text-base font-bold text-white font-mono">{totals.protein.toFixed(1)}g</span>
                <span className="text-[10px] text-slate-400 block">Goal: {user.targets.protein}g</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-semibold block">Carbohydrates</span>
                <span className="text-base font-bold text-white font-mono">{totals.carbs.toFixed(1)}g</span>
                <span className="text-[10px] text-slate-400 block">Goal: {user.targets.carbs}g</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-semibold block">Fats</span>
                <span className="text-base font-bold text-white font-mono">{totals.fat.toFixed(1)}g</span>
                <span className="text-[10px] text-slate-400 block">Goal: {user.targets.fat}g</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-purple-400 font-semibold block">Dietary Fiber</span>
                <span className="text-base font-bold text-white font-mono">{totals.fiber.toFixed(1)}g</span>
                <span className="text-[10px] text-slate-400 block">Goal: {user.targets.fiber}g</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-rose-400 font-semibold block">Sugar Limit</span>
                <span className="text-base font-bold text-white font-mono">{totals.sugar.toFixed(1)}g</span>
                <span className="text-[10px] text-slate-400 block">Max: {user.targets.sugarLimit}g</span>
              </div>
            </div>
          </div>

          {/* Meals Consumed Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Itemized Daily Meals ({meals.length})
            </h4>
            <div className="space-y-2">
              {meals.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-fitness-green">
                      {m.mealType}
                    </span>
                    <span className="text-white font-semibold">
                      {m.items.map((i) => i.name).join(", ")}
                    </span>
                  </div>
                  <div className="font-mono text-slate-300">
                    <span className="text-white font-bold">{m.totalCalories} kcal</span> •{" "}
                    <span className="text-emerald-400">{m.totalProtein.toFixed(1)}g P</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Clinical Recommendations */}
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4" />
              AI Dietitian Clinical Recommendations
            </div>
            <p className="text-slate-300 leading-relaxed">
              Overall nutritional compliance today is <strong>92% (Grade A)</strong>. Glycemic index distribution was well modulated. For dinner, prioritize casein-rich cottage cheese or a light whey shake to reach the remaining protein target without adding surplus carbohydrates.
            </p>
          </div>
        </div>
      )}

      {/* ================= MONTHLY INTELLIGENCE REPORT VIEW ================= */}
      {activeTab === "MONTHLY" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                FitLens AI 30-Day Longitudinal Intelligence
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Monthly Body Recomposition & Performance
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Period: Last 30 Days • User: <strong className="text-white">{user.name}</strong> • Current Streak:{" "}
                <strong className="text-fitness-green">{user.currentStreak} Days</strong>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Calendar className="w-8 h-8" />
            </div>
          </div>

          {/* 30-Day Aggregates Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Caloric Intake</span>
              <span className="text-2xl font-black text-white font-mono">56,700</span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Avg 1,890 kcal/day
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Active Burn</span>
              <span className="text-2xl font-black text-fitness-red font-mono">9,850</span>
              <span className="text-[11px] text-fitness-green block mt-1">
                +18% vs prior month
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Avg Daily Protein</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">118g</span>
              <span className="text-[11px] text-emerald-400 block mt-1">
                102% of daily target!
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Workout Consistency</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">92%</span>
              <span className="text-[11px] text-slate-400 block mt-1">
                23 of 25 target sessions
              </span>
            </div>
          </div>

          {/* Body Composition Delta */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              30-Day Physical Transformation Ledger
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">Total Scale Weight</span>
                  <span className="text-white font-mono text-sm font-bold">64.5kg ➔ 62.0kg</span>
                </div>
                <span className="text-fitness-green font-bold text-sm">-2.5 kg</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">Body Fat Percentage</span>
                  <span className="text-white font-mono text-sm font-bold">26.2% ➔ 24.1%</span>
                </div>
                <span className="text-amber-400 font-bold text-sm">-2.1%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">Waist Circumference</span>
                  <span className="text-white font-mono text-sm font-bold">73.5cm ➔ 70.2cm</span>
                </div>
                <span className="text-purple-400 font-bold text-sm">-3.3 cm</span>
              </div>
            </div>
          </div>

          {/* Best Day vs Worst Day Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>🌟 Best Nutrition Day (Friday)</span>
                <span className="font-mono">Score: 98/100</span>
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                Hit 124g protein with exactly 1,940 kcal (0.5% margin). Sugar was held to 16g. Fasting window was sustained for 16.5 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-1">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>⚠️ Lowest Adherence Day (Sunday)</span>
                <span className="font-mono">Score: 72/100</span>
              </div>
              <p className="text-slate-300 leading-relaxed pt-1">
                Cheat meal bumped sodium to 2,900mg and carbs exceeded by 40g. Quickly rebounded on Monday with a 30-minute fasted walk.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
