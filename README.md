# Eldorado Gold Investment Dashboard

**By Jorden Shaw**

A conversational investment decision dashboard for Eldorado Gold Corporation (TSX: ELD, NYSE: EGO).

## Investment Thesis

Eldorado Gold is executing a multi-asset transformation in 2026. **Skouries** (Greece) targets first copper-gold concentrate in Q3 2026 and commercial production Q4 2026, unlocking a major polymetallic asset. **McIlvenna Bay** (Canada) achieved first copper in June 2026 and first zinc in July 2026, ramping toward 2,750 tpd. These projects shift the company from a pure gold producer to a copper-exposed polymetallic miner. 

**The tension**: Q2 2026 AISC rose to $1,926/oz (vs. ~$1,810/oz in 2025), driven by Olympias' high costs and Skouries pre-commercial spending. H1 2026 production of 204,974 oz tracks toward FY 2026 guidance of 495–600 koz, but the story is back-half weighted. **The decision point**: if Skouries and McIlvenna Bay ramp on schedule and costs compress below $1,800/oz by Q1 2027, the asset base transforms. If costs stay elevated or ramps slip, margin compression at $3,000–$3,200 gold becomes a concern. This dashboard tracks the ramp, cost, and production data that drive the 2027 investment decision.

## Features

- **6 predesigned charts** on load: ELD price vs gold, quarterly production vs guidance, AISC trend, Skouries/McIlvenna Bay ramp timeline, gold/copper revenue mix, and a decision callout panel.
- **Conversational interface**: Ask the dashboard to filter (e.g., "Just Lamaque"), modify chart types ("Show AISC as a bar chart"), add visuals ("Add copper production"), or remove charts ("Remove the price chart").
- **Investment-grade responses**: The chat can answer questions like "Does Skouries slipping a quarter change the 2027 story?" with judgment-driven analysis, not KPI dumps.
- **Real public data**: All figures sourced from Eldorado Gold news releases, SEDAR+/SEC filings, and public market data (Yahoo Finance, Stooq). No fake numbers.
- **Mobile-usable**: Responsive design works on tablet and phone.
- **Dark finance aesthetic**: Clean, readable charts with a professional dark theme.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Rule-based intent parser**: Chat works without LLM API keys; uses pattern matching and templated responses to mutate charts and answer investment questions.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Chat Examples

Try these commands in the chat panel:

- **"Just Lamaque"** – Filter to Lamaque mine data
- **"Show AISC as a bar chart"** – Switch AISC to bar chart by mine
- **"Add copper production"** – Add copper production chart
- **"Remove the price chart"** – Hide the ELD vs gold price chart
- **"Does Skouries slipping a quarter change the 2027 story?"** – Get investment analysis

## Data Sources

All data is from public sources:

- **Company disclosures**: Eldorado Gold Corporation news releases at [eldoradogold.com](https://www.eldoradogold.com)
- **Regulatory filings**: SEDAR+ (Canada) and SEC 6-K exhibits (USA)
- **Market data**: Yahoo Finance, Stooq, and similar public sources for ELD/EGO and gold prices
- **Key metrics**: H1 2026 production 204,974 oz; Q2 2026 AISC $1,926/oz; FY 2026 guidance 495–600 koz gold

If a data series is unavailable, the dashboard indicates this rather than inventing figures.

## Project Structure

```
/app
  layout.tsx          # Root layout with metadata
  page.tsx            # Main dashboard page with chart state management
  globals.css         # Global styles and dark theme

/components
  Charts.tsx          # All chart components (Price, Production, AISC, Ramp, Mix, Decision, Copper)
  ChatPanel.tsx       # Chat interface component

/data
  eldorado-data.ts    # Real Eldorado Gold data (prices, production, AISC, ramps, mix)

/lib
  chat-parser.ts      # Intent parser for chat commands and investment questions
```

## Operations Summary

Eldorado Gold operates six mines:

- **Lamaque** (Canada): Gold, established producer
- **Kisladag** (Türkiye): Gold, heap leach
- **Efemcukuru** (Türkiye): Gold, underground
- **Olympias** (Greece): Gold, high-cost
- **Skouries** (Greece): Copper-gold, ramping Q3-Q4 2026
- **McIlvenna Bay** (Canada): Copper-zinc-gold, producing since June 2026

## Notes

This is a portfolio piece built by Jorden Shaw to demonstrate:

- Modern web development with Next.js and TypeScript
- Data visualization and UX design for financial dashboards
- Intent parsing and conversational interfaces without LLM dependencies
- Investment analysis and judgment in a live data context

**Not investment advice.** This dashboard presents public data for educational and analytical purposes. Make your own investment decisions.

---

**Built in August 2026** | [GitHub Repository](https://github.com/yourusername/eldorado-gold-dashboard)
