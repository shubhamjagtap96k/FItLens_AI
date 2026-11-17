import { MealLog, WorkoutLog, BodyMeasurement, UserProfile } from "@/types";

export function exportDailyReportToCSV(
  user: UserProfile,
  meals: MealLog[],
  workouts: WorkoutLog[],
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    burned: number;
    water: number;
  }
) {
  const dateStr = new Date().toISOString().split("T")[0];
  let csv = `FitLens AI Daily Health Intelligence Report\n`;
  csv += `User: ${user.name} (${user.email})\n`;
  csv += `Date: ${dateStr}\n`;
  csv += `Goal: ${user.goal} | Target Calories: ${user.targets.calories} kcal\n\n`;

  csv += `--- NUTRITION SUMMARY ---\n`;
  csv += `Metric,Consumed,Target,Status\n`;
  csv += `Calories (kcal),${totals.calories},${user.targets.calories},${totals.calories <= user.targets.calories ? "Within Target" : "Over Target"}\n`;
  csv += `Protein (g),${totals.protein},${user.targets.protein},${totals.protein >= user.targets.protein ? "Goal Met" : "Deficit"}\n`;
  csv += `Carbs (g),${totals.carbs},${user.targets.carbs},OK\n`;
  csv += `Fat (g),${totals.fat},${user.targets.fat},OK\n`;
  csv += `Water (ml),${totals.water},${user.targets.waterMl},${totals.water >= user.targets.waterMl ? "Optimal" : "Needs Hydration"}\n`;
  csv += `Active Burned (kcal),${totals.burned},-,Burned\n`;
  csv += `Net Calories,${totals.calories - totals.burned},-,Net\n\n`;

  csv += `--- MEALS LOGGED ---\n`;
  csv += `Meal Type,Time,Dish Name,Quantity,Calories,Protein(g),Carbs(g),Fat(g)\n`;
  meals.forEach((meal) => {
    meal.items.forEach((item) => {
      csv += `"${meal.mealType}","${meal.loggedAt}","${item.name}","${item.quantity} ${item.unit}",${item.calories},${item.protein},${item.carbs},${item.fat}\n`;
    });
  });

  csv += `\n--- WORKOUTS & ACTIVITY ---\n`;
  csv += `Activity Type,Title,Duration(min),Calories Burned,Intensity,Source\n`;
  workouts.forEach((w) => {
    csv += `"${w.type}","${w.title}",${w.durationMinutes},${w.caloriesBurned},"${w.intensity}","${w.source}"\n`;
  });

  downloadBlob(csv, `FitLens_Daily_Report_${dateStr}.csv`, "text/csv;charset=utf-8;");
}

export function exportMonthlyReportToExcel(
  user: UserProfile,
  measurements: BodyMeasurement[]
) {
  const dateStr = new Date().toISOString().split("T")[0];
  let content = `FitLens AI - Monthly Health Intelligence Report\t\t\t\t\n`;
  content += `Member Name:\t${user.name}\tGenerated On:\t${dateStr}\n`;
  content += `Current Weight:\t${user.weightKg} kg\tTarget Weight:\t${user.targetWeightKg} kg\n`;
  content += `Dietary Preference:\t${user.dietaryPreference}\tActive Streak:\t${user.currentStreak} Days\n\n`;

  content += `Monthly Summary KPI\tValue\tTarget\tChange\n`;
  content += `Avg Daily Calories\t1,890 kcal\t${user.targets.calories} kcal\t-60 kcal (Deficit)\n`;
  content += `Avg Daily Protein\t118 g\t${user.targets.protein} g\t+3 g (Crushed)\n`;
  content += `Workout Consistency\t92%\t85%\t+7%\n`;
  content += `Total Fat Loss\t2.5 kg\t2.0 kg\tGoal Exceeded!\n`;
  content += `Best Nutrition Day\tFriday (Score 98/100)\t-\t-\n`;
  content += `Lowest Adherence Day\tSunday (Cheat Meal)\t-\t-\n\n`;

  content += `Date / Week\tWeight (kg)\tBody Fat (%)\tWaist (cm)\tHip (cm)\tChest (cm)\tNotes\n`;
  measurements.forEach((m) => {
    content += `${m.date}\t${m.weightKg}\t${m.bodyFatPct || "-"}\t${m.waistCm || "-"}\t${m.hipCm || "-"}\t${m.chestCm || "-"}\t"${m.notes || ""}"\n`;
  });

  downloadBlob(content, `FitLens_Monthly_Intelligence_${dateStr}.xls`, "application/vnd.ms-excel;charset=utf-8;");
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
