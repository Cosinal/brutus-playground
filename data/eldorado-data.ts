export interface PriceData {
  date: string;
  eldPrice: number;
  goldPrice: number;
}

export interface ProductionByMineData {
  quarter: string;
  lamaque: number;
  kisladag: number;
  efemcukuru: number;
  olympias: number;
  skouries: number;
  mcilvenna: number;
}

export interface AISCVsGoldData {
  period: string;
  aisc: number | null;
  realized: number | null;
}

export interface AssetMixData {
  mine: string;
  q2_2026_production: number;
  percentage: number;
}

export interface RampData {
  project: string;
  milestone: string;
  planned: string;
  actual: string | null;
  status: "on-track" | "achieved" | "delayed";
}

export interface AnnualProductionData {
  year: string;
  production: number;
  isGuidance?: boolean;
  guidanceLow?: number;
  guidanceHigh?: number;
}

export interface RevenueAndFCFData {
  period: string;
  revenue: number | null;
  fcf: number | null;
  fcfExGrowth: number | null;
  note?: string;
}

export interface MarketPriceData {
  date: string;
  EGO: number | null;
  ELD_TO: number | null;
  gold: number | null;
}

export const dataSources = {
  asOf: "2026-08-26",
  sources: [
    "Eldorado Gold Q2 2026 News Release (2026-07-30)",
    "Q2 2026 MD&A filed on SEDAR+ and SEC EDGAR",
    "Q1 2026, Q4 2025, and earlier quarterly reports",
    "Performance and Guidance at a Glance (eldoradogold.com)",
    "Market data: Yahoo Finance ELD.TO (CAD), EGO (USD) as of 2026-08-26",
  ],
  notes: [
    "All production figures in ounces (not koz) to preserve filing accuracy",
    "AISC and realized gold price in USD per ounce",
    "Skouries first concentrate EXPECTED Q3 2026 (not reported as of 2026-07-30)",
    "McIlvenna Bay first copper 2026-06-07, commercial production EXPECTED Q3 2026",
    "FCF-ex definition changed Q2 2026 to exclude both Skouries and McIlvenna Bay",
    "Blanks indicate data not disclosed in public filings",
  ],
};

// Market price data for growth/time horizon views
// Source: Yahoo Finance as of 2026-08-26
// Note: This is a placeholder structure. In production, fetch from Yahoo v8 chart API or Stooq CSV
export const marketPriceData: MarketPriceData[] = [
  // Data to be populated from Yahoo Finance API or manual CSV import
  // EGO (NYSE, USD), ELD.TO (TSX, CAD), GC=F (gold futures)
  // Market close 2026-08-26: ELD.TO 65.19 CAD, EGO 46.96 USD
  // Structure retained for future implementation
];

// Production by Mine (ounces, not koz)
// Source: Eldorado Gold Q2 2026 MD&A and quarterly reports
// As of: Q2 2026 (actual production data)
// Note: Q3/Q4 2026 projections REMOVED - no invented figures
export const productionByMine: ProductionByMineData[] = [
  { quarter: "Q1 2025", lamaque: 40438, kisladag: 44319, efemcukuru: 19307, olympias: 11829, skouries: 0, mcilvenna: 0 },
  { quarter: "Q2 2025", lamaque: 50640, kisladag: 46058, efemcukuru: 21093, olympias: 15978, skouries: 0, mcilvenna: 0 },
  { quarter: "Q3 2025", lamaque: 46823, kisladag: 37184, efemcukuru: 17586, olympias: 13597, skouries: 0, mcilvenna: 0 },
  { quarter: "Q4 2025", lamaque: 49307, kisladag: 41140, efemcukuru: 14496, olympias: 18473, skouries: 0, mcilvenna: 0 },
  { quarter: "Q1 2026", lamaque: 42306, kisladag: 28339, efemcukuru: 15394, olympias: 14319, skouries: 0, mcilvenna: 0 },
  { quarter: "Q2 2026", lamaque: 52340, kisladag: 19108, efemcukuru: 18019, olympias: 15125, skouries: 0, mcilvenna: 0 },
];

