"use client";

import React, { useState, useEffect } from "react";
import {
  UserProfile,
  GoalType,
  DietaryPreference,
  ActivityLevel,
} from "@/types";
import {
  calculateBMR,
  calculateTDEE,
  calculateGoalTargets,
} from "@/lib/utils/nutrition-calc";
import {
  User,
  UserPlus,
  Settings,
  Target,
  Sparkles,
  HeartPulse,
  Save,
  X,
  Shield,
  Activity,
  CheckCircle2,
  Database,
  ArrowRight,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

const GOALS: { type: GoalType; label: string; desc: string }[] = [
  { type: "FAT_LOSS", label: "Fat Loss (Cutting)", desc: "Maintain lean mass while shedding adipose tissue" },
  { type: "WEIGHT_LOSS", label: "Weight Loss", desc: "Steady, sustainable caloric deficit (-500 kcal)" },
  { type: "MUSCLE_BUILDING", label: "Muscle Building (Bulking)", desc: "Hypertrophy focus with caloric surplus & high protein" },
  { type: "BODY_RECOMPOSITION", label: "Body Recomposition", desc: "Build muscle and drop fat at slight deficit" },
  { type: "HEALTHY_LIFESTYLE", label: "Healthy Lifestyle", desc: "Metabolic vitality, longevity, and maintenance" },
  { type: "WEIGHT_GAIN", label: "Weight Gain", desc: "Nutrient-dense caloric surplus for recovery" },
];

const DIETARY_PREFERENCES: { type: DietaryPreference; label: string }[] = [
  { type: "VEGETARIAN", label: "Vegetarian (Lacto-Ovo)" },
  { type: "VEGAN", label: "Vegan (100% Plant-Based)" },
  { type: "JAIN", label: "Jain Vegetarian (No Root Veggies)" },
  { type: "HIGH_PROTEIN", label: "High Protein Fitness" },
  { type: "KETO", label: "Ketogenic (High Fat, Low Carb)" },
  { type: "LOW_CARB", label: "Low Carb" },
  { type: "MEDITERRANEAN", label: "Mediterranean" },
  { type: "STANDARD", label: "Standard / Omnivore" },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<"EDIT_CURRENT" | "CREATE_NEW" | "VIEW_ALL">("EDIT_CURRENT");
  const [isSaving, setIsSaving] = useState(false);
  const [dbStatusMessage, setDbStatusMessage] = useState<string | null>(null);

  // Edit current user state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [heightCm, setHeightCm] = useState(user.heightCm);
  const [weightKg, setWeightKg] = useState(user.weightKg);
  const [targetWeightKg, setTargetWeightKg] = useState(user.targetWeightKg);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user.activityLevel);
  const [goal, setGoal] = useState<GoalType>(user.goal);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(user.dietaryPreference);
  const [allergiesText, setAllergiesText] = useState(user.allergies.join(", "));
  const [conditionsText, setConditionsText] = useState(user.medicalConditions.join(", "));

  // Create new user state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAge, setNewAge] = useState(25);
  const [newGender, setNewGender] = useState<"male" | "female" | "other">("male");
  const [newHeightCm, setNewHeightCm] = useState(175);
  const [newWeightKg, setNewWeightKg] = useState(72);
  const [newTargetWeightKg, setNewTargetWeightKg] = useState(68);
  const [newActivityLevel, setNewActivityLevel] = useState<ActivityLevel>("MODERATE");
  const [newGoal, setNewGoal] = useState<GoalType>("MUSCLE_BUILDING");
  const [newDietaryPreference, setNewDietaryPreference] = useState<DietaryPreference>("HIGH_PROTEIN");

  // All saved users in DB
  const [savedUsersList, setSavedUsersList] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchSavedUsers();
    }
  }, [isOpen]);

  const fetchSavedUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSavedUsersList(json.data);
      }
    } catch (err) {
      console.warn("Could not load users:", err);
    }
  };

  if (!isOpen) return null;

  // Real-time recalculated BMR and TDEE for current edit
  const currentBmr = calculateBMR(gender, weightKg, heightCm, age);
  const currentTdee = calculateTDEE(currentBmr, activityLevel);
  const currentTargets = calculateGoalTargets(currentTdee, weightKg, goal);

  // Real-time recalculated BMR and TDEE for new user
  const newBmr = calculateBMR(newGender, newWeightKg, newHeightCm, newAge);
  const newTdee = calculateTDEE(newBmr, newActivityLevel);
  const newTargets = calculateGoalTargets(newTdee, newWeightKg, newGoal);

  // Save current user edits to DB
  const handleSaveCurrent = async () => {
    setIsSaving(true);
    setDbStatusMessage(null);

    const updatedUserObj: UserProfile = {
      ...user,
      name,
      email,
      age: Number(age),
      gender,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      targetWeightKg: Number(targetWeightKg),
      activityLevel,
      goal,
      dietaryPreference,
      allergies: allergiesText.split(",").map((s) => s.trim()).filter(Boolean),
      medicalConditions: conditionsText.split(",").map((s) => s.trim()).filter(Boolean),
      targets: currentTargets,
      bmr: currentBmr,
      tdee: currentTdee,
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedUserObj.name,
          email: updatedUserObj.email,
          age: updatedUserObj.age,
          gender: updatedUserObj.gender,
          heightCm: updatedUserObj.heightCm,
          weightKg: updatedUserObj.weightKg,
          targetWeightKg: updatedUserObj.targetWeightKg,
          activityLevel: updatedUserObj.activityLevel,
          goal: updatedUserObj.goal,
          dietaryPreference: updatedUserObj.dietaryPreference,
          allergies: updatedUserObj.allergies,
          medicalConditions: updatedUserObj.medicalConditions,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setDbStatusMessage(`✅ User saved in ${json.source} Database!`);
        onUpdateProfile(json.data || updatedUserObj);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        fetchSavedUsers();
      } else {
        setDbStatusMessage(`⚠️ Saved locally: ${json.error || "Ready"}`);
        onUpdateProfile(updatedUserObj);
      }
    } catch {
      onUpdateProfile(updatedUserObj);
      setDbStatusMessage("✅ User info saved locally in session.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setDbStatusMessage(null), 4000);
    }
  };

  // Register brand new user and persist to DB
  const handleCreateNewUser = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      alert("Please provide both Name and Email for the new user.");
      return;
    }

    setIsSaving(true);
    setDbStatusMessage(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          age: Number(newAge),
          gender: newGender,
          heightCm: Number(newHeightCm),
          weightKg: Number(newWeightKg),
          targetWeightKg: Number(newTargetWeightKg),
          activityLevel: newActivityLevel,
          goal: newGoal,
          dietaryPreference: newDietaryPreference,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setDbStatusMessage(`🎉 Created & Saved in ${json.source} Database!`);
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        onUpdateProfile(json.data);
        fetchSavedUsers();
        setActiveTab("EDIT_CURRENT");
      } else {
        alert(json.error || "Failed to create user in database");
      }
    } catch (err: any) {
      alert("Failed to connect to /api/users: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSwitchUser = (selected: UserProfile) => {
    onUpdateProfile(selected);
    setName(selected.name);
    setEmail(selected.email);
    setAge(selected.age);
    setGender(selected.gender);
    setHeightCm(selected.heightCm);
    setWeightKg(selected.weightKg);
    setTargetWeightKg(selected.targetWeightKg);
    setActivityLevel(selected.activityLevel);
    setGoal(selected.goal);
    setDietaryPreference(selected.dietaryPreference);
    setAllergiesText(selected.allergies.join(", "));
    setConditionsText(selected.medicalConditions.join(", "));
    setDbStatusMessage(`Switched active profile to ${selected.name}`);
    setActiveTab("EDIT_CURRENT");
    setTimeout(() => setDbStatusMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-fitness-green/10 text-fitness-green">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">User Accounts & Database Storage</h2>
              <p className="text-xs text-muted-foreground">
                Manage user biometrics, targets & save records to PostgreSQL database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-900/40 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("EDIT_CURRENT")}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 text-xs font-semibold transition-colors ${
              activeTab === "EDIT_CURRENT"
                ? "border-fitness-green text-fitness-green"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Edit Active User
          </button>

          <button
            onClick={() => setActiveTab("CREATE_NEW")}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 text-xs font-semibold transition-colors ${
              activeTab === "CREATE_NEW"
                ? "border-fitness-green text-fitness-green"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add New User to DB
          </button>

          <button
            onClick={() => setActiveTab("VIEW_ALL")}
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b-2 text-xs font-semibold transition-colors ${
              activeTab === "VIEW_ALL"
                ? "border-fitness-green text-fitness-green"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Saved Accounts ({savedUsersList.length})
          </button>
        </div>

        {/* Database Status Alert Banner */}
        {dbStatusMessage && (
          <div className="mx-5 mt-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-fitness-green shrink-0" />
            <span>{dbStatusMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* ================= TAB 1: EDIT CURRENT PROFILE ================= */}
          {activeTab === "EDIT_CURRENT" && (
            <div className="space-y-5">
              {/* BMR & TDEE Live Preview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/30 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Basal Metabolic Rate</span>
                  <span className="text-lg font-black text-white font-mono">{currentBmr}</span>
                  <span className="text-[10px] text-slate-400 block">kcal BMR</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Daily Burn (TDEE)</span>
                  <span className="text-lg font-black text-cyan-400 font-mono">{currentTdee}</span>
                  <span className="text-[10px] text-cyan-400 block">kcal Maintenance</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Target Calorie Budget</span>
                  <span className="text-lg font-black text-fitness-green font-mono">{currentTargets.calories}</span>
                  <span className="text-[10px] text-fitness-green block">kcal / day</span>
                </div>
              </div>

              {/* Demographics */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Account Credentials & Demographics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Email Address (Unique)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Current Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Goal Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={targetWeightKg}
                      onChange={(e) => setTargetWeightKg(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Activity Level</label>
                    <select
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                    >
                      <option value="SEDENTARY">Sedentary (Desk Job)</option>
                      <option value="LIGHT">Light (1-3 days/wk)</option>
                      <option value="MODERATE">Moderate (3-5 days/wk)</option>
                      <option value="VERY_ACTIVE">Very Active (6-7 days/wk)</option>
                      <option value="EXTRA_ACTIVE">Extra Active (Athlete)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Goal Selector */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Fitness Goal
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {GOALS.map((g) => (
                    <button
                      key={g.type}
                      onClick={() => setGoal(g.type)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        goal === g.type
                          ? "bg-fitness-green/10 border-fitness-green text-white shadow-sm"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{g.label}</span>
                        {goal === g.type && <Sparkles className="w-3.5 h-3.5 text-fitness-green" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Dietary Preference & Restrictions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {DIETARY_PREFERENCES.map((dp) => (
                    <button
                      key={dp.type}
                      onClick={() => setDietaryPreference(dp.type)}
                      className={`p-2.5 rounded-xl border text-center font-semibold text-[11px] transition-all ${
                        dietaryPreference === dp.type
                          ? "bg-slate-200 text-slate-950 border-slate-200 font-bold"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {dp.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: CREATE BRAND NEW USER ================= */}
          {activeTab === "CREATE_NEW" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-2.5">
                <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Save Directly to Database:</strong> Creating a user creates both a primary <code className="text-cyan-300 font-mono">User</code> record and an attached <code className="text-cyan-300 font-mono">Profile</code> record with automatically computed BMR, TDEE, and macro targets.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Verma"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul.verma@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Gender</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={newHeightCm}
                    onChange={(e) => setNewHeightCm(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeightKg}
                    onChange={(e) => setNewWeightKg(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Goal Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTargetWeightKg}
                    onChange={(e) => setNewTargetWeightKg(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Fitness Goal</label>
                  <select
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value as GoalType)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                  >
                    <option value="FAT_LOSS">Fat Loss (Cutting)</option>
                    <option value="WEIGHT_LOSS">Weight Loss (-500 kcal)</option>
                    <option value="MUSCLE_BUILDING">Muscle Building (+350 kcal)</option>
                    <option value="BODY_RECOMPOSITION">Body Recomposition</option>
                    <option value="HEALTHY_LIFESTYLE">Healthy Lifestyle</option>
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="text-slate-400 block mb-1">Dietary Preference</label>
                  <select
                    value={newDietaryPreference}
                    onChange={(e) => setNewDietaryPreference(e.target.value as DietaryPreference)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                  >
                    <option value="HIGH_PROTEIN">High Protein Fitness</option>
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="JAIN">Jain</option>
                    <option value="KETO">Ketogenic</option>
                    <option value="STANDARD">Standard</option>
                  </select>
                </div>
              </div>

              {/* Calculated Targets Preview for New User */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Calculated Energy Target for New User:</span>
                <span className="text-sm font-bold text-white font-mono">
                  {newTargets.calories} kcal • {newTargets.protein}g Protein • {newTargets.carbs}g Carbs • {newTargets.fat}g Fat
                </span>
              </div>
            </div>
          )}

          {/* ================= TAB 3: SAVED ACCOUNTS IN DB ================= */}
          {activeTab === "VIEW_ALL" && (
            <div className="space-y-3">
              <span className="text-xs text-slate-400 block">
                The following accounts are currently persisted in the database:
              </span>

              {savedUsersList.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No additional accounts found in database. Create one using the &ldquo;Add New User to DB&rdquo; tab!
                </div>
              ) : (
                savedUsersList.map((u) => (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.email === user.email && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-fitness-green/20 text-fitness-green font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {u.goal.replace("_", " ")} • {u.targets.calories} kcal • {u.targets.protein}g P
                      </div>
                    </div>

                    {u.email !== user.email ? (
                      <button
                        onClick={() => handleSwitchUser(u)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs"
                      >
                        <span>Switch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-fitness-green font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Selected
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>

          {activeTab === "EDIT_CURRENT" && (
            <button
              onClick={handleSaveCurrent}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-fitness-green hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-fitness-green/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              {isSaving ? "Saving to Database..." : "Save to Database"}
            </button>
          )}

          {activeTab === "CREATE_NEW" && (
            <button
              onClick={handleCreateNewUser}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-400/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              {isSaving ? "Creating User in DB..." : "Create & Save in Database"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
