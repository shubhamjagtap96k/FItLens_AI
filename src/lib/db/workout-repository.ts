import { prisma } from "@/lib/db/prisma";
import { WorkoutLog, WorkoutType, SyncSource } from "@/types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const WORKOUTS_FILE = path.join(DATA_DIR, "workouts.json");

function ensureLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(WORKOUTS_FILE)) {
    fs.writeFileSync(WORKOUTS_FILE, JSON.stringify([], null, 2));
  }
}

function readLocalWorkouts(): WorkoutLog[] {
  try {
    ensureLocalStore();
    const data = fs.readFileSync(WORKOUTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeLocalWorkouts(workouts: WorkoutLog[]) {
  try {
    ensureLocalStore();
    fs.writeFileSync(WORKOUTS_FILE, JSON.stringify(workouts, null, 2));
  } catch (err) {
    console.error("Could not write local workouts file:", err);
  }
}

export class WorkoutRepository {
  /**
   * Save a workout into PostgreSQL / Online Database
   */
  static async saveWorkout(
    userId: string,
    workout: WorkoutLog
  ): Promise<{ workout: WorkoutLog; storageSource: "PostgreSQL" | "Local_DB" }> {
    try {
      let validUserId = userId;
      const userExists = await prisma.user.findFirst({ where: { id: userId } });
      if (!userExists) {
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
          validUserId = firstUser.id;
        } else {
          const created = await prisma.user.create({
            data: { email: "priya.sharma@example.com", name: "Priya Sharma" },
          });
          validUserId = created.id;
        }
      }

      const dbWorkout = await prisma.workoutLog.create({
        data: {
          userId: validUserId,
          workoutType: workout.type as any,
          title: workout.title,
          durationMinutes: workout.durationMinutes,
          distanceKm: workout.distanceKm || null,
          caloriesBurned: workout.caloriesBurned,
          intensity: workout.intensity || "MODERATE",
          source: (workout.source as any) || "MANUAL",
          notes: workout.notes || null,
          exercises: workout.exercises && workout.exercises.length > 0 ? {
            create: workout.exercises.map((ex) => ({
              exerciseName: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              weightKg: ex.weightKg || 0,
            })),
          } : undefined,
        },
        include: { exercises: true },
      });

      const formatted: WorkoutLog = {
        id: dbWorkout.id,
        type: dbWorkout.workoutType as WorkoutType,
        title: dbWorkout.title,
        durationMinutes: dbWorkout.durationMinutes,
        distanceKm: dbWorkout.distanceKm || undefined,
        caloriesBurned: dbWorkout.caloriesBurned,
        intensity: dbWorkout.intensity as any,
        source: dbWorkout.source as SyncSource,
        notes: dbWorkout.notes || undefined,
        loggedAt: "Just now",
        exercises: dbWorkout.exercises.map((e) => ({
          name: e.exerciseName,
          sets: e.sets,
          reps: e.reps,
          weightKg: e.weightKg,
        })),
      };

      return { workout: formatted, storageSource: "PostgreSQL" };
    } catch (err) {
      console.warn("PostgreSQL unreachable, saving workout to local store:", err);
      const local = readLocalWorkouts();
      local.unshift(workout);
      writeLocalWorkouts(local);
      return { workout, storageSource: "Local_DB" };
    }
  }

  static async getWorkouts(userId?: string): Promise<WorkoutLog[]> {
    try {
      const dbWorkouts = await prisma.workoutLog.findMany({
        where: userId ? { userId } : undefined,
        include: { exercises: true },
        orderBy: { loggedAt: "desc" },
        take: 30,
      });

      if (dbWorkouts && dbWorkouts.length > 0) {
        return dbWorkouts.map((w) => ({
          id: w.id,
          type: w.workoutType as WorkoutType,
          title: w.title,
          durationMinutes: w.durationMinutes,
          distanceKm: w.distanceKm || undefined,
          caloriesBurned: w.caloriesBurned,
          intensity: w.intensity as any,
          source: w.source as SyncSource,
          notes: w.notes || undefined,
          loggedAt: w.loggedAt.toLocaleDateString(),
          exercises: w.exercises.map((e) => ({
            name: e.exerciseName,
            sets: e.sets,
            reps: e.reps,
            weightKg: e.weightKg,
          })),
        }));
      }
    } catch {
      // fallback
    }

    return readLocalWorkouts();
  }
}
