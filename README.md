# Eldorado Gold Investment Dashboard

**By Jorden Shaw**

A conversational investment decision dashboard for Eldorado Gold Corporation (TSX: ELD, NYSE: EGO) with **sourced historical data** and **growth/time-horizon analysis**.

## Investment Thesis

Eldorado Gold is executing a multi-asset transformation in 2026. **Skouries** (Greece) targets first copper-gold concentrate in Q3 2026 and commercial production Q4 2026, unlocking a major polymetallic asset. **McIlvenna Bay** (Canada) achieved first copper in June 2026 and first zinc in July 2026, ramping toward 2,750 tpd. These projects shift the company from a pure gold producer to a copper-exposed polymetallic miner. 

**The tension**: Q2 2026 AISC rose to $1,926/oz (vs. Q1 2025 $1,559/oz), driven by Olympias' high costs and Skouries pre-commercial spending. H1 2026 production of 204,974 oz tracks toward FY 2026 guidance of 495–600 koz, but the story is back-half weighted. **The decision point**: if Skouries and McIlvenna Bay ramp on schedule and costs compress below $1,800/oz by Q1 2027, the asset base transforms. If costs stay elevated or ramps slip, margin compression at gold prices above $4,000/oz becomes a concern. This dashboard tracks the ramp, cost, and production data that drive the 2027 investment decision.

## Features

- **Default board (5 charts)**: Production by mine, AISC vs realized gold, asset mix, ramp timeline, market data placeholder
- **Profitability mode**: Ask "profitability" or "show profitability" to rebuild the board around Q2 2026 margins, FCF, mine-level costs, and revenue splits
- **Growth / historical mode** *(NEW)*: Ask "growth", "historical growth", "over time", or "show history" to view sourced time-series data across quarters and years
- **Conversational interface**: Filter (e.g., "Just Lamaque"), modify chart types, add/remove visuals, or ask investment questions
- **Investment-grade responses**: The chat can answer questions like "Does Skouries slipping a quarter change the 2027 story?" with judgment-driven analysis
- **Real public data only**: All figures sourced from Eldorado Gold news releases, SEDAR+/SEC filings, and public market sources. **No invented numbers**.
- **Mobile-usable**: Responsive design works on tablet and phone
- **Dark finance aesthetic**: Clean, readable charts with a professional dark theme

## Growth Mode — Historical Data

The **growth mode** shows Eldorado's operating history and time-horizon trends:

### What's Included (Sourced Data)

- **Quarterly production by mine**: Q1 2025 through Q2 2026 (6 quarters) from Eldorado Gold quarterly reports
  - Exact ounces (not rounded koz) to match filings
  - Lamaque, Kışladağ, Efemçukuru, Olympias
  - Skouries and McIlvenna Bay at zero until commercial production reported
- **Annual production**: FY 2025 actual (488,268 oz) and FY 2026 guidance (495–600 koz midpoint shown)
- **AISC vs realized gold price**: Q1 2025 through Q2 2026 where disclosed
  - Q3 2025 and Q4 2025 AISC available; realized gold price omitted (not disclosed in public filings)
- **Revenue and FCF**: Q1 2025 through Q2 2026 where disclosed
  - Q2 2026 FCF breakdown: Total -$334.1M, Operating mines (ex-growth) +$40.9M
  - Note: FCF-ex definition changed Q2 2026 to exclude both Skouries and McIlvenna Bay
- **Market comparison**: Placeholder for EGO (NYSE), ELD.TO (TSX), and gold futures (GC=F)
  - Current close 2026-08-26: ELD.TO CAD 65.19, EGO USD 46.96
  - Live data requires Yahoo Finance v8 chart API or Stooq CSV import

### What's NOT Included (Unavailable or Uninvented)

- **Q3/Q4 2026 projected production**: Not sourced; no invented estimates
- **Quarterly realized gold prices before Q1 2025**: Not disclosed in public MD&As reviewed
- **EBITDA and Net Income time series**: Only Q2 2026 available in sourced data
- **Historical market price series**: Yahoo/Stooq API integration blocked by rate limits; static snapshot not yet implemented
- **Annual production before 2025**: Not yet sourced from earlier Eldorado reports (can be added from performance-and-guidance page or annual NRs)

Ask "last 8 quarters", "annual only", or "vs gold" in growth mode to filter time horizons. If you ask for a period we don't have, the dashboard will tell you.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Rule-based intent parser**: Chat works without LLM API keys; uses pattern matching and templated responses to mutate charts and answer investment questions

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

