/**
 * FitLens AI - Neon PostgreSQL Verification Script
 * Tests live queries: User fetch, MealLog insertion, WorkoutLog insertion.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Testing Live Neon PostgreSQL Connection...');

  try {
    // 1. Fetch Users
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        goals: true,
      },
    });
    console.log(`✅ Successfully queried Neon DB! Found ${users.length} users:`);
    users.forEach((u) => {
      console.log(`   - ${u.name} (${u.email}) | Goal: ${u.goals?.[0]?.goalType || 'N/A'}`);
    });

    if (users.length === 0) {
      throw new Error('No users found in database');
    }

    const priya = users.find((u) => u.email === 'priya.sharma@example.com') || users[0];

    // 2. Insert a MealLog with items
    const meal = await prisma.mealLog.create({
      data: {
        userId: priya.id,
        mealType: 'BREAKFAST',
        loggedAt: new Date(),
        totalCalories: 450,
        totalProtein: 25.5,
        totalCarbs: 52.0,
        totalFat: 14.0,
        totalFiber: 7.5,
        totalSugar: 8.0,
        totalSodium: 380,
        aiConfidenceScore: 0.95,
        aiNutritionFeedback: 'Excellent protein-rich breakfast! Good balance of complex carbs and healthy fats.',
        items: {
          create: [
            {
              foodName: 'Stuffed Paneer Paratha',
              unit: '1 paratha (120g)',
              calories: 320,
              protein: 15.0,
              carbs: 40.0,
              fat: 11.0,
              fiber: 5.0,
              sugar: 2.0,
              sodium: 310,
            },
            {
              foodName: 'Greek Yogurt (Plain)',
              unit: '100g',
              calories: 130,
              protein: 10.5,
              carbs: 12.0,
              fat: 3.0,
              fiber: 2.5,
              sugar: 6.0,
              sodium: 70,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    console.log(`✅ Successfully created MealLog in Neon DB! ID: ${meal.id}`);
    console.log(`   Items: ${meal.items.map(f => f.foodName).join(', ')}`);
    console.log(`   Calories: ${meal.totalCalories} kcal, Protein: ${meal.totalProtein}g`);

    // 3. Insert a WorkoutLog
    const workout = await prisma.workoutLog.create({
      data: {
        userId: priya.id,
        workoutType: 'GYM',
        title: 'Morning Upper Body & Core Strength',
        durationMinutes: 45,
        caloriesBurned: 320,
        intensity: 'HIGH',
        notes: 'Felt strong, progressive overload on dumbbell chest press',
        exercises: {
          create: [
            {
              exerciseName: 'Dumbbell Bench Press',
              sets: 4,
              reps: 10,
              weightKg: 18.0,
            },
            {
              exerciseName: 'Plank Hold',
              sets: 3,
              reps: 60,
              weightKg: 0,
            },
          ],
        },
      },
      include: {
        exercises: true,
      },
    });

    console.log(`✅ Successfully created WorkoutLog in Neon DB! ID: ${workout.id}`);
    console.log(`   Workout: ${workout.title} (${workout.durationMinutes} mins, ${workout.caloriesBurned} kcal burned)`);

    // 4. Verify Total Counts in Neon DB
    const mealCount = await prisma.mealLog.count();
    const workoutCount = await prisma.workoutLog.count();
    console.log(`\n🎉 Verification Complete! All data is actively streaming to Neon PostgreSQL!`);
    console.log(`   Total Users in Neon DB: ${users.length}`);
    console.log(`   Total Meal Logs in Neon DB: ${mealCount}`);
    console.log(`   Total Workout Logs in Neon DB: ${workoutCount}`);

  } catch (err) {
    console.error('❌ Neon DB Verification Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
