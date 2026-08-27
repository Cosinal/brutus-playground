# Eldorado Gold Investment Dashboard

**By Jorden Shaw** | [LinkedIn](https://linkedin.com/in/jordenshaw587/)

A conversational investment dashboard for Eldorado Gold Corporation (ELD/EGO) that answers questions by rebuilding the entire interface around your query.

🔗 **Live Demo**: [https://brutus-playground.vercel.app](https://brutus-playground.vercel.app) *(will be updated after deployment)*

---

## What This Does

This is Jorden Shaw's personal website—not a portfolio page with a dashboard tucked away, but a **single-page live investment dashboard** that IS the site.

**Default experience**: 5 prebuilt charts analyzing Eldorado Gold using public Q2 2026 data.

**Question-driven mode**: Ask "what was profitability" and the **entire board rebuilds** to show profitability from every angle—company trend, FCF split (operating vs growth capex), mine-level AISC, metal revenue, earnings. Same for production, Skouries, or other focused questions. The question owns the layout.

---

## Data & Sources

All figures from **public sources only**. No invented numbers, no confidential work product.

### Sources (as of August 2026)
1. **Eldorado Gold Q2 2026 Financial Results** (eldoradogold.com/investors)
2. **Q2 2026 MD&A** filed on SEDAR+ and SEC EDGAR
3. **Yahoo Finance** for ELD.TO (TSX, CAD) and EGO (NYSE, USD) market data
4. **Kitco.com / TradingView** for gold spot prices (USD/oz)

### Key Figures (Q2 2026)
- **Production**: H1 2026: 204,974 oz gold | FY 2026 Guidance: 495–600 koz
- **AISC**: $1,926/oz USD (consolidated)
- **Realized gold**: $4,379/oz USD
- **Cash margin**: $2,453/oz (realized minus AISC)
- **FCF**: -$334.1M total, +$40.9M ex-growth (Skouries + McIlvenna Bay capex consuming -$375M)
- **Revenue**: $487.5M total (gold $449.7M, other metals $37.8M)

### By Mine (Q2 2026, USD/oz)
- **Lamaque** (Canada): AISC $1,192 | 46 koz
- **Kışladağ** (Türkiye): AISC $2,407 | 32 koz
- **Efemçukuru** (Türkiye): AISC $2,252 | 15 koz
- **Olympias** (Greece): AISC $2,465 | 10 koz
- **McIlvenna Bay** (Canada): ramping, first Cu June 2026, first Zn July 2026
- **Skouries** (Greece): commissioning, first Cu-Au concentrate Q3 2026, commercial Q4 2026

---

## Features

### Default Dashboard (5 Charts)
1. **Production by Mine** – Quarterly gold production (koz) by asset, Q1 2025 → Q4 2026*
2. **AISC vs Gold** – Consolidated AISC vs realized gold price trend
3. **Asset Mix** – Q2 2026 production breakdown by mine (pie chart)
4. **Ramp Timeline** – Skouries & McIlvenna Bay milestones (on-track, achieved, delayed)
5. **ELD vs Gold Price** – 24-month stock (ELD.TO CAD) vs gold (USD/oz) correlation

### Profitability Mode (Question Takes Over)
Ask **"what was profitability"** (or earnings, margin, AISC vs gold) and the board rebuilds with 5 profitability views:
1. **Company Trend**: Realized gold vs AISC vs TCC (Q1 2025 → Q2 2026)
2. **FCF Split**: Total FCF vs FCF ex-growth projects (shows -$334M vs +$41M for Q2)
3. **By Mine & Country**: Q2 AISC by mine, grouped Canada / Türkiye / Greece
4. **By Metal**: Gold revenue vs other metals (Cu/Zn/Ag) over time
5. **Revenue & Earnings**: Revenue, adj. EBITDA, net income trend

**No fake segments**: Eldorado does not report "services." If asked, the dashboard explains what's actually disclosed.

### Chat Commands
- **Mode switching**: `"what was profitability"` → profitability board | `"reset"` → default 5 charts
- **Filter**: `"show only Lamaque"`, `"just Canada"`, `"hide Türkiye"`
- **Modify**: `"restyle AISC to dark gold theme"` (theme variants)
- **Add/Remove**: `"remove the timeline"`, `"add production"`
- **Answer**: `"what is Q2 AISC?"` → sources exact figures with citation

---

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **React 18** with client-side state for mode switching
- **Recharts** for all visualizations
- **Tailwind CSS** for dark finance aesthetic
- **Rule-based intent parser** – chat works without LLM API keys using pattern matching and templated responses

No paid APIs. No secrets required. The entire dataset is baked into the repo as TypeScript data structures so the site works offline/static.

---

## Installation & Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
# → http://localhost:3000

# Build for production
npm run build
npm start
```

---

## Deployment

### Vercel (Recommended)
1. Push this repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Framework: Next.js (auto-detected)
4. Build command: `npm run build` (default)
5. Deploy

The site is static-export compatible. Preview deploy URL becomes the live demo immediately.

### Cloudflare Pages / GitHub Pages
Next.js static export:
```bash
npm run build
# Deploy .next/static or use next export if configured
```

---

## Chat Examples

### Profitability Mode
- `"what was profitability"` → switches to 5-view profitability analysis
- `"were they profitable"` → profitability board
- `"how did they make money"` → profitability board

### Filters (work in any mode)
- `"show only Lamaque"` → filter to Lamaque
- `"just Canada"` → Canadian operations
- `"hide Türkiye"` → exclude Türkiye mines

### Questions
- `"what is Q2 AISC?"` → "$1,926/oz USD consolidated. Lamaque $1,192..."
- `"what was production?"` → "Q2 2026: 104 koz (Lamaque 46, Kışladağ 32...)"

### Reset
- `"reset"` or `"show the full dashboard"` → back to default 5 charts

---

## Project Structure

```
/app
  layout.tsx       # Root layout, metadata
  page.tsx         # Main dashboard with mode switching logic
  globals.css      # Dark theme

/components
  Charts.tsx       # All chart components (default + profitability)
  ChatPanel.tsx    # Chat UI with mode indicator

/data
  eldorado-data.ts # Sourced data: production, AISC, profitability, ramp

/lib
  chat-parser.ts   # Intent parser for mode switching and commands
```

---

## Investment Thesis (Dashboard's Argument)

Eldorado Gold is executing a 2026 polymetallic transformation:

1. **Skouries** (Greece): Q3 2026 first Cu-Au concentrate, Q4 commercial → major copper-gold asset goes live
2. **McIlvenna Bay** (Canada): June 2026 first Cu, July first Zn → ramping to 2,750 tpd
3. **Cost tension**: Q2 2026 AISC $1,926/oz elevated vs 2025 avg ~$1,810/oz (Olympias high-cost, Skouries pre-commercial)
4. **FCF bifurcation**: Operating mines +$41M FCF; growth projects -$375M capex → total -$334M

**Decision framework**:
- ✅ **If**: Skouries + McBay ramp on schedule AND costs compress <$1,800/oz by Q1 2027 → asset base transforms, polymetallic story de-risks
- ⚠️ **If**: Ramps slip or costs stay >$1,900/oz → margin pressure at $3,000–3,200 gold becomes a concern

This dashboard tracks production, cost trajectory, and ramp milestones that drive the 2027 investment decision.

---

## Notes

- **Not investment advice**. This is a portfolio piece demonstrating modern web dev, data viz, UX design, and investment analysis.
- **No confidential data**. All figures from public filings and market sources.
- **Currency explicit**: USD vs CAD labeled everywhere.
- **Blanks stay blank**: If a data series doesn't exist in public filings, dashboard says so rather than inventing figures.

---

**Built by Jorden Shaw** | August 2026  
[LinkedIn](https://linkedin.com/in/jordenshaw587/) | [GitHub](https://github.com/Cosinal/brutus-playground)
