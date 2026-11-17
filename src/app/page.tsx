"use client";

import React, { useState, useMemo } from "react";
import {
  UserProfile,
  MealLog,
  WorkoutLog,
  BodyMeasurement,
  Challenge,
  Badge,
  AICoachAlert,
  DailyTotals,
  MealType,
} from "@/types";
import {
  INITIAL_USER_PROFILE,
  INITIAL_MEAL_LOGS,
  INITIAL_WORKOUT_LOGS,
  INITIAL_BODY_MEASUREMENTS,
  INITIAL_CHALLENGES,
  INITIAL_BADGES,
  INITIAL_ALERTS,
  INITIAL_FASTING_SESSION,
} from "@/lib/db/mock-data";
import { calculateNutritionScore } from "@/lib/utils/nutrition-calc";

// Layout Components
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar, ActiveNavTab } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

// Dashboard Components
import { NutritionRings } from "@/components/dashboard/NutritionRings";
import { DailyStatsCards } from "@/components/dashboard/DailyStatsCards";
import { HydrationCard } from "@/components/dashboard/HydrationCard";
import { FastingWidget } from "@/components/dashboard/FastingWidget";
import { AICoachAlerts } from "@/components/dashboard/AICoachAlerts";
import { RecentMealsList } from "@/components/dashboard/RecentMealsList";

