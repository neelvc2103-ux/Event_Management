# EventCraft 🇮🇳 - GenAI-Powered Event Planning Assistant

> A full-stack, India-first GenAI event planning assistant for weddings, birthdays, and community festivals. Built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, Recharts, and swappable LLM engines (Anthropic Claude & Google Gemini).

---

## 🌟 Highlights & Key Capabilities

- **India-First Regional Nuance**:
  - Currency in **Indian Rupees (INR ₹)** formatted via the Indian numbering system (`₹15,00,000`, `₹30,000`, `₹2,00,000`).
  - **Wedding Sub-Events**: Custom selection for Engagement/Roka, Mehendi, Haldi/Pithi, Sangeet & Choreography, Wedding Ceremony (Muhurat/Pheras), and Reception.
  - **Community & Festival Procedures**: Tailored for Ganesh Utsav, Navratri/Garba, Diwali Milan, and Society Annual Days with municipal/police sound permissions (10 PM sound curfew), fire-safety NOCs, and pandal/shamiana setups.
  - **Birthdays**: Dedicated tracks for kids (magic shows, bouncy castle, theme cakes, return gifts) and adults (cocktails, live bands, lounges).
  - **Strict Cultural & Dietary Respect**: Seamless handling of Jain, Swaminarayan, Halal, Pure Vegetarian, and regional traditions without stereotyping.

- **Bulletproof Budget Rebalancing & Live Donut Chart**:
  - Category percentages always sum strictly to 100%.
  - Rupee amounts are computed in code via the Largest Remainder Method so that `sum(amounts) === totalBudget` down to the exact single rupee.
  - Dragging sliders or entering rupee values auto-rebalances remaining categories proportionally in real time.

- **Zero-Past Backward Timelines**:
  - Timelines are dynamically calculated backward from the target event date.
  - If an event is scheduled too soon, the engine automatically compresses milestones and flags a clear notice in the summary.

- **Swappable LLM Architecture**:
  - Seamlessly switch between **Anthropic Claude** (via official `@anthropic-ai/sdk`) and **Google Gemini** (via `@google/generative-ai`) using `LLM_PROVIDER=anthropic` or `gemini`.
  - Server-side only route handlers ensure zero client-side API key exposure.
  - Automatic retry mechanism with error correction if LLM JSON is malformed.
  - Built-in authentic domain generator fallback ensures the app runs smoothly out of the box even before API keys are configured.

- **Clean Printable PDF & WhatsApp Share**:
  - Clean `@media print` layout formatting all 4 tabs into an executive event dossier.
  - One-click "Share on WhatsApp" formatting an emoji-rich summary for family and committee members.

- **Plan Assistant AI Chat Drawer**:
  - Ask follow-ups ("make it 15% cheaper", "what are sound curfew rules?").
  - Directly applies real-time updates to the active plan.

---

## 🏗️ Project Architecture

