import {
  ActivityLevel,
  DailyTargets,
  DailyTotals,
  GoalType,
  UserProfile,
} from "@/types";

export function calculateBMR(
  gender: "male" | "female" | "other",
  weightKg: number,
  heightCm: number,
  age: number
): number {
  if (gender === "male") {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
}

export function getActivityMultiplier(level: ActivityLevel): number {
  switch (level) {
    case "SEDENTARY":
      return 1.2;
    case "LIGHT":
      return 1.375;
    case "MODERATE":
      return 1.55;
    case "VERY_ACTIVE":
      return 1.725;
    case "EXTRA_ACTIVE":
      return 1.9;
    default:
      return 1.4;
  }
}

export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel
): number {
  return Math.round(bmr * getActivityMultiplier(activityLevel));
}

export function calculateGoalTargets(
  tdee: number,
  weightKg: number,
  goal: GoalType
): DailyTargets {
  let targetCalories = tdee;
  let proteinMultiplier = 1.6; // g/kg

  switch (goal) {
    case "FAT_LOSS":
      targetCalories = tdee - 450;
      proteinMultiplier = 2.0;
      break;
    case "WEIGHT_LOSS":
      targetCalories = tdee - 500;
      proteinMultiplier = 1.8;
      break;
    case "MUSCLE_BUILDING":
      targetCalories = tdee + 350;
      proteinMultiplier = 2.2;
      break;
    case "WEIGHT_GAIN":
      targetCalories = tdee + 450;
      proteinMultiplier = 1.8;
      break;
    case "BODY_RECOMPOSITION":
      targetCalories = tdee - 200;
      proteinMultiplier = 2.2;
      break;
    case "HEALTHY_LIFESTYLE":
    default:
      targetCalories = tdee;
      proteinMultiplier = 1.4;
      break;
  }

  const proteinG = Math.round(weightKg * proteinMultiplier);
  const proteinCals = proteinG * 4;

  // Fat: 25% of total calories
  const fatCals = targetCalories * 0.25;
  const fatG = Math.round(fatCals / 9);

  // Carbs: Remaining calories
  const carbsCals = Math.max(0, targetCalories - (proteinCals + fatCals));
  const carbsG = Math.round(carbsCals / 4);

  return {
    calories: Math.round(targetCalories),
    protein: proteinG,
    carbs: carbsG,
    fat: fatG,
    fiber: 30,
    sugarLimit: 36,
    sodiumLimit: 2200,
    waterMl: Math.round(weightKg * 40), // 40ml per kg bodyweight
  };
}

/**
 * Calculates a continuous nutrition score (0 - 100)
 */
export function calculateNutritionScore(
  totals: DailyTotals,
  targets: DailyTargets
): {
  score: number;
  grade: "A+" | "A" | "B+" | "B" | "C" | "Needs Attention";
  breakdown: { label: string; score: number; max: number }[];
} {
  // Calorie adherence (30 pts)
  const calRatio = totals.calories / (targets.calories || 2000);
  let calPts = 30;
  if (calRatio > 1.15 || calRatio < 0.8) {
    calPts = Math.max(10, Math.round(30 - Math.abs(1 - calRatio) * 40));
  }

  // Protein adherence (30 pts)
  const proteinRatio = Math.min(1.0, totals.protein / (targets.protein || 100));
  const proteinPts = Math.round(proteinRatio * 30);

  // Fiber sufficiency (15 pts)
  const fiberRatio = Math.min(1.0, totals.fiber / (targets.fiber || 30));
  const fiberPts = Math.round(fiberRatio * 15);

  // Sugar moderation (15 pts)
  let sugarPts = 15;
  if (totals.sugar > targets.sugarLimit) {
    sugarPts = Math.max(3, Math.round(15 - ((totals.sugar - targets.sugarLimit) / 10) * 4));
  }

  // Sodium moderation (10 pts)
  let sodiumPts = 10;
  if (totals.sodium > targets.sodiumLimit) {
    sodiumPts = Math.max(2, Math.round(10 - ((totals.sodium - targets.sodiumLimit) / 500) * 3));
  }

  const totalScore = Math.min(100, Math.max(0, calPts + proteinPts + fiberPts + sugarPts + sodiumPts));

  let grade: "A+" | "A" | "B+" | "B" | "C" | "Needs Attention" = "B";
  if (totalScore >= 95) grade = "A+";
  else if (totalScore >= 88) grade = "A";
  else if (totalScore >= 78) grade = "B+";
  else if (totalScore >= 68) grade = "B";
  else if (totalScore >= 55) grade = "C";
  else grade = "Needs Attention";

  return {
    score: totalScore,
    grade,
    breakdown: [
      { label: "Calorie Balance", score: calPts, max: 30 },
      { label: "Protein Target", score: proteinPts, max: 30 },
      { label: "Gut Fiber", score: fiberPts, max: 15 },
      { label: "Sugar Control", score: sugarPts, max: 15 },
      { label: "Sodium Balance", score: sodiumPts, max: 10 },
    ],
  };
}

/**
 * Predicts weight change over 30 days based on caloric balance
 */
export function predict30DayWeight(
  currentWeightKg: number,
  dailyDeficitOrSurplus: number
): {
  projectedWeightKg: number;
  projectedChangeKg: number;
  goalProbabilityPct: number;
} {
  // 7,700 kcal ≈ 1 kg of fat tissue
  const monthlyCalorieBalance = dailyDeficitOrSurplus * 30;
  const projectedChangeKg = parseFloat((monthlyCalorieBalance / 7700).toFixed(2));
  const projectedWeightKg = parseFloat((currentWeightKg + projectedChangeKg).toFixed(1));

  // Probability calculation based on consistency
  let goalProbabilityPct = 88;
  if (Math.abs(dailyDeficitOrSurplus) > 300) goalProbabilityPct = 94;

  return {
    projectedWeightKg,
    projectedChangeKg,
    goalProbabilityPct,
  };
}

/**
 * Determines current fasting phase and progress
 */
export function getFastingPhase(elapsedHours: number): {
  phaseName: string;
  stageColor: string;
  description: string;
  benefits: string[];
} {
  if (elapsedHours < 4) {
    return {
      phaseName: "Anabolic Fed State",
      stageColor: "#32ADE6",
      description: "Food is being actively digested. Blood glucose and circulating insulin are elevated.",
      benefits: ["Nutrient absorption", "Glycogen replenishment", "Muscle protein synthesis"],
    };
  } else if (elapsedHours < 12) {
    return {
      phaseName: "Early Catabolic Phase",
      stageColor: "#AF52DE",
      description: "Insulin levels drop back to baseline. The liver begins mobilizing stored glycogen.",
      benefits: ["Blood sugar normalization", "Decreased inflammation", "Digestive rest"],
    };
  } else if (elapsedHours < 16) {
    return {
      phaseName: "Fat Oxidation & Ketosis Entry",
      stageColor: "#FF9500",
      description: "Liver glycogen is nearly depleted. The body initiates lipolysis to burn adipose fatty acids.",
      benefits: ["High fat burning", "Mild ketone production", "Enhanced mental focus"],
    };
  } else {
    return {
      phaseName: "Autophagy & Deep Cellular Repair",
      stageColor: "#00E073",
      description: "Intracellular autophagy accelerates, recycling damaged proteins and senescent cells.",
      benefits: ["Maximum cellular rejuvenation", "Anti-aging gene activation", "Growth hormone surge"],
    };
  }
}
