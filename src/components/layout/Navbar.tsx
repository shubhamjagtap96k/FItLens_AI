"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types";
import {
  Camera,
  Flame,
  Trophy,
  Bell,
  Settings,
  Sparkles,
  Timer,
  Scan,
  User,
} from "lucide-react";

interface NavbarProps {
  user: UserProfile;
  onOpenScanner: () => void;
  onOpenProfile: () => void;
  onOpenCoachChat: () => void;
  activeFastHours?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenScanner,
  onOpenProfile,
  onOpenCoachChat,
  activeFastHours = 14.5,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { title: "Hydration Check", desc: "You're 700ml away from completing today's water ring.", time: "15m ago" },
    { title: "Protein Reminder", desc: "43g of protein remaining for dinner target.", time: "45m ago" },
    { title: "Fasting Milestone", desc: "You entered the deep fat-burning metabolic phase at 14 hours!", time: "1h ago" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 sm:px-6 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-fitness-green via-emerald-400 to-cyan-400 p-0.5 shadow-lg shadow-fitness-green/20">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
              <Scan className="w-5 h-5 text-fitness-green animate-pulseGlow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-white">
                FitLens <span className="text-fitness-green">AI</span>
              </h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-fitness-green/20 text-fitness-green font-bold">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              Vision Nutrition & Health Intelligence
            </p>
          </div>
        </div>

        {/* Center Live Badges (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="font-bold text-white font-mono">{user.currentStreak}</span>
            <span className="text-[11px] text-slate-400">Day Streak</span>
          </div>

          {/* Points Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300 font-mono">{user.points}</span>
            <span className="text-[11px] text-slate-400">pts</span>
          </div>

          {/* Fasting Active Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
            <Timer className="w-3.5 h-3.5" />
            <span className="font-mono font-bold">{Math.floor(activeFastHours)}h {Math.floor((activeFastHours % 1) * 60)}m</span>
            <span className="text-[10px] text-amber-400/80 hidden lg:inline">• Fasting</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Scan Food CTA */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-fitness-green hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-lg shadow-fitness-green/25"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Scan Food</span>
          </button>

          {/* AI Coach Quick Pill */}
          <button
            onClick={onOpenCoachChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors"
            title="Chat with AI Coach"
          >
            <Sparkles className="w-3.5 h-3.5 text-fitness-green" />
            <span className="hidden lg:inline">Coach</span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-fitness-red" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">Smart Reminders & Alerts</span>
                  <span className="text-[10px] text-fitness-green font-semibold">3 New</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar / Settings */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <span className="font-semibold text-xs hidden sm:inline max-w-[80px] truncate">
              {user.name.split(" ")[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