// Annual Production (sourced + FY 2026 guidance)
// Source: Eldorado Gold annual reports and FY 2026 guidance
// As of: Q2 2026 reporting
export const annualProduction: AnnualProductionData[] = [
  { year: "2025", production: 488268 },
  { year: "2026 Guidance", production: 547500, isGuidance: true, guidanceLow: 495000, guidanceHigh: 600000 },
];

// AISC vs Realized Gold Price (quarterly, sourced only)
// Source: Eldorado Gold quarterly MD&As
// As of: Q2 2026
export const aiscVsGold: AISCVsGoldData[] = [
  { period: "Q1 2025", aisc: 1559, realized: 2933 },
  { period: "Q2 2025", aisc: 1520, realized: 3270 },
  { period: "Q3 2025", aisc: 1679, realized: null },
  { period: "Q4 2025", aisc: 1894, realized: null },
  { period: "Q1 2026", aisc: 1942, realized: 4891 },
  { period: "Q2 2026", aisc: 1926, realized: 4379 },
];

// Revenue and Free Cash Flow (quarterly, sourced only)
// Source: Eldorado Gold quarterly financial statements
// As of: Q2 2026
export const revenueAndFCF: RevenueAndFCFData[] = [
  { period: "Q1 2025", revenue: 355.2, fcf: -29.4, fcfExGrowth: null },
  { period: "Q2 2025", revenue: 451.7, fcf: -61.6, fcfExGrowth: null },
  { period: "Q3 2025", revenue: 434.7, fcf: null, fcfExGrowth: null },
  { period: "Q4 2025", revenue: 577.2, fcf: null, fcfExGrowth: null },
  { period: "Q1 2026", revenue: 532.4, fcf: -129.1, fcfExGrowth: null },
  { period: "Q2 2026", revenue: 487.5, fcf: -334.1, fcfExGrowth: 40.9, note: "FCF-ex excludes Skouries + McBay starting Q2 2026" },
];

// Chart 4: Skouries & McIlvenna Bay Ramp Timeline
// Source: Eldorado Gold project updates and quarterly reports
// As of: August 2026
export const rampTimeline: RampData[] = [
  {
    project: "Skouries",
    milestone: "First copper-gold concentrate",
    planned: "Q3 2026",
    actual: null,
    status: "on-track",
  },
  {
    project: "Skouries",
    milestone: "Commercial production",
    planned: "Q4 2026",
    actual: null,
    status: "on-track",
  },
  {
    project: "McIlvenna Bay",
    milestone: "First copper production",
    planned: "June 2026",
    actual: "June 2026",
    status: "achieved",
  },
  {
    project: "McIlvenna Bay",
    milestone: "First zinc production",
    planned: "July 2026",
    actual: "July 2026",
    status: "achieved",
  },
  {
    project: "McIlvenna Bay",
    milestone: "Ramp to 2,750 tpd",
    planned: "H2 2026",
    actual: null,
    status: "on-track",
  },
];

// Asset Mix (Q2 2026 production by mine, sourced ounces)
// Source: Eldorado Gold Q2 2026 quarterly report
// As of: Q2 2026
// Note: McBay gold production was 0 oz in Q2 2026 (only copper/zinc), removed from pie
export const assetMix: AssetMixData[] = [
  { mine: "Lamaque", q2_2026_production: 52340, percentage: 50.0 },
  { mine: "Kışladağ", q2_2026_production: 19108, percentage: 18.3 },
  { mine: "Efemçukuru", q2_2026_production: 18019, percentage: 17.2 },
  { mine: "Olympias", q2_2026_production: 15125, percentage: 14.5 },
];

// Profitability Data
// Source: Eldorado Gold Q2 2026 Financial Results and MD&A
// As of: Q2 2026

export interface ProfitabilityCompanyData {
  period: string;
  revenue: number; // $M USD
  realizedGold: number | null; // $/oz
  tcc: number | null; // $/oz Total Cash Cost
  aisc: number; // $/oz All-In Sustaining Cost
  adjEbitda: number | null; // $M USD
  netIncome: number | null; // $M USD
  fcf: number | null; // $M USD Free Cash Flow
  fcfExGrowth: number | null; // $M USD FCF excluding Skouries + McIlvenna Bay
}

