import { prisma } from "@/lib/db/prisma";
import { UserProfile, GoalType, DietaryPreference, ActivityLevel } from "@/types";
import { calculateBMR, calculateTDEE, calculateGoalTargets } from "@/lib/utils/nutrition-calc";
import fs from "fs";
import path from "path";

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  activityLevel?: ActivityLevel;
  goal?: GoalType;
  dietaryPreference?: DietaryPreference;
  allergies?: string[];
  medicalConditions?: string[];
}

// Fallback local storage directory when PostgreSQL is not connected locally
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
}

function readLocalUsers(): UserProfile[] {
  try {
    ensureLocalStore();
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.warn("Could not read local users file:", err);
    return [];
  }
}

function writeLocalUsers(users: UserProfile[]) {
  try {
    ensureLocalStore();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Could not write to local users file:", err);
  }
}

export class UserRepository {
  /**
   * Creates a user in the Database (PostgreSQL via Prisma)
   * With automatic fallback to local persistent store if DB is offline
   */
  static async createUser(input: CreateUserInput): Promise<{
    user: UserProfile;
    storageSource: "PostgreSQL" | "Local_DB";
  }> {
    const age = input.age || 28;
    const gender = input.gender || "female";
    const heightCm = input.heightCm || 168.0;
    const weightKg = input.weightKg || 64.5;
    const targetWeightKg = input.targetWeightKg || 59.0;
    const activityLevel = input.activityLevel || "MODERATE";
    const goal = input.goal || "FAT_LOSS";
    const dietaryPreference = input.dietaryPreference || "VEGETARIAN";
    const allergies = input.allergies || [];
    const medicalConditions = input.medicalConditions || [];

    // Calculate BMR, TDEE & macro targets
    const bmr = calculateBMR(gender, weightKg, heightCm, age);
    const tdee = calculateTDEE(bmr, activityLevel);
    const targets = calculateGoalTargets(tdee, weightKg, goal);

    const generatedId = "user-" + Date.now();

    // 1. Try saving to PostgreSQL via Prisma
    try {
      const dbUser = await prisma.user.create({
        data: {
          email: input.email.toLowerCase().trim(),
          name: input.name.trim(),
          passwordHash: input.password || "hashed_pass_placeholder",
          profile: {
            create: {
              age,
              gender,
              heightCm,
              weightKg,
              targetWeightKg,
              activityLevel,
              dietaryPreference,
              allergies: JSON.stringify(allergies),
              medicalConditions: JSON.stringify(medicalConditions),
              dailyCalorieTarget: targets.calories,
              dailyProteinTargetG: targets.protein,
              dailyCarbTargetG: targets.carbs,
              dailyFatTargetG: targets.fat,
              dailyFiberTargetG: targets.fiber,
              dailySugarLimitG: targets.sugarLimit,
              dailySodiumLimitMg: targets.sodiumLimit,
              dailyWaterTargetMl: targets.waterMl,
              bmr,
              tdee,
            },
          },
          goals: {
            create: {
              goalType: goal,
              targetCalories: targets.calories,
              targetProtein: targets.protein,
              targetCarbs: targets.carbs,
              targetFat: targets.fat,
            },
          },
        },
        include: {
          profile: true,
          goals: true,
        },
      });

      const userProfile: UserProfile = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        age: dbUser.profile?.age || age,
        gender: (dbUser.profile?.gender as any) || gender,
        heightCm: dbUser.profile?.heightCm || heightCm,
        weightKg: dbUser.profile?.weightKg || weightKg,
        targetWeightKg: dbUser.profile?.targetWeightKg || targetWeightKg,
        activityLevel: (dbUser.profile?.activityLevel as any) || activityLevel,
        goal: (dbUser.goals[0]?.goalType as any) || goal,
        dietaryPreference: (dbUser.profile?.dietaryPreference as any) || dietaryPreference,
        allergies,
        medicalConditions,
        targets,
        points: dbUser.points,
        currentStreak: dbUser.currentStreak,
        longestStreak: dbUser.longestStreak,
        bmr,
        tdee,
      };

      return { user: userProfile, storageSource: "PostgreSQL" };
    } catch (dbError) {
      console.warn("PostgreSQL not accessible, persisting to local database storage:", dbError);

      // 2. Fallback to Local Persistent File Storage
      const newUserProfile: UserProfile = {
        id: generatedId,
        name: input.name.trim(),
        email: input.email.toLowerCase().trim(),
        age,
        gender,
        heightCm,
        weightKg,
        targetWeightKg,
        activityLevel,
        goal,
        dietaryPreference,
        allergies,
        medicalConditions,
        targets,
        points: 150,
        currentStreak: 1,
        longestStreak: 1,
        bmr,
        tdee,
      };

      const existingUsers = readLocalUsers();
      // Check for email collision
      const index = existingUsers.findIndex(u => u.email === newUserProfile.email);
      if (index >= 0) {
        existingUsers[index] = newUserProfile;
      } else {
        existingUsers.push(newUserProfile);
      }
      writeLocalUsers(existingUsers);

      return { user: newUserProfile, storageSource: "Local_DB" };
    }
  }

  /**
   * Retrieves all users from DB
   */
  static async getAllUsers(): Promise<UserProfile[]> {
    try {
      const dbUsers = await prisma.user.findMany({
        include: {
          profile: true,
          goals: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (dbUsers.length > 0) {
        return dbUsers.map((u) => {
          const prof = u.profile;
          const targets = prof
            ? {
                calories: prof.dailyCalorieTarget,
                protein: prof.dailyProteinTargetG,
                carbs: prof.dailyCarbTargetG,
                fat: prof.dailyFatTargetG,
                fiber: prof.dailyFiberTargetG,
                sugarLimit: prof.dailySugarLimitG,
                sodiumLimit: prof.dailySodiumLimitMg,
                waterMl: prof.dailyWaterTargetMl,
              }
            : calculateGoalTargets(2000, 65, "FAT_LOSS");

          return {
            id: u.id,
            name: u.name,
            email: u.email,
            age: prof?.age || 28,
            gender: (prof?.gender as any) || "female",
            heightCm: prof?.heightCm || 168,
            weightKg: prof?.weightKg || 65,
            targetWeightKg: prof?.targetWeightKg || 60,
            activityLevel: (prof?.activityLevel as any) || "MODERATE",
            goal: (u.goals[0]?.goalType as any) || "FAT_LOSS",
            dietaryPreference: (prof?.dietaryPreference as any) || "VEGETARIAN",
            allergies: prof?.allergies ? JSON.parse(prof.allergies) : [],
            medicalConditions: prof?.medicalConditions ? JSON.parse(prof.medicalConditions) : [],
            targets,
            points: u.points,
            currentStreak: u.currentStreak,
            longestStreak: u.longestStreak,
            bmr: prof?.bmr || 1500,
            tdee: prof?.tdee || 2100,
          };
        });
      }
    } catch {
      // Postgres not available, fallback
    }

    return readLocalUsers();
  }

  /**
   * Find single user by ID
   */
  static async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const u = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true, goals: true },
      });

      if (u) {
        const prof = u.profile;
        const targets = prof
          ? {
              calories: prof.dailyCalorieTarget,
              protein: prof.dailyProteinTargetG,
              carbs: prof.dailyCarbTargetG,
              fat: prof.dailyFatTargetG,
              fiber: prof.dailyFiberTargetG,
              sugarLimit: prof.dailySugarLimitG,
              sodiumLimit: prof.dailySodiumLimitMg,
              waterMl: prof.dailyWaterTargetMl,
            }
          : calculateGoalTargets(2000, 65, "FAT_LOSS");

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          age: prof?.age || 28,
          gender: (prof?.gender as any) || "female",
          heightCm: prof?.heightCm || 168,
          weightKg: prof?.weightKg || 65,
          targetWeightKg: prof?.targetWeightKg || 60,
          activityLevel: (prof?.activityLevel as any) || "MODERATE",
          goal: (u.goals[0]?.goalType as any) || "FAT_LOSS",
          dietaryPreference: (prof?.dietaryPreference as any) || "VEGETARIAN",
          allergies: prof?.allergies ? JSON.parse(prof.allergies) : [],
          medicalConditions: prof?.medicalConditions ? JSON.parse(prof.medicalConditions) : [],
          targets,
          points: u.points,
          currentStreak: u.currentStreak,
          longestStreak: u.longestStreak,
          bmr: prof?.bmr || 1500,
          tdee: prof?.tdee || 2100,
        };
      }
    } catch {
      // fallback
    }

    const localUsers = readLocalUsers();
    return localUsers.find(u => u.id === userId) || null;
  }
}
