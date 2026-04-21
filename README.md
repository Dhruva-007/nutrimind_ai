# NutriMind AI 🥗🧠

## Chosen Vertical
Health & Wellness — Real-time adaptive food intelligence system

## Problem Statement
Static diet plans fail because they ignore real-time context. Most fitness applications give you a generic list of macros to hit, completely ignoring how behaviors (e.g., skipping meals), physical states (e.g., post-workout recovery), and time-of-day constraints affect your real-world choices.

## Solution Overview
NutriMind AI is a context-aware food intelligence PWA. Instead of merely a calorie tracker, it acts as an autonomous dietician. It adjusts your nutritional pipeline dynamically using the Antigravity Workflow Engine to compensate for missed meals, adapt to your realtime physical context, and provide ultra-personalized food recommendations.

This app features a full-stack Next.js architecture integrated deeply with Firebase, BigQuery for analytics, and Vertex AI for food scanning recognition. Every recommendation is uniquely scored based on your consistency, calorie debt, user preferences, and real-time urgency.

## Architecture Diagram
```
[User Interface (Next.js PWA)]
        |
        v
[Firebase Hosting & Auth]
        |
        v
[Cloud Functions (API Gateway)]
        |----------------------------\
        v                            v
[Antigravity Workflow Engine]   [Vertex AI Vision]
(Context & ML Processing)       (Image Scanning)
        |                            |
        v                            |
[Firestore DB] <---------------------/
(Meal Logs & Profiles)
        |
        v
[BigQuery]
(Analytics & Trend Extraction)
```

## Core Features
- Real-Time Context-Aware Recommendations
- Dynamic Pipeline Routing (diabetic/high-protein/keto/standard)
- Behavior Adaptation (skip compensation, preference learning)
- Food Image Scanner (Vertex AI)
- Smart Grocery Generator
- Health Score Dashboard
- Voice Input ("What should I eat now?")
- Accessibility (contrast, font size, screen reader)

## How Antigravity Workflows Work
1. **Fetch Profile:** Retrieves `UserProfile` from Firestore.
2. **Fetch History:** Grabs the last 20 `MealLog` entries.
3. **Detect Context:** Assesses current hour, urgency, and activity (`contextDetector`).
4. **Analyze Profile:** Calculates TDEE and selects the ML pipeline (e.g., `high-protein`).
5. **Analyze Behavior:** Extracts skip rate, calorie debt, and disliked foods.
6. **Evaluate Food Options:** Ranks food DB matching pipeline against context and behavior constraints.
7. **Generate Recommendation:** Constructs final primary/alternative payload with reasoning.
8. **Cache:** Memorizes result for 5 mins to save compute.
9. **Log Analytics:** Fires anonymized event to BigQuery.
10. **Return Output:** Delivers JSON payload to the UI.

## Dynamic Routing Logic
| Condition | Pipeline | Food Strategy |
|-----------|----------|---------------|
| `diet=diabetic` or `goal=lose` | low-sugar | 30% Protein / 30% Carbs / 40% Fat |
| `activity=active` & `goal=gain` | high-protein | 40% Protein / 35% Carbs / 25% Fat |
| `diet=keto` | low-carb | 35% Protein / 10% Carbs / 55% Fat |
| Baseline | standard | 25% Protein / 50% Carbs / 25% Fat |

## Google Services Used
| Service | Purpose |
|---------|---------|
| Firebase Auth | Google Sign-In |
| Firestore | User profiles, meal logs |
| Cloud Functions | API + workflow orchestration |
| Vertex AI | Food image recognition |
| BigQuery | Anonymized analytics, trend queries |
| Firebase Hosting | PWA deployment |

## Local Setup
```bash
git clone <repo>
npm install
cp .env.example .env.local
# fill in Firebase config
npm run dev
```

## Running Tests
```bash
npm test
npm run test:coverage
```

## Assumptions
- Food DB is curated (30+ items); production would use USDA API.
- Vertex AI endpoint configured in project (mock used in dev).
- Weather/location context planned but not shipped in v1.
- BMI/gender simplified to two generic categories for MVP.

## Folder Structure
- `src/components/`: Reusable PWA visual interfaces.
- `src/pages/`: Next.js UI routing layers.
- `src/hooks/`: React state synchronization & fetch logic.
- `src/services/`: Firebase, Vertex AI, BigQuery adapters.
- `src/workflows/`: Antigravity behavior & decision engine logic.
- `src/utils/`: Math and macro calculators.
- `src/types/`: Global TypeScript interfaces.
- `functions/src/`: Serverless endpoint handlers.
- `tests/`: Jest suites for unit and workflow verification.
