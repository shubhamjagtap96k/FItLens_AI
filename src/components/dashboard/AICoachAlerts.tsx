"use client";

import React from "react";
import { AICoachAlert } from "@/types";
import { AlertTriangle, Sparkles, CheckCircle2, ChevronRight, Lightbulb } from "lucide-react";

interface AICoachAlertsProps {
  alerts: AICoachAlert[];
  onOpenCoachChat?: () => void;
}

export const AICoachAlerts: React.FC<AICoachAlertsProps> = ({
  alerts,
  onOpenCoachChat,
}) => {
  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-fitness-green/10 text-fitness-green">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Nutrition Intelligence</h3>
            <p className="text-xs text-muted-foreground">Continuous dietary analysis & real-time warnings</p>
          </div>
        </div>

        {onOpenCoachChat && (
          <button
            onClick={onOpenCoachChat}
            className="text-xs text-fitness-green hover:underline flex items-center font-semibold"
          >
            Chat Coach <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const isDeficiency = alert.type === "DEFICIENCY";
          const isWarning = alert.type === "WARNING";
          const isExcellent = alert.type === "EXCELLENT";

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isDeficiency
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                  : isWarning
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                  : isExcellent
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-200"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isDeficiency ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : isExcellent ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white tracking-wide">
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>

                  {alert.actionRecommendation && (
                    <div className="mt-2 pt-2 border-t border-white/10 text-xs text-slate-200 flex items-start gap-1.5">
                      <span className="text-fitness-green font-semibold shrink-0">AI Action:</span>
                      <span>{alert.actionRecommendation}</span>
                    </div>
                  )}

                  {alert.foodSuggestions && alert.foodSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {alert.foodSuggestions.map((item, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300"
                        >
                          + {item}
                        </span>
                      ))}
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
