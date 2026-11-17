import { NextRequest, NextResponse } from "next/server";
import { WorkoutRepository } from "@/lib/db/workout-repository";
import { WorkoutLog } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, workout } = body;

    if (!workout || !workout.title) {
      return NextResponse.json(
        { error: "Invalid workout data." },
        { status: 400 }
      );
    }

    const result = await WorkoutRepository.saveWorkout(userId || "user-priya-01", workout);

    return NextResponse.json({
      success: true,
      message: `Workout successfully saved to ${result.storageSource} Database!`,
      source: result.storageSource,
      data: result.workout,
    });
  } catch (error: any) {
    console.error("Failed to save workout:", error);
    return NextResponse.json(
      { error: "Failed to save workout to database", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;

    const workouts = await WorkoutRepository.getWorkouts(userId);
    return NextResponse.json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch workouts", details: error.message },
      { status: 500 }
    );
  }
}
