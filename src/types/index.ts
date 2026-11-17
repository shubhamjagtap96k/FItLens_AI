export type MealType =
  | "BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "SNACKS"
  | "PRE_WORKOUT"
  | "POST_WORKOUT";

export type GoalType =
  | "WEIGHT_LOSS"
  | "WEIGHT_GAIN"
  | "MUSCLE_BUILDING"
  | "FAT_LOSS"
  | "HEALTHY_LIFESTYLE"
  | "BODY_RECOMPOSITION";

export type DietaryPreference =
  | "STANDARD"
  | "VEGETARIAN"
  | "VEGAN"
  | "JAIN"
  | "KETO"
  | "HIGH_PROTEIN"
  | "LOW_CARB"
  | "MEDITERRANEAN";

export type ActivityLevel =
  | "SEDENTARY"
  | "LIGHT"
  | "MODERATE"
  | "VERY_ACTIVE"
  | "EXTRA_ACTIVE";

export type WorkoutType =
  | "RUNNING"
  | "WALKING"
  | "GYM"
  | "CYCLING"
  | "SWIMMING"
  | "YOGA"
  | "SPORTS";

export type SyncSource =
  | "MANUAL"
  | "APPLE_HEALTH"
  | "GOOGLE_FIT"
  | "FITBIT"
  | "GARMIN"
  | "SAMSUNG_HEALTH";

export interface Micronutrients {
  sodiumMg: number;
  potassiumMg: number;
  vitaminA_DV: number;
  vitaminC_DV: number;
  calcium_DV: number;
  iron_DV: number;
}

export interface FoodDetectionResult {
  id: string;
  foodName: string;
  category: string;
  confidenceScore: number; // 0 to 1
  portionSize: number;
  portionUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  sodiumMg: number;
  micronutrients?: Micronutrients;
  ingredients: string[];
  allergens: string[];
  healthRating: number; // 1 to 10
  glycemicIndex: "LOW" | "MEDIUM" | "HIGH";
  suggestedMealType: MealType;
  imageUrl?: string;
  aiNotes?: string;
}

export interface MealFoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface MealLog {
  id: string;
  mealType: MealType;
  loggedAt: string;
  items: MealFoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  aiConfidenceScore?: number;
  imageUrl?: string;
  voiceTranscript?: string;
  feedback?: string;
}

export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugarLimit: number;
  sodiumLimit: number;
  waterMl: number;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  waterMl: number;
  caloriesBurned: number;
  netCalories: number;
  remainingCalories: number;
}

export interface AICoachAlert {
  id: string;
  type: "DEFICIENCY" | "WARNING" | "SUGGESTION" | "EXCELLENT";
  category: "PROTEIN" | "FIBER" | "SUGAR" | "SODIUM" | "HYDRATION" | "GENERAL";
  title: string;
  message: string;
  actionRecommendation: string;
  foodSuggestions?: string[];
  timestamp: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
}

export interface WorkoutLog {
  id: string;
  type: WorkoutType;
  title: string;
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  intensity: "LOW" | "MODERATE" | "HIGH" | "PEAK";
  source: SyncSource;
  exercises?: WorkoutExercise[];
  notes?: string;
  loggedAt: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPct?: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  bicepsCm?: number;
  thighsCm?: number;
  notes?: string;
}

export interface FastingSession {
  id: string;
  type: "16:8" | "18:6" | "20:4" | "OMAD (23:1)" | "Circadian (12:12)";
  targetHours: number;
  startTime: string; // ISO
  endTime?: string;
  isActive: boolean;
  notes?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: "NUTRITION" | "WORKOUT" | "HYDRATION" | "STREAK";
  targetDays: number;
  completedDays: number;
  rewardPoints: number;
  badgeName: string;
  icon: string;
  isCompleted: boolean;
  isEnrolled: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: "STREAK" | "PROTEIN" | "WORKOUT" | "METABOLIC";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: "male" | "female" | "other";
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  dietaryPreference: DietaryPreference;
  allergies: string[];
  medicalConditions: string[];
  targets: DailyTargets;
  points: number;
  currentStreak: number;
  longestStreak: number;
  bmr: number;
  tdee: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
