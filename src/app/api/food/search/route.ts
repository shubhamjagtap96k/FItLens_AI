import { NextRequest, NextResponse } from "next/server";
import { searchFoodDatabase } from "@/lib/db/food-database";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";

  const results = searchFoodDatabase(q, category);
  return NextResponse.json({ success: true, count: results.length, data: results });
}
