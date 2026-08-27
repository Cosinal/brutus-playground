// SOURCED DATA ONLY — As of 2026-08-26
// Sources: Q2 2026 NR (2026-07-30), Q2 MD&A, Q1 2026 NR, Q4 2025 ops data, Yahoo Finance
// All figures from public filings. Blanks = not disclosed. Do not interpolate.

import seedData from "./eldorado-q-series.json";

export { seedData };

export interface PriceData {
  date: string;
  eld_CAD: number | null;
  gold_USD: number | null;
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
  aisc: number;
  realized: number | null;
}

export interface AssetMixData {
  mine: string;
  h1_2026_oz: number;
  percentage: number;
}

export interface ProjectStatus {
  project: string;
  milestone: string;
  expected: string;
  actual: string | null;
  status: "expected" | "achieved" | "not-yet";
}

export interface FinancialData {
  period: string;
  revenue: number | null;
  fcf: number | null;
  fcf_ex_growth: number | null;
  cash: number | null;
  debt: number | null;
}

export const dataSources = {
  asOf: seedData.asOf,
  sources: seedData.sources,
};

// Market data as of 2026-08-26
export const marketData = {
  ELD_TO_CAD: seedData.market.ELD_TO.price_CAD,
  ELD_change_pct: seedData.market.ELD_TO.change_pct,
  ELD_marketCap_B_CAD: seedData.market.ELD_TO.marketCap_CAD_B,
  EGO_USD: seedData.market.EGO.price_USD,
  EGO_change_pct: seedData.market.EGO.change_pct,
  EGO_marketCap_B_USD: seedData.market.EGO.marketCap_USD_B,
  gold_futures_COMEX: seedData.market.gold_futures_COMEX,
  note: "ELD.TO in CAD; EGO in USD; COMEX is futures not realized",
};

// Production by mine (oz gold produced) — From PDF finals
export const productionByMine: ProductionByMineData[] = [
  { quarter: "Q1 2025", lamaque: 40438, kisladag: 44319, efemcukuru: 19307, olympias: 11829, skouries: 0, mcilvenna: 0 },
  { quarter: "Q2 2025", lamaque: 50640, kisladag: 46058, efemcukuru: 21093, olympias: 15978, skouries: 0, mcilvenna: 0 },
  { quarter: "Q3 2025", lamaque: 46823, kisladag: 37184, efemcukuru: 17586, olympias: 13597, skouries: 0, mcilvenna: 0 },
  { quarter: "Q4 2025", lamaque: 49307, kisladag: 41140, efemcukuru: 14496, olympias: 18473, skouries: 0, mcilvenna: 0 },
  { quarter: "Q1 2026", lamaque: 42306, kisladag: 28339, efemcukuru: 15394, olympias: 14319, skouries: 0, mcilvenna: 0 },
  { quarter: "Q2 2026", lamaque: 52340, kisladag: 19108, efemcukuru: 18019, olympias: 15125, skouries: 0, mcilvenna: 0 },
];

// AISC vs Realized Gold (USD per oz)
// Realized = actual price received for gold sold
// Blanks where not disclosed in quarterly reports
export const aiscVsRealized: AISCVsGoldData[] = [
  { period: "Q1 2025", aisc: 1559, realized: 2933 },
  { period: "Q2 2025", aisc: 1520, realized: 3270 },
  { period: "Q3 2025", aisc: 1679, realized: null },
  { period: "Q4 2025", aisc: 1894, realized: null },
  { period: "Q1 2026", aisc: 1942, realized: 4891 },
  { period: "Q2 2026", aisc: 1926, realized: 4379 },
];

// H1 2026 Asset Mix (46% Lamaque, 23% Kışladağ, 16% Efemçukuru, 14% Olympias)
export const assetMixH1_2026: AssetMixData[] = [
  { mine: "Lamaque", h1_2026_oz: 94646, percentage: 46 },
  { mine: "Kışladağ", h1_2026_oz: 47447, percentage: 23 },
  { mine: "Efemçukuru", h1_2026_oz: 33413, percentage: 16 },
  { mine: "Olympias", h1_2026_oz: 29444, percentage: 14 },
];

// Q2 2026 AISC by Mine (USD per oz sold)
export const aiscByMineQ2_2026 = {
  Lamaque: 1192,
  Kisladag: 2407,
  Efemcukuru: 2252,
  Olympias: 2465,
  corporate_allocation: 130,
};

