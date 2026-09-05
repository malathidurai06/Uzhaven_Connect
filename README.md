# Uzhavan Connect
### AI-Powered Hyperlocal Smart Agricultural Marketplace with Demand Prediction & Food Waste Reduction

A final-year CSE project — a working, runnable scaffold implementing every feature from the
project blueprint: hyperlocal marketplace, AI price recommendation, AI demand prediction,
crop rescue system, Tamil voice assistant, and freshness grading.

---

## 📁 Project Structure

```
uzhavan-connect/
├── backend/            Node.js + Express API (SQLite) — also serves the built frontend
├── ai-service/          Python FastAPI — the AI/ML brain
├── frontend/            React (Vite) web app — includes a proper landing page (Home)
└── database/schema.sql  Production PostgreSQL + PostGIS schema (for later migration)
```

---

## 🔗 Single-Link Architecture (`http://localhost:5000`)

Uzhavan Connect has three integrated components:
- **ai-service** — the AI brain (Python FastAPI on port 8000)
- **backend** — the main API + SQLite database (Node.js on port 5000)
- **frontend** — the website interface (React + Vite, served by Express)

Everything is accessed through **one single link: `http://localhost:5000`**.

---

## 🚀 How to Run

### Terminal 1 — AI Service (Python FastAPI)
```bash
cd ai-service
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

### Terminal 2 — Frontend Build & Backend Start
```bash
cd frontend
npm run build

cd ../backend
npm start
```

Now open:
```
http://localhost:5000
```

---

## 🌾 Core Features
- **1-Click Demo Personas** (Farmer Murugan, Buyer Priya, Hotel Royal Residency)
- **Hyperlocal Marketplace** with real crop photos and freshness tags
- **AI Price Recommendation** (RandomForest model)
- **AI 7-Day Demand Prediction** (GradientBoosting model)
- **Live Tamil Voice Assistant** (Web Speech API + Tamil NLP)
- **Crop Rescue & Zero Waste Clearance** (35-50% off surplus produce)
- **Multi-lingual support** (English + தமிழ் UI)

