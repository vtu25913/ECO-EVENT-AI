<div align="center">
  <br/>
  <h1>🌿 EcoEvent AI</h1>
  <p><strong>Intelligent Sustainability Analysis Platform for Events</strong></p>
  <p>
    <a href="https://ecoevent-ai.vercel.app" target="_blank">🌐 Live Demo</a> •
    <a href="#-problem-statement">Problem</a> •
    <a href="#-objective">Objective</a> •
    <a href="#-features">Features</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-technology-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a>
  </p>
  <br/>
</div>

---

## 📋 Overview

**EcoEvent AI** is a comprehensive platform for measuring, analyzing, and improving the environmental impact of events. From college fests to corporate conferences, it empowers organizers with AI-driven sustainability insights, real-time analytics, and actionable recommendations.

Built with React, Supabase, and OpenAI, the platform provides end-to-end sustainability management — from carbon footprint calculation to SDG impact mapping and certification tracking.

---

## ❗ Problem Statement

Events — whether college fests, corporate conferences, cultural gatherings, or community meetups — have a significant environmental footprint. A single large event can generate **tons of CO₂ emissions**, produce **hundreds of kilograms of waste**, consume **thousands of liters of water**, and use **substantial amounts of energy** — all within a span of a few days.

Despite growing awareness, most event organizers face critical challenges:

| Challenge | Impact |
|---|---|
| 📉 **Lack of Measurement Tools** | No standardized way to quantify environmental impact of events |
| 📊 **Data Fragmentation** | Sustainability data is scattered across spreadsheets, making analysis impossible |
| 🎯 **No Actionable Insights** | Without measurement, organizers can't identify improvement areas |
| 🏷️ **Greenwashing Risk** | Events claim to be "green" without verifiable metrics or certifications |
| 🌍 **SDG Alignment Gap** | Difficulty mapping event decisions to UN Sustainable Development Goals |
| 🔄 **No Continuous Improvement** | Without tracking, events can't benchmark or show progress over time |
| 💰 **Cost vs. Sustainability** | Perceived trade-off between being eco-friendly and staying within budget |

The result? Most events miss opportunities to reduce their environmental impact simply because they lack the tools to **measure, analyze, and improve**.

---

## 🎯 Objective

**EcoEvent AI** aims to democratize sustainability analysis for events by providing:

1. **🔍 Measure** — Quantify environmental impact across 5 critical dimensions (Carbon, Water, Waste, Energy, Environmental) using a standardized scoring framework
2. **📊 Analyze** — Generate comprehensive sustainability reports with interactive charts, trend analysis, and benchmark comparisons
3. **💡 Improve** — Deliver AI-powered, actionable recommendations tailored to each event's specific profile
4. **🏆 Certify** — Award verifiable sustainability certifications (Bronze → Silver → Gold → Platinum) based on objective scoring
5. **🌍 Align** — Map every event decision to 6 UN Sustainable Development Goals (SDGs 6, 7, 11, 12, 13, 15)
6. **📈 Track** — Monitor progress over time with historical data, leaderboards, and achievement badges
7. **🤖 Advise** — Provide an intelligent AI Sustainability Advisor available 24/7 for expert guidance

---

## ✨ Features

### 🧠 AI Sustainability Advisor
- **Hybrid AI Model** — Rule-based local responses for simple queries, OpenAI-powered (gpt-4o-mini) for complex analysis
- **Context-Aware** — Passes event analysis data for personalized recommendations
- **24h Response Cache** — Minimizes API costs by caching identical queries
- **Graceful Fallback** — Falls back to local knowledge base when AI is unavailable

### 📊 Event Sustainability Analyzer
Analyze events across **5 dimensions** with automatic scoring:

| Dimension | Weight | Key Factors |
|---|---|---|
| 💨 **Carbon & Transportation** | 25% | Transport mode, energy source, virtual options |
| 💧 **Water Stewardship** | 20% | Water source, conservation initiatives, refill stations |
| ♻️ **Waste Management** | 20% | Registration type, certificates, food service, segregation |
| ⚡ **Energy Efficiency** | 20% | Usage level, renewable adoption, smart controls |
| 🌿 **Environmental Impact** | 15% | Initiatives, biodiversity, tree planting |

#### Certification Tiers
| Tier | Score | Description |
|---|---|---|
| 🥇 **Platinum** | 90–100 | Industry-leading sustainability |
| 🥇 **Gold** | 75–89 | Excellent sustainable practices |
| 🥈 **Silver** | 60–74 | Good sustainability foundation |
| 🥉 **Bronze** | 40–59 | Basic sustainable practices |
| 📉 **Unsustainable** | 0–39 | Major improvements required |

