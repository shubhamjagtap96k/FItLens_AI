import { NextRequest, NextResponse } from "next/server";
import { MealRepository } from "@/lib/db/meal-repository";
import { MealLog } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, meal } = body;

    if (!meal || !meal.items || meal.items.length === 0) {
      return NextResponse.json(
        { error: "Invalid meal data. Must include items." },
        { status: 400 }
      );
    }

    const result = await MealRepository.saveMeal(userId || "user-priya-01", meal);

    return NextResponse.json({
      success: true,
      message: `Meal successfully saved to ${result.storageSource} Database!`,
      source: result.storageSource,
      data: result.meal,
    });
  } catch (error: any) {
    console.error("Failed to save meal:", error);
    return NextResponse.json(
      { error: "Failed to save meal to database", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;

    const meals = await MealRepository.getMeals(userId);
    return NextResponse.json({
      success: true,
      count: meals.length,
      data: meals,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch meals", details: error.message },
      { status: 500 }
    );
  }
}
