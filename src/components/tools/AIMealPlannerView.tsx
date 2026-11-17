"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types";
import { AIDietitianCoach, GeneratedRecipe } from "@/lib/ai/dietitian-coach";
import {
  CalendarDays,
  ShoppingCart,
  ChefHat,
  Sparkles,
  Check,
  Plus,
  Clock,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";

interface AIMealPlannerViewProps {
  user: UserProfile;
}

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const AIMealPlannerView: React.FC<AIMealPlannerViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<"PLANNER" | "GROCERY" | "RECIPE_CREATOR">("PLANNER");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [groceryList] = useState(AIDietitianCoach.generateGroceryList(user));
  const [checkedGroceries, setCheckedGroceries] = useState<Record<string, boolean>>({});

  // Recipe Creator state
  const [pantryInput, setPantryInput] = useState("Paneer, Baby Spinach, Garlic, Extra Virgin Olive Oil, Cumin");
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [isCooking, setIsCooking] = useState(false);

  const toggleGroceryItem = (item: string) => {
    setCheckedGroceries((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleGenerateRecipe = () => {
    setIsCooking(true);
    setTimeout(() => {
      const rec = AIDietitianCoach.generateRecipeFromIngredients(
        pantryInput,
        user.dietaryPreference
      );
      setGeneratedRecipe(rec);
      setIsCooking(false);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-fitness-green/10 text-fitness-green">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">AI Nutrition Planner & Kitchen Assistant</h2>
            <p className="text-xs text-muted-foreground">
              Personalized 7-day meal plans, smart grocery manifests & pantry recipe generator
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex">
          <button
            onClick={() => setActiveTab("PLANNER")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "PLANNER" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Meal Plan
          </button>
          <button
            onClick={() => setActiveTab("GROCERY")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "GROCERY" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Grocery List
          </button>
          <button
            onClick={() => setActiveTab("RECIPE_CREATOR")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "RECIPE_CREATOR" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Pantry Recipe Creator
          </button>
        </div>
      </div>

      {/* ================= TAB 1: 7-DAY MEAL PLANNER ================= */}
      {activeTab === "PLANNER" && (
        <div className="space-y-5">
          {/* Day Selector Strip */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {WEEK_DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                  selectedDay === day
                    ? "bg-fitness-green text-slate-950 border-fitness-green shadow-md shadow-fitness-green/20"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Meals for Selected Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Breakfast */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider">
                  🌅 Breakfast (08:30 AM)
                </span>
                <span className="font-mono text-white font-bold">420 kcal • 28g P</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Chia Seed & Greek Yogurt Protein Oatmeal
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rolled oats steeped in unsweetened almond milk, topped with 150g Greek yogurt, fresh blueberries, and chia seeds.
              </p>
            </div>

            {/* Lunch */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 uppercase tracking-wider">
                  🥗 Lunch (01:15 PM)
                </span>
                <span className="font-mono text-white font-bold">580 kcal • 38g P</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Tandoori Paneer / Tofu Tikka Quinoa Bowl
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                200g grilled cottage cheese cubes paired with steamed tricolor quinoa, roasted bell peppers, and fresh mint chutney.
              </p>
            </div>

            {/* Snack */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400 uppercase tracking-wider">
                  🍎 Afternoon Fuel (04:45 PM)
                </span>
                <span className="font-mono text-white font-bold">210 kcal • 21g P</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Chilled Whey Isolate Shake & Roasted Makhana
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                1 scoop dark chocolate whey isolate with iced cold brew and a handful of air-popped spiced lotus seeds.
              </p>
            </div>

            {/* Dinner */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-400 uppercase tracking-wider">
                  🍲 Dinner (08:00 PM)
                </span>
                <span className="font-mono text-white font-bold">490 kcal • 32g P</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Moong Dal & Baby Spinach Khichdi with Raita
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Slow-simmered yellow lentils and spinach tempered with cumin and cow ghee, accompanied by cucumber yogurt raita.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SMART GROCERY LIST ================= */}
      {activeTab === "GROCERY" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                AI Generated Weekly Grocery Manifest
              </h3>
              <p className="text-xs text-muted-foreground">
                Optimized for {user.dietaryPreference} • High Protein Nutrition Plan
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {Object.values(checkedGroceries).filter(Boolean).length} items checked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(groceryList).map(([category, items]) => (
              <div key={category} className="space-y-2.5">
                <h4 className="text-xs font-bold text-fitness-green uppercase tracking-wider">
                  {category}
                </h4>
                <div className="space-y-1.5">
                  {items.map((item) => {
                    const isChecked = !!checkedGroceries[item];

                    return (
                      <div
                        key={item}
                        onClick={() => toggleGroceryItem(item)}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-slate-900/40 border-slate-800 text-slate-500 line-through"
                            : "bg-slate-900 border-slate-800/80 text-white hover:border-slate-700"
                        }`}
                      >
                        <span>{item}</span>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                            isChecked
                              ? "bg-fitness-green border-fitness-green text-slate-950"
                              : "border-slate-700 bg-slate-950"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PANTRY RECIPE CREATOR ================= */}
      {activeTab === "RECIPE_CREATOR" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Recipe Creator From Available Ingredients</h3>
              <p className="text-xs text-muted-foreground">
                Enter ingredients in your fridge/pantry; AI synthesizes a macro-optimized gourmet meal
              </p>
            </div>
          </div>

          {/* Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              What ingredients do you currently have?
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={pantryInput}
                onChange={(e) => setPantryInput(e.target.value)}
                placeholder="e.g. Eggs, Sourdough, Avocado, Chili Flakes"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-fitness-green"
              />
              <button
                onClick={handleGenerateRecipe}
                disabled={isCooking}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-md shadow-orange-500/20 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                {isCooking ? "Cooking Recipe..." : "Create Recipe"}
              </button>
            </div>
          </div>

          {/* Recipe Card Output */}
          {generatedRecipe && (
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-orange-500/30 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <h4 className="text-base font-black text-white">{generatedRecipe.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      {generatedRecipe.prepTimeMinutes} mins prep
                    </span>
                    <span>•</span>
                    <span className="text-fitness-green font-bold">
                      {user.dietaryPreference} Friendly
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold">
                    {generatedRecipe.calories} kcal
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
                    {generatedRecipe.proteinG}g Protein
                  </span>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Cooking Instructions:
                </span>
                <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                  {generatedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Chef Pro-Tip */}
              <div className="p-3.5 rounded-2xl bg-orange-950/20 border border-orange-500/30 text-xs text-slate-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-orange-400">Dietitian Pro-Tip:</strong>{" "}
                  {generatedRecipe.proTip}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
