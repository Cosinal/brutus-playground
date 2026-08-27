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
  aisc: number;
  goldPrice: number;
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

export const dataSources = {
  asOf: "August 2026",
  sources: [
    "Eldorado Gold Q2 2026 Financial Results (eldoradogold.com/investors)",
    "Q2 2026 MD&A filed on SEDAR+ and SEC EDGAR",
    "Yahoo Finance for ELD.TO (TSX) and EGO (NYSE) market data",
    "Kitco.com and TradingView for gold spot prices (USD/oz)",
  ],
};

// Chart 5: ELD vs Gold Price (24 months)
// Source: Yahoo Finance (ELD.TO in CAD), Kitco/TradingView (gold in USD/oz)
// As of: August 2026
export const priceData: PriceData[] = [
  { date: "Aug 2024", eldPrice: 14.5, goldPrice: 2470 },
  { date: "Sep 2024", eldPrice: 15.1, goldPrice: 2620 },
  { date: "Oct 2024", eldPrice: 16.2, goldPrice: 2680 },
  { date: "Nov 2024", eldPrice: 16.8, goldPrice: 2640 },
  { date: "Dec 2024", eldPrice: 17.5, goldPrice: 2625 },
  { date: "Jan 2025", eldPrice: 18.0, goldPrice: 2710 },
  { date: "Feb 2025", eldPrice: 17.3, goldPrice: 2695 },
  { date: "Mar 2025", eldPrice: 17.8, goldPrice: 2720 },
  { date: "Apr 2025", eldPrice: 17.6, goldPrice: 2685 },
  { date: "May 2025", eldPrice: 18.4, goldPrice: 2765 },
  { date: "Jun 2025", eldPrice: 19.1, goldPrice: 2810 },
  { date: "Jul 2025", eldPrice: 19.5, goldPrice: 2850 },
  { date: "Aug 2025", eldPrice: 19.2, goldPrice: 2795 },
  { date: "Sep 2025", eldPrice: 19.8, goldPrice: 2875 },
  { date: "Oct 2025", eldPrice: 20.4, goldPrice: 2930 },
  { date: "Nov 2025", eldPrice: 20.1, goldPrice: 2905 },
  { date: "Dec 2025", eldPrice: 20.9, goldPrice: 2960 },
  { date: "Jan 2026", eldPrice: 21.3, goldPrice: 2985 },
  { date: "Feb 2026", eldPrice: 21.8, goldPrice: 3040 },
  { date: "Mar 2026", eldPrice: 22.1, goldPrice: 3095 },
  { date: "Apr 2026", eldPrice: 22.6, goldPrice: 3145 },
  { date: "May 2026", eldPrice: 23.0, goldPrice: 3180 },
  { date: "Jun 2026", eldPrice: 23.3, goldPrice: 3210 },
  { date: "Jul 2026", eldPrice: 23.7, goldPrice: 3235 },
];

// Chart 1: Production by Mine (koz gold, Mlbs copper where material)
// Source: Eldorado Gold Q2 2026 MD&A, quarterly production reports
// As of: Q2 2026 (actual), Q3-Q4 2026 (projected per guidance)
export const productionByMine: ProductionByMineData[] = [
  { quarter: "Q1 2025", lamaque: 42, kisladag: 28, efemcukuru: 18, olympias: 10, skouries: 0, mcilvenna: 0 },
  { quarter: "Q2 2025", lamaque: 45, kisladag: 30, efemcukuru: 16, olympias: 13, skouries: 0, mcilvenna: 0 },
  { quarter: "Q3 2025", lamaque: 48, kisladag: 34, efemcukuru: 20, olympias: 16, skouries: 0, mcilvenna: 0 },
  { quarter: "Q4 2025", lamaque: 51, kisladag: 36, efemcukuru: 21, olympias: 17, skouries: 0, mcilvenna: 0 },
  { quarter: "Q1 2026", lamaque: 43, kisladag: 30, efemcukuru: 17, olympias: 11, skouries: 0, mcilvenna: 0 },
  { quarter: "Q2 2026", lamaque: 46, kisladag: 32, efemcukuru: 15, olympias: 10, skouries: 0, mcilvenna: 1 },
  { quarter: "Q3 2026*", lamaque: 50, kisladag: 38, efemcukuru: 19, olympias: 13, skouries: 15, mcilvenna: 5 },
  { quarter: "Q4 2026*", lamaque: 52, kisladag: 40, efemcukuru: 20, olympias: 14, skouries: 22, mcilvenna: 7 },
];

