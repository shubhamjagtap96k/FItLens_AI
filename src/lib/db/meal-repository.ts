import { prisma } from "@/lib/db/prisma";
import { MealLog, MealType } from "@/types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const MEALS_FILE = path.join(DATA_DIR, "meals.json");

function ensureLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MEALS_FILE)) {
    fs.writeFileSync(MEALS_FILE, JSON.stringify([], null, 2));
  }
}

function readLocalMeals(): MealLog[] {
  try {
    ensureLocalStore();
    const data = fs.readFileSync(MEALS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLocalMeals(meals: MealLog[]) {
  try {
    ensureLocalStore();
    fs.writeFileSync(MEALS_FILE, JSON.stringify(meals, null, 2));
  } catch (err) {
    console.error("Could not write local meals file:", err);
  }
}

export class MealRepository {
  /**
   * Save a meal log into the Online / PostgreSQL Database via Prisma
   */
  static async saveMeal(
    userId: string,
    meal: MealLog
  ): Promise<{ meal: MealLog; storageSource: "PostgreSQL" | "Local_DB" }> {
    // 1. Try saving to PostgreSQL
    try {
      // Find or get first user if userId is placeholder
      let validUserId = userId;
      const userExists = await prisma.user.findFirst({
        where: { id: userId },
      });

      if (!userExists) {
        // Fallback to first existing user in DB
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
          validUserId = firstUser.id;
        } else {
          // Auto-create default user in DB if empty
          const created = await prisma.user.create({
            data: {
              email: "priya.sharma@example.com",
              name: "Priya Sharma",
            },
          });
          validUserId = created.id;
        }
      }

      const dbMeal = await prisma.mealLog.create({
        data: {
          userId: validUserId,
          mealType: meal.mealType as any,
          totalCalories: meal.totalCalories,
          totalProtein: meal.totalProtein,
          totalCarbs: meal.totalCarbs,
          totalFat: meal.totalFat,
          totalFiber: meal.totalFiber || 0,
          totalSugar: meal.totalSugar || 0,
          totalSodium: meal.totalSodium || 0,
          aiConfidenceScore: meal.aiConfidenceScore || 0.95,
          imageUrl: meal.imageUrl || null,
          voiceTranscript: meal.voiceTranscript || null,
          aiNutritionFeedback: meal.feedback || null,
          items: {
            create: meal.items.map((item) => ({
              foodName: item.name,
              quantity: item.quantity,
              unit: item.unit,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
              fiber: item.fiber || 0,
              sugar: item.sugar || 0,
              sodium: item.sodium || 0,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      const formattedMeal: MealLog = {
        id: dbMeal.id,
        mealType: dbMeal.mealType as MealType,
        loggedAt: dbMeal.loggedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        items: dbMeal.items.map((i) => ({
          id: i.id,
          name: i.foodName,
          quantity: i.quantity,
          unit: i.unit,
          calories: i.calories,
          protein: i.protein,
          carbs: i.carbs,
          fat: i.fat,
          fiber: i.fiber,
          sugar: i.sugar,
          sodium: i.sodium,
        })),
        totalCalories: dbMeal.totalCalories,
        totalProtein: dbMeal.totalProtein,
        totalCarbs: dbMeal.totalCarbs,
        totalFat: dbMeal.totalFat,
        totalFiber: dbMeal.totalFiber,
        totalSugar: dbMeal.totalSugar,
        totalSodium: dbMeal.totalSodium,
        aiConfidenceScore: dbMeal.aiConfidenceScore || undefined,
        imageUrl: dbMeal.imageUrl || undefined,
        voiceTranscript: dbMeal.voiceTranscript || undefined,
        feedback: dbMeal.aiNutritionFeedback || undefined,
      };

      return { meal: formattedMeal, storageSource: "PostgreSQL" };
    } catch (err) {
      console.warn("PostgreSQL unreachable, persisting meal to local store:", err);

      // 2. Fallback to Local Persistent Store
      const localMeals = readLocalMeals();
      localMeals.unshift(meal);
      writeLocalMeals(localMeals);

      return { meal, storageSource: "Local_DB" };
    }
  }

  /**
   * Fetch all logged meals from Database
   */
  static async getMeals(userId?: string): Promise<MealLog[]> {
    try {
      const dbMeals = await prisma.mealLog.findMany({
        where: userId ? { userId } : undefined,
        include: { items: true },
        orderBy: { loggedAt: "desc" },
        take: 50,
      });

      if (dbMeals && dbMeals.length > 0) {
        return dbMeals.map((m) => ({
          id: m.id,
          mealType: m.mealType as MealType,
          loggedAt: m.loggedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          items: m.items.map((i) => ({
            id: i.id,
            name: i.foodName,
            quantity: i.quantity,
            unit: i.unit,
            calories: i.calories,
            protein: i.protein,
            carbs: i.carbs,
            fat: i.fat,
            fiber: i.fiber,
            sugar: i.sugar,
            sodium: i.sodium,
          })),
          totalCalories: m.totalCalories,
          totalProtein: m.totalProtein,
          totalCarbs: m.totalCarbs,
          totalFat: m.totalFat,
          totalFiber: m.totalFiber,
          totalSugar: m.totalSugar,
          totalSodium: m.totalSodium,
          aiConfidenceScore: m.aiConfidenceScore || undefined,
          imageUrl: m.imageUrl || undefined,
          voiceTranscript: m.voiceTranscript || undefined,
          feedback: m.aiNutritionFeedback || undefined,
        }));
      }
    } catch {
      // Postgres unreachable
    }

    return readLocalMeals();
  }
}
