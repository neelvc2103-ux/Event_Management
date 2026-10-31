# AYOJA 🇮🇳 - Your Plans. Your People. Your Moments.

> **AYOJA** (derived from *Ayojan* - आयोजन) is an intelligent, India-first event planning and command center for weddings, birthdays, and community festivals. Built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, Recharts, and swappable Generative AI engines (Google Gemini & Anthropic Claude).

Live Deployment: [https://eventplanner2.vercel.app](https://eventplanner2.vercel.app)  
Repository: [https://github.com/neelvc2103-ux/Event_Management](https://github.com/neelvc2103-ux/Event_Management)

---

<p align="center">
  <img src="public/ayoja-logo.png" alt="AYOJA Brand Identity & Mark" width="360" />
</p>

## 🎨 Brand Identity & Visual Language

AYOJA combines luxury editorial aesthetics with high-precision logistical command:
* **Brand Name**: **AYOJA** (Pronounced *uh-yoh-jah*)
* **Tagline**: `YOUR PLANS. YOUR PEOPLE. YOUR MOMENTS.`
* **Logo Concept**:
  * **People Together**: Dual flowing ribbons coming together like people and traditions to form the arch of the letter **A**.
  * **Celebration & Joy**: A radiant 4-pointed Royal Gold spark at the apex representing unforgettable memories.
  * **Progress & Planning**: A forward-moving form symbolizing organization and flawless execution.
* **Color Palette**:
  * **Celebration Plum** (`#6C1D4F`): Primary luxury brand anchor
  * **Vibrant Coral** (`#F0656B`): Radiant accent & CTA gradients
  * **Royal Gold** (`#D4A753`): Warm metallic accent & celebration spark
  * **Soft Blush** (`#F9E8E1`): Warm ambient canvas & subtle card borders
  * **Midnight** (`#1F1B2E`): Deep obsidian surface & high-contrast dark mode
* **Typography**: **Playfair Display** (Headings, wordmark & editorial titles) paired with **Inter** (Data grids, checklists & UI copy).

---

## ✨ Key Features & Capabilities

### 1. India-First Regional Intelligence
* **Authentic Currency & Numbering**: All budgets formatted strictly in **Indian Rupees (INR ₹)** using Indian comma separation (`₹15,00,000`, `₹2,00,000`, `₹30,000`).
* **Wedding Ceremony Framework**: Distinct handling for multi-day ceremonies including Engagement/Roka, Mehendi, Haldi/Pithi, Sangeet & Choreography, Lagna Muhurat/Pheras, and Reception.
* **Community & Festival Logistics**: Specialized blueprints for Ganesh Utsav, Navratri/Garba, and Society Days including municipal/police permissions, society NOCs, fire-safety clearances, and the mandatory **10:00 PM loudspeaker curfew**.
* **Cultural & Dietary Respect**: First-class support for Jain cooking separation (root vegetable exclusion, separate halwai utensils), Pure Vegetarian, Swaminarayan, and regional cuisines.

### 2. Mathematical Budget Rebalancing (Zero Drift)
* Category percentages always sum strictly to 100%.
* Uses the **Largest Remainder Method** to distribute whole rupees deterministically so `sum(category_amounts) === totalBudget` down to the exact rupee.
* Dragging any category slider or editing an amount auto-rebalances remaining categories proportionally in real time.

### 3. Zero-Past Backward Timelines
* Dynamically calculates deadlines backward from the target event date.
* If an event is scheduled on short notice, the engine compresses milestones and flags urgent tasks rather than assigning impossible historical dates.

### 4. What-If Scenario & Trade-Off Simulator (Stress-Testing)
* Interactive simulator allowing families to test stress scenarios:
  * **+20% Market Cost Spike**: Simulates inflation across catering/decor and recommends specific cuts (e.g., floral repurposing, menu streamlining).
  * **+50 Guest Surge**: Calculates the marginal food and seating impact and identifies buffer capacity.
  * **-15% Budget Cut**: Shows how to gracefully reduce expenses without compromising core cultural rituals.

### 5. Indicative Multi-Tier Vendor Quotation Matrix
* Synthesizes calculated price tiers (**Standard / Value**, **Curated / Recommended**, and **Luxury Experience**) derived from regional market benchmarks.
* Prepares families with **Negotiation Checklists**, audits typical hidden fees (generator fuel, overtime post 10 PM, GST), and provides questions to ask before signing contracts.
* *(Note: Quotes are comparative model benchmarks to aid procurement decisions rather than live third-party marketplace feeds).*

### 6. One-Click Editorial PDF & Print Dossier
* Generates high-fidelity printable executive handouts for:
  * **Family Elders / Treasurers**: Multi-tranche payment ledger (Advance, Mid-Way, Final Delivery) and budget breakdown.
  * **Venue & Operations Managers**: Day-of contact directory, sound curfew sign-off, and emergency kit checklist.

### 7. Interactive WhatsApp RSVP & Pass Dispatcher
* Generates pre-filled WhatsApp invitation text with personalized links for guests.
* Directs attendees to web-based credentials and dietary preference confirmations.

### 8. Strictly Optional VIP Gate Passes & Badges
* VIP access badges and QR credentials are treated as an **opt-in feature** (`+ Need VIP Pass? (Optional)`).
* Only renders when requested by the host for reserved seating, priority car parking, and elder access.

### 9. Dual Persistence: LocalStorage + Cloud Database
* Works out-of-the-box using browser `localStorage` for offline convenience.
* Supports saving multiple plans and sharing unique private cloud URLs with co-planners via PostgreSQL (Supabase / Vercel Postgres).

---

## 🤖 Gen AI Architecture & Integration

```
AYOJA Client (Next.js 14 App Router)
   │
   ├── POST /api/plan          ──► Validates inputs with Zod
   ├── POST /api/chat          ──► Conversational assistant (<PLAN_UPDATE> patcher)
   ├── POST /api/regenerate    ──► Regenerates discrete creative ideas
   │
Server-Side Execution Layer (lib/llmClient.ts)
   │
   ├── Swappable Provider Bridge:
   │     ├── Google Gemini SDK (@google/generative-ai) -> gemini-1.5-pro / gemini-1.5-flash
   │     └── Anthropic Claude SDK (@anthropic-ai/sdk)  -> claude-3-5-sonnet-20241022
   │
   ├── Self-Correcting Retry Loop:
   │     If output JSON is malformed, catches error and re-prompts with exact validation delta
   │
   ├── Deterministic Post-Processing:
   │     Overrides LLM arithmetic: Normalizes percentages and recalculates exact rupee amounts
   │     Clamps timeline dates to eliminate zero-past anomalies
   │
   └── Offline Fallback Engine (lib/mockPlanGenerator.ts):
         Provides realistic, culturally rich plans when running without external API keys
```

### Prompt Engineering Highlights
* **Strict JSON Mode**: Enforces pure RFC-8259 JSON output without markdown fences.
* **Tier-Based Pricing Rules**: Calibrates vendor rates against Indian city tiers (Tier 1 metros vs Tier 2/3 towns).
* **Conversational Patching**: The AI chat assistant outputs conversational guidance alongside an optional `<PLAN_UPDATE>{...}</PLAN_UPDATE>` JSON payload that automatically updates the active plan in state.

---

## 📱 Interactive User Experience & Modules

| Module / Screen | User Workflow & Capabilities |
| :--- | :--- |
| **Landing & Cultural Setup** | Interactive brief wizard, regional muhurat presets, and 1-click authentic test scenarios (Gujarati Wedding, Pune Birthday, Mumbai Ganesh Utsav). |
| **Budget Command Center** | Interactive Recharts donut visualization, exact rupee Largest Remainder distribution, lockable categories, and instant zero-drift slider rebalancing. |
| **Temporal Execution Timeline** | Zero-past backward calculation engine, dependency tags (e.g., Venue Booking must precede Decor/Catering), and countdown meters. |
| **Vendor Hub & Quotations** | Regional planning benchmarks, milestone payment tranches (Advance, Mid-Way, Final), and 3-tier indicative quote matrix with hidden-fee audits. |
| **What-If Trade-Off Simulator**| Live stress-testing for +20% market cost spikes, +50 guest surges, and -15% budget cuts with auto-mitigation strategies. |
| **Operations & Run-of-Show** | Hour-by-hour day-of checklist, 10 PM police sound curfew flags, duty coordinators, and optional VIP gate pass QR credentials. |
| **Editorial Handout & WhatsApp** | One-click printable PDF dossier for family elders and venue managers, plus pre-filled WhatsApp RSVP dispatcher. |

---

## 🛠️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Conversational AI assistant endpoint
│   │   ├── plan/route.ts        # Primary event plan generation endpoint
│   │   ├── regenerate/route.ts  # Creative section regeneration endpoint
│   │   └── share/route.ts       # Cloud plan persistence & retrieval endpoint
│   ├── globals.css              # AYOJA theme tokens & print stylesheets
│   ├── layout.tsx               # Root layout, Playfair & Inter font loading
│   └── page.tsx                 # View state machine (landing, form, loading, plan)
├── components/
│   ├── AyojaLogo.tsx            # Precision vector SVG mark & wordmark
│   ├── Navbar.tsx               # Navigation, Home button, plans drawer, theme toggle
│   ├── LandingHero.tsx          # Pitch, sample scenarios & FAQ accordion
│   ├── MultiStepForm.tsx        # 3-step planning wizard with Indian presets
│   ├── LoadingPlanState.tsx     # Skeleton UI with rotating cultural status messages
│   ├── PlanDashboard.tsx        # Executive command center & KPI headers
│   ├── TradeOffSimulatorModal.tsx # What-if simulator (+20% spike, +50 guests)
│   ├── VendorQuotationModal.tsx # Indicative 3-tier price quotes & negotiation prep
│   ├── EditorialPdfExportModal.tsx # Printable ledger for elders & venue managers
│   ├── WhatsAppRsvpDispatcher.tsx # Interactive WhatsApp invite generator
│   ├── DigitalPassModal.tsx     # Optional VIP badge & QR credential viewer
│   ├── ChatDrawer.tsx           # Interactive AI assistant drawer
│   └── tabs/
│       ├── BudgetTab.tsx        # Recharts Donut chart & auto-rebalancing sliders
│       ├── TimelineTab.tsx      # Backward timeline with overdue warnings
│       ├── VendorsTab.tsx       # Vendor status, milestones & quotation triggers
│       ├── IdeasTab.tsx         # Themes, regional dining & decor styling
│       └── OperationsTab.tsx    # Run-of-show schedule, sound curfew & gate desk
├── database/
│   └── schema.sql               # PostgreSQL schema for cloud persistence
├── lib/
│   ├── budgetMath.ts            # Largest Remainder Method financial redistribution
│   ├── dateUtils.ts             # Backward timeline calculation & temporal clamping
│   ├── formatters.ts            # Indian currency (₹) & date formatters
│   ├── llmClient.ts             # Multi-provider LLM client with self-correcting retry
│   ├── mockPlanGenerator.ts     # Offline domain generator
│   ├── prompts.ts               # Domain-specific prompt definitions
│   └── schemas.ts               # Zod validation schemas
└── tests/                       # 46 Vitest unit tests (budget math, dates, schemas)
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18.17+ or 20+
* npm or pnpm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/neelvc2103-ux/Event_Management.git
cd Event_Management
npm install
```

### 2. Environment Configuration (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your preferred LLM provider:
```env
# Choose 'anthropic' or 'gemini' (Defaults to offline generator if omitted)
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# OR Anthropic:
# LLM_PROVIDER=anthropic
# ANTHROPIC_API_KEY=your_anthropic_api_key_here
# LLM_MODEL=claude-3-5-sonnet-20241022

# Optional Cloud Database (Supabase / Vercel Postgres)
# POSTGRES_URL=postgres://...
```

*(Note: If no API keys are provided, AYOJA automatically uses its intelligent India-first fallback generator, allowing you to run and test all features instantly without configuration).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite
```bash
npx vitest run
```
Runs all 46 unit tests covering budget mathematics, zero-past date calculations, rate limiting, and Zod schemas.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## ⚖️ Transparent Data & Modeling Disclaimers

1. **Regional Reference Dataset**: Vendor directories, catering estimates, and venue options are drawn from AYOJA's built-in regional planning reference benchmarks (covering major Indian cities including Bhuj, Mumbai, Pune, Ahmedabad, Jaipur, and Delhi NCR) rather than a live third-party marketplace API.
2. **Indicative Quotation Models**: The Vendor Quotation Matrix provides calculated market-rate tiers (Standard, Recommended, Luxury) designed to illustrate comparative procurement trade-offs and common hidden fees. These are planning benchmarks to prepare families for negotiations before formal supplier quotes are solicited.
3. **Sound Curfew Guidelines**: Noise restrictions and police permission reminders are based on standard Indian municipal regulations (e.g., Supreme Court of India 10:00 PM loudspeaker guideline). Always consult local police stations and municipal wards for designated festive exemptions.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
