import { NextRequest, NextResponse } from "next/server";
import { VisionService } from "@/lib/ai/vision-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, mealType, portionMultiplier } = body;

    if (!image) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const result = await VisionService.analyzeFoodImage(image, {
      userMealType: mealType,
      portionMultiplier: portionMultiplier || 1.0,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Food scan error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image", details: error.message },
      { status: 500 }
    );
  }
}