### Mode Switching
- **"profitability"** – Switch to profitability mode (margins, FCF, mine costs)
- **"growth"** or **"historical growth"** – Switch to growth mode (time-series production, AISC trends, revenue/FCF)
- **"reset"** – Return to default 5-chart dashboard

### Filters and Modifications
- **"Just Lamaque"** – Filter to Lamaque mine data
- **"Show AISC as a bar chart"** – Switch AISC to bar chart by mine
- **"Remove the price chart"** – Hide the market price chart

### Investment Questions
- **"What was Q2 2026 AISC?"** – Get specific data points
- **"Does Skouries slipping a quarter change the 2027 story?"** – Investment analysis

## Data Sources

All data is from public sources as of **2026-08-26**:

### Company Disclosures
- **Eldorado Gold Q2 2026 News Release** (2026-07-30): [eldoradogold.com](https://www.eldoradogold.com/investors/news-releases/)
- **Q2 2026 MD&A** filed on SEDAR+ (Canada) and SEC EDGAR (USA)
- **Q1 2026, Q4 2025, Q3 2025, Q2 2025, Q1 2025** quarterly reports and MD&As
- **Performance and Guidance at a Glance**: [eldoradogold.com/assets/performance-and-guidance-at-a-glance](https://www.eldoradogold.com/assets/performance-and-guidance-at-a-glance)

### Market Data
- **Yahoo Finance**: ELD.TO (TSX, CAD) and EGO (NYSE, USD) as of 2026-08-26
- **Market close 2026-08-26**: ELD.TO CAD 65.19, EGO USD 46.96
- **52-week ranges**: ELD.TO CAD 32.77–69.46, EGO USD 23.81–51.16

### Key Sourced Figures (Q2 2026)
- **Production**: Lamaque 52,340 oz, Kışladağ 19,108 oz, Efemçukuru 18,019 oz, Olympias 15,125 oz (total 104,616 oz)
- **AISC**: Consolidated $1,926/oz | By mine: Lamaque $1,192, Kışladağ $2,407, Efemçukuru $2,252, Olympias $2,465
- **Realized gold**: $4,379/oz → Operating margin $2,453/oz
- **TCC**: Consolidated $1,432/oz | Lamaque $865/oz (only mine-level TCC disclosed)
- **Revenue**: $487.5M total ($449.7M gold, $37.8M other metals)
- **FCF**: -$334.1M total, $40.9M ex-growth (operating mines only)
- **Cash**: $554.6M | Debt: $1,749.9M
- **FY 2026 Guidance**: 495–600 koz gold (four existing mines 430–490 koz, Skouries 60–100 koz)

If a data series is unavailable, the dashboard indicates this rather than inventing figures.

## Project Structure

```
/app
  layout.tsx          # Root layout with metadata
  page.tsx            # Main dashboard page with chart state management and mode switching
  globals.css         # Global styles and dark theme

/components
  Charts.tsx          # All chart components (default, profitability, and growth modes)
  ChatPanel.tsx       # Chat interface component

/data
  eldorado-data.ts    # Sourced Eldorado Gold data (production, AISC, FCF, revenue, guidance)

/lib
  chat-parser.ts      # Intent parser for chat commands and investment questions
```

## Operations Summary

Eldorado Gold operates six assets:

- **Lamaque** (Canada): Gold, established producer, lowest AISC ($1,192/oz Q2 2026)
- **Kışladağ** (Türkiye): Gold, heap leach
- **Efemçukuru** (Türkiye): Gold, underground
- **Olympias** (Greece): Gold, high-cost
- **Skouries** (Greece): Copper-gold, first concentrate expected Q3 2026, commercial production Q4 2026
- **McIlvenna Bay** (Canada): Copper-zinc-gold, first copper June 2026, commercial production expected Q3 2026

## Notes

This is a portfolio piece built by Jorden Shaw to demonstrate:

- Modern web development with Next.js and TypeScript
- Data visualization and UX design for financial dashboards
- Intent parsing and conversational interfaces without LLM dependencies
- Investment analysis and judgment in a live data context
- **Data sourcing discipline**: No invented numbers; blanks stay blank

**Not investment advice.** This dashboard presents public data for educational and analytical purposes. Make your own investment decisions.

---

**Built in August 2026** | [GitHub Repository](https://github.com/Cosinal/brutus-playground)