// Project Status — EXPECTED milestones, not achieved
export const projectStatus: ProjectStatus[] = [
  {
    project: "Skouries",
    milestone: "First Cu-Au concentrate",
    expected: "Q3 2026",
    actual: null,
    status: "expected",
  },
  {
    project: "Skouries",
    milestone: "Commercial production",
    expected: "Q4 2026",
    actual: null,
    status: "expected",
  },
  {
    project: "Skouries",
    milestone: "First ore crushed (temp power)",
    expected: "July 2026",
    actual: "July 2026",
    status: "achieved",
  },
  {
    project: "McIlvenna Bay",
    milestone: "First copper production",
    expected: "June 2026",
    actual: "2026-06-07",
    status: "achieved",
  },
  {
    project: "McIlvenna Bay",
    milestone: "First zinc production",
    expected: "July 2026",
    actual: "July 2026",
    status: "achieved",
  },
  {
    project: "McIlvenna Bay",
    milestone: "Commercial production",
    expected: "Q3 2026",
    actual: null,
    status: "expected",
  },
];

// Financials ($M USD)
// FCF-ex definition CHANGED Q2 2026 to exclude both Skouries AND McIlvenna Bay
export const financials: FinancialData[] = [
  { period: "Q1 2025", revenue: 355.2, fcf: -29.4, fcf_ex_growth: null, cash: 978.1, debt: 932.8 },
  { period: "Q2 2025", revenue: 451.7, fcf: -61.6, fcf_ex_growth: null, cash: 1078.6, debt: 1157.1 },
  { period: "Q3 2025", revenue: 434.7, fcf: null, fcf_ex_growth: null, cash: null, debt: null },
  { period: "Q4 2025", revenue: 577.2, fcf: null, fcf_ex_growth: null, cash: 869.4, debt: 1275.1 },
  { period: "Q1 2026", revenue: 532.4, fcf: -129.1, fcf_ex_growth: null, cash: 629.7, debt: 1230.8 },
  { period: "Q2 2026", revenue: 487.5, fcf: -334.1, fcf_ex_growth: 40.9, cash: 554.6, debt: 1749.9 },
];

// Q2 2026 Summary
export const q2_2026 = {
  produced_oz: 104616,
  sold_oz: 102691,
  realized_per_oz: 4379,
  tcc_per_oz: 1432,
  aisc_per_oz: 1926,
  margin_per_oz: 4379 - 1926, // $2,453
  revenue_M: 487.5,
  fcf_M: -334.1,
  fcf_ex_growth_M: 40.9,
  cash_M: 554.6,
  debt_M: 1749.9,
};

// FY 2025 Summary
export const fy_2025 = {
  produced_oz: 488268,
  aisc_per_oz: 1664,
  revenue_M: 1818.9,
};

// 2026 Guidance
export const guidance_2026 = {
  consolidated_gold_koz: "495–600",
  existing_four_mines_koz: "430–490",
  tcc_per_oz: "1220–1420",
  aisc_per_oz: "1670–1870",
  aisc_note: "Four existing mines; excludes Skouries and McIlvenna Bay",
  skouries_au_koz: "60–100",
  skouries_cu_mlb: "20–40",
  mcbay_cu_mlb: "5–10",
  mcbay_zn_kt: "3–6",
  mcbay_au_koz: "5–10",
  mcbay_ag_koz: "100–200",
};

export const companyInfo = {
  name: "Eldorado Gold Corporation",
  headquarters: "Vancouver, Canada",
  tickers: "ELD.TO (TSX, CAD) / EGO (NYSE, USD)",
  operations: [
    "Lamaque (Canada)",
    "Kışladağ (Türkiye)",
    "Efemçukuru (Türkiye)",
    "Olympias (Greece)",
    "Skouries (Greece) — commissioning",
    "McIlvenna Bay (Canada) — ramping",
  ],
  h1_2026_production: "204,974 oz gold",
  fy_2026_guidance: "495–600 koz gold (incl. Skouries + McBay)",
  q2_2026_aisc: "$1,926/oz USD (four mines; above FY ops guidance $1,670–1,870)",
  q2_2026_note: "Production H2-weighted; Q2 AISC above ops guidance but not a concluded miss",
};
