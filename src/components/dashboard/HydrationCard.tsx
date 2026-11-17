"use client";

import React, { useState } from "react";
import { Droplet, Plus, Check } from "lucide-react";

interface HydrationCardProps {
  currentWaterMl: number;
  targetWaterMl: number;
  onAddWater: (amountMl: number) => void;
}

export const HydrationCard: React.FC<HydrationCardProps> = ({
  currentWaterMl,
  targetWaterMl,
  onAddWater,
}) => {
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const percentage = Math.min(100, Math.round((currentWaterMl / (targetWaterMl || 2500)) * 100));

  const handleQuickAdd = (ml: number) => {
    onAddWater(ml);
    setJustAdded(ml);
    setTimeout(() => setJustAdded(null), 1200);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 relative overflow-hidden">
      {/* Background Water Wave Glow */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/20 via-blue-500/10 to-transparent pointer-events-none transition-all duration-700"
        style={{ height: `${percentage}%` }}
      />

      <div className="relative z-10 flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
            <Droplet className="w-5 h-5 fill-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Smart Hydration</h3>
            <p className="text-xs text-muted-foreground">
              {targetWaterMl - currentWaterMl > 0
                ? `${((targetWaterMl - currentWaterMl) / 1000).toFixed(1)}L remaining to goal`
                : "🎉 Daily hydration target achieved!"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-extrabold text-white font-mono">
            {(currentWaterMl / 1000).toFixed(2)}{" "}
            <span className="text-xs text-muted-foreground font-normal">/ {(targetWaterMl / 1000).toFixed(1)}L</span>
          </div>
          <div className="text-[11px] font-semibold text-cyan-400">{percentage}% completed</div>
        </div>
      </div>

      {/* Visual Water Level Bar */}
      <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 mb-4">
        <div
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-700 shadow-md shadow-cyan-500/50"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleQuickAdd(250)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs font-medium text-slate-200 transition-all active:scale-95"
        >
          {justAdded === 250 ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5 text-cyan-400" />}
          +250 ml <span className="text-[10px] text-muted-foreground hidden sm:inline">(Glass)</span>
        </button>

        <button
          onClick={() => handleQuickAdd(500)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs font-medium text-slate-200 transition-all active:scale-95"
        >
          {justAdded === 500 ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5 text-cyan-400" />}
          +500 ml <span className="text-[10px] text-muted-foreground hidden sm:inline">(Bottle)</span>
        </button>

        <button
          onClick={() => handleQuickAdd(750)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs font-medium text-slate-200 transition-all active:scale-95"
        >
          {justAdded === 750 ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5 text-cyan-400" />}
          +750 ml <span className="text-[10px] text-muted-foreground hidden sm:inline">(Flask)</span>
        </button>
      </div>
    </div>
  );
};
