import {
  UserProfile,
  MealLog,
  WorkoutLog,
  DailyTotals,
  AICoachAlert,
} from "@/types";

export interface MealPlanDay {
  dayName: string;
  breakfast: { name: string; calories: number; protein: number; recipeNote: string };
  lunch: { name: string; calories: number; protein: number; recipeNote: string };
  snack: { name: string; calories: number; protein: number; recipeNote: string };
  dinner: { name: string; calories: number; protein: number; recipeNote: string };
  totalCalories: number;
  totalProtein: number;
}

export interface GeneratedRecipe {
  title: string;
  prepTimeMinutes: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  ingredientsUsed: string[];
  instructions: string[];
  proTip: string;
}

export class AIDietitianCoach {
  /**
   * Generates conversational responses for the Personal AI Coach chat interface
   */
  static generateCoachResponse(
    query: string,
    user: UserProfile,
    meals: MealLog[],
    workouts: WorkoutLog[],
    totals: DailyTotals
  ): {
    reply: string;
    suggestedFollowUps: string[];
  } {
    const q = query.toLowerCase();

    // 1. "How much protein did I eat today?"
    if (q.includes("protein") && (q.includes("eat") || q.includes("consume") || q.includes("how much") || q.includes("today"))) {
      const remainingProtein = Math.max(0, user.targets.protein - totals.protein);
      const isMet = remainingProtein === 0;

      const vegetarianSwaps = "paneer tikka (200g = 22g), a Greek yogurt bowl (22g), roasted edamame (14g), or a scoop of whey/plant isolate (25g)";
      const generalSwaps = user.dietaryPreference === "VEGAN"
        ? "tofu scramble, tempeh cubes, hemp seeds, or pea protein"
        : user.dietaryPreference === "VEGETARIAN"
        ? vegetarianSwaps
        : "grilled chicken breast (150g = 45g), 4 egg whites (15g), or wild salmon fillet (38g)";

      const reply = `You've consumed **${totals.protein.toFixed(1)}g of protein** so far today across ${meals.length} logged meals.

🎯 **Daily Goal:** ${user.targets.protein}g
${
  isMet
    ? `🎉 **Awesome work!** You've exceeded your daily target by ${(totals.protein - user.targets.protein).toFixed(1)}g. Your muscle protein synthesis is fully optimized for recovery.`
    : `⚖️ **Remaining to hit target:** ${remainingProtein.toFixed(1)}g needed.
    
💡 **Recommended Additions for Dinner/Snack:**
You can easily reach your target by having ${generalSwaps}.`
}`;

      return {
        reply,
        suggestedFollowUps: [
          "What should I eat after workout?",
          "Am I in calorie deficit?",
          "Suggest a diet plan for tomorrow",
        ],
      };
    }

    // 2. "What should I eat after workout?"
    if (q.includes("after workout") || q.includes("post workout") || q.includes("post-workout")) {
      const reply = `For optimal post-workout recovery within the 45-minute anabolic window, aim for a **3:1 or 2:1 ratio of fast-acting protein to complex carbs**:

1. **Hydration & Electrolytes:** Replenish 400-500ml of water with a pinch of Himalayan salt or coconut water.
2. **Protein (25-35g):** Whey/Plant Protein isolate shake or 200g Greek yogurt/steamed edamame. This triggers the mTOR pathway for muscle repair.
3. **Glycogen Replenishment (30-40g carbs):** 1 ripe banana, 2 whole grain toasts, or a bowl of steel-cut oatmeal with honey.

*Since your goal is ${user.goal.replace("_", " ")}, keeping post-workout fat intake low (<5g) will speed up amino acid absorption.*`;

      return {
        reply,
        suggestedFollowUps: [
          "How much protein did I eat today?",
          "Am I in calorie deficit?",
          "Suggest high protein snacks",
        ],
      };
    }

    // 3. "Am I in calorie deficit?"
    if (q.includes("deficit") || q.includes("surplus") || q.includes("calories remaining") || q.includes("calorie")) {
      const netCalories = totals.calories - totals.caloriesBurned;
      const deficitAgainstTDEE = user.tdee - netCalories;

      const reply = `Here is your real-time **Caloric Energy Balance** breakdown:

🔥 **TDEE (Maintenance):** ${user.tdee} kcal
📥 **Calories Consumed:** ${totals.calories} kcal
🏃 **Active Calories Burned:** ${totals.caloriesBurned} kcal
⚡ **Net Caloric Intake:** ${netCalories} kcal

${
  deficitAgainstTDEE > 0
    ? `✅ **Yes! You are currently in a deficit of ${deficitAgainstTDEE} kcal** relative to your maintenance burn. This puts you directly on pace for your target of **-0.5 kg fat loss per week** without sacrificing metabolic rate.`
    : `⚠️ **You are currently at a slight caloric surplus (+${Math.abs(deficitAgainstTDEE)} kcal).** Consider a 25-minute brisk walk or keeping tonight's dinner lighter in carbs.`
}

🎯 **Remaining to hit your daily target (${user.targets.calories} kcal):** ${Math.max(0, user.targets.calories - totals.calories)} kcal remaining.`;

      return {
        reply,
        suggestedFollowUps: [
          "How much protein did I eat today?",
          "Show my last month's report",
          "Suggest a diet plan for tomorrow",
        ],
      };
    }

    // 4. "Show my last month's report"
    if (q.includes("month") || q.includes("monthly") || q.includes("report") || q.includes("progress")) {
      const reply = `📊 **Monthly Intelligence Summary (Last 30 Days):**

- **Total Weight Lost:** -2.5 kg (64.5 kg ➔ 62.0 kg) 📉
- **Body Fat Change:** 26.2% ➔ 24.1% (-2.1% reduction)
- **Waist Circumference:** -3.3 cm reduction
- **Average Daily Protein:** 118g (Target was 115g — 102% consistency!)
- **Workout Consistency Score:** 92% (23 workouts logged out of 25 planned)
- **Best Day:** Last Friday (Nutrition Score 98/100, zero excess sugar)
- **Projected 30-Day Outlook:** On track to reach **59.5 kg** by next month at current rate!

*You can download the full PDF/Excel copy anytime from the Reports tab.*`;

      return {
        reply,
        suggestedFollowUps: [
          "Suggest a diet plan for tomorrow",
          "Am I in calorie deficit?",
          "How is my fasting score?",
        ],
      };
    }

    // 5. "Suggest a diet plan for tomorrow"
    if (q.includes("diet plan") || q.includes("tomorrow") || q.includes("meal plan") || q.includes("what should i eat")) {
      const reply = `Here is your customized **High-Protein ${user.dietaryPreference} Day Plan** tailored for **${user.targets.calories} kcal**:

🌅 **Breakfast (08:30 AM) • 420 kcal | 28g Protein**
• Overnight chia-protein oats with Greek yogurt, blueberries, and 5 crushed almonds.

🥗 **Lunch (01:15 PM) • 580 kcal | 38g Protein**
• Grilled Paneer / Tofu Tikka bowl with spiced quinoa, baby spinach, roasted bell peppers, and lemon-mint dressing.

🍎 **Snack (04:45 PM) • 210 kcal | 20g Protein**
• 1 scoop Plant/Whey isolate shake with iced espresso or roasted edamame cup.

🍲 **Dinner (08:00 PM) • 490 kcal | 32g Protein**
• Moong Dal & Spinach Khichdi with a bowl of cucumber raita and grilled cottage cheese cubes.

💧 **Hydration Goal:** 2.8 Liters with electrolytes.`;

      return {
        reply,
        suggestedFollowUps: [
          "Generate a grocery list for this plan",
          "How much protein did I eat today?",
          "Am I in calorie deficit?",
        ],
      };
    }

    // Default intelligent coach response
    return {
      reply: `I'm analyzing your real-time nutrition and health metrics! Today you've logged **${totals.calories} kcal** and **${totals.protein}g protein** with **${totals.waterMl}ml water**. You're actively crushing your **${user.goal.replace("_", " ")}** goals. 

Feel free to ask me to analyze specific meals, tweak your macro splits, review your workout recovery, or generate a tailored grocery list!`,
      suggestedFollowUps: [
        "How much protein did I eat today?",
        "What should I eat after workout?",
        "Am I in calorie deficit?",
        "Suggest a diet plan for tomorrow",
      ],
    };
  }

  /**
   * Generates smart grocery list based on dietary preferences
   */
  static generateGroceryList(user: UserProfile): Record<string, string[]> {
    if (user.dietaryPreference === "VEGETARIAN" || user.dietaryPreference === "JAIN") {
      return {
        "High Protein Sources": [
          "Fresh Paneer / Cottage Cheese (Low Fat)",
          "Greek Yogurt 0% (Plain)",
          "Edamame beans (Frozen)",
          "Sprouted Moong Beans",
          "Whey or Pea Protein Isolate (Chocolate/Vanilla)",
          "Tofu (Extra Firm)",
        ],
        "Fresh Produce & Greens": [
          "Baby Spinach & Kale",
          "Bell Peppers (Red & Yellow)",
          "Avocados (Hass)",
          "Fresh Blueberries & Strawberries",
          "Cucumbers & Cherry Tomatoes",
          "Lemons & Fresh Mint",
        ],
        "Complex Carbohydrates": [
          "Rolled Steel-Cut Oats",
          "Artisan Sourdough Loaf",
          "Tricolor Quinoa",
          "Brown Basmati Rice",
          "Whole Wheat Multigrain Atta",
        ],
        "Healthy Fats & Pantry": [
          "Extra Virgin Olive Oil",
          "Raw Chia Seeds & Flaxseeds",
          "Almonds & Walnuts",
          "Pink Himalayan Salt",
          "Cumin Seeds, Turmeric & Garam Masala",
        ],
      };
    }

    return {
      "High Protein Sources": [
        "Skinless Boneless Chicken Breast",
        "Wild Caught Atlantic Salmon Fillets",
        "Free Range Eggs (Large)",
        "Greek Yogurt 0% Plain",
        "Whey Protein Isolate",
        "Lean Ground Turkey 93/7",
      ],
      "Fresh Produce": [
        "Broccoli Crowns",
        "Avocados",
        "Fresh Spinach",
        "Asparagus Spears",
        "Mixed Berries",
      ],
      "Complex Carbs & Grains": [
        "Organic Rolled Oats",
        "Quinoa",
        "Sweet Potatoes",
        "Jasmine Brown Rice",
      ],
      "Healthy Fats & Seasonings": [
        "Extra Virgin Olive Oil",
        "Almonds",
        "Dijon Mustard",
        "Garlic & Fresh Herbs",
      ],
    };
  }

  /**
   * Bonus AI Feature 8: AI recipe creator from available pantry ingredients
   */
  static generateRecipeFromIngredients(
    ingredientsInput: string,
    preference: string
  ): GeneratedRecipe {
    const items = ingredientsInput.split(",").map((s) => s.trim()).filter(Boolean);

    return {
      title: "Chef's High-Protein Golden Sauté with Herbs",
      prepTimeMinutes: 15,
      calories: 380,
      proteinG: 34,
      carbsG: 18,
      fatG: 14,
      ingredientsUsed: items.length > 0 ? items : ["Paneer / Tofu", "Spinach", "Garlic", "Olive Oil", "Cumin"],
      instructions: [
        "Heat 1 teaspoon of olive oil in a non-stick skillet over medium heat.",
        "Add minced garlic, cumin seeds, and sauté for 60 seconds until fragrant.",
        "Cube your protein source (paneer/tofu/chicken) and sear each side for 3-4 minutes until golden.",
        "Toss in remaining vegetables and greens; cover with lid for 2 minutes to gently steam.",
        "Season with pink salt, cracked black pepper, and a fresh squeeze of lemon juice. Serve hot!",
      ],
      proTip: "Pair with a side of steamed quinoa or 1 warm whole wheat roti to complete your daily complex carbohydrate intake.",
    };
  }
}
