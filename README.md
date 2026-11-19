[github_project_readme.md](https://github.com/user-attachments/files/35101406/github_project_readme.md)
# ArthaJRF · UGC NET & JRF Study Workbench

**ArthaJRF** (`UGC-NET-Cracker`) is an interactive, dual-paper preparation platform built specifically for **NTA UGC NET & JRF aspirants**, covering both **Paper 1 (Teaching & Research Aptitude)** and **Paper 2 (Economics — Subject Code 01)**.

🌐 **Live Application:** [https://ugc-net-cracker-nine.vercel.app](https://ugc-net-cracker-nine.vercel.app)

---

## ✨ Key Features

### 1. Dual-Paper Mock & PYQ Practice Arena (`MockArena`)
* **Paper Switcher:** Seamlessly toggle between **Paper 2: Economics (Code 01)** (260+ questions) and **Paper 1: General Aptitude** (75+ questions across all 10 units).
* **Two Practice Modes:**
  * **Practice & Explain Mode:** Check answers immediately with detailed derivations, econometric/logical notes, and NTA exam-trap tips.
  * **Timed NTA CBT Simulation:** Countdown timer, interactive NTA-style question palette (Answered, Marked for Review, Visited, Not Visited), and post-submission unit-wise accuracy diagnostics.
* **Granular Filtering:** Filter drills by syllabus unit, question archetype (*Concept MCQ, Assertion & Reason, Statement I & II, Match List, Chronology, Numerical*), or bookmarked questions.

### 2. Interactive Economic Model & Curve Visualizer (`ModelLab`)
Hands-on comparative statics sandbox covering 9 essential UGC NET Economics diagram theories with live SVG graphs and parameter sliders:
1. **IS–LM & Policy Effectiveness** (Fiscal vs. Monetary multipliers, Liquidity Trap, and Classical crowding-out ranges)
2. **Solow–Swan Growth Model** (Steady-state capital $k^*$, output $y^*$, consumption $c^*$, and Golden Rule $k_{\text{gold}}$)
3. **Monopoly & Deadweight Loss** ($\text{AR}$, $\text{MR}$, $\text{MC}$, Lerner Index, Consumer Surplus, and Harberger DWL triangle)
4. **Phillips Curve & NAIRU** (Short-Run vs. vertical Long-Run Phillips Curve, adaptive inflation expectations, and supply shocks)
5. **Lorenz Curve & Gini Coefficient** (45° line of equality, quintile shares, and inequality curvature)
6. **Tax Incidence & Laffer Curve** (Elasticity-based buyer/seller tax burden, excess burden, and revenue-maximizing tax rates)
7. **Sweezy's Kinked Demand Curve** (Oligopoly price stickiness and discontinuous $\text{MR}$ vertical gap)
8. **J-Curve & Balance of Payments** (Post-depreciation short-run price lag dip vs. long-run Marshall–Lerner volume recovery)
9. **Kuznets & Environmental Kuznets Curve** (Inverted-U trajectory across development stages)

### 3. Syllabus Vault & Readiness Dashboard (`OverviewDashboard` & `SyllabusVault`)
* **10-Unit Economics Syllabus Tracker:** Mark topic mastery status, save custom revision notes, and track flashcard progress.
* **JRF Score Target Planner:** Set Paper 1 and Paper 2 score targets and monitor recent mock test performance—saved locally in the browser via `localStorage`.

### 4. Creator Cover Screen (`WelcomeScreen`)
* Clean landing screen showcasing live question bank counts, platform highlights, and creator credentials before launching into the workbench.

---

## 🗂️ Project Structure

```text
UGC-NET-Cracker/
├── public/
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.tsx      # Landing cover page & creator card
│   │   ├── TopBar.tsx             # Navigation bar & quick-start trigger
│   │   ├── OverviewDashboard.tsx  # Target planner & unit diagnostics
│   │   ├── MockArena.tsx          # Dual-paper CBT mock & PYQ practice engine
│   │   ├── ModelLab.tsx           # 9 interactive SVG economic diagram labs
│   │   └── SyllabusVault.tsx      # Unit-wise notes, mastery status & flashcards
│   ├── data/
│   │   ├── questionBank.ts        # Paper 2 Economics PYQ & concept bank (260+ Qs)
│   │   ├── paper1QuestionBank.ts  # Paper 1 General Aptitude bank (75+ Qs)
│   │   ├── syllabusData.ts        # Official 10-unit Economics syllabus metadata
│   │   └── revisionVault.ts       # High-yield flashcards & quick revision notes
│   ├── types/
│   │   └── economics.ts           # TypeScript interfaces for questions, mocks & state
│   ├── App.tsx                    # Main application state & view router
│   └── main.tsx                   # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling & Icons:** Tailwind CSS, Lucide React
* **Graphics:** Custom responsive SVG mathematical & economic curve plotting
* **Persistence:** Browser `localStorage` & `sessionStorage` (zero backend required)
* **Deployment:** Vercel (auto-deployed from GitHub `main`)

---

## 🚀 Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/Anshn013/UGC-NET-Cracker.git
cd UGC-NET-Cracker

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

To build for production:

```bash
npm run build
```

---

## 👨‍💻 Created & Curated By

**Anshin Shan K**  
*UGC NET Qualified (Economics) · MA Economics, Farook College, Calicut*

* **GitHub:** [github.com/Anshn013](https://github.com/Anshn013)
* **LinkedIn:** [linkedin.com/in/anshinshan13](https://www.linkedin.com/in/anshinshan13)
* **Email:** [anshinshan13@gmail.com](mailto:anshinshan13@gmail.com)
* **Phone:** +91 6235040913

---

*Built to help UGC NET & JRF aspirants practice smarter with conceptual clarity.*
