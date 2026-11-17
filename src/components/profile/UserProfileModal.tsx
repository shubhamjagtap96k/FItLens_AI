"use client";

import React, { useState } from "react";
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
  Settings,
  Target,
  Sparkles,
  HeartPulse,
  Save,
  X,
  Shield,
  Activity,
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
  const [name, setName] = useState(user.name);
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

  if (!isOpen) return null;

  // Real-time recalculated BMR and TDEE
  const newBmr = calculateBMR(gender, weightKg, heightCm, age);
  const newTdee = calculateTDEE(newBmr, activityLevel);
  const newTargets = calculateGoalTargets(newTdee, weightKg, goal);

  const handleSave = () => {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    const updated: UserProfile = {
      ...user,
      name,
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
      targets: newTargets,
      bmr: newBmr,
      tdee: newTdee,
    };

    onUpdateProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-fitness-green/10 text-fitness-green">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Biometric Profile & Health Goals</h2>
              <p className="text-xs text-muted-foreground">Adjust your metabolic targets, dietary rules & body objectives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Real-time BMR & TDEE Live Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/30 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Basal Metabolic Rate</span>
              <span className="text-lg font-black text-white font-mono">{newBmr}</span>
              <span className="text-[10px] text-slate-400 block">kcal BMR</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Daily Burn (TDEE)</span>
              <span className="text-lg font-black text-cyan-400 font-mono">{newTdee}</span>
              <span className="text-[10px] text-cyan-400 block">kcal Maintenance</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Target Calorie Budget</span>
              <span className="text-lg font-black text-fitness-green font-mono">{newTargets.calories}</span>
              <span className="text-[10px] text-fitness-green block">kcal / day</span>
            </div>
          </div>

          {/* Demographics */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Physical Demographics
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

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
                >
                  <option value="SEDENTARY">Sedentary (Desk job, little exercise)</option>
                  <option value="LIGHT">Light (1-3 days exercise/week)</option>
                  <option value="MODERATE">Moderate (3-5 days workout/week)</option>
                  <option value="VERY_ACTIVE">Very Active (6-7 days intense)</option>
                  <option value="EXTRA_ACTIVE">Extra Active (Athlete, 2x day)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Goal Selector */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Primary Fitness & Body Goal
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

          {/* Allergies & Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">
                Known Allergies (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Peanuts, Gluten, Shellfish"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">
                Medical Conditions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. PCOS, Thyroid, Pre-diabetic"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-fitness-green"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-fitness-green hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-fitness-green/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            Save Profile & Targets
          </button>
        </div>
      </div>
    </div>
  );
};
