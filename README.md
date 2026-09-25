# AnekEk (अनेकेक)
### "Co-Owned Platform for Gig Workers"
**Smart India Hackathon 2026**  
**Problem Statement:** 26089  
**Theme:** Agriculture, FoodTech & Rural Development / Household & Community Services  
**Category:** Software  

---

> *"Fair for the hands that work. Trusted by the homes that call."*

---

## 1. Project Overview & Vision

AnekEk is India's first worker-owned digital cooperative marketplace for household, trade, and community services (electricians, plumbers, carpenters, cleaners, caregivers, cooks, painters, and technicians). 

Unlike conventional gig-service aggregators that treat workers as expendable contractors, extract 25%–35% commissions, and operate on opaque algorithms, **AnekEk transforms gig workers into verified co-owners of their digital marketplace**:
- **8%–10% Capped Commission:** 90%+ of customer payments go directly to the worker.
- **Transparent Shared Ledger:** 100% of the retained 10% commission remains in member-governed funds: Emergency Worker Welfare (30%), Accidental/Health Insurance (30%), Collective Tools & Equipment (20%), and Year-End Member Dividends (20%).
- **Democratic Governance ("One Member, One Vote"):** Workers vote directly on commission rates, cluster pricing adjustments, and federation proposals.
- **Institutional Verification:** Onboarding integrates with Self-Help Groups (SHGs), Labour Cooperative Federations, Digilocker/e-Shram e-KYC simulation with strict privacy masking (`XXXX-XXXX-4821`), and mandatory character certificates for vulnerable care roles.
- **Explainable AI Matching:** Transparent scoring combining verified trade skills, proximity, schedule availability, community ratings, and a **fair rotation index** to prevent algorithm monopoly.
- **Bilingual & Low-Literacy Friendly:** Complete English & Hindi interfaces with masked privacy protection for communications.

---

## 2. Tech Stack & Architecture

```
C:\Users\prash\.gemini\antigravity\scratch\anekek\
├── backend/                  # REST API & Database Layer
│   ├── prisma/
│   │   ├── schema.prisma     # Relational SQLite/PostgreSQL schema
│   │   └── seed.ts           # Realistic demo dataset
│   ├── src/
│   │   ├── controllers/      # Auth, Workers, Services, Bookings, Payment, Co-op, Chat, Admin
│   │   ├── services/         # Explainable AI Matching & Transparent Pricing Engine
│   │   ├── middleware/       # JWT Authentication & Role-based Access Control
│   │   ├── routes/           # REST endpoints
│   │   ├── types/            # Shared TypeScript types
│   │   └── index.ts          # Express server
│   └── tests/                # Automated Vitest integration test suite
│
├── frontend/                 # React SPA (Vite + TypeScript)
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar, Hero, Modals, Cards, Charts)
│   │   ├── i18n/             # Bilingual dictionaries (English & Hindi)
│   │   ├── services/         # API client
│   │   ├── styles/           # AnekEk Authentic Design Tokens (CSS)
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Master view coordinator
│   │   └── main.tsx
│   └── vite.config.ts        # Vite configuration with API proxy
│
├── .env.example
├── package.json
└── README.md
```

### Stack Details
- **Frontend:** React 18, TypeScript, Vite, Recharts (for governance & analytics visualization), Lucide React icons, Leaflet.
- **Backend:** Node.js, Express, TypeScript, tsx, JWT.
- **Database & ORM:** Prisma ORM with SQLite for zero-configuration, instant out-of-the-box evaluation (`file:./dev.db`), 100% production-ready for PostgreSQL.
- **Testing:** Vitest with 12 comprehensive unit and integration tests.

---

## 3. Preserved Authentic Design Identity

AnekEk preserves its warm, community-first visual language:
- **Palette:**
  - Ink Teal (`#1C4B44`) & Ink Teal Dark (`#123832`)
  - Turmeric (`#D89B3C`) & Turmeric Light (`#EFC988`)
  - Clay (`#A8503A`)
  - Warm Paper (`#F3ECDC`) & Paper Dark (`#E8DFC8`)
  - Charcoal (`#2A2420`)
  - Subtle Thread (`#C9BFA0`)
  - Warm White (`#FFFDF8`)
- **Typography:**
  - **Rokkitt:** Hero quotations, big statistics, card headers, and badges.
  - **Work Sans:** Readable, accessible body text and responsive forms.
  - **IBM Plex Mono:** Transparent financial numbers, distance badges, and transaction codes.

---

## 4. Quick Start & Running the Project

### Prerequisites
- Node.js (v18+ or v24+)
- npm

### Step 1: Install Dependencies
```bash
# In the backend directory
cd backend
npm install

# In the frontend directory
cd ../frontend
npm install
```

### Step 2: Database Setup & Seed
```bash
cd backend
# Generate Prisma Client & push schema to dev.db
npx prisma db push

# Seed realistic demo data
npx tsx prisma/seed.ts
```

### Step 3: Run the Automated Test Suite
```bash
cd backend
npm test
```
*All 14 tests verify pricing calculations, AI explainable matching, booking transitions, demo payments, rating aggregates, worker registrations, OTP validation, and democratic voting.*

### Step 4: Run the Application
In terminal 1 (Backend):
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

In terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```

---

## 5. Demo Personas & Hackathon Evaluation Guide

The platform includes a **One-Click Persona Switcher** in the top navigation bar (`🎭 Switch Demo Persona`):

| Persona | Name | Role / Title | Seed Phone | Demo OTP |
| :--- | :--- | :--- | :--- | :--- |
| **Worker** | Rekha Sharma | Home Cleaning & Care Co-Owner | `9876543210` | `1234` |
| **Customer** | Priya Sharma | Powai Resident / Household Provider | `9123456789` | `1234` |
| **Admin** | Federation Board | Cooperative Secretary & Audit Board | `9999988888` | `1234` |

*Note: For manual mobile OTP entry during live judging, enter any registered number and input `1234`.*

---

## 6. End-to-End SIH 2026 Presentation Flow

Follow this exact 10-step flow during the hackathon demonstration:

1. **Open Landing Page (`http://localhost:3000`):**
   - View Hero quotation, rotating verified co-op stamp, and live stat strip.
   - Click `📡 Use Live Location` to observe high-precision GPS simulation and distance radar mockup.
2. **Explore Services & Co-op Economics:**
   - Scroll to *"What We Offer"* featuring 12 services with worker-owned badges.
   - Interact with the *"One Booking. Shared Value."* slider to visualize the transparent 90%/10% split and the Recharts allocation donut chart.
3. **Discover Verified Workers:**
   - Click *"Home Cleaning"* or *"Book a Service"*.
   - Filter by distance or sort by `⚡ AI Smart Match`.
   - Inspect the **"Why this worker?"** box showing explainable AI factors (skill match, 0.6 km distance, fair rotation allocation).
4. **Transparent Price Breakdown:**
   - Click `Book Now` on Rekha Sharma's card.
   - Review *"Where your money goes"*: Base price ₹350, distance top-up ₹0, customer total ₹350, worker net ₹315, and cooperative breakdown.
5. **DEMO UPI Payment:**
   - Click `Proceed to DEMO UPI Payment`.
   - Enter `priya@okhdfcbank` and click `Pay ₹350`.
   - Observe instant transaction receipt with unique transaction reference (`UPI-DEMO-XXXXXXXX`).
6. **Switch to Worker Persona (`🧑‍🔧 Rekha Sharma`):**
   - Click `🎭 Switch Demo Persona` $\rightarrow$ `Worker: Rekha Sharma`.
   - Go to `🗓️ Bookings` tab: Observe incoming booking.
   - Click `✓ Accept Job`, then progress to `🚴 Mark: On the Way`, `🛠️ Mark: Started`, and `✓ Mark: Completed`.
   - Check `📊 Dashboard` tab: Net earnings increase immediately.
7. **Switch to Customer Persona (`🏠 Priya Sharma`):**
   - Go to `📜 Booking History` tab.
   - Click `⭐ Rate Worker`: Select 5 stars and submit review comment.
8. **Democratic Governance in Action:**
   - Switch back to `Worker: Rekha Sharma`.
   - Go to `🗳️ Vote & Decisions` tab: Select proposal *"Raise emergency welfare contribution from 2% to 3%"*.
   - Click `Yes, approve`: Observe one-member-one-vote lock and instant vote percentage recount.
9. **Ideas & Collective Forum:**
   - Open `💡 Ideas & Problems` tab: Upvote a fellow worker's rainy-day buffer proposal.
10. **Federation Admin & Demand Forecasting:**
    - Switch to `🛡️ Admin: Federation Board`.
    - View weekly booking trends, service demand chart, worker verification approvals queue, and dispute resolution board.

---

## 7. Mathematical Models & Formulas

### A. Transparent Pricing Ledger
$$\text{Distance Fee} = \max(0, \text{Distance}_{\text{km}} - 1.0) \times ₹20$$
$$\text{Customer Total} = \text{Base Price} + \text{Distance Fee}$$
$$\text{Cooperative Commission (10\%)} = \text{Customer Total} \times 0.10$$
$$\text{Worker Net Earning} = \text{Customer Total} - \text{Commission}$$

**Cooperative Allocation:**
- Welfare Pool = $30\%$ of Commission
- Insurance Pool = $30\%$ of Commission
- Equipment & Reinvestment Pool = $20\%$ of Commission
- Member Dividend Pool = $20\%$ of Commission

### B. Explainable AI Matching Score
$$\text{Score} = 0.35 \cdot S_{\text{skill}} + 0.20 \cdot S_{\text{dist}} + 0.15 \cdot S_{\text{avail}} + 0.10 \cdot S_{\text{rating}} + 0.10 \cdot S_{\text{exp}} + 0.10 \cdot S_{\text{rotation}}$$

Where:
- $S_{\text{skill}} \in \{0.0, 1.0\}$: Exact trade skill certification.
- $S_{\text{dist}} = \max(0, 1 - \frac{\text{Distance}_{\text{km}}}{10})$: Distance decay via Haversine.
- $S_{\text{rotation}} \in [0, 1]$: Fair rotation points ensuring equitable job distribution across all members.

---

## 8. Privacy & Security Architecture
- **Aadhaar Masking:** Only masked placeholders (`XXXX-XXXX-4821`) are processed and displayed; raw 12-digit Aadhaar numbers are never stored in plain text.
- **Masked Communication:** Phone numbers remain confidential. In-app chat and audio call buttons connect through anonymous platform channels.
- **Role-Based Authorization:** Server-side JWT validation guards worker actions, customer bookings, and admin governance decisions.

---

## 9. Multilingual Support
Toggle between English and Hindi (`🌐 EN` / `🌐 HI`) at any time from the top navigation. Translations cover all navigation, services, pricing equations, dashboard tabs, booking statuses, and cooperative voting dialogs.

---

## 10. Team & Submission Credits
Developed for **Smart India Hackathon 2026** by the AnekEk Team under the theme *Agriculture, FoodTech & Rural Development / Household & Community Services*.