### 💨 Carbon Impact Simulator
- Interactive scenario modeling with real-time calculations
- Compare transport modes, energy sources, and material choices
- See instant CO₂e reduction estimates
- Export detailed impact reports

### 🌍 SDG Impact Mapping
Track contributions to **6 UN Sustainable Development Goals**:

| SDG | Focus Area | Event Contribution |
|---|---|---|
| **SDG 6** 💧 | Clean Water & Sanitation | Refill stations, reduced bottled water |
| **SDG 7** ⚡ | Affordable & Clean Energy | Renewable energy adoption, LED lighting |
| **SDG 11** 🏙️ | Sustainable Cities & Communities | Accessible venues, local sourcing |
| **SDG 12** 🔄 | Responsible Consumption & Production | Waste reduction, digital materials |
| **SDG 13** 🌍 | Climate Action | Carbon measurement & offsetting |
| **SDG 15** 🌳 | Life on Land | Tree planting, eco-friendly venues |

### 🏆 Gamification & Leaderboard
- Global leaderboard ranking events by sustainability score
- Achievement badges for milestones (10+ analyses, platinum score, etc.)
- Certification tracking with verification codes
- Competitive motivation for continuous improvement

---

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <img src="screenshots/landing_page.png" alt="Landing Page" width="100%" />
        <br/><strong>🏠 Landing Page</strong>
        <br/><sub>Hero with app overview & stats</sub>
      </td>
      <td align="center" width="33%">
        <img src="screenshots/Login.png" alt="Login" width="100%" />
        <br/><strong>🔑 Login</strong>
        <br/><sub>Sign in with email/password</sub>
      </td>
      <td align="center" width="33%">
        <img src="screenshots/Register.png" alt="Register" width="100%" />
        <br/><strong>📝 Register</strong>
        <br/><sub>Create a free account</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <img src="screenshots/home.png" alt="Home" width="100%" />
        <br/><strong>🏡 Home</strong>
        <br/><sub>User's home/dashboard overview</sub>
      </td>
      <td align="center" width="33%">
        <img src="screenshots/dashboard.png" alt="Dashboard" width="100%" />
        <br/><strong>📊 Dashboard</strong>
        <br/><sub>Real-time analytics & metrics</sub>
      </td>
      <td align="center" width="33%">
        <img src="screenshots/analyzer.png" alt="Event Analyzer" width="100%" />
        <br/><strong>📝 Event Analyzer</strong>
        <br/><sub>5-dimension sustainability scoring</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <img src="screenshots/ai_assistant.png" alt="AI Assistant" width="100%" />
        <br/><strong>🤖 AI Assistant</strong>
        <br/><sub>Chat with sustainability advisor</sub>
      </td>
      <td align="center" width="33%">
        <img src="screenshots/advisor.png" alt="Advisor" width="100%" />
        <br/><strong>🧠 Advisor</strong>
        <br/><sub>Full-page advisor interface</sub>
      </td>
      <td align="center" width="33%">
        <img src="screenshots/leaderboard.png" alt="Leaderboard" width="100%" />
        <br/><strong>🏆 Leaderboard</strong>
        <br/><sub>Ranked events & certifications</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <img src="screenshots/reports.png" alt="Reports" width="100%" />
        <br/><strong>📈 Reports</strong>
        <br/><sub>Detailed analysis & PDF export</sub>
      </td>
      <td align="center" width="33%">
        <img src="screenshots/sdg_impact.png" alt="SDG Impact" width="100%" />
        <br/><strong>🌍 SDG Impact</strong>
        <br/><sub>UN Sustainable Development Goals</sub>
      </td>
      <td align="center" width="33%">
        <img src="screenshots/carbon_simulator.png" alt="Carbon Simulator" width="100%" />
        <br/><strong>💨 Carbon Simulator</strong>
        <br/><sub>Emissions scenario modeling</sub>
      </td>
    </tr>
    <tr>
      <td align="center" width="33%">
        <img src="screenshots/settings.png" alt="Settings" width="100%" />
        <br/><strong>⚙️ Settings</strong>
        <br/><sub>Preferences & data management</sub>
      </td>
      <td align="center" width="33%">
        <img src="screenshots/about.png" alt="About" width="100%" />
        <br/><strong>ℹ️ About</strong>
        <br/><sub>Platform info & version</sub>
      </td>
      <td align="center" width="33%">
        <br/><br/>
        <em>More features coming soon</em>
        <br/><br/><br/>
      </td>
    </tr>
  </table>
</div>

---

