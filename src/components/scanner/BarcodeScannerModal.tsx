"use client";

import React, { useState } from "react";
import { MealLog, MealType } from "@/types";
import { searchFoodDatabase, findFoodByBarcode, DatabaseFoodItem } from "@/lib/db/food-database";
import { Barcode, Search, Plus, Check, X, ShieldAlert, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmMeal: (meal: MealLog) => void;
  initialMealType?: MealType;
}

const SAMPLE_BARCODES = [
  { label: "ON Gold Standard Whey", code: "748927028669" },
  { label: "Quest Protein Bar", code: "888849000010" },
  { label: "Chobani Non-Fat Greek Yogurt", code: "894700010045" },
  { label: "Quaker Rolled Oats", code: "030000010103" },
];

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onConfirmMeal,
  initialMealType = "SNACKS",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<MealType>(initialMealType);

  if (!isOpen) return null;

  const searchResults = searchFoodDatabase(searchQuery, activeCategory);

  const handleBarcodeSubmit = (codeToScan?: string) => {
    const code = (codeToScan || barcodeInput).trim();
    if (!code) return;

    const matched = findFoodByBarcode(code);
    if (matched) {
      logItem(matched);
    } else {
      alert(`Barcode ${code} not found. Please try searching by name or scan another barcode.`);
    }
  };

  const logItem = (item: DatabaseFoodItem) => {
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {}

    const meal: MealLog = {
      id: "meal-" + Date.now(),
      mealType: selectedMealType,
      loggedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: [
        {
          id: "item-" + Date.now(),
          name: item.name,
          quantity: 1,
          unit: item.servingUnit,
          calories: item.calories,
          protein: item.proteinG,
          carbs: item.carbsG,
          fat: item.fatG,
          fiber: item.fiberG,
          sugar: item.sugarG,
          sodium: item.sodiumMg,
        },
      ],
      totalCalories: item.calories,
      totalProtein: item.proteinG,
      totalCarbs: item.carbsG,
      totalFat: item.fatG,
      totalFiber: item.fiberG,
      totalSugar: item.sugarG,
      totalSodium: item.sodiumMg,
      aiConfidenceScore: 0.99,
      imageUrl: item.imageUrl,
      feedback: `Logged via OpenFoodFacts & USDA verified verified database entry.`,
    };

    onConfirmMeal(meal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Smart Database & Barcode Lookup</h2>
              <p className="text-xs text-muted-foreground">OpenFoodFacts & USDA Verified Global/Indian Database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Barcode Quick Sim Buttons */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Barcode className="w-3.5 h-3.5 text-cyan-400" />
                Scan Packaged Barcode (UPC)
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">OpenFoodFacts API</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 12-digit UPC Barcode (e.g. 748927028669)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                onClick={() => handleBarcodeSubmit()}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Scan
              </button>
            </div>

            {/* Quick barcode chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SAMPLE_BARCODES.map((b) => (
                <button
                  key={b.code}
                  onClick={() => {
                    setBarcodeInput(b.code);
                    handleBarcodeSubmit(b.code);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  ⚡ {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Indian curries, global dishes, restaurant meals, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fitness-green"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {["All", "Indian", "Global", "Packaged", "Restaurant"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-slate-200 text-slate-950 font-semibold"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Results List */}
          <div className="space-y-2.5">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No matching foods found in current filter. Try typing &ldquo;Paneer&rdquo;, &ldquo;Chicken&rdquo;, or &ldquo;Yogurt&rdquo;.
              </div>
            ) : (
              searchResults.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-medium">
                          {item.category}
                        </span>
                        {item.brand && (
                          <span className="text-[10px] text-cyan-400 font-semibold truncate">
                            {item.brand}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        <span className="text-white font-bold">{item.calories} kcal</span> •{" "}
                        <span className="text-emerald-400">P: {item.proteinG}g</span> •{" "}
                        <span className="text-cyan-400">C: {item.carbsG}g</span> •{" "}
                        <span className="text-amber-400">F: {item.fatG}g</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => logItem(item)}
                    className="p-2 rounded-xl bg-fitness-green hover:bg-emerald-400 text-slate-950 transition-all active:scale-95 shrink-0 shadow-md shadow-fitness-green/20"
                    title="Add to daily log"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
