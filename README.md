# Eldorado Gold Investment Dashboard

**By Jorden Shaw** | [LinkedIn](https://linkedin.com/in/jordenshaw587/)

A conversational investment dashboard for Eldorado Gold Corporation (ELD.TO / EGO) using **sourced public data only**. Ask questions, filter charts, all backed by Q2 2026 filings.

🔗 **Live Demo**: *Deploy to Vercel to get public URL*

---

## What This Is

This IS Jorden Shaw's personal website—not a portfolio page with a dashboard nested inside, but a **single-page live investment dashboard** analyzing Eldorado Gold.

**5 prebuilt charts** on load (production by mine, AISC vs realized gold, asset mix, project status, market snapshot).

**Chat-driven**: Filter (`"show only Lamaque"`), add/remove charts (`"remove the market chart"`), ask questions (`"what is Q2 AISC"`, `"has Skouries produced concentrate"`). All answers from sourced data—never invented.

---

## Sourced Data — As of 2026-08-26

### Sources
1. **Eldorado Gold Q2 2026 News Release** (2026-07-30): [https://www.eldoradogold.com/investors/news-releases/eldorado-gold-reports-solid-q2-2026-financial-and-operational-results](https://www.eldoradogold.com/investors/news-releases/eldorado-gold-reports-solid-q2-2026-financial-and-operational-results)
2. **Q2 2026 MD&A** (SEDAR+/SEC PDF)
3. **Q1 2026 News Release**
4. **Q4 2025 Operations Data PDF**
5. **Skouries First Ore Crushed News Release**
6. **Performance and Guidance at a Glance**
7. **Yahoo Finance**: ELD.TO (CAD), EGO (USD) as of 2026-08-26

All data baked into `/data/eldorado-q-series.json`. **No invented figures. Blanks stay blank.**

### Key Figures (Q2 2026)

**Production**:
- Produced: 104,616 oz gold (Lamaque 52,340; Kışladağ 19,108; Efemçukuru 18,019; Olympias 15,125)
- Sold: 102,691 oz
- H1 2026: 204,974 oz
- FY 2026 guidance: 495–600 koz (incl. Skouries + McBay)

**Costs & Margin**:
- **AISC**: $1,926/oz USD (exactly, not ~)
- **Realized gold**: $4,379/oz USD
- **Margin**: $2,453/oz (realized minus AISC)
- **By mine AISC**: Lamaque $1,192 | Kışladağ $2,407 | Efemçukuru $2,252 | Olympias $2,465 | Corporate $130

**Q2 AISC** above FY ops guidance ($1,670–1,870) but **production is H2-weighted**; not a concluded miss.

**Financials**:
- Revenue: $487.5M USD
- FCF: -$334.1M (total)
- FCF ex-growth: $40.9M (operating mines positive; Skouries + McBay consuming capex)
- Cash: $554.6M | Debt: $1,749.9M

**Market (2026-08-26)**:
- ELD.TO: C$65.19 (-1.97%), cap C$17.002B, 52w C$32.77–C$69.46
- EGO: $46.96 USD (-2.45%), cap $12.248B USD, 52w $23.81–$51.16
- Gold futures (COMEX GC=F): $4,690.6 (not LBMA, not company realized)

### Project Status

**Skouries (Greece)**:
- **First Cu-Au concentrate**: EXPECTED Q3 2026 (**NOT yet reported** as of 2026-07-30)
- **Commercial production**: EXPECTED Q4 2026
- 97% complete at 2026-06-30
- First ore crushed July 2026 on temp power
- Final grid energization still required
- Do NOT write as if concentrate has shipped

**McIlvenna Bay (Canada)**:
- **First copper**: 2026-06-07 (achieved)
- **First zinc**: July 2026 (achieved)
- **Commercial production**: EXPECTED Q3 2026 (**not yet achieved**)
- Q2 2026: 5,405 t processed → 65,398 payable Cu lb
- Not in AISC denominator until commercial

---

## Chat Examples

### Questions (Answered from Sourced Data)
- `"what is Q2 AISC"` → "$1,926/oz sold (USD). By mine: Lamaque $1,192..."
- `"has Skouries produced concentrate"` → "No; expected Q3 2026; not yet reported as of 2026-07-30..."
- `"has McIlvenna Bay hit commercial"` → "No; first Cu 2026-06-07; commercial expected Q3 2026..."
- `"what was Q2 margin"` → "$2,453/oz (realized $4,379 minus AISC $1,926)"

### Filtering
- `"show only Lamaque"` → filter to Lamaque
- `"just Canada"` → Canadian operations
- `"hide Türkiye"` → exclude Türkiye mines

### Chart Manipulation
- `"remove the market chart"` → hide market snapshot
- `"add production"` → restore production chart
- `"reset"` → back to default 5 charts

### What Chat Refuses
- NAV/share (not disclosed in filings)
- Q3/Q4 2026 actuals (not yet reported; next print ~Oct 29, 2026)
- Invented 2027 projections
- "Commercial production achieved" for Skouries or McBay (both still expected)

---

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Recharts** for visualizations
- **Tailwind CSS** dark theme
- **Rule-based intent parser** – no LLM/API keys required
- **Sourced data**: `/data/eldorado-q-series.json` (public filings only)

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

### Vercel (Recommended, 2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Import `Cosinal/brutus-playground`
3. Deploy (auto-detects Next.js)
4. Get live URL: `brutus-playground.vercel.app`

No secrets required. No environment variables. All data baked into repo.

See `DEPLOY.md` for full instructions.

---

## Data Quality

**No interpolation. No invention.**
- Production by mine: Q1 2025 → Q2 2026 (PDF finals from quarterly reports)
- AISC vs realized: Q1 2025 → Q2 2026 (blanks where not disclosed, e.g. Q3/Q4 2025 realized gold)
- Financials: blanks for Q3 2025 FCF, Q4 2025 FCF (not disclosed)
- Skouries/McBay gold oz: 0 until reported (no pie slice yet)

**Currency explicit**:
- ELD.TO in **CAD**
- EGO in **USD**
- AISC, TCC, realized gold in **USD/oz**
- Revenue, FCF, cash, debt in **USD millions**

**Sources cited** on every chart footer.

---

## Investment Thesis (Dashboard's Story)

Eldorado Gold's 2026 transformation tracked through Q2 2026 data:

**✅ Ramp Progress**:
- McIlvenna Bay first Cu/Zn achieved (June/July 2026), commercial expected Q3
- Skouries 97% complete, first ore crushed, concentrate expected Q3, commercial Q4

**⚠️ Cost Tension**:
- Q2 AISC $1,926/oz above ops guidance ($1,670–1,870) but production H2-weighted
- Olympias high-cost ($2,465/oz); Lamaque low-cost ($1,192/oz)

**💰 FCF Story**:
- Operating mines: +$40.9M FCF ex-growth (profitable)
- Growth capex: Skouries + McBay consuming capital
- Total Q2 FCF: -$334.1M (expected during commissioning)

**📈 Decision Framework**:
- **If** Skouries/McBay ramp on schedule → polymetallic transformation de-risks
- **If** Q2 AISC stays elevated in H2 → watch margin compression vs guidance

---

## Project Structure

```
/app
  layout.tsx       # Root layout, metadata
  page.tsx         # Main dashboard with chart state
  globals.css      # Dark theme

/components
  Charts.tsx       # 5 chart components using sourced data
  ChatPanel.tsx    # Chat UI

/data
  eldorado-q-series.json  # Sourced data seed (all figures from filings)
  eldorado-data.ts        # TypeScript interfaces and exports

/lib
  chat-parser.ts   # Intent parser for chat commands
```

---

## Notes

- **Not investment advice**. Portfolio piece demonstrating modern web dev, data viz, and investment analysis.
- **No confidential data**. All figures from public filings.
- **Currency explicit** everywhere (USD vs CAD).
- **Blanks stay blank**: If not disclosed in filings, dashboard says so.
- **Skouries/McBay**: Dashboard correctly reflects "expected" vs "achieved" status per 2026-07-30 NR.

---

**Built by Jorden Shaw** | August 2026  
[LinkedIn](https://linkedin.com/in/jordenshaw587/) | [GitHub](https://github.com/Cosinal/brutus-playground)

**Live URL**: *Deploy to Vercel for public URL*
