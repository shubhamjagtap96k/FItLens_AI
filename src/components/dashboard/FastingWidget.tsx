"use client";

import React, { useState, useEffect } from "react";
import { FastingSession } from "@/types";
import { getFastingPhase } from "@/lib/utils/nutrition-calc";
import { Timer, Zap, Play, Square, Award } from "lucide-react";

interface FastingWidgetProps {
  initialSession: FastingSession;
}

export const FastingWidget: React.FC<FastingWidgetProps> = ({ initialSession }) => {
  const [session, setSession] = useState<FastingSession>(initialSession);
  const [elapsedHours, setElapsedHours] = useState<number>(14.5);

  useEffect(() => {
    if (!session.isActive) return;

    const interval = setInterval(() => {
      const startMs = new Date(session.startTime).getTime();
      const diffHours = (Date.now() - startMs) / (1000 * 60 * 60);
      setElapsedHours(Math.max(0, diffHours));
    }, 5000);

    return () => clearInterval(interval);
  }, [session]);

  const currentPhase = getFastingPhase(elapsedHours);
  const progressPct = Math.min(100, Math.round((elapsedHours / session.targetHours) * 100));

  const hoursDisplay = Math.floor(elapsedHours);
  const minsDisplay = Math.floor((elapsedHours - hoursDisplay) * 60);

  const toggleFast = () => {
    if (session.isActive) {
      setSession({
        ...session,
        isActive: false,
        endTime: new Date().toISOString(),
      });
    } else {
      setSession({
        ...session,
        isActive: true,
        startTime: new Date().toISOString(),
        endTime: undefined,
      });
      setElapsedHours(0.1);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Intermittent Fasting</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                {session.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {session.isActive ? "Fast actively in progress" : "Fasting paused"}
            </p>
          </div>
        </div>

        {/* Metabolic Score Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Award className="w-4 h-4" />
          <span>Metabolic: 88</span>
        </div>
      </div>

      {/* Timer and Stage Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {hoursDisplay}h {minsDisplay}m
            </div>
            <div className="text-[11px] text-muted-foreground">
              Target: {session.targetHours} hours ({progressPct}% complete)
            </div>
          </div>

          <button
            onClick={toggleFast}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              session.isActive
                ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30"
                : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/30"
            }`}
          >
            {session.isActive ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                End Fast
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Fast
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Metabolic Stage Explanation */}
        <div className="flex items-start gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">{currentPhase.phaseName}: </span>
            <span className="text-slate-400">{currentPhase.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
