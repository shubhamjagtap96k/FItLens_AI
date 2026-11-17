"use client";

import React, { useState } from "react";
import { VisionService, MenuAnalysisResult } from "@/lib/ai/vision-service";
import { Camera, Sparkles, X, Check, AlertTriangle, UtensilsCrossed } from "lucide-react";

interface MenuScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuScannerModal: React.FC<MenuScannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [menuResult, setMenuResult] = useState<MenuAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const res = VisionService.analyzeRestaurantMenu("sample-menu.jpg");
      setMenuResult(res);
      setAnalyzing(false);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Restaurant Menu Scanner</h2>
              <p className="text-xs text-muted-foreground">Scan any paper or digital menu to reveal healthiest dishes</p>
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
          {!menuResult && !analyzing && (
            <div
              onClick={handleSimulateScan}
              className="border-2 border-dashed border-slate-700 hover:border-orange-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-3">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Scan Bistro or Restaurant Menu
              </h3>
              <p className="text-xs text-slate-400 max-w-xs">
                AI extracts dishes, scans preparation methods (fried vs grilled), and highlights the lowest calorie & highest protein picks.
              </p>
              <button className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-xl">
                Scan Sample Bistro Menu
              </button>
            </div>
          )}

          {analyzing && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Sparkles className="w-8 h-8 text-orange-400 animate-spin" />
              <div className="text-sm font-bold text-white">
                Reading Menu Items & Scoring Nutritional Profiles...
              </div>
            </div>
          )}

          {menuResult && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white">{menuResult.restaurantName}</h4>
                  <p className="text-xs text-slate-400">{menuResult.totalItemsFound} items parsed</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Menu Health Index</span>
                  <span className="text-lg font-black text-fitness-green font-mono">
                    {menuResult.overallMenuHealthRating}/10
                  </span>
                </div>
              </div>

              {/* Healthiest Recommendations */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-fitness-green uppercase tracking-wider block">
                  Top Recommended Healthiest Picks
                </span>
                {menuResult.healthiestOptions.map((opt, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-white font-bold">
                      <span>⭐ {opt.dishName}</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {opt.estimatedCalories} kcal • {opt.proteinG}g P
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {opt.whyRecommended}
                    </p>
                  </div>
                ))}
              </div>

              {/* Items to Modify */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Dishes to Customize or Avoid
                </span>
                {menuResult.optionsToAvoidOrModify.map((opt, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-amber-300 font-bold">
                      <span>⚠️ {opt.dishName}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{opt.reason}</p>
                    <div className="pt-1 text-[11px] text-slate-200">
                      <strong className="text-fitness-green">FitLens Tip:</strong>{" "}
                      {opt.suggestedCustomization}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
