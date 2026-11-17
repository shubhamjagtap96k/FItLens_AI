import { NextRequest, NextResponse } from "next/server";
import { AIDietitianCoach } from "@/lib/ai/dietitian-coach";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, user, meals, workouts, totals } = body;

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const response = AIDietitianCoach.generateCoachResponse(
      query,
      user,
      meals || [],
      workouts || [],
      totals || {
        calories: 1800,
        protein: 95,
        carbs: 180,
        fat: 50,
        fiber: 25,
        sugar: 20,
        sodium: 1500,
        waterMl: 2200,
        caloriesBurned: 350,
        netCalories: 1450,
        remainingCalories: 200,
      }
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
