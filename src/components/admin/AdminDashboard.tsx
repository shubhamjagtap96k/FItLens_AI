"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Users,
  Database,
  Activity,
  CreditCard,
  CheckCircle,
  TrendingUp,
  Search,
  Plus,
} from "lucide-react";
import { FOOD_DATABASE } from "@/lib/db/food-database";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ANALYTICS" | "USERS" | "FOOD_DB" | "AI_METRICS">("ANALYTICS");
  const [searchUser, setSearchUser] = useState("");

  const mockUsers = [
    { id: "u-1", name: "Priya Sharma", email: "priya.sharma@example.com", tier: "FitLens Pro", streak: 6, scans: 48, status: "Active" },
    { id: "u-2", name: "Rahul Verma", email: "rahul.v@example.com", tier: "FitLens Elite", streak: 28, scans: 142, status: "Active" },
    { id: "u-3", name: "Sarah Jenkins", email: "sarah.j@example.com", tier: "Free Tier", streak: 2, scans: 14, status: "Active" },
    { id: "u-4", name: "Amit Patel", email: "amit.patel@example.com", tier: "FitLens Pro", streak: 12, scans: 89, status: "Active" },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">FitLens Executive Administration Console</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Monitor neural vision accuracy, manage global food databases, and audit member subscriptions
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("ANALYTICS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ANALYTICS" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("USERS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "USERS" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("FOOD_DB")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "FOOD_DB" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Food Database
          </button>
          <button
            onClick={() => setActiveTab("AI_METRICS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "AI_METRICS" ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            AI Accuracy
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Subscribers</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">14,280</div>
          <div className="text-[11px] text-fitness-green mt-1">+14.2% MoM growth</div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>AI Vision Accuracy</span>
            <Activity className="w-4 h-4 text-fitness-green" />
          </div>
          <div className="text-2xl font-black text-fitness-green font-mono">94.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">Evaluated on 50k images</div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Monthly Recurring Rev</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">$48,650</div>
          <div className="text-[11px] text-amber-400 mt-1">Stripe & Azure billing</div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Verified Food Items</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">18,500+</div>
          <div className="text-[11px] text-purple-400 mt-1">USDA & OpenFoodFacts sync</div>
        </div>
      </div>

      {/* TAB: USERS */}
      {activeTab === "USERS" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white">Registered Application Users</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Subscription Tier</th>
                  <th className="pb-3 font-semibold">Active Streak</th>
                  <th className="pb-3 font-semibold">Food Scans</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="py-3">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-[11px]">
                        {u.tier}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-orange-400">{u.streak} Days</td>
                    <td className="py-3 font-mono text-slate-300">{u.scans}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: FOOD DATABASE */}
      {activeTab === "FOOD_DB" && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Global & Indian Food Registry Moderation</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fitness-green text-slate-950 font-bold text-xs">
              <Plus className="w-3.5 h-3.5" />
              Add Food Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Item Name</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Calories</th>
                  <th className="pb-3 font-semibold">Protein</th>
                  <th className="pb-3 font-semibold">Carbs</th>
                  <th className="pb-3 font-semibold">Fat</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {FOOD_DATABASE.slice(0, 8).map((f) => (
                  <tr key={f.id} className="hover:bg-slate-900/40">
                    <td className="py-3 font-bold text-white">{f.name}</td>
                    <td className="py-3 text-slate-400">{f.category}</td>
                    <td className="py-3 font-mono text-white">{f.calories}</td>
                    <td className="py-3 font-mono text-emerald-400">{f.proteinG}g</td>
                    <td className="py-3 font-mono text-cyan-400">{f.carbsG}g</td>
                    <td className="py-3 font-mono text-amber-400">{f.fatG}g</td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: AI ACCURACY METRICS & ANALYTICS */}
      {(activeTab === "ANALYTICS" || activeTab === "AI_METRICS") && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-fitness-green" />
            AI Computer Vision Model Performance & Accuracy Telemetry
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Indian Regional Foods</span>
                <span className="text-fitness-green font-mono">93.8%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-fitness-green h-full rounded-full" style={{ width: "93.8%" }} />
              </div>
              <span className="text-[10px] text-slate-400 block">
                Tested against curries, rotis, dals, dosas & biryanis
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Global Western Dishes</span>
                <span className="text-cyan-400 font-mono">96.4%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: "96.4%" }} />
              </div>
              <span className="text-[10px] text-slate-400 block">
                Salads, grilled poultry, fish, oats, toasts & bowls
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Packaged Barcode Recognition</span>
                <span className="text-purple-400 font-mono">99.1%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: "99.1%" }} />
              </div>
              <span className="text-[10px] text-slate-400 block">
                OpenFoodFacts UPC checksum resolution
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
