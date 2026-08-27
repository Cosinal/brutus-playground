// Eldorado Gold: Expected vs Achieved Milestone Ledger
// Sourced from public SEC filings (6-K), news releases, and MD&As
// This ledger tracks prior guidance against what was reported in the latest filing

export interface MilestoneEntry {
  metric: string;
  category: "production" | "ramp" | "cost" | "guidance";
  priorExpected: string | null;
  latestPrinted: string | null;
  status: "expected" | "achieved" | "slipped" | "unchanged";
  source: string;
  sourceDate: string;
  sourceUrl?: string;
  notes?: string;
}

// Milestone ledger: expected vs achieved
// Updated as of: 2026-08-27
// Latest filing: Q2 2026 6-K (2026-07-30) and McIlvenna Bay NR (2026-06-08)
export const milestoneLedger: MilestoneEntry[] = [
  {
    metric: "Skouries first copper-gold concentrate",
    category: "ramp",
    priorExpected: "Q3 2026",
    latestPrinted: "Q3 2026 (expected)",
    status: "expected",
    source: "Q2 2026 MD&A and News Release",
    sourceDate: "2026-07-30",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0000918608/000091860826000022/ego6-k20260730nr.htm",
    notes: "Skouries commissioning on track for Q3 2026 first concentrate per Q2 2026 NR",
  },
  {
    metric: "Skouries commercial production",
    category: "ramp",
    priorExpected: "Q4 2026",
    latestPrinted: "Q4 2026 (expected)",
    status: "expected",
    source: "Q2 2026 MD&A and News Release",
    sourceDate: "2026-07-30",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0000918608/000091860826000022/ego6-k20260730nr.htm",
    notes: "Skouries commercial production targeted Q4 2026 per Q2 2026 NR",
  },
  {
    metric: "McIlvenna Bay first copper",
    category: "ramp",
    priorExpected: "June 2026",
    latestPrinted: "Achieved June 7, 2026",
    status: "achieved",
    source: "McIlvenna Bay First Concentrate News Release",
    sourceDate: "2026-06-08",
    notes: "First copper concentrate produced June 7, 2026 per June 8 NR (GlobeNewswire)",
  },
  {
    metric: "McIlvenna Bay commercial production",
    category: "ramp",
    priorExpected: "Q3 2026",
    latestPrinted: "Q3 2026 (expected)",
    status: "expected",
    source: "Q2 2026 MD&A and News Release",
    sourceDate: "2026-07-30",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0000918608/000091860826000022/ego6-k20260730nr.htm",
    notes: "McIlvenna Bay commercial production expected Q3 2026 per Q2 2026 NR",
  },
  {
    metric: "McIlvenna Bay nameplate capacity",
    category: "ramp",
    priorExpected: "4,900 tpd",
    latestPrinted: "4,900 tpd (ramping)",
    status: "unchanged",
    source: "McIlvenna Bay First Concentrate News Release",
    sourceDate: "2026-06-08",
    notes: "Nameplate 4,900 tpd confirmed June 8, 2026 NR. Prior unsourced 2,750 tpd removed.",
  },
  {
    metric: "FY 2026 production guidance",
    category: "guidance",
    priorExpected: "495–600 koz gold",
    latestPrinted: "495–600 koz (unchanged)",
    status: "unchanged",
    source: "Q2 2026 MD&A and News Release",
    sourceDate: "2026-07-30",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0000918608/000091860826000022/ego6-k20260730nr.htm",
    notes: "FY 2026 guidance reaffirmed at 495–600 koz in Q2 2026 MD&A",
  },
  {
    metric: "H1 2026 production",
    category: "production",
    priorExpected: null,
    latestPrinted: "204,974 oz gold",
    status: "achieved",
    source: "Q2 2026 MD&A and News Release",
    sourceDate: "2026-07-30",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0000918608/000091860826000022/ego6-k20260730nr.htm",
    notes: "H1 2026 actual: 204,974 oz (Q1 100,358 oz + Q2 104,616 oz)",
  },
  {
    metric: "Q2 2026 AISC",
    category: "cost",
    priorExpected: null,
    latestPrinted: "$1,926/oz",
    status: "achieved",
    source: "Q2 2026 MD&A and News Release",
    sourceDate: "2026-07-30",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/0000918608/000091860826000022/ego6-k20260730nr.htm",
    notes: "Q2 2026 AISC $1,926/oz vs Q1 2026 $1,942/oz (slight improvement)",
  },
];

// Latest filings metadata (sourced from SEC EDGAR submissions API)
// This is a subset of data/sec-filings.json for the most relevant filings
export interface FilingMeta {
  accessionNumber: string;
  filingDate: string;
  reportDate: string;
  form: string;
  description: string;
  url: string;
}

export const latestFilings: FilingMeta[] = [
  {
    accessionNumber: "0000918608-26-000022",
    filingDate: "2026-07-30",
    reportDate: "2026-06-30",
    form: "6-K",
    description: "Q2 2026 News Release",
    url: "https://www.sec.gov/Archives/edgar/data/0000918608/000091860826000022/ego6-k20260730nr.htm",
  },
  {
    accessionNumber: "0000918608-26-000023",
    filingDate: "2026-07-30",
    reportDate: "2026-06-30",
    form: "6-K",
    description: "Q2 2026 MD&A and Financial Statements",
    url: "https://www.sec.gov/Archives/edgar/data/0000918608/000091860826000023/ego6-k20260730fsmda.htm",
  },
];

// Helper: get the latest filing for a category
export function getLatestFilingForCategory(category: string): FilingMeta | null {
  // For now, all categories use Q2 2026 6-K as the latest source
  return latestFilings[0] || null;
}

// Helper: check if a milestone has changed since prior guidance
export function getMilestonesDiff(): MilestoneEntry[] {
  // Return milestones that have status "achieved" or "slipped"
  // "expected" and "unchanged" are the baseline
  return milestoneLedger.filter(m => m.status === "achieved" || m.status === "slipped");
}

// Data sourcing notes
export const milestoneLedgerMeta = {
  asOf: "2026-08-27",
  source: "SEC EDGAR 6-K filings and Eldorado Gold news releases",
  notes: [
    "All milestones sourced from public filings (no confidential data)",
    "Expected milestones are guidance from latest filing (Q2 2026 MD&A)",
    "Achieved milestones confirmed in news releases or MD&As",
    "Slipped milestones show where guidance moved vs prior quarter",
    "Blanks (null) mean no prior guidance or no latest print",
  ],
};
