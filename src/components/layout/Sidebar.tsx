"use client";

import React from "react";
import {
  LayoutDashboard,
  Dumbbell,
  Scale,
  FileText,
  CalendarDays,
  Trophy,
  ShieldCheck,
  Bot,
  Camera,
  Barcode,
  Mic,
  UtensilsCrossed,
} from "lucide-react";

export type ActiveNavTab =
  | "DASHBOARD"
  | "WORKOUTS"
  | "BODY_PROGRESS"
  | "REPORTS"
  | "MEAL_PLANNER"
  | "CHALLENGES"
  | "ADMIN";

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenScanner: () => void;
  onOpenBarcode: () => void;
  onOpenVoice: () => void;
  onOpenMenuScanner: () => void;
  onOpenCoachChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenScanner,
  onOpenBarcode,
  onOpenVoice,
  onOpenMenuScanner,
  onOpenCoachChat,
}) => {
  const mainNavItems: { id: ActiveNavTab; label: string; icon: React.ReactNode }[] = [
    { id: "DASHBOARD", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "WORKOUTS", label: "Workouts & Sync", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "BODY_PROGRESS", label: "Body Progress", icon: <Scale className="w-4 h-4" /> },
    { id: "REPORTS", label: "Health Reports", icon: <FileText className="w-4 h-4" /> },
    { id: "MEAL_PLANNER", label: "Meal Planner & Grocery", icon: <CalendarDays className="w-4 h-4" /> },
    { id: "CHALLENGES", label: "Challenges & Streaks", icon: <Trophy className="w-4 h-4" /> },
    { id: "ADMIN", label: "Admin Console", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 p-4 hidden md:flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Main Navigation Links */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">
            Navigation
          </span>
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-fitness-green text-slate-950 font-bold shadow-md shadow-fitness-green/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <span className={isActive ? "text-slate-950" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Quick Input Tools Section */}
        <div className="space-y-1 pt-4 border-t border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">
            AI Vision & Audio Inputs
          </span>

          <button
            onClick={onOpenScanner}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Camera className="w-4 h-4 text-fitness-green" />
            <span>AI Food Vision</span>
          </button>

          <button
            onClick={onOpenBarcode}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Barcode className="w-4 h-4 text-cyan-400" />
            <span>Barcode & Database</span>
          </button>

          <button
            onClick={onOpenVoice}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Mic className="w-4 h-4 text-purple-400" />
            <span>Voice Meal Logger</span>
          </button>

          <button
            onClick={onOpenMenuScanner}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4 text-orange-400" />
            <span>Restaurant Menu Scan</span>
          </button>
        </div>
      </div>

      {/* AI Coach Floating Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-tr from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-fitness-green/30 text-left space-y-2 mt-6">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Bot className="w-4 h-4 text-fitness-green" />
          <span>AI Nutrition Coach</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Ask questions about your daily protein deficit, post-workout timing & diet plans.
        </p>
        <button
          onClick={onOpenCoachChat}
          className="w-full py-2 px-3 rounded-xl bg-fitness-green hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
        >
          Open Coach Chat
        </button>
      </div>
    </aside>
  );
};
