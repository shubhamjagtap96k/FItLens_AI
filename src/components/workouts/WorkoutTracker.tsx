"use client";

import React, { useState } from "react";
import { WorkoutLog, WorkoutType, SyncSource } from "@/types";
import {
  Dumbbell,
  Flame,
  Clock,
  Plus,
  RefreshCw,
  CheckCircle,
  Activity,
  Heart,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";

interface WorkoutTrackerProps {
  workouts: WorkoutLog[];
  onAddWorkout: (workout: WorkoutLog) => void;
}

const SYNC_PROVIDERS: { name: SyncSource; label: string; icon: string; connected: boolean }[] = [
  { name: "APPLE_HEALTH", label: "Apple Health", icon: "🍎", connected: true },
  { name: "GOOGLE_FIT", label: "Google Fit", icon: "🟢", connected: true },
  { name: "GARMIN", label: "Garmin Connect", icon: "🔵", connected: false },
  { name: "FITBIT", label: "Fitbit", icon: "🔷", connected: false },
  { name: "SAMSUNG_HEALTH", label: "Samsung Health", icon: "🟣", connected: false },
];

export const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({
  workouts,
  onAddWorkout,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [workoutType, setWorkoutType] = useState<WorkoutType>("GYM");
  const [title, setTitle] = useState("Afternoon Strength Session");
  const [duration, setDuration] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState(320);
  const [distanceKm, setDistanceKm] = useState<number | undefined>(undefined);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [weightKg, setWeightKg] = useState(25);
  const [addedExercises, setAddedExercises] = useState<{ name: string; sets: number; reps: number; weightKg?: number }[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const totalMinutes = workouts.reduce((sum, w) => sum + w.durationMinutes, 0);
  const totalBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  const handleAddExerciseRow = () => {
    if (!exerciseName.trim()) return;
    setAddedExercises([
      ...addedExercises,
      { name: exerciseName.trim(), sets, reps, weightKg },
    ]);
    setExerciseName("");
  };

  const handleSaveWorkout = () => {
    try {
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    } catch {}

    const newWorkout: WorkoutLog = {
      id: "w-" + Date.now(),
      type: workoutType,
      title: title || `${workoutType} Session`,
      durationMinutes: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
      intensity: "MODERATE",
      source: "MANUAL",
      loggedAt: "Just now",
      exercises: addedExercises.length > 0 ? addedExercises : undefined,
    };

    onAddWorkout(newWorkout);
    setIsAdding(false);
    setAddedExercises([]);
  };

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Synced latest heart rate & active workout sessions from Apple HealthKit and Google Fit!");
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Total Active Burn</span>
            <Flame className="w-4 h-4 text-fitness-red" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {totalBurned} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
          <div className="text-[11px] text-fitness-green mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Metabolic Rate Elevated
          </div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Workout Duration</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {totalMinutes} <span className="text-xs font-normal text-slate-400">minutes</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target: 45 mins/day
          </div>
        </div>

        <div className="glass-panel p-4 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Device Integration</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-white flex items-center gap-2">
            <span>2 Connected</span>
            <button
              onClick={handleSimulateSync}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Sync Devices"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-fitness-green" : ""}`} />
            </button>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Apple Health • Google Fit Live
          </div>
        </div>
      </div>

      {/* Connected Health Apps Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Heart className="w-4 h-4 text-fitness-red" />
          Health Device Sync:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {SYNC_PROVIDERS.map((p) => (
            <span
              key={p.name}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border ${
                p.connected
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              <span>{p.icon}</span>
              {p.label}
              {p.connected && <CheckCircle className="w-3 h-3 text-emerald-400 ml-0.5" />}
            </span>
          ))}
        </div>
      </div>

      {/* Workout Logs Header & Add Action */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-fitness-green" />
          Logged Workouts & Activities
        </h3>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-fitness-green hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all active:scale-95 shadow-md shadow-fitness-green/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Log Workout
        </button>
      </div>

      {/* Add Workout Form */}
      {isAdding && (
        <div className="glass-panel p-5 rounded-3xl border border-fitness-green/30 space-y-4 animate-fadeIn">
          <h4 className="text-sm font-bold text-white">Log New Workout Session</h4>

          {/* Type Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">
              Activity Type
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-xs">
              {(["GYM", "RUNNING", "WALKING", "CYCLING", "SWIMMING", "YOGA", "SPORTS"] as WorkoutType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setWorkoutType(t)}
                  className={`py-2 px-1 rounded-xl border font-semibold text-[11px] transition-all ${
                    workoutType === t
                      ? "bg-fitness-green text-slate-950 border-fitness-green"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Core Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Session Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Calories Burned (kcal)</label>
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>
          </div>

          {/* Optional Distance */}
          {(workoutType === "RUNNING" || workoutType === "CYCLING" || workoutType === "WALKING") && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 5.2"
                value={distanceKm || ""}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-fitness-green font-mono"
              />
            </div>
          )}

          {/* Exercises Sub-form for Gym */}
          {workoutType === "GYM" && (
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                Log Lift Exercises (Sets, Reps, Weight)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Exercise name (e.g. Incline DB Press)"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none sm:col-span-1"
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono flex-1"
                  />
                  <button
                    onClick={handleAddExerciseRow}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-fitness-green font-bold text-xs rounded-xl"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {addedExercises.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {addedExercises.map((ex, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-xl border border-slate-700"
                    >
                      {ex.name}: {ex.sets} sets × {ex.reps} reps @ {ex.weightKg} kg
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveWorkout}
              className="px-5 py-2 rounded-xl bg-fitness-green text-slate-950 font-bold text-xs shadow-md shadow-fitness-green/20"
            >
              Save Workout
            </button>
          </div>
        </div>
      )}

      {/* Workout List */}
      <div className="space-y-3">
        {workouts.map((w) => (
          <div
            key={w.id}
            className="glass-panel p-4 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-fitness-green/10 text-fitness-green">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{w.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                      {w.type}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {w.durationMinutes} mins
                    </span>
                    {w.distanceKm && <span>{w.distanceKm} km</span>}
                    <span>Intensity: {w.intensity}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-white font-mono flex items-center gap-1 justify-end">
                  <Flame className="w-4 h-4 text-fitness-red" />
                  {w.caloriesBurned} kcal
                </div>
                <span className="text-[10px] text-emerald-400 font-medium">
                  via {w.source.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Exercise breakdown if present */}
            {w.exercises && w.exercises.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Exercise Progression:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {w.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                    >
                      <div className="font-semibold text-white truncate">{ex.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {ex.sets} × {ex.reps} {ex.weightKg ? `@ ${ex.weightKg}kg` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