export interface ProfitabilityMineData {
  mine: string;
  country: string;
  q2_2026_production_oz: number;
  tcc: number | null; // $/oz
  aisc: number; // $/oz
}

export interface ProfitabilityMetalData {
  period: string;
  goldRevenue: number | null; // $M USD
  otherRevenue: number | null; // $M USD (copper, zinc, silver)
  totalRevenue: number; // $M USD
}

export interface ProfitabilitySegmentData {
  period: string;
  segment: string;
  fcf: number | null; // $M USD
}

export const profitabilityCompany: ProfitabilityCompanyData[] = [
  { period: "Q1 2025", revenue: 355.2, realizedGold: 2933, tcc: null, aisc: 1559, adjEbitda: null, netIncome: null, fcf: -29.4, fcfExGrowth: null },
  { period: "Q2 2025", revenue: 451.7, realizedGold: 3270, tcc: null, aisc: 1520, adjEbitda: null, netIncome: null, fcf: -61.6, fcfExGrowth: null },
  { period: "Q3 2025", revenue: 434.7, realizedGold: null, tcc: null, aisc: 1679, adjEbitda: null, netIncome: null, fcf: null, fcfExGrowth: null },
  { period: "Q4 2025", revenue: 577.2, realizedGold: null, tcc: null, aisc: 1894, adjEbitda: null, netIncome: null, fcf: null, fcfExGrowth: null },
  { period: "Q1 2026", revenue: 532.4, realizedGold: 4891, tcc: null, aisc: 1942, adjEbitda: null, netIncome: null, fcf: -129.1, fcfExGrowth: null },
  { period: "Q2 2026", revenue: 487.5, realizedGold: 4379, tcc: 1432, aisc: 1926, adjEbitda: null, netIncome: null, fcf: -334.1, fcfExGrowth: 40.9 },
];

export const profitabilityByMine: ProfitabilityMineData[] = [
  { mine: "Lamaque", country: "Canada", q2_2026_production_oz: 52340, tcc: 865, aisc: 1192 },
  { mine: "Kışladağ", country: "Türkiye", q2_2026_production_oz: 19108, tcc: null, aisc: 2407 },
  { mine: "Efemçukuru", country: "Türkiye", q2_2026_production_oz: 18019, tcc: null, aisc: 2252 },
  { mine: "Olympias", country: "Greece", q2_2026_production_oz: 15125, tcc: null, aisc: 2465 },
];

export const profitabilityByMetal: ProfitabilityMetalData[] = [
  { period: "Q1 2025", goldRevenue: null, otherRevenue: null, totalRevenue: 355.2 },
  { period: "Q2 2025", goldRevenue: null, otherRevenue: null, totalRevenue: 451.7 },
  { period: "Q3 2025", goldRevenue: null, otherRevenue: null, totalRevenue: 434.7 },
  { period: "Q4 2025", goldRevenue: null, otherRevenue: null, totalRevenue: 577.2 },
  { period: "Q1 2026", goldRevenue: null, otherRevenue: null, totalRevenue: 532.4 },
  { period: "Q2 2026", goldRevenue: 449.7, otherRevenue: 37.8, totalRevenue: 487.5 },
];

export const profitabilityBySegment: ProfitabilitySegmentData[] = [
  { period: "Q1 2026", segment: "Operating Mines", fcf: null },
  { period: "Q1 2026", segment: "Growth Projects (Skouries + McBay)", fcf: null },
  { period: "Q2 2026", segment: "Operating Mines", fcf: 40.9 },
  { period: "Q2 2026", segment: "Growth Projects (Skouries + McBay)", fcf: -375.0 },
];

export const companyInfo = {
  name: "Eldorado Gold Corporation",
  headquarters: "Vancouver, Canada",
  tickers: "ELD (TSX) / EGO (NYSE)",
  operations: [
    "Lamaque (Canada)",
    "Kışladağ (Türkiye)",
    "Efemçukuru (Türkiye)",
    "Olympias (Greece)",
    "Skouries (Greece)",
    "McIlvenna Bay (Canada)",
  ],
  h1_2026_production: "204,974 oz gold",
  fy_2026_guidance: "495,000 – 600,000 oz gold",
  q2_2026_aisc: "$1,926/oz USD",
};