## 🛠️ Technology Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, TailwindCSS 4, Framer Motion |
| **Backend** | Node.js, Express 5, Vercel Serverless Functions |
| **Database** | Supabase (PostgreSQL) + LocalStorage fallback |
| **AI** | OpenAI (gpt-4o-mini) with rule-based fallback |
| **Charts** | Chart.js via react-chartjs-2 |
| **3D Graphics** | Three.js / React Three Fiber |
| **PDF Reports** | jsPDF + html2canvas |
| **Authentication** | Supabase Auth (email/password) |
| **Deployment** | Vercel (Frontend + API) |

</div>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project (free tier works)

### Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd ecoevent-ai

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Set up environment variables
# Create backend/.env:
echo "PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key" > backend/.env

# 5. Initialize the database
# Run supabase-schema.sql in your Supabase SQL Editor

# 6. Start both servers
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npx vite --port 5173
```

Visit **http://localhost:5173** to use the application.

### Vercel Deployment

The app is designed for seamless Vercel deployment:

```bash
# Deploy frontend + API routes
npx vercel --prod
```

Required environment variables on Vercel:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
AI_API_KEY              # Optional - for AI-powered chat
ADMIN_SECRET            # Optional - admin panel access
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Vercel Deployment                      │
├──────────────────┬──────────────────────────────────────┤
│   Frontend (SPA) │        API Routes (Serverless)       │
│   React + Vite   │      /api/* (Node.js fetch-based)    │
├──────────────────┼──────────────────────────────────────┤
│                  │  /api/analyses     ─── Analyses CRUD  │
│  Dashboard       │  /api/leaderboard  ─── Leaderboard   │
│  Event Analyzer  │  /api/ai-advisor/* ─── AI Chat       │
│  AI Assistant    │  /api/admin/*      ─── Admin panel   │
│  Leaderboard     │  /api/health       ─── Health check  │
│  Reports         │                                       │
└──────────────────┴──────────────────────────────────────┘
         │                        │
         └────────────┬───────────┘
                      ▼
         ┌────────────────────────┐
         │       Supabase         │
         │  PostgreSQL + Auth     │
         │  RLS + SECURITY        │
         │  DEFINER Functions     │
         └────────────────────────┘
```

### Project Structure

```
ecoevent-ai/
├── api/                        # Vercel serverless functions
│   ├── analyses.js             # Analyses CRUD API
│   ├── health.js               # Health check endpoint
│   ├── leaderboard/            # Leaderboard API (index.js + stats.js)
│   ├── ai-advisor/             # Chat, capabilities, seed-data
│   └── admin/                  # Admin stats & verification
├── backend/
│   └── src/
│       ├── index.js            # Express server (local dev)
│       ├── routes/             # Express route handlers
│       ├── middleware/          # Auth middleware
│       └── services/            # AI advisor service
├── frontend/
│   └── src/
│       ├── components/         # React components
│       │   ├── chat/           # AI chat widget
│       │   ├── sustainability/ # Score gauges, SDG wheel, etc.
│       │   ├── common/         # Reusable UI (Button, Card, Modal)
│       │   ├── charts/         # Chart.js visualizations
│       │   ├── layout/         # Sidebar, header, footer
│       │   └── three/          # 3D Three.js components
│       ├── pages/              # Route pages
│       ├── context/            # React context providers
│       ├── services/           # API service layer
│       └── utils/              # Calculations & helpers
├── supabase-schema.sql         # Complete database schema
├── screenshots/                # App screenshots
└── vercel.json                 # Vercel configuration
```

---

## 📊 API Reference

### Public Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Health check & DB status |
| `GET` | `/api/leaderboard` | Top 50 ranked events |
| `GET` | `/api/leaderboard/stats` | Global aggregate statistics |
| `GET` | `/api/ai-advisor/capabilities` | Available AI features list |

### Authenticated Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/analyses` | List user's analyses |
| `POST` | `/api/analyses` | Create new analysis |
| `DELETE` | `/api/analyses/:id` | Delete an analysis |
| `POST` | `/api/ai-advisor/chat` | Send chat message |
| `POST` | `/api/ai-advisor/seed-data` | Seed 12 sample events |

### Admin Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/admin/stats` | Platform-wide statistics |
| `POST` | `/api/admin/verify` | Verify admin credentials |

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Public anon key for client requests |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (admin operations) |
| `VITE_SUPABASE_URL` | ✅ | Frontend-accessible Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Frontend-accessible anon key |
| `AI_API_KEY` | ❌ | OpenAI API key for AI chat |
| `ADMIN_SECRET` | ❌ | Admin panel access secret |

---

## 📄 License

This project is part of an IBM BOP (Business Operations Platform) demonstration.

---

<p align="center">
  <strong>Powered by EcoEvent AI</strong><br />
  <em>Plan Smarter. Waste Less. Create Impact.</em><br />
  <br />
  <a href="https://ecoevent-ai.vercel.app" target="_blank">🌐 ecoevent-ai.vercel.app</a>
</p>