```
PromptWars/
├── app/
│   ├── api/
│   │   ├── plan/route.ts        # POST: Validates form & generates full event plan
│   │   ├── regenerate/route.ts  # POST: Regenerates specific idea section
│   │   └── chat/route.ts        # POST: Conversational planning assistant & updates
│   ├── globals.css              # Warm festive Indian palette & print styles
│   ├── layout.tsx               # Root layout with Outfit & Inter typography
│   └── page.tsx                 # Main application state machine & controller
├── components/
│   ├── tabs/
│   │   ├── BudgetTab.tsx        # Recharts Donut chart & auto-rebalancing sliders
│   │   ├── TimelineTab.tsx      # Countdown, task checklists & overdue flags
│   │   ├── VendorsTab.tsx       # Actual spend vs estimate & booked toggles
│   │   └── IdeasTab.tsx         # Themes, regional menu, decor & regeneration
│   ├── ChatDrawer.tsx           # Interactive AI assistant drawer
│   ├── LandingHero.tsx          # Pitch, primary CTA & 1-click test scenarios
│   ├── LoadingPlanState.tsx     # Skeleton UI with rotating Indian status messages
│   ├── MultiStepForm.tsx        # 3-step form with progress bar and presets
│   ├── Navbar.tsx               # Branding, dark mode toggle & saved plans count
│   └── SavedPlansDrawer.tsx     # LocalStorage drawer to manage, load & delete plans
├── lib/
│   ├── budgetMath.ts            # Mathematical rebalancing & exact rupee distribution
│   ├── dateUtils.ts             # Backward timeline date calculation & compression
│   ├── formatters.ts            # Indian currency (INR ₹) & date formatters
│   ├── llmClient.ts             # Swappable Anthropic Claude / Google Gemini client
│   ├── mockPlanGenerator.ts     # Authentic India-first domain generator
│   ├── prompts.ts               # Domain-specific Indian event prompts
│   ├── rateLimit.ts             # IP-based rate limiting & input sanitization
│   ├── schemas.ts               # Zod validation schemas for form & LLM output
│   ├── storage.ts               # LocalStorage persistence & sample inputs
│   └── utils.ts                 # Tailwind cn merge utility
├── tests/
│   ├── budgetMath.test.ts       # Vitest tests for budget math & exact sum
│   └── dateUtils.test.ts        # Vitest tests for backward dates & compression
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: v18.17.0 or later (v20+ recommended)
- **npm** or **pnpm**

### 2. Clone & Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` to configure your preferred LLM provider:
```env
# Choose 'anthropic' or 'gemini'
LLM_PROVIDER=anthropic

# Anthropic Claude Configuration
ANTHROPIC_API_KEY=your_claude_api_key_here
LLM_MODEL=claude-3-5-sonnet-20241022

# Google Gemini Configuration (if using LLM_PROVIDER=gemini)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro
```
*(Note: If no API keys are provided, EventCraft automatically uses its intelligent India-first fallback generator, allowing you to run and test all features instantly!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Unit Tests
```bash
npm test
```
Runs the Vitest test suite for budget math rebalancing and backward timeline date calculations.

---

## 🚢 Deploying to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the repository. Next.js App Router will be detected automatically.
4. In the **Environment Variables** section, add:
   - `LLM_PROVIDER`: `anthropic` (or `gemini`)
   - `ANTHROPIC_API_KEY`: your Anthropic API Key
   - `LLM_MODEL`: `claude-3-5-sonnet-20241022`
   - *(Optional for Gemini)*: `GEMINI_API_KEY`, `GEMINI_MODEL`
5. Click **Deploy**. Your app is live with full production edge routing!

---

## 🧪 3 Sample Test Inputs & Expected Output Shapes

### Scenario 1: Gujarati Wedding in Bhuj (₹15 Lakhs)
**Input Data:**
```json
{
  "eventType": "wedding",
  "eventName": "Aarav & Diya’s Gujarati Wedding",
  "eventDate": "2027-02-25",
  "guestCount": 350,
  "city": "Bhuj, Gujarat",
  "totalBudget": 1500000,
  "venueType": "banquet_hall",
  "vibe": "Traditional Gujarati elegance with vibrant Dandiya Sangeet, Jain catering, and royal mandap setup.",
  "presetVibes": ["Traditional", "Royal", "Fun"],
  "weddingSubEvents": ["engagement", "mehendi", "haldi", "sangeet", "wedding_ceremony", "reception"],
  "mustHaves": "Strict pure-vegetarian & Jain food counters, authentic live Dhol-Tasha, and grand Toran mandap entry.",
  "culturalPreferences": "Gujarati traditions (Lagna Geet, Hastamelap, Kanya Daan), auspicious afternoon muhurat."
}
```
**Expected Output Highlights:**
- **Budget**: Catering & Shahi Bhojan (35% = ₹5,25,000), Venue (22% = ₹3,30,000), Decor & Mandap (15% = ₹2,25,000), Photography (10% = ₹1,50,000), Panditji & Samagri (3% = ₹45,000). Total sums to exactly ₹15,00,000.
- **Vendors**: Halwai with Jain cooking separation, Panditji for Vedic Muhurat, Candid photographer, Dhol-Tasha troupe.
- **Menu**: Live Chaat Bazaar (Sev Puri, Dal Pakwan), Gujarati Kadhi, Puran Poli, Jalebi-Rabri, Kesar Thandai.

---

### Scenario 2: Kid's 5th Birthday in Pune (₹30,000)
**Input Data:**
```json
{
  "eventType": "birthday",
  "eventName": "Reyansh’s 5th Jungle Safari Birthday",
  "eventDate": "2026-11-20",
  "guestCount": 40,
  "city": "Pune",
  "totalBudget": 30000,
  "venueType": "society_ground",
  "vibe": "Fun, colorful Jungle Safari with balloon animals, live games, and cartoon mascot.",
  "presetVibes": ["Fun", "Modern"],
  "birthdayCategory": "kids",
  "mustHaves": "2-tier eggless jungle animal cake, interactive magic show, and animal-themed return hampers."
}
```
**Expected Output Highlights:**
- **Budget**: Kid Snacks & Food (38% = ₹11,400), Theme Decor & Balloon Arch (22% = ₹6,600), Custom Designer Cake (12% = ₹3,600), Magic Show & Games Host (12% = ₹3,600), Return Gifts (10% = ₹3,000), Venue Setup (6% = ₹1,800). Total sums to exactly ₹30,000.
- **Timeline**: Fast-track timeline within 25 days avoiding past dates.
- **Vendors**: Home baker for eggless theme cake, balloon artist, comedy magician.

---

### Scenario 3: Society Ganesh Utsav in Mumbai (₹2 Lakhs)
**Input Data:**
```json
{
  "eventType": "community",
  "eventName": "Gokuldham Society Ganesh Utsav 2026",
  "eventDate": "2026-12-10",
  "guestCount": 500,
  "city": "Mumbai",
  "totalBudget": 200000,
  "venueType": "society_ground",
  "vibe": "Vibrant spiritual festivities, eco-friendly Clay Ganesha, daily cultural Aarti, and grand Mahaprasad.",
  "presetVibes": ["Traditional", "Eco-friendly"],
  "communityType": "ganesh_utsav",
  "mustHaves": "Eco-friendly Shadu Mati idol, BMC & Police sound permission clearance, fire extinguishers, and silent generator.",
  "notes": "Need strict adherence to 10:00 PM police sound curfew."
}
```
**Expected Output Highlights:**
- **Budget**: Waterproof Pandal & Stage (28% = ₹56,000), Decibel-compliant Sound & Silent DG Generator (20% = ₹40,000), Mahaprasad & Bhandara (22% = ₹44,000), Eco-Murti & Daily Garlands (14% = ₹28,000), Police/BMC Permissions & Security (8% = ₹16,000), Cultural Prizes (8% = ₹16,000). Total sums to exactly ₹2,00,000.
- **Checklist**: Municipal ward structure clearance, local police sound curfew NOC, certified fire extinguishers, biodegradable leaf plates (pattals).

---

## 📐 Design Decisions & Architectural Rationale

1. **Client vs Server Boundary**:
   - All AI interactions and API keys stay exclusively on the server in Next.js App Router handlers (`app/api/*`). Zero credentials ever touch the client bundle.
2. **Deterministic Financial Math**:
   - LLMs are notoriously imprecise with floating point arithmetic. Rather than trusting the model's budget arithmetic, the server extracts normalized percentages and recomputes exact rupee amounts in TypeScript using the Largest Remainder Method, ensuring not a single rupee is lost or duplicated.
3. **Timeline Temporal Integrity**:
   - Dates calculated backward from the event date are clamped against `new Date()`. When the remaining window is compressed, tasks are redistributed smoothly so the user never receives a task due yesterday.
4. **Resilient User Experience**:
   - 1-click sample templates enable users to test and inspect the full dashboard in under 60 seconds without having to type form data manually or wait for cold starts.
