# FitLens AI — Intelligent AI-Powered Nutrition, Calorie & Health Tracker

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-AKS-326CE5?style=for-the-badge&logo=kubernetes)](https://kubernetes.io/)

FitLens AI is an advanced, production-grade health and fitness web & mobile platform designed to help users track daily nutrition, calorie intake, macronutrients, micronutrients, hydration, workouts, body measurements, intermittent fasting, and long-term metabolic health using multi-model AI computer vision (Google Gemini Vision, OpenAI GPT-4o, Claude 3.5 Sonnet) and continuous personalized dietitian coaching.

---

## 📑 Table of Contents

1. [Key Features Overview](#-key-features-overview)
2. [Application Usage Instructions (Step-by-Step Guide)](#-application-usage-instructions-step-by-step-guide)
   - [1. Food Scanning with AI Vision](#1-food-scanning-with-ai-vision)
   - [2. Automated Meal Classification](#2-automated-meal-classification)
   - [3. Reading the Apple Health Nutrition Rings](#3-reading-the-apple-health-nutrition-rings)
   - [4. AI Nutrition Coach Continuous Warnings & Alerts](#4-ai-nutrition-coach-continuous-warnings--alerts)
   - [5. Chatting with Personal AI Dietitian](#5-chatting-with-personal-ai-dietitian)
   - [6. Intermittent Fasting Tracker & Metabolic Stages](#6-intermittent-fasting-tracker--metabolic-stages)
   - [7. Smart Hydration Tracking](#7-smart-hydration-tracking)
   - [8. Workout Logging & Wearable Device Sync](#8-workout-logging--wearable-device-sync)
   - [9. Body Measurements & AI 30-Day Projections](#9-body-measurements--ai-30-day-projections)
   - [10. Generating & Exporting Health Intelligence Reports](#10-generating--exporting-health-intelligence-reports)
   - [11. Barcode Scanning & Smart Food Database Lookup](#11-barcode-scanning--smart-food-database-lookup)
   - [12. Hands-Free Voice Meal Logging](#12-hands-free-voice-meal-logging)
   - [13. AI Restaurant Menu Scanner](#13-ai-restaurant-menu-scanner)
   - [14. AI Meal Planner, Grocery List & Pantry Recipe Creator](#14-ai-meal-planner-grocery-list--pantry-recipe-creator)
   - [15. Challenges, Habit Streaks & Gamification](#15-challenges-habit-streaks--gamification)
   - [16. User Profile, Goals & Dietary Preference Configuration](#16-user-profile-goals--dietary-preference-configuration)
   - [17. Executive Administration Console](#17-executive-administration-console)
3. [Quick Start & Local Setup](#-quick-start--local-setup)
4. [Docker & Containerized Deployment](#-docker--containerized-deployment)
5. [Kubernetes Production Deployment (AKS/EKS/GKE)](#-kubernetes-production-deployment-akseksgke)
6. [Environment Variables Reference](#-environment-variables-reference)
7. [REST API Specifications](#-rest-api-specifications)
8. [Architecture & Engineering Blueprint](#-architecture--engineering-blueprint)

---

## 🌟 Key Features Overview

- **Multi-Model Vision Pipeline**: Computer vision engine with automated fallback to extract dish names, ingredients, portion sizes, calories, macros, and micronutrients with confidence scoring.
- **Apple Health 3-Ring Visualizer**: Real-time animated SVG rings tracking active calories, protein targets, and hydration.
- **Continuous AI Nutrition Coach**: Live deficit alerts, fiber adequacy tracking, sugar/sodium ceiling warnings, and food swap suggestions.
- **Biometric Health Chatbot**: Context-aware AI coach knowing your real-time caloric balance, logged meals, and workout burn.
- **Intermittent Fasting Tracker**: Real-time timer mapping progress across Anabolic, Catabolic, Fat Oxidation, and Autophagy phases.
- **Wearable Health Sync**: Integrates with Apple Health, Google Fit, Garmin, Fitbit, and Samsung Health.
- **30-Day Forward Predictive Modeling**: Calculates expected weight and goal achievement probability using cumulative caloric energy formulas.
- **Multi-Format Export Engine**: One-click export of daily and monthly reports to print-ready PDF, Excel (`.xls`), and CSV (`.csv`).
- **Comprehensive Database**: Rich database of authentic Indian recipes, global fitness staples, restaurant foods, and OpenFoodFacts barcodes.
- **Bonus Capabilities**: Restaurant menu scanner, grocery item rater, barcode scanner, voice meal logger, 7-day meal planner, smart grocery list, and pantry recipe generator.

---

## 📖 Application Usage Instructions (Step-by-Step Guide)

### 1. Food Scanning with AI Vision
How to log meals using your device camera or uploaded image:
1. Click the glowing green **"Scan Food"** button in the top navigation bar, floating mobile button, or sidebar.
2. In the modal, you have two options:
   - **Upload or Snap Photo**: Click the dashed upload area to take a photo using your phone/webcam or upload an existing image (`.jpg`, `.png`, `.webp`).
   - **Sample Meals**: Click any preset (e.g., *Paneer Tikka*, *Grilled Chicken Salad*, *Avocado Poached Egg*, *Dal Khichdi*, or *Berry Oatmeal Bowl*) for instant demonstration.
3. The AI Vision Engine will display an animated laser scan reticle while analyzing the image.
4. **Review & Customization Screen**:
   - **Confidence Score**: View the identification confidence (e.g., `94% AI Confidence`).
   - **Edit Title**: Click the edit pencil icon next to the food name to rename or customize it.
   - **Portion Size Slider**: Drag the portion slider between `0.5x` (light), `1.0x` (standard), `2.0x` (double), or `3.0x` (large). Notice how calories, protein, carbs, fats, fiber, and sodium recalculate in real time.
   - **Meal Classification**: Select whether this food is for Breakfast, Lunch, Dinner, Snacks, Pre-Workout, or Post-Workout.
   - **Micronutrients & Ingredients**: Review identified ingredients and allergen warnings (e.g., Dairy, Gluten, Nuts).
5. Click **"Confirm & Log Meal"**. Confetti will fire, and your meal will instantly update your daily totals, macro progress bars, and Apple Health rings!

---

### 2. Automated Meal Classification
Organize your daily intake by category:
- Food entries automatically default to the appropriate meal slot based on the current time of day:
  - **06:00 AM – 11:00 AM**: `BREAKFAST` (Yellow badge)
  - **11:00 AM – 03:30 PM**: `LUNCH` (Emerald badge)
  - **03:30 PM – 06:30 PM**: `SNACKS` (Cyan badge)
  - **06:30 PM – 11:00 PM**: `DINNER` (Purple badge)
  - **Workout Windows**: `PRE_WORKOUT` (Orange badge) or `POST_WORKOUT` (Rose badge)
- In the **"Today's Classified Meals"** list, you can view each meal with its photo thumbnail, timestamp, macro breakdown, and dietitian feedback note.

---

### 3. Reading the Apple Health Nutrition Rings
The dashboard features an Apple Watch / Apple Health inspired 3-ring visualizer:
- **Red / Orange Outer Ring (Calories)**:
  - Tracks total calories consumed against your daily target budget (e.g., `1,890 / 1,950 kcal`).
  - Ring completes at 100% when you reach your target.
- **Neon Green Middle Ring (Protein)**:
  - Tracks dietary protein intake in grams against your muscle preservation/growth target (e.g., `118g / 115g`).
  - Stretches past 100% with a glowing overlap if you exceed your protein goal.
- **Aqua / Cyan Inner Ring (Water)**:
  - Tracks hydration volume against your daily fluid goal (e.g., `2.1L / 2.8L`).
- **Center Health Score**:
  - Displays your composite **Daily Health Score (0–100)** calculated based on calorie balance, protein target, fiber sufficiency, and sugar/sodium moderation.

---

### 4. AI Nutrition Coach Continuous Warnings & Alerts
FitLens AI continuously audits your logged nutrients in real time:
- **Protein Deficiency Alert**: If your remaining meals cannot reasonably cover your protein target, the coach displays a red warning:
  > *"You have consumed only 71.9g of protein today while your goal is 115g. Add paneer tikka, 3 boiled egg whites, edamame bowl, or a scoop of whey/plant protein for dinner."*
- **Sugar & Sodium Limit Alerts**: Triggered if sodium exceeds `2,200mg` or added sugar exceeds `36g`, prompting heart-healthy alternatives.
- **Fiber Adequacy Badge**: Highlights positive gut health when soluble fiber targets (`30g+`) are achieved.
- Click **"Chat Coach"** on any alert card to immediately ask the AI how to resolve the issue.

---

### 5. Chatting with Personal AI Dietitian
1. Click **"Coach"** in the top navbar or select the **AI Nutrition Coach** card.
2. The coach possesses full real-time awareness of:
   - Your age, gender, height, current weight, and target weight
   - Your goal (e.g., Fat Loss, Muscle Building, Recomposition)
   - Your dietary preferences (e.g., Vegetarian, Vegan, Jain, Keto)
   - Today's logged meals, active burned calories, and net deficit
3. **Preset One-Tap Prompts**:
   - *"How much protein did I eat today?"*
   - *"What should I eat after workout?"*
   - *"Am I in calorie deficit?"*
   - *"Suggest a diet plan for tomorrow"*
   - *"Show my last month's report"*
4. Type any custom question in natural language (e.g., *"Can I eat a bowl of poha for breakfast without ruining my keto deficit?"*) and receive immediate, scientifically grounded advice.

---

### 6. Intermittent Fasting Tracker & Metabolic Stages
1. Locate the **Intermittent Fasting** widget on the dashboard.
2. Select your protocol: **16:8**, **18:6**, **20:4 (Warrior)**, **OMAD (23:1)**, or **Circadian (12:12)**.
3. Click **"Start Fast"** when you finish your last meal of the day.
4. Watch the live timer track elapsed hours and progress along your target.
5. The widget explains your current internal metabolic stage:
   - **0–4 Hours (Anabolic Fed State)**: Food is actively digested; glucose and insulin are elevated.
   - **4–12 Hours (Catabolic Phase)**: Insulin levels fall to baseline; glycogen mobilization begins.
   - **12–16 Hours (Fat Oxidation Zone)**: Liver glycogen depletes; body shifts to burning fatty acids and ketones.
   - **16+ Hours (Autophagy & Cellular Renewal)**: Cellular clean-up activates, recycling damaged mitochondria.
6. Click **"End Fast"** when you break your fast with your first meal.

---

### 7. Smart Hydration Tracking
1. The **Smart Hydration** card displays your current fluid intake vs. target (e.g., `2.10 / 2.8L`).
2. The card features an interactive animated wave background that rises as you drink.
3. **Quick-Add Buttons**:
   - `+250 ml` (Standard Glass)
   - `+500 ml` (Fitness Water Bottle)
   - `+750 ml` (Large Flask / Shaker)
4. Tapping any button increments your total, updates the inner Aqua ring, and updates your hydration challenge streak.

---

### 8. Workout Logging & Wearable Device Sync
1. Navigate to the **Workouts & Sync** tab from the sidebar or mobile menu.
2. View total active burn calories, total workout duration, and wearable sync status.
3. **Health Device Sync**:
   - View connection status for Apple Health, Google Fit, Garmin, Fitbit, and Samsung Health.
   - Click the sync button to simulate refreshing heart rate and active calories.
4. **Log a Workout**:
   - Click **"Log Workout"**.
   - Select activity type: `GYM`, `RUNNING`, `WALKING`, `CYCLING`, `SWIMMING`, `YOGA`, or `SPORTS`.
   - Enter session title, duration in minutes, and calories burned.
   - For Gym sessions: Add strength exercise entries (Exercise Name, Sets, Reps, Weight in kg).
   - Click **"Save Workout"** to log the session and immediately deduct burned calories from your net caloric intake.

---

### 9. Body Measurements & AI 30-Day Projections
1. Navigate to the **Body Progress** tab.
2. **Key Metric Cards**: View Current Weight, Target Goal Weight, Body Fat %, and Waist Circumference with total change indicators.
3. **30-Day SVG Trend Graph**: Examine your historical weigh-in trajectory with interactive milestone dots.
4. **AI Predictive Engine**:
   - View your **Projected Weight in 30 Days** (e.g., `59.5 kg`) calculated using your average daily caloric deficit.
   - Check your **Goal Achievement Probability** (e.g., `94% Confidence`).
5. **Log New Weigh-In**:
   - Click **"Log Weigh-In"**.
   - Input Scale Weight, Body Fat %, Waist, Hip, Chest, Biceps, Thighs, and notes (e.g., *"Fasted morning weigh-in"*).
   - Click **"Save Measurement"** to update your trend line.

---

### 10. Generating & Exporting Health Intelligence Reports
1. Navigate to the **Health Reports** tab.
2. **Switch between Report Types**:
   - **Daily Executive Summary**: Detailed nutrition ledger, target compliance, itemized meals, workout summary, and clinical AI dietitian prescriptions.
   - **Monthly Intelligence Report**: 30-day caloric averages, workout consistency percentage (`92%`), best nutrition day vs lowest adherence day, and physical transformation ledger.
3. **Exporting Data**:
   - Click **"PDF"**: Opens a formatted, print-optimized document ready to save as PDF or print.
   - Click **"Excel"**: Instantly downloads a formatted `.xls` spreadsheet.
   - Click **"CSV"**: Downloads raw structured `.csv` data for Excel, Google Sheets, or data analysis.

---

### 11. Barcode Scanning & Smart Food Database Lookup
1. Click **"Barcode & Database"** in the sidebar.
2. **Scan Packaged Barcode**:
   - Type or scan a 12-digit UPC barcode (e.g., `748927028669` for ON Gold Standard Whey, `888849000010` for Quest Protein Bar, `894700010045` for Chobani Greek Yogurt, `030000010103` for Quaker Oats).
   - Click **"Scan"**. The system checks verified records and queries the live **OpenFoodFacts API**.
3. **Smart Search**:
   - Search across 100+ Indian regional dishes, global staples, packaged products, and restaurant meals.
   - Filter by tabs: `All`, `Indian`, `Global`, `Packaged`, `Restaurant`.
   - Click the green `+` button on any item to log it directly into your daily meals.

---

### 12. Hands-Free Voice Meal Logging
1. Click **"Voice Meal Logger"** in the sidebar.
2. Click the large purple microphone button to start recording.
3. Speak naturally, for example:
   > *"I had 2 whole wheat rotis, one bowl of palak paneer, and a small bowl of cucumber salad."*
   > OR
   > *"Just finished workout, drank one scoop chocolate whey isolate with 300ml almond milk and 1 banana."*
4. Click **"Stop"** or pick a simulation chip.
5. The AI Natural Language Parser will extract the food items, portions, and calculate exact calories, protein, carbs, and fats.
6. Click **"Confirm Voice Log"** to add it to your ledger.

---

### 13. AI Restaurant Menu Scanner
1. Click **"Restaurant Menu Scan"** in the sidebar.
2. Upload or snap a picture of any restaurant menu.
3. Click **"Scan Sample Bistro Menu"**.
4. The AI parses the preparation methods (fried vs. grilled, heavy cream vs. olive oil) and outputs:
   - **Top Recommended Healthiest Picks**: Dishes with the highest protein-to-calorie ratio, healthy fats, and low glycemic index.
   - **Dishes to Customize or Avoid**: Identifies high-calorie, ultra-processed, or high-sodium dishes with exact modification tips (e.g., *"Ask for marinara sauce instead of heavy Alfredo cream"*).

---

### 14. AI Meal Planner, Grocery List & Pantry Recipe Creator
Navigate to the **Meal Planner & Grocery** tab:
- **7-Day Meal Plan**: Select any day (Monday through Sunday) to view a customized, macro-budgeted schedule featuring Breakfast, Lunch, Afternoon Fuel, and Dinner tailored to your dietary preference.
- **Smart Grocery List**: Review a complete weekly shopping list categorized into *High Protein Sources*, *Fresh Produce & Greens*, *Complex Carbohydrates*, and *Healthy Fats & Pantry*. Tap items to check them off as you shop.
- **Pantry Recipe Creator**:
  1. Switch to the **"Pantry Recipe Creator"** tab.
  2. Enter the ingredients currently in your fridge/pantry (e.g., *"Paneer, Spinach, Garlic, Olive Oil, Cumin"*).
  3. Click **"Create Recipe"**.
  4. The AI generates a gourmet high-protein recipe with prep time, exact macros, step-by-step instructions, and a clinical dietitian pro-tip!

---

### 15. Challenges, Habit Streaks & Gamification
1. Navigate to the **Challenges & Streaks** tab.
2. **Level Progression**: Track your FitPoints and Level tier (e.g., Level 4: *Metabolic Athlete*).
3. **Active Challenges**:
   - *7-Day Protein Streak* (115g+ daily)
   - *30-Day Lean Recomp*
   - *Hydration Hero* (2.8L+ for 5 days)
   - *Whole Food Purity Challenge*
4. When a challenge reaches 100%, click **"Claim Points"** to earn points and trigger celebration confetti!
5. **Medal Showcase**: View earned badges (e.g., *6-Day Streak*, *Hydro Legend*, *AI Vision Pioneer*, *Macro Precision*).

---

### 16. User Profile, Goals & Dietary Preference Configuration
1. Click your profile avatar in the top right corner of the navbar.
2. **Demographics**: Update Name, Age, Gender, Height, Current Weight, and Goal Weight.
3. **Activity Level**: Choose from *Sedentary*, *Light*, *Moderate*, *Very Active*, or *Extra Active*.
4. **Primary Goal**: Select from:
   - `FAT_LOSS` (Cutting, high protein, -450 kcal deficit)
   - `WEIGHT_LOSS` (Steady deficit, -500 kcal)
   - `MUSCLE_BUILDING` (Bulking, +350 kcal surplus)
   - `BODY_RECOMPOSITION` (Lean gains, slight deficit, high protein)
   - `HEALTHY_LIFESTYLE` (Maintenance vitality)
   - `WEIGHT_GAIN` (Nutrient-dense surplus)
5. **Dietary Preferences**: Select `VEGETARIAN`, `VEGAN`, `JAIN` (no root vegetables), `KETO`, `HIGH_PROTEIN`, `LOW_CARB`, `MEDITERRANEAN`, or `STANDARD`.
6. **Allergies & Medical Conditions**: Enter any conditions (e.g., Peanuts, Gluten, PCOS, Thyroid) to steer AI recommendations.
7. Observe the real-time **BMR**, **TDEE**, and **Target Calories** recalculation. Click **"Save Profile & Targets"**.

---

### 17. Executive Administration Console
1. Navigate to the **Admin Console** tab (restricted to administrators).
2. **Key Telemetry**: View total active subscribers, monthly recurring revenue ($48.6k), verified database records, and AI vision accuracy rates.
3. **Subscribers Management**: View registered user accounts, active subscription tiers (Pro, Elite, Free), habit streaks, and scan counts.
4. **Food Database Moderation**: Approve, verify, or edit items across global and Indian food categories.
5. **AI Vision Accuracy Telemetry**: Monitor recognition accuracy benchmarks across Indian regional foods (`93.8%`), Western staples (`96.4%`), and Packaged UPC barcodes (`99.1%`).

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: `v18.18+`, `v20+` or `v22+` (tested on Node 22/26)
- **npm**: `v9+` or `v10+` (or `pnpm`)
- **Git**
- **Neon Cloud PostgreSQL Account** (or any PostgreSQL connection string)

---

### 2. Running the Project (Two Easy Options)

FitLens AI supports running from either the **root workspace directory** or inside the **`FItLens_AI` subfolder**:

#### Option A: Run from the Root Directory (`FitlensAI/`)
If your terminal is in `C:\Users\shubhjag\AntiProjects\FitlensAI`:
```bash
# 1. Start the development server directly (delegates automatically)
npm run dev

# 2. View in browser
# http://localhost:3000
```

#### Option B: Run from the App Directory (`FItLens_AI/`)
If you navigate into `FItLens_AI`:
```bash
cd FItLens_AI

# 1. Start development server
npm run dev

# 2. Open in browser
# http://localhost:3000
```

---

### 3. Online Cloud Database Setup (Neon PostgreSQL)

FitLens AI is fully wired to an online **Neon PostgreSQL** serverless database for persistent day-to-day logging of meals, workouts, users, and health metrics.

#### Step 3.1: Configure Environment Variables
Ensure `.env.local` and `.env` in `FItLens_AI` contain your live Neon PostgreSQL connection string:
```env
DATABASE_URL="postgresql://neondb_owner:npg_ACOeEz1obHv8@ep-silent-dew-bdwj4way-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

#### Step 3.2: Sync Schema to Neon Database
Push the relational Prisma schema to create all 18+ tables in Neon:
```bash
npm run db:push
# Or: npx prisma db push
```

#### Step 3.3: Seed Users & Goals into Neon
Populate initial user profiles (*Priya Sharma*, *Rahul Verma*, *Ananya Mehta*) with custom macro targets, dietary preferences, and fitness goals:
```bash
npm run seed
# Or: node scripts/seed-users.js
```

#### Step 3.4: Verify Database Connectivity & Live Read/Write
Run the automated verification script to confirm real-time queries and insertions into your Neon cloud database:
```bash
npm run test:db
# Or: node scripts/test-neon-db.js
```
Expected output:
```
🔍 Testing Live Neon PostgreSQL Connection...
✅ Successfully queried Neon DB! Found 3 users:
   - Priya Sharma (priya.sharma@example.com) | Goal: FAT_LOSS
   - Rahul Verma (rahul.verma@example.com) | Goal: MUSCLE_BUILDING
   - Ananya Mehta (ananya.mehta@example.com) | Goal: BODY_RECOMPOSITION
✅ Successfully created MealLog in Neon DB!
✅ Successfully created WorkoutLog in Neon DB!
🎉 Verification Complete! All data is actively streaming to Neon PostgreSQL!
```

---

### 4. Visualizing & Managing Your Live Data

#### Option 1: Prisma Studio (Interactive Local GUI)
To browse, filter, edit, or delete live rows in your Neon database via a clean web GUI:
```bash
npm run studio
# Or: npx prisma studio
```
Then visit **[http://localhost:5555](http://localhost:5555)** in your browser.

#### Option 2: Neon Cloud Console
1. Log in at [https://console.neon.tech](https://console.neon.tech).
2. Open your project **`ep-silent-dew-bdwj4way`**.
3. Click **Tables** on the left menu to view live records for `users`, `meal_logs`, `meal_food_items`, `workout_logs`, `workout_exercises`, and `body_measurements`.

---

### 5. Available NPM Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Starts local Next.js dev server at `http://localhost:3000` |
| `npm run build` | `next build` | Compiles production-optimized client & API bundles |
| `npm run start` | `next start` | Runs production server |
| `npm run db:push` | `prisma db push` | Pushes Prisma schema changes to Neon cloud database |
| `npm run seed` | `node scripts/seed-users.js` | Seeds demo profiles and macro targets into Neon DB |
| `npm run test:db` | `node scripts/test-neon-db.js` | Runs end-to-end read/write test against Neon PostgreSQL |
| `npm run studio` | `prisma studio` | Opens Prisma Studio visual database editor at port 5555 |
| `npm run lint` | `next lint` | Runs ESLint type and syntax validation |

---

## 🐳 Docker & Containerized Deployment

Run the complete multi-container stack (Next.js App + PostgreSQL 16 + Redis 7):

```bash
# Build and run all services in background
docker-compose up --build -d

# Check service logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

The services will be available at:
- **FitLens Web Application**: `http://localhost:3000`
- **PostgreSQL Database**: `localhost:5432` (`fitlens_user` / `fitlens_secure_pass_2026`)
- **Redis Cache**: `localhost:6379`

---

## ☸️ Kubernetes Production Deployment (AKS/EKS/GKE)

Production-ready Kubernetes manifests are provided in [`k8s/`](file:///c:/Users/shubhjag/AntiProjects/FitlensAI/FItLens_AI/k8s/):

```bash
# 1. Apply configuration and environment settings
kubectl apply -f k8s/configmap.yaml

# 2. Deploy application pods (3 replicas with rolling updates)
kubectl apply -f k8s/deployment.yaml

# 3. Expose Service, Ingress (with SSL/TLS), and Horizontal Pod Autoscaler (HPA)
kubectl apply -f k8s/ingress-hpa-service.yaml

# 4. Verify deployment rollout
kubectl rollout status deployment/fitlens-ai-deployment -n fitlens-prod
```

---

## ⚙️ Environment Variables Reference

| Variable | Description | Default / Example |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | Name of the application | `FitLens AI` |
| `NEXT_PUBLIC_APP_URL` | Base public URL | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/fitlens_ai` |
| `GEMINI_API_KEY` | Google Gemini 1.5/2.0 Flash Vision key | `AIzaSy...` (Optional, uses fallback if unset) |
| `OPENAI_API_KEY` | OpenAI GPT-4o Vision API key | `sk-proj-...` (Optional) |
| `NEXTAUTH_SECRET` | JWT authentication encryption key | `fitlens-ai-ultra-secure-jwt-secret-key-32chars` |
| `OPENFOODFACTS_BASE_URL`| OpenFoodFacts API endpoint | `https://world.openfoodfacts.org/api/v2` |
| `REDIS_URL` | Redis caching & rate limiting endpoint | `redis://localhost:6379` |

---

## 🔌 REST API Specifications

| Method | Endpoint | Description | Payload / Query |
|---|---|---|---|
| `GET` | `/api/meals` | Fetch logged meals from Neon DB | `?userId=<id>&limit=20` |
| `POST` | `/api/meals` | Log meal with items & macros to Neon DB | `{ "mealType": "LUNCH", "totalCalories": 550, "items": [...] }` |
| `GET` | `/api/workouts` | Fetch logged workouts from Neon DB | `?userId=<id>&limit=20` |
| `POST` | `/api/workouts` | Log workout & exercises to Neon DB | `{ "type": "GYM", "durationMinutes": 45, "exercises": [...] }` |
| `GET` | `/api/users` | List all registered user profiles | None |
| `POST` | `/api/users` | Create or update user profile & goals | `{ "name": "...", "email": "...", "targets": {...} }` |
| `POST` | `/api/food/scan` | Analyze food image with AI vision | `{ "image": "data:image/jpeg;base64,...", "mealType": "LUNCH" }` |
| `GET` | `/api/food/search` | Search verified food database | `?q=paneer&category=Indian` |
| `GET` | `/api/food/barcode` | Lookup UPC barcode (Local + OpenFoodFacts) | `?barcode=748927028669` |
| `POST` | `/api/coach/chat` | AI Dietitian consultation endpoint | `{ "query": "Am I in calorie deficit?", "user": {...}, "totals": {...} }` |

---

## 🏛️ Architecture & Engineering Blueprint

For technical details, including:
- **Mermaid System Architecture Flowchart**
- **Relational Entity-Relationship (ER) Diagram**
- **NestJS Enterprise Microservices Blueprint** ([backend-nestjs/](file:///c:/Users/shubhjag/AntiProjects/FitlensAI/FItLens_AI/backend-nestjs/))
- **Automated CI/CD Pipeline** ([.github/workflows/ci-cd.yml](file:///c:/Users/shubhjag/AntiProjects/FitlensAI/FItLens_AI/.github/workflows/ci-cd.yml))
- **Scalability Strategy for 100k+ Concurrent Users**
- **Unit, Integration, and E2E Testing Strategy**

Please refer to the technical specification in [ARCHITECTURE.md](file:///c:/Users/shubhjag/AntiProjects/FitlensAI/FItLens_AI/ARCHITECTURE.md).

---

## 📄 License

Distributed under the MIT License. Built with ❤️ for health, fitness, and longevity.
