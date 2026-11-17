# FitLens AI — Intelligent AI-Powered Nutrition, Calorie & Health Tracker

FitLens AI is an advanced, modern AI-powered health and fitness application designed to help users track daily nutrition, calorie intake, macronutrients, micronutrients, hydration, workouts, body measurements, intermittent fasting, and long-term health progress using multi-model computer vision and dynamic dietitian intelligence.

---

## 🌟 Core Features & Modules

### 1. 📷 Multi-Model AI Food Scanning
- Instant camera capture & file upload with real-time neural vision recognition.
- Identifies **Food Name**, **Ingredients**, **Portion size**, **Calories**, **Protein**, **Carbohydrates**, **Fats**, **Fiber**, **Sugar**, **Sodium**, and **Micronutrients** (Calcium, Iron, Potassium, Vitamin A, Vitamin C).
- Provides real-time **AI Confidence Scores** (e.g. 96%).
- Interactive **Portion Slider** (0.5x to 3.0x) that dynamically recalculates all macro totals.
- Editable food title & instant confirmation into the daily log.

### 2. 🏷️ Automated Meal Classification
- Categorizes meals into **Breakfast**, **Lunch**, **Dinner**, **Snacks**, **Pre-workout**, and **Post-workout**.

### 3. 🎯 Apple Health Inspired Nutrition Rings & Dashboard
- **3-Ring SVG Visualizer**:
  - **Outer Ring**: Active Calories vs Target (Gradient Red / Orange)
  - **Middle Ring**: Protein Goal Completion (Gradient Neon Green)
  - **Inner Ring**: Hydration Level (Gradient Cyan / Aqua)
- **Macro Progress Bars**: Protein, Carbs, Fats, Gut Fiber, and Sugar Limits with status pills.
- **Caloric Ledger**: Consumed vs Burned vs Net vs Remaining.

### 4. 🧠 Continuous AI Nutrition Coach Alerts
- Continuous real-time meal analysis generating a composite **Nutrition Score (0-100)**.
- **Deficiency Alerts**: Highlights remaining protein or fiber deficits with personalized food suggestions (e.g., Paneer, Greek Yogurt, Edamame, Whey Isolate).
- **Sugar & Sodium Warnings**: Protects cardiovascular health and glycemic stability.

### 5. 🏋️ Workout & Health Wearables Sync
- Track **Gym workouts**, **Running**, **Walking**, **Cycling**, **Swimming**, **Yoga**, and **Sports**.
- Log Duration, Distance, Sets, Reps, Weight lifted, and Calories burned.
- Built-in integration indicators for **Apple Health**, **Google Fit**, **Fitbit**, **Garmin**, and **Samsung Health**.

### 6. ⚖️ Body Progress Tracking & AI 30-Day Projections
- Log Weight, Body Fat %, Chest, Waist, Hip, Biceps, and Thighs.
- 30-Day SVG Trend Graphs with milestone points.
- **AI Forward Prediction Engine**: Predicts expected weight after 30 days and goal achievement probability.

### 7. 📄 Health Intelligence Reports & Multi-Format Export
- **Daily Executive Summary**: Calories, macros, itemized meals, workout zones, and clinical AI recommendations.
- **Monthly Intelligence Report**: 30-day caloric averages, best/worst adherence days, body transformation ledger.
- **One-Click Export**:
  - 📄 **PDF**: Print-ready styling with dedicated `@media print` layout.
  - 📊 **Excel**: Downloadable `.xls` spreadsheet.
  - 📑 **CSV**: Raw structured data for spreadsheet analysis.

### 8. 🔍 Smart Food Database & Barcode Scanner
- Comprehensive database of authentic **Indian Foods** (Paneer Tikka, Dal Makhani, Khichdi, Phulka, Idli Sambar, etc.), **Global Staples**, **Restaurant meals**, and **Packaged goods**.
- **Barcode Scanner (UPC)** powered by OpenFoodFacts API and USDA verified data.

### 9. 🤖 Personal AI Dietitian Chatbot
- Conversational chat interface with direct access to user's real-time biometric ledger.
- Instant preset prompts:
  - *"How much protein did I eat today?"*
  - *"What should I eat after workout?"*
  - *"Am I in calorie deficit?"*
  - *"Suggest a diet plan for tomorrow"*
  - *"Show my last month's report"*

### 10. ⏱️ Intermittent Fasting Tracker
- Supports **16:8**, **18:6**, **20:4**, **OMAD**, and **Circadian 12:12** protocols.
- Live elapsed timer and metabolic stage tracker:
  - *Anabolic Fed State* (0-4h)
  - *Catabolic Phase* (4-12h)
  - *Fat Oxidation Zone* (12-16h)
  - *Autophagy & Cellular Renewal* (16h+)

### 11. 🏆 Challenges & Gamification
- **7-Day Protein Streak**, **30-Day Lean Recomp**, **Hydration Hero**, and **Whole Food Purity**.
- Experience Points (FitPoints), Habit Streaks, and Badges showcase.

### 12. 🛡️ Executive Admin Console
- User subscriber management, global food database moderation, and AI computer vision accuracy telemetry.

### 13. 🎁 Bonus AI Features
- **Restaurant Menu Scanner**: Scans menus and highlights the healthiest options.
- **AI 7-Day Meal Planner**: Generates personalized meal schedules based on dietary preferences.
- **AI Grocery List Generator**: Auto-sorts weekly groceries into categorized checklists.
- **AI Pantry Recipe Creator**: Transforms whatever ingredients you have in your fridge into a gourmet high-protein meal.
- **Voice Meal Logger**: Speaks naturally; AI parses dishes, quantities, and macros.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: `v18+` or `v20+` (tested on Node 26)
- **npm** or **pnpm**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/shubhamjagtap96k/FItLens_AI.git
cd FItLens_AI

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience FitLens AI.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🐳 Docker & Kubernetes Deployment

### Run via Docker Compose:
```bash
docker-compose up --build
```
This boots:
1. `fitlens-ai-app` on port 3000
2. `fitlens-postgres` PostgreSQL 16 on port 5432
3. `fitlens-redis` Redis 7 on port 6379

### Deploy to Kubernetes (AKS / EKS / GKE):
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/ingress-hpa-service.yaml
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend** | Next.js 15 Full-Stack Server Actions & API Routes + NestJS Enterprise Microservices Blueprint |
| **Database & ORM** | PostgreSQL 16, Prisma ORM |
| **AI Inference** | Google Gemini 1.5/2.0 Flash Vision, OpenAI GPT-4o, Claude 3.5 Sonnet Vision |
| **Health Integrations**| Apple HealthKit, Google Fit REST API, Garmin, Fitbit, Samsung Health |
| **Cloud & DevOps** | Azure Container Apps, Azure Kubernetes Service (AKS), Docker, GitHub Actions CI/CD |

---

## 📖 Architecture & Technical Specs
For complete entity-relationship diagrams, API endpoints, scalability plans, and testing strategies, see [ARCHITECTURE.md](file:///c:/Users/shubhjag/AntiProjects/FitlensAI/FItLens_AI/ARCHITECTURE.md).
