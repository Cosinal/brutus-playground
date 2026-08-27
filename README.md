# Public Company Dashboard Kit

**By Jorden Shaw**

**Live Dashboard:** https://brutus-playground-xrz5.vercel.app

A plug-and-play dashboard framework for public companies with automatic market data and financial metrics. Eldorado Gold Corporation (TSX: ELD, NYSE: EGO) is the reference implementation.

## What Is This?

A Next.js dashboard that can display any public company's:
- **Market history** (Yahoo Finance, any ticker, any range/interval)
- **Standard financials** (SEC EDGAR company facts API for US filers)
- **Optional company-specific operations pack** (manually sourced metrics like mine production, AISC, project ramps)

Eldorado Gold includes a full mining operations pack with sourced quarterly production, AISC, profitability, and project ramp data. Other companies start with market + SEC data only.

## Quick Start — Use Eldorado Data

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The dashboard loads with Eldorado's real Yahoo Finance 5-year market history and existing operations pack.

## Plug-and-Play — Point at Another Company

### 1. Edit `config/company.json`

```json
{
  "name": "Example Corp",
  "shortName": "Example",
  "headquarters": "City, Country",
  "tickers": {
    "primary": "EXPL",
    "secondary": null,
    "benchmark": "^GSPC"
  },
  "tickerDetails": {
    "EXPL": {
      "exchange": "NYSE",
      "currency": "USD",
      "description": "New York Stock Exchange"
    },
    "^GSPC": {
      "exchange": "INDEX",
      "currency": "USD",
      "description": "S&P 500 Index"
    }
  },
  "cik": "0001234567",
  "sector": "Technology",
  "industry": "Software",
  "hasMiningOperationsPack": false,
  "asOf": "2026-08-27",
  "sources": [
    "SEC EDGAR CIK 0001234567",
    "Yahoo Finance v8 chart API"
  ],
  "description": "Company description",
  "fiscalYearEnd": "12-31",
  "website": "https://example.com"
}
```

### 2. Fetch Market Data

```bash
python scripts/fetch-yahoo-market.py
```

This reads `config/company.json` and fetches all tickers (primary, secondary, benchmark) from Yahoo Finance. Writes `data/yahoo-market.json`.

**Arguments:**
- `--config PATH` — Path to config (default: `config/company.json`)
- `--range 5y` — Time range: `1y`, `5y`, `max`, etc.
- `--interval 1mo` — Interval: `1d`, `1wk`, `1mo`
- `--tickers TICK1 TICK2` — Override config tickers

**Example:**
```bash
python scripts/fetch-yahoo-market.py --range 5y --interval 1mo
```

### 3. Fetch SEC Financials (if CIK exists)

```bash
python scripts/fetch-sec-financials.py
```

Fetches annual (10-K) standard metrics from SEC EDGAR company facts API:
- Revenues
- Net Income (Loss)
- Operating Cash Flow
- Free Cash Flow (if tagged)

Writes `data/sec-financials.json`. Only works for US SEC filers with a CIK. Canadian-only filers: skip this step.

**Note:** SEC API may be blocked from some VMs (403). Run from a local machine if needed.

### 4. Build and Run

```bash
npm run build
npm start
```

The dashboard now shows your company's market history. Operations-specific charts (production, AISC, profitability) are hidden unless you create a company pack.

## Advanced — Create a Company Operations Pack

If your company is a miner or has industry-specific metrics not available through standard APIs, create a company-specific pack like Eldorado's.

1. Create `data/packs/yourcompany-operations.ts`
2. Define interfaces and export sourced data (production, costs, projects, etc.)
3. Update `components/Charts.tsx` to import your pack
4. Set `"hasMiningOperationsPack": true` in `config/company.json`

See `data/packs/eldorado-operations.ts` as a reference. This is **manual sourcing** from company filings — not automated.

## Features

- **Default board**: Market history + operations (if pack exists)
- **Profitability mode**: Margins, FCF, mine-level costs (if pack exists)
- **Growth mode**: Historical time-series production, AISC, revenue/FCF (if pack exists)
- **Conversational chat**: Pattern-based intent parser (no LLM API keys required)
- **Responsive design**: Works on desktop, tablet, mobile

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Python 3** for data fetch scripts (stdlib only, no dependencies)

## Project Structure

```
/config
  company.json              # Active company configuration

/scripts
  fetch-yahoo-market.py     # Fetch market data from Yahoo Finance
  fetch-sec-financials.py   # Fetch financials from SEC EDGAR

/data
  company-data.ts           # General company data module (config + market + SEC)
  yahoo-market.json         # Market history (fetched)
  sec-financials.json       # SEC metrics (fetched)
  /packs
    eldorado-operations.ts  # Eldorado-specific mining ops pack (sourced)

/components
  Charts.tsx                # All chart components
  ChatPanel.tsx             # Chat interface

/app
  page.tsx                  # Main dashboard (conditionally renders ops charts)
  layout.tsx                # Root layout

/lib
  chat-parser.ts            # Intent parser for chat commands
```

## Data Sources

### General (All Companies)

