/**
 * FitLens AI - Database Seeder Script
 * Usage: node scripts/seed-users.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const SEED_USERS = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    age: 27,
    gender: 'female',
    heightCm: 167.0,
    weightKg: 62.0,
    targetWeightKg: 57.5,
    activityLevel: 'MODERATE',
    goal: 'FAT_LOSS',
    dietaryPreference: 'VEGETARIAN',
    allergies: ['Peanuts'],
    medicalConditions: ['Mild PCOS'],
    targets: {
      calories: 1950,
      protein: 115,
      carbs: 210,
      fat: 55,
      fiber: 30,
      sugarLimit: 35,
      sodiumLimit: 2200,
      waterMl: 2800,
    },
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    age: 25,
    gender: 'male',
    heightCm: 178.0,
    weightKg: 76.5,
    targetWeightKg: 74.0,
    activityLevel: 'VERY_ACTIVE',
    goal: 'MUSCLE_BUILDING',
    dietaryPreference: 'HIGH_PROTEIN',
    allergies: [],
    medicalConditions: [],
    targets: {
      calories: 2650,
      protein: 165,
      carbs: 310,
      fat: 75,
      fiber: 35,
      sugarLimit: 40,
      sodiumLimit: 2400,
      waterMl: 3500,
    },
  },
  {
    name: 'Ananya Mehta',
    email: 'ananya.mehta@example.com',
    age: 30,
    gender: 'female',
    heightCm: 162.0,
    weightKg: 58.0,
    targetWeightKg: 55.0,
    activityLevel: 'LIGHT',
    goal: 'BODY_RECOMPOSITION',
    dietaryPreference: 'JAIN',
    allergies: ['Dairy'],
    medicalConditions: [],
    targets: {
      calories: 1820,
      protein: 105,
      carbs: 220,
      fat: 50,
      fiber: 32,
      sugarLimit: 30,
      sodiumLimit: 2000,
      waterMl: 2600,
    },
  },
];

async function seed() {
  console.log('🌱 Starting FitLens AI User Database Seeding...');

  // Try PostgreSQL via Prisma
  let pgSuccess = false;
  try {
    for (const u of SEED_USERS) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {
          name: u.name,
        },
        create: {
          email: u.email,
          name: u.name,
          profile: {
            create: {
              age: u.age,
              gender: u.gender,
              heightCm: u.heightCm,
              weightKg: u.weightKg,
              targetWeightKg: u.targetWeightKg,
              activityLevel: u.activityLevel,
              dietaryPreference: u.dietaryPreference,
              allergies: JSON.stringify(u.allergies),
              medicalConditions: JSON.stringify(u.medicalConditions),
              dailyCalorieTarget: u.targets.calories,
              dailyProteinTargetG: u.targets.protein,
              dailyCarbTargetG: u.targets.carbs,
              dailyFatTargetG: u.targets.fat,
              dailyFiberTargetG: u.targets.fiber,
              dailySugarLimitG: u.targets.sugarLimit,
              dailySodiumLimitMg: u.targets.sodiumLimit,
              dailyWaterTargetMl: u.targets.waterMl,
            },
          },
          goals: {
            create: {
              goalType: u.goal,
              targetCalories: u.targets.calories,
              targetProtein: u.targets.protein,
              targetCarbs: u.targets.carbs,
              targetFat: u.targets.fat,
            },
          },
        },
      });
      console.log(`✅ Seeded to PostgreSQL: ${u.name} (${u.email})`);
    }
    pgSuccess = true;
  } catch (err) {
    console.log('ℹ️  PostgreSQL service not reachable locally. Writing to local data store...');
  } finally {
    await prisma.$disconnect();
  }

  // Also write to local storage data/users.json so dev runs immediately
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const usersFile = path.join(dataDir, 'users.json');
  const localUsers = SEED_USERS.map((u, i) => ({
    id: 'user-seed-' + (i + 1),
    ...u,
    points: 150 + i * 50,
    currentStreak: 3 + i * 2,
    longestStreak: 10 + i * 2,
    bmr: 1450 + i * 100,
    tdee: 2100 + i * 200,
  }));

  fs.writeFileSync(usersFile, JSON.stringify(localUsers, null, 2));
  console.log(`✅ Seeded ${localUsers.length} users into local storage file: ${usersFile}`);
  console.log('🎉 Seeding completed successfully!');
}

seed();
