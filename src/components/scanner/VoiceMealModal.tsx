"use client";

import React, { useState } from "react";
import { MealLog, MealType } from "@/types";
import { Mic, MicOff, Sparkles, Check, X, Volume2 } from "lucide-react";
import confetti from "canvas-confetti";

interface VoiceMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmMeal: (meal: MealLog) => void;
  initialMealType?: MealType;
}

const SAMPLE_VOICE_PROMPTS = [
  {
    label: "Indian Lunch",
    transcript: "I had 2 whole wheat rotis, one bowl of palak paneer, and a small bowl of cucumber salad.",
    calories: 380,
    protein: 21.7,
    carbs: 45.0,
    fat: 14.2,
    fiber: 7.2,
    sugar: 3.0,
    sodium: 520,
    mealType: "LUNCH" as MealType,
  },
  {
    label: "Gym Post-Workout",
    transcript: "Just finished workout, drank one scoop chocolate whey isolate with 300ml almond milk and 1 banana.",
    calories: 275,
    protein: 29.5,
    carbs: 32.0,
    fat: 3.8,
    fiber: 3.5,
    sugar: 15.0,
    sodium: 190,
    mealType: "POST_WORKOUT" as MealType,
  },
  {
    label: "Healthy Breakfast",
    transcript: "A bowl of rolled oatmeal with blueberries, a spoonful of peanut butter, and black coffee.",
    calories: 340,
    protein: 13.0,
    carbs: 48.0,
    fat: 12.0,
    fiber: 7.5,
    sugar: 8.5,
    sodium: 75,
    mealType: "BREAKFAST" as MealType,
  },
];

export const VoiceMealModal: React.FC<VoiceMealModalProps> = ({
  isOpen,
  onClose,
  onConfirmMeal,
  initialMealType = "LUNCH",
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedMeal, setParsedMeal] = useState<typeof SAMPLE_VOICE_PROMPTS[0] | null>(null);

  if (!isOpen) return null;

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate real-time audio parsing or use Web Speech API if supported
      setTimeout(() => {
        const sample = SAMPLE_VOICE_PROMPTS[0];
        setTranscript(sample.transcript);
        setParsedMeal(sample);
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_VOICE_PROMPTS[0]) => {
    setTranscript(sample.transcript);
    setParsedMeal(sample);
  };

  const handleConfirm = () => {
    if (!parsedMeal) return;

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    const meal: MealLog = {
      id: "meal-" + Date.now(),
      mealType: parsedMeal.mealType || initialMealType,
      loggedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: [
        {
          id: "item-" + Date.now(),
          name: parsedMeal.transcript.slice(0, 40) + "...",
          quantity: 1,
          unit: "serving",
          calories: parsedMeal.calories,
          protein: parsedMeal.protein,
          carbs: parsedMeal.carbs,
          fat: parsedMeal.fat,
          fiber: parsedMeal.fiber,
          sugar: parsedMeal.sugar,
          sodium: parsedMeal.sodium,
        },
      ],
      totalCalories: parsedMeal.calories,
      totalProtein: parsedMeal.protein,
      totalCarbs: parsedMeal.carbs,
      totalFat: parsedMeal.fat,
      totalFiber: parsedMeal.fiber,
      totalSugar: parsedMeal.sugar,
      totalSodium: parsedMeal.sodium,
      aiConfidenceScore: 0.95,
      voiceTranscript: parsedMeal.transcript,
      feedback: "Voice meal successfully parsed into granular macro targets.",
    };

    onConfirmMeal(meal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Voice Meal Logger</h2>
              <p className="text-xs text-muted-foreground">Speak naturally; AI will extract food, quantity & macros</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6">
          {/* Animated Microphone Circle */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleToggleRecord}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-rose-500 text-white animate-pulse shadow-2xl shadow-rose-500/50 scale-110"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30 active:scale-95"
              }`}
            >
              {isRecording ? <Mic className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              {isRecording && (
                <span className="absolute -inset-2 rounded-full border-2 border-rose-400 animate-ping opacity-75" />
              )}
            </button>
            <span className="text-xs font-semibold text-slate-300 mt-3">
              {isRecording ? "Listening & Transcribing..." : "Tap to Speak"}
            </span>
          </div>

          {/* Transcript Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left min-h-[70px]">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Voice Transcript:
            </span>
            <p className="text-xs text-slate-200 italic">
              {transcript || "Speak something like: 'I had 2 boiled eggs and a whole wheat toast with butter'"}
            </p>
          </div>

          {/* Quick Voice Simulation Chips */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-semibold text-slate-400 block">
              Or Try a Voice Simulation:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_VOICE_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSelectSample(p)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-left text-xs transition-colors"
                >
                  <div className="font-bold text-white flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    {p.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{p.calories} kcal</div>
                </button>
              ))}
            </div>
          </div>

          {/* Extracted Macros Preview */}
          {parsedMeal && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-left space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                <Sparkles className="w-4 h-4" />
                AI Extracted Nutrition Profile
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Calories</span>
                  <span className="font-bold text-white font-mono">{parsedMeal.calories}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-emerald-400 block">Protein</span>
                  <span className="font-bold text-emerald-400 font-mono">{parsedMeal.protein}g</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-cyan-400 block">Carbs</span>
                  <span className="font-bold text-cyan-400 font-mono">{parsedMeal.carbs}g</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl">
                  <span className="text-[10px] text-amber-400 block">Fat</span>
                  <span className="font-bold text-amber-400 font-mono">{parsedMeal.fat}g</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>
          {parsedMeal && (
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Confirm Voice Log
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