**Market Data:**
- **Yahoo Finance v8 chart API**: Automatic for any ticker
- Range: Configurable (default 5 years)
- Interval: Configurable (default monthly)
- Currencies preserved as reported
- Indexed to 100 at first non-null close for relative performance

**Financials:**
- **SEC EDGAR company facts API**: Annual (10-K) standard metrics for US filers
- Revenues, Net Income, Operating Cash Flow, Free Cash Flow (if tagged)
- Only available if company has a CIK (US SEC registration)

### Eldorado Gold (Reference Implementation)

Eldorado's dashboard includes a full **mining operations pack** with sourced data from public filings:

**Company Disclosures:**
- Eldorado Gold Q2 2026 News Release (2026-07-30)
- Q2 2026 MD&A filed on SEDAR+ and SEC EDGAR
- Q1 2026, Q4 2025, Q3 2025, Q2 2025, Q1 2025 quarterly reports
- Performance and Guidance at a Glance: [eldoradogold.com](https://www.eldoradogold.com/assets/performance-and-guidance-at-a-glance)

**Market Data:**
- Fetched: 2026-08-27
- Tickers: ELD.TO (TSX, CAD), EGO (NYSE, USD), GC=F (COMEX gold futures, USD/oz)
- Range: September 2021–August 2026 (~61 monthly closes)
- Gold futures have fewer data points (~53) due to contract rollover

**Operations Pack:**
- **Production**: Quarterly by mine (Lamaque, Kışladağ, Efemçukuru, Olympias)
- **AISC & Realized Gold**: Q1 2025–Q2 2026
- **Revenue & FCF**: Operating vs growth projects
- **Project Ramps**: Skouries and McIlvenna Bay milestones
- **Profitability**: Mine-level costs, metal revenue splits

All Eldorado operational data is manually sourced from company filings. Not available through standard APIs.

### Refreshing Eldorado Data

```bash
# Refresh market data (Yahoo Finance)
python scripts/fetch-yahoo-market.py

# Refresh SEC financials (if accessible)
python scripts/fetch-sec-financials.py

# Rebuild and deploy
npm run build
```

**Note:** Operations pack data (production, AISC, etc.) must be updated manually by editing `data/packs/eldorado-operations.ts`.

## Investment Thesis — Eldorado Gold

Eldorado Gold is executing a multi-asset transformation in 2026. **Skouries** (Greece) targets first copper-gold concentrate in Q3 2026 and commercial production Q4 2026, unlocking a major polymetallic asset. **McIlvenna Bay** (Canada) achieved first copper in June 2026 and first zinc in July 2026, ramping toward 2,750 tpd.

**The tension**: Q2 2026 AISC rose to $1,926/oz (vs. Q1 2025 $1,559/oz), driven by Olympias' high costs and Skouries pre-commercial spending. H1 2026 production of 204,974 oz tracks toward FY 2026 guidance of 495–600 koz.

**The decision point**: If Skouries and McIlvenna Bay ramp on schedule and costs compress below $1,800/oz by Q1 2027, the asset base transforms. If costs stay elevated, margin compression becomes a concern even at gold above $4,000/oz.

This dashboard tracks the ramp, cost, and production data that drive the 2027 investment decision.

## Chat Examples

Try these commands in the chat panel:

### Mode Switching
- **"profitability"** – Margins, FCF, mine-level costs
- **"growth"** or **"historical growth"** – Time-series production, AISC, revenue/FCF
- **"reset"** – Return to default dashboard

### Filters and Modifications
- **"Just Lamaque"** – Filter to Lamaque mine
- **"Show AISC as a bar chart"** – Switch chart type
- **"Remove the price chart"** – Hide market chart

### Investment Questions (Eldorado)
- **"What was Q2 2026 AISC?"**
- **"Does Skouries slipping a quarter change the 2027 story?"**

## Constraints

- **Public data only**: No paid APIs, no proprietary data
- **No invented numbers**: Missing data stays null
- **No FX conversion**: Currencies preserved as reported
- **Python stdlib only**: Fetch scripts use `urllib`, no external dependencies
- **SEC rate limiting**: Scripts include 100ms delay between requests

## Operations Pack Notes

Mine-level AISC, production by mine, and project ramps are **not standard XBRL fields**. These require manual sourcing from:
- Quarterly MD&As
- News releases
- Investor presentations
- Performance snapshots

If you want these for another mining company, create a company-specific pack following `data/packs/eldorado-operations.ts` as a template.

## Notes

This is a portfolio piece built by Jorden Shaw to demonstrate:
- Plug-and-play data architecture for public companies
- Modern web development with Next.js and TypeScript
- Financial data visualization and UX design
- Conversational interfaces without LLM dependencies
- Data sourcing discipline: no invented numbers, blanks stay blank

**Not investment advice.** This dashboard presents public data for educational and analytical purposes.

---

**Built in August 2026** | **Live at [brutus-playground-xrz5.vercel.app](https://brutus-playground-xrz5.vercel.app)** | [GitHub Repository](https://github.com/Cosinal/brutus-playground)

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
