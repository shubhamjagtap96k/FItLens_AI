"use client";

import React from "react";
import { MealLog, MealType } from "@/types";
import { Utensils, Sparkles, Clock, Plus } from "lucide-react";

interface RecentMealsListProps {
  meals: MealLog[];
  onOpenScanner: (defaultMealType?: MealType) => void;
  onSelectMeal?: (meal: MealLog) => void;
}

const MEAL_ICONS: Record<MealType, { label: string; color: string }> = {
  BREAKFAST: { label: "Breakfast", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  LUNCH: { label: "Lunch", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  DINNER: { label: "Dinner", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  SNACKS: { label: "Snacks", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  PRE_WORKOUT: { label: "Pre-Workout", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  POST_WORKOUT: { label: "Post-Workout", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
};

export const RecentMealsList: React.FC<RecentMealsListProps> = ({
  meals,
  onOpenScanner,
}) => {
  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-200">
            <Utensils className="w-4 h-4 text-fitness-green" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Today's Classified Meals</h3>
            <p className="text-xs text-muted-foreground">{meals.length} meals logged today</p>
          </div>
        </div>

        <button
          onClick={() => onOpenScanner()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fitness-green hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all active:scale-95 shadow-md shadow-fitness-green/20"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          Scan Meal
        </button>
      </div>

      <div className="space-y-3">
        {meals.map((meal) => {
          const badge = MEAL_ICONS[meal.mealType] || MEAL_ICONS.LUNCH;

          return (
            <div
              key={meal.id}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-start gap-3">
                {/* Photo Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                  {meal.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={meal.imageUrl}
                      alt={meal.items[0]?.name || "Meal"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Utensils className="w-6 h-6" />
                    </div>
                  )}

                  {meal.aiConfidenceScore && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] text-center font-mono text-emerald-400 font-bold py-0.5">
                      {Math.round(meal.aiConfidenceScore * 100)}% AI
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meal.loggedAt}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white truncate">
                    {meal.items.map((i) => i.name).join(" + ")}
                  </h4>

                  {/* Macro Pills */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-mono">
                    <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded-md">
                      {meal.totalCalories} kcal
                    </span>
                    <span className="text-emerald-400">P: {meal.totalProtein.toFixed(1)}g</span>
                    <span className="text-cyan-400">C: {meal.totalCarbs.toFixed(1)}g</span>
                    <span className="text-amber-400">F: {meal.totalFat.toFixed(1)}g</span>
                    {meal.totalFiber > 0 && (
                      <span className="text-purple-400">Fib: {meal.totalFiber.toFixed(1)}g</span>
                    )}
                  </div>

                  {meal.feedback && (
                    <div className="mt-2 text-[11px] text-slate-300 bg-slate-800/40 p-2 rounded-lg border border-slate-800 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-fitness-green shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{meal.feedback}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
