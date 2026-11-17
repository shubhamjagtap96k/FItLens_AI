import { NextRequest, NextResponse } from "next/server";
import { findFoodByBarcode } from "@/lib/db/food-database";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const barcode = searchParams.get("barcode");

  if (!barcode) {
    return NextResponse.json({ error: "Missing barcode" }, { status: 400 });
  }

  // 1. Check local verified database first
  const localMatch = findFoodByBarcode(barcode);
  if (localMatch) {
    return NextResponse.json({ success: true, source: "verified_db", data: localMatch });
  }

  // 2. Fallback to OpenFoodFacts live API lookup
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
      headers: { "User-Agent": "FitLensAI - Nutrition Tracker" },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.status === 1 && json.product) {
        const prod = json.product;
        const nutriments = prod.nutriments || {};

        return NextResponse.json({
          success: true,
          source: "openfoodfacts",
          data: {
            id: "off-" + barcode,
            name: prod.product_name || "Packaged Food",
            brand: prod.brands || "Unknown Brand",
            barcode: barcode,
            servingSize: 100,
            servingUnit: "g",
            calories: nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 150,
            proteinG: nutriments.proteins_100g || 0,
            carbsG: nutriments.carbohydrates_100g || 0,
            fatG: nutriments.fat_100g || 0,
            fiberG: nutriments.fiber_100g || 0,
            sugarG: nutriments.sugars_100g || 0,
            sodiumMg: Math.round((nutriments.sodium_100g || 0) * 1000),
            ingredients: prod.ingredients_text ? prod.ingredients_text.split(",") : [],
            imageUrl: prod.image_url,
          },
        });
      }
    }
  } catch (err) {
    console.warn("OpenFoodFacts fallback lookup failed:", err);
  }

  return NextResponse.json({ error: "Barcode not found in databases" }, { status: 404 });
}
