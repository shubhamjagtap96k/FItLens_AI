"use client";

import React, { useState, useRef } from "react";
import { FoodDetectionResult, MealLog, MealType } from "@/types";
import { VisionService } from "@/lib/ai/vision-service";
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Check,
  Edit2,
  Sliders,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import confetti from "canvas-confetti";

interface FoodScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmMeal: (meal: MealLog) => void;
  initialMealType?: MealType;
}

const SAMPLE_FOOD_PREVIEWS = [
  {
    name: "Paneer Tikka",
    prompt: "paneer",
    img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Grilled Chicken Salad",
    prompt: "chicken",
    img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Avocado Poached Egg",
    prompt: "avocado",
    img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Dal Khichdi & Ghee",
    prompt: "dal",
    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Berry Oatmeal Bowl",
    prompt: "oatmeal",
    img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
  },
];

export const FoodScannerModal: React.FC<FoodScannerModalProps> = ({
  isOpen,
  onClose,
  onConfirmMeal,
  initialMealType = "LUNCH",
}) => {
  const [step, setStep] = useState<"CAPTURE" | "ANALYZING" | "REVIEW">("CAPTURE");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectedFood, setDetectedFood] = useState<FoodDetectionResult | null>(null);
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1.0);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(initialMealType);
  const [isEditingName, setIsEditingName] = useState(false);
  const [customFoodName, setCustomFoodName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const triggerAnalyze = async (imageSrc: string, promptTag?: string) => {
    setSelectedImage(imageSrc);
    setStep("ANALYZING");

    try {
      // Simulate/call vision analyzer
      setTimeout(async () => {
        const result = await VisionService.analyzeFoodImage(imageSrc, {
          imagePrompt: promptTag,
          userMealType: selectedMealType,
          portionMultiplier: 1.0,
        });
        setDetectedFood(result);
        setCustomFoodName(result.foodName);
        setPortionMultiplier(1.0);
        setStep("REVIEW");
      }, 1500);
    } catch (err) {
      console.error(err);
      setStep("CAPTURE");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          triggerAnalyze(reader.result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (!detectedFood) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00E073", "#00C7BE", "#FF2D55", "#FF9500"],
      });
    } catch {
      // ignore
    }

    const calculatedCalories = Math.round(detectedFood.calories * portionMultiplier);
    const calculatedProtein = parseFloat((detectedFood.proteinG * portionMultiplier).toFixed(1));
    const calculatedCarbs = parseFloat((detectedFood.carbsG * portionMultiplier).toFixed(1));
    const calculatedFat = parseFloat((detectedFood.fatG * portionMultiplier).toFixed(1));
    const calculatedFiber = parseFloat((detectedFood.fiberG * portionMultiplier).toFixed(1));
    const calculatedSugar = parseFloat((detectedFood.sugarG * portionMultiplier).toFixed(1));
    const calculatedSodium = Math.round(detectedFood.sodiumMg * portionMultiplier);

    const newMeal: MealLog = {
      id: "meal-" + Date.now(),
      mealType: selectedMealType,
      loggedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: [
        {
          id: "item-" + Date.now(),
          name: customFoodName || detectedFood.foodName,
          quantity: portionMultiplier,
          unit: detectedFood.portionUnit,
          calories: calculatedCalories,
          protein: calculatedProtein,
          carbs: calculatedCarbs,
          fat: calculatedFat,
          fiber: calculatedFiber,
          sugar: calculatedSugar,
          sodium: calculatedSodium,
        },
      ],
      totalCalories: calculatedCalories,
      totalProtein: calculatedProtein,
      totalCarbs: calculatedCarbs,
      totalFat: calculatedFat,
      totalFiber: calculatedFiber,
      totalSugar: calculatedSugar,
      totalSodium: calculatedSodium,
      aiConfidenceScore: detectedFood.confidenceScore,
      imageUrl: selectedImage || undefined,
      feedback: detectedFood.aiNotes || "Nutritionally balanced meal successfully tracked.",
    };

    onConfirmMeal(newMeal);
    onClose();
    setStep("CAPTURE");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-fitness-green/10 text-fitness-green">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">FitLens Vision Scanner</h2>
              <p className="text-xs text-muted-foreground">AI Food Recognition & Macro Estimation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: CAPTURE / SELECT */}
          {step === "CAPTURE" && (
            <div className="space-y-5">
              {/* Camera / Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-2 border-dashed border-slate-700 hover:border-fitness-green/70 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-900/40 hover:bg-slate-900/70"
              >
                <div className="w-16 h-16 rounded-full bg-fitness-green/10 flex items-center justify-center text-fitness-green group-hover:scale-110 transition-transform mb-3 shadow-lg shadow-fitness-green/10">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Take a Photo or Upload Food Image
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Snap any meal, home-cooked dish, or packaged snack for instant AI portion & macro breakdown.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />
              </div>

              {/* Quick Preset Test Meals */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Or Test with Sample Meals:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_FOOD_PREVIEWS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => triggerAnalyze(preset.img, preset.prompt)}
                      className="group flex flex-col rounded-2xl overflow-hidden border border-slate-800 hover:border-fitness-green bg-slate-900/50 hover:bg-slate-900 transition-all text-left"
                    >
                      <div className="h-20 w-full overflow-hidden bg-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.img}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="p-2 text-xs font-medium text-slate-200 truncate">
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ANALYZING STATE */}
          {step === "ANALYZING" && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-40 h-40 rounded-3xl overflow-hidden border-2 border-fitness-green/60 shadow-2xl shadow-fitness-green/20">
                {selectedImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedImage}
                    alt="Analyzing"
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
                {/* Laser scan line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-fitness-green to-transparent animate-scanLine shadow-lg shadow-fitness-green" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-fitness-green font-bold text-sm">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  AI Vision Engine Analyzing...
                </div>
                <p className="text-xs text-slate-400">
                  Identifying dish, calculating volume density & portion macros
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & EDIT RESULTS */}
          {step === "REVIEW" && detectedFood && (
            <div className="space-y-4">
              {/* Image & Confidence Banner */}
              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800">
                {selectedImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedImage}
                    alt={detectedFood.foodName}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/40 text-[11px] font-bold text-fitness-green">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {Math.round(detectedFood.confidenceScore * 100)}% Confidence
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-slate-700 text-[11px] font-semibold text-slate-300">
                    {detectedFood.category}
                  </span>
                </div>

                {/* Editable Food Title */}
                <div className="absolute bottom-3 inset-x-3">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customFoodName}
                        onChange={(e) => setCustomFoodName(e.target.value)}
                        className="flex-1 bg-black/90 border border-fitness-green rounded-xl px-3 py-1 text-sm font-bold text-white focus:outline-none"
                      />
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="px-3 py-1 bg-fitness-green text-slate-950 rounded-xl text-xs font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-white drop-shadow">
                        {customFoodName || detectedFood.foodName}
                      </h3>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Meal Classification Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Meal Classification
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs">
                  {(
                    [
                      "BREAKFAST",
                      "LUNCH",
                      "DINNER",
                      "SNACKS",
                      "PRE_WORKOUT",
                      "POST_WORKOUT",
                    ] as MealType[]
                  ).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMealType(m)}
                      className={`py-1.5 px-2 rounded-xl border text-[11px] font-semibold transition-all ${
                        selectedMealType === m
                          ? "bg-fitness-green text-slate-950 border-fitness-green shadow-sm"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {m.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Portion Multiplier Slider */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-fitness-green" />
                    Portion Size Adjustment
                  </span>
                  <span className="font-mono font-bold text-fitness-green">
                    {portionMultiplier}x ({(detectedFood.portionSize * portionMultiplier).toFixed(0)} {detectedFood.portionUnit})
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.25"
                  value={portionMultiplier}
                  onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-fitness-green cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0.5x (Light)</span>
                  <span>1.0x (Standard)</span>
                  <span>2.0x (Double)</span>
                  <span>3.0x (Large)</span>
                </div>
              </div>

              {/* Estimated Macro Numbers */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-red-500/20">
                  <div className="text-[10px] font-semibold text-red-400">Calories</div>
                  <div className="text-base font-extrabold text-white font-mono">
                    {Math.round(detectedFood.calories * portionMultiplier)}
                  </div>
                  <div className="text-[9px] text-slate-400">kcal</div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-green-500/20">
                  <div className="text-[10px] font-semibold text-green-400">Protein</div>
                  <div className="text-base font-extrabold text-white font-mono">
                    {(detectedFood.proteinG * portionMultiplier).toFixed(1)}
                  </div>
                  <div className="text-[9px] text-slate-400">grams</div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-cyan-500/20">
                  <div className="text-[10px] font-semibold text-cyan-400">Carbs</div>
                  <div className="text-base font-extrabold text-white font-mono">
                    {(detectedFood.carbsG * portionMultiplier).toFixed(1)}
                  </div>
                  <div className="text-[9px] text-slate-400">grams</div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-amber-500/20">
                  <div className="text-[10px] font-semibold text-amber-400">Fats</div>
                  <div className="text-base font-extrabold text-white font-mono">
                    {(detectedFood.fatG * portionMultiplier).toFixed(1)}
                  </div>
                  <div className="text-[9px] text-slate-400">grams</div>
                </div>
              </div>

              {/* Micronutrients & Ingredients */}
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Fiber: {(detectedFood.fiberG * portionMultiplier).toFixed(1)}g</span>
                  <span>Sugar: {(detectedFood.sugarG * portionMultiplier).toFixed(1)}g</span>
                  <span>Sodium: {Math.round(detectedFood.sodiumMg * portionMultiplier)}mg</span>
                </div>

                {detectedFood.ingredients && detectedFood.ingredients.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Detected Ingredients:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {detectedFood.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {detectedFood.allergens && detectedFood.allergens.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300 pt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Allergens: {detectedFood.allergens.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              if (step === "REVIEW") setStep("CAPTURE");
              else onClose();
            }}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            {step === "REVIEW" ? "Retake Photo" : "Cancel"}
          </button>

          {step === "REVIEW" && (
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-fitness-green hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-fitness-green/20 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Confirm & Log Meal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