// Sub-views & Modals
import { FoodScannerModal } from "@/components/scanner/FoodScannerModal";
import { BarcodeScannerModal } from "@/components/scanner/BarcodeScannerModal";
import { VoiceMealModal } from "@/components/scanner/VoiceMealModal";
import { MenuScannerModal } from "@/components/scanner/MenuScannerModal";
import { AICoachChat } from "@/components/coach/AICoachChat";
import { UserProfileModal } from "@/components/profile/UserProfileModal";
import { WorkoutTracker } from "@/components/workouts/WorkoutTracker";
import { BodyProgressTracker } from "@/components/body/BodyProgressTracker";
import { ReportsView } from "@/components/reports/ReportsView";
import { AIMealPlannerView } from "@/components/tools/AIMealPlannerView";
import { ChallengesGamification } from "@/components/challenges/ChallengesGamification";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function Home() {
  // Primary State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [meals, setMeals] = useState<MealLog[]>(INITIAL_MEAL_LOGS);
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(INITIAL_WORKOUT_LOGS);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(INITIAL_BODY_MEASUREMENTS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [alerts, setAlerts] = useState<AICoachAlert[]>(INITIAL_ALERTS);
  const [currentWaterMl, setCurrentWaterMl] = useState<number>(2100);

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveNavTab>("DASHBOARD");

  // Modal Visibility State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerDefaultMealType, setScannerDefaultMealType] = useState<MealType>("LUNCH");
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isMenuScannerOpen, setIsMenuScannerOpen] = useState(false);
  const [isCoachChatOpen, setIsCoachChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dynamic Daily Nutrition Totals Calculation
  const totals: DailyTotals = useMemo(() => {
    const cals = meals.reduce((sum, m) => sum + m.totalCalories, 0);
    const p = meals.reduce((sum, m) => sum + m.totalProtein, 0);
    const c = meals.reduce((sum, m) => sum + m.totalCarbs, 0);
    const f = meals.reduce((sum, m) => sum + m.totalFat, 0);
    const fib = meals.reduce((sum, m) => sum + (m.totalFiber || 0), 0);
    const sug = meals.reduce((sum, m) => sum + (m.totalSugar || 0), 0);
    const sod = meals.reduce((sum, m) => sum + (m.totalSodium || 0), 0);
    const burned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

    return {
      calories: cals,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib,
      sugar: sug,
      sodium: sod,
      waterMl: currentWaterMl,
      caloriesBurned: burned,
      netCalories: cals - burned,
      remainingCalories: Math.max(0, user.targets.calories - cals),
    };
  }, [meals, workouts, currentWaterMl, user.targets.calories]);

  // Overall Continuous Health Score (0 - 100)
  const healthScoreResult = useMemo(() => {
    return calculateNutritionScore(totals, user.targets);
  }, [totals, user.targets]);

  // Handlers
  const handleAddMeal = (newMeal: MealLog) => {
    setMeals((prev) => [newMeal, ...prev]);

    // Check if new protein level satisfies requirements or updates alert
    const newTotalProtein = totals.protein + newMeal.totalProtein;
    if (newTotalProtein >= user.targets.protein) {
      setAlerts((prev) => [
        {
          id: "alert-" + Date.now(),
          type: "EXCELLENT",
          category: "PROTEIN",
          title: "Daily Protein Target Achieved! 🏆",
          message: `Great job! You reached ${newTotalProtein.toFixed(1)}g of protein today.`,
          actionRecommendation: "Maintain hydration to support metabolic clearance.",
          timestamp: "Just now",
        },
        ...prev.filter((a) => a.category !== "PROTEIN"),
      ]);
    }
  };

  const handleAddWorkout = (newWorkout: WorkoutLog) => {
    setWorkouts((prev) => [newWorkout, ...prev]);
  };

  const handleAddMeasurement = (newM: BodyMeasurement) => {
    setMeasurements((prev) => [...prev, newM]);
  };

  const handleAddWater = (ml: number) => {
    setCurrentWaterMl((prev) => prev + ml);
  };

  const handleOpenScannerWithMealType = (mType?: MealType) => {
    if (mType) setScannerDefaultMealType(mType);
    setIsScannerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-fitness-green selection:text-slate-950 pb-20 md:pb-6">
      {/* Top Universal Navbar */}
      <Navbar
        user={user}
        onOpenScanner={() => handleOpenScannerWithMealType()}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCoachChat={() => setIsCoachChatOpen(true)}
        activeFastHours={14.5}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar Navigation (Desktop) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenScanner={() => handleOpenScannerWithMealType()}
          onOpenBarcode={() => setIsBarcodeOpen(true)}
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenMenuScanner={() => setIsMenuScannerOpen(true)}
          onOpenCoachChat={() => setIsCoachChatOpen(true)}
        />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* ================= VIEW: DASHBOARD ================= */}
          {activeTab === "DASHBOARD" && (
            <div className="space-y-6">
              {/* Top Row: Nutrition Rings & Key Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Apple Health 3-Ring Visualizer Card */}
                <div className="lg:col-span-5 glass-panel rounded-3xl border border-slate-800 p-2 flex flex-col justify-between">
                  <div className="px-4 pt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Activity & Nutrition Rings
                    </span>
                    <span className="text-[10px] text-fitness-green font-semibold">
                      Apple Health Kit
                    </span>
                  </div>

                  <NutritionRings
                    totals={totals}
                    targets={user.targets}
                    healthScore={healthScoreResult.score}
                  />
                </div>

                {/* Macro Progress Bars & Net Deficit Card */}
                <div className="lg:col-span-7">
                  <DailyStatsCards totals={totals} targets={user.targets} />
                </div>
              </div>

              {/* Fasting & Hydration Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <FastingWidget initialSession={INITIAL_FASTING_SESSION} />
                <HydrationCard
                  currentWaterMl={currentWaterMl}
                  targetWaterMl={user.targets.waterMl}
                  onAddWater={handleAddWater}
                />
              </div>

              {/* AI Real-time Coach Alerts */}
              <AICoachAlerts
                alerts={alerts}
                onOpenCoachChat={() => setIsCoachChatOpen(true)}
              />

              {/* Classified Recent Meals Logged Today */}
              <RecentMealsList
                meals={meals}
                onOpenScanner={handleOpenScannerWithMealType}
              />
            </div>
          )}

          {/* ================= VIEW: WORKOUTS ================= */}
          {activeTab === "WORKOUTS" && (
            <WorkoutTracker workouts={workouts} onAddWorkout={handleAddWorkout} />
          )}

          {/* ================= VIEW: BODY PROGRESS ================= */}
          {activeTab === "BODY_PROGRESS" && (
            <BodyProgressTracker
              user={user}
              measurements={measurements}
              onAddMeasurement={handleAddMeasurement}
            />
          )}

          {/* ================= VIEW: REPORTS ================= */}
          {activeTab === "REPORTS" && (
            <ReportsView
              user={user}
              meals={meals}
              workouts={workouts}
              totals={totals}
              measurements={measurements}
              healthScore={healthScoreResult.score}
            />
          )}

          {/* ================= VIEW: MEAL PLANNER & GROCERY ================= */}
          {activeTab === "MEAL_PLANNER" && <AIMealPlannerView user={user} />}

          {/* ================= VIEW: CHALLENGES & GAMIFICATION ================= */}
          {activeTab === "CHALLENGES" && (
            <ChallengesGamification
              user={user}
              challenges={challenges}
              badges={badges}
            />
          )}

          {/* ================= VIEW: ADMIN DASHBOARD ================= */}
          {activeTab === "ADMIN" && <AdminDashboard />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenScanner={() => handleOpenScannerWithMealType()}
        onOpenCoachChat={() => setIsCoachChatOpen(true)}
      />

      {/* Global Modals */}
      <FoodScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onConfirmMeal={handleAddMeal}
        initialMealType={scannerDefaultMealType}
      />

      <BarcodeScannerModal
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
        onConfirmMeal={handleAddMeal}
      />

      <VoiceMealModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onConfirmMeal={handleAddMeal}
      />

      <MenuScannerModal
        isOpen={isMenuScannerOpen}
        onClose={() => setIsMenuScannerOpen(false)}
      />

      <AICoachChat
        isOpen={isCoachChatOpen}
        onClose={() => setIsCoachChatOpen(false)}
        user={user}
        meals={meals}
        workouts={workouts}
        totals={totals}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateProfile={setUser}
      />
    </div>
  );
}