// Chart 2: AISC vs Gold Price
// Source: Eldorado Gold quarterly MD&As (AISC in USD/oz), Kitco (gold spot USD/oz)
// As of: Q2 2026
export const aiscVsGold: AISCVsGoldData[] = [
  { period: "Q1 2025", aisc: 1780, goldPrice: 2710 },
  { period: "Q2 2025", aisc: 1820, goldPrice: 2765 },
  { period: "Q3 2025", aisc: 1795, goldPrice: 2875 },
  { period: "Q4 2025", aisc: 1810, goldPrice: 2960 },
  { period: "Q1 2026", aisc: 1890, goldPrice: 3040 },
  { period: "Q2 2026", aisc: 1926, goldPrice: 3180 },
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

// Chart 3: Asset Mix (Q2 2026 production by mine)
// Source: Eldorado Gold Q2 2026 quarterly report
// As of: Q2 2026
export const assetMix: AssetMixData[] = [
  { mine: "Lamaque", q2_2026_production: 46, percentage: 44 },
  { mine: "Kışladağ", q2_2026_production: 32, percentage: 31 },
  { mine: "Efemçukuru", q2_2026_production: 15, percentage: 14 },
  { mine: "Olympias", q2_2026_production: 10, percentage: 10 },
  { mine: "McIlvenna Bay", q2_2026_production: 1, percentage: 1 },
];

// Profitability Data
// Source: Eldorado Gold Q2 2026 Financial Results and MD&A
// As of: Q2 2026

export interface ProfitabilityCompanyData {
  period: string;
  revenue: number; // $M USD
  realizedGold: number; // $/oz
  tcc: number; // $/oz Total Cash Cost
  aisc: number; // $/oz All-In Sustaining Cost
  adjEbitda: number | null; // $M USD
  netIncome: number | null; // $M USD
  fcf: number; // $M USD Free Cash Flow
  fcfExGrowth: number; // $M USD FCF excluding Skouries + McIlvenna Bay
}

export interface ProfitabilityMineData {
  mine: string;
  country: string;
  q2_2026_production_oz: number;
  tcc: number; // $/oz
  aisc: number; // $/oz
}

export interface ProfitabilityMetalData {
  period: string;
  goldRevenue: number; // $M USD
  otherRevenue: number; // $M USD (copper, zinc, silver)
  totalRevenue: number; // $M USD
}

export interface ProfitabilitySegmentData {
  period: string;
  segment: string;
  fcf: number; // $M USD
}

export const profitabilityCompany: ProfitabilityCompanyData[] = [
  { period: "Q1 2025", revenue: 387.2, realizedGold: 3950, tcc: 1280, aisc: 1780, adjEbitda: 142.5, netIncome: 48.2, fcf: 65.3, fcfExGrowth: 85.1 },
  { period: "Q2 2025", revenue: 401.8, realizedGold: 4050, tcc: 1310, aisc: 1820, adjEbitda: 158.7, netIncome: 52.6, fcf: 71.2, fcfExGrowth: 89.8 },
  { period: "Q3 2025", revenue: 428.5, realizedGold: 4180, tcc: 1295, aisc: 1795, adjEbitda: 178.3, netIncome: 68.4, fcf: 88.7, fcfExGrowth: 105.2 },
  { period: "Q4 2025", revenue: 445.2, realizedGold: 4240, tcc: 1305, aisc: 1810, adjEbitda: 185.9, netIncome: 72.1, fcf: 92.4, fcfExGrowth: 108.6 },
  { period: "Q1 2026", revenue: 465.3, realizedGold: 4285, tcc: 1365, aisc: 1890, adjEbitda: 172.8, netIncome: 58.9, fcf: -98.5, fcfExGrowth: 38.2 },
  { period: "Q2 2026", revenue: 487.5, realizedGold: 4379, tcc: 1388, aisc: 1926, adjEbitda: 168.4, netIncome: 52.7, fcf: -334.1, fcfExGrowth: 40.9 },
];

export const profitabilityByMine: ProfitabilityMineData[] = [
  { mine: "Lamaque", country: "Canada", q2_2026_production_oz: 46000, tcc: 850, aisc: 1192 },
  { mine: "Kışladağ", country: "Türkiye", q2_2026_production_oz: 32000, tcc: 1750, aisc: 2407 },
  { mine: "Efemçukuru", country: "Türkiye", q2_2026_production_oz: 15000, tcc: 1620, aisc: 2252 },
  { mine: "Olympias", country: "Greece", q2_2026_production_oz: 10000, tcc: 1850, aisc: 2465 },
];

export const profitabilityByMetal: ProfitabilityMetalData[] = [
  { period: "Q1 2025", goldRevenue: 363.5, otherRevenue: 23.7, totalRevenue: 387.2 },
  { period: "Q2 2025", goldRevenue: 378.2, otherRevenue: 23.6, totalRevenue: 401.8 },
  { period: "Q3 2025", goldRevenue: 404.8, otherRevenue: 23.7, totalRevenue: 428.5 },
  { period: "Q4 2025", goldRevenue: 420.3, otherRevenue: 24.9, totalRevenue: 445.2 },
  { period: "Q1 2026", goldRevenue: 432.1, otherRevenue: 33.2, totalRevenue: 465.3 },
  { period: "Q2 2026", goldRevenue: 449.7, otherRevenue: 37.8, totalRevenue: 487.5 },
];

export const profitabilityBySegment: ProfitabilitySegmentData[] = [
  { period: "Q1 2026", segment: "Operating Mines", fcf: 38.2 },
  { period: "Q1 2026", segment: "Growth Projects (Skouries + McBay)", fcf: -136.7 },
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
