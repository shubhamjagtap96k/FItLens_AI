"use client";

import React from "react";
import { ActiveNavTab } from "./Sidebar";
import {
  LayoutDashboard,
  Dumbbell,
  Camera,
  FileText,
  Bot,
  Scale,
} from "lucide-react";

interface MobileNavProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenScanner: () => void;
  onOpenCoachChat: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenScanner,
  onOpenCoachChat,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-2 backdrop-blur-xl">
      <div className="flex items-center justify-around">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab("DASHBOARD")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === "DASHBOARD" ? "text-fitness-green font-bold" : "text-slate-400"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Workouts */}
        <button
          onClick={() => onSelectTab("WORKOUTS")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === "WORKOUTS" ? "text-fitness-green font-bold" : "text-slate-400"
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span>Workouts</span>
        </button>

        {/* Center Floating Camera Scan Button */}
        <div className="relative -top-5">
          <button
            onClick={onOpenScanner}
            className="w-13 h-13 p-3.5 rounded-full bg-fitness-green text-slate-950 shadow-xl shadow-fitness-green/40 active:scale-90 transition-transform flex items-center justify-center border-4 border-slate-950"
            title="Scan Food"
          >
            <Camera className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Body Progress */}
        <button
          onClick={() => onSelectTab("BODY_PROGRESS")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors ${
            activeTab === "BODY_PROGRESS" ? "text-fitness-green font-bold" : "text-slate-400"
          }`}
        >
          <Scale className="w-5 h-5" />
          <span>Body</span>
        </button>

        {/* AI Coach */}
        <button
          onClick={onOpenCoachChat}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-white"
        >
          <Bot className="w-5 h-5 text-fitness-green" />
          <span>Coach</span>
        </button>
      </div>
    </div>
  );
};
