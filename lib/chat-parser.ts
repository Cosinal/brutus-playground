export type ChartId = string;
export type BoardMode = "default" | "profitability" | "growth" | "filings" | "production" | "skouries" | "liquidity";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChartAction {
  type: "filter" | "modify" | "add" | "remove" | "answer" | "switch_mode" | "reset";
  target?: string;
  params?: Record<string, any>;
  response: string;
  mode?: BoardMode;
  charts?: string[];
}

export function parseIntent(query: string): ChartAction {
  const q = query.toLowerCase().trim();

  // Reset to default dashboard
  if (q.includes("reset") || q.includes("show the full dashboard") || q.includes("default dashboard")) {
    return {
      type: "reset",
      response: "Resetting to the default 5-chart dashboard.",
      mode: "default",
    };
  }

  // PROFITABILITY MODE - Question takes over the board
  if (
    q.includes("profitability") ||
    q.includes("profitable") ||
    q.includes("earnings") ||
    q.includes("margin") && !q.includes("add") ||
    q.includes("aisc vs gold") && !q.includes("chart") ||
    q.includes("how did they make money") ||
    q.includes("were they profitable")
  ) {
    return {
      type: "switch_mode",
      mode: "profitability",
      response: "Switching to profitability analysis. Q2 2026: Realized gold $4,379/oz, AISC $1,926/oz → cash margin $2,453/oz. Operating mines FCF positive at $40.9M ex-growth; total FCF -$334.1M due to Skouries + McIlvenna Bay capex.",
      charts: ["profitability-company", "profitability-fcf", "profitability-mine", "profitability-metal", "profitability-revenue"],
    };
  }

  // GROWTH MODE - Historical time horizon view
  if (
    q.includes("growth") ||
    q.includes("historical") && !q.includes("add") ||
    q.includes("over time") ||
    q.includes("time horizon") ||
    q.includes("history") && !q.includes("add") ||
    q.includes("trend") && !q.includes("add") ||
    q.includes("how has production grown") ||
    q.includes("show me growth")
  ) {
    return {
      type: "switch_mode",
      mode: "growth",
      response: "Switching to growth / historical view. Sourced data: Q1 2025–Q2 2026 quarterly production, FY 2025 annual (488 koz), FY 2026 guidance (495–600 koz). Revenue and FCF tracked where disclosed. No invented projections.",
      charts: ["growth-production", "growth-annual", "growth-aisc", "growth-revenue-fcf", "growth-market"],
    };
  }

  // FILINGS MODE - Expected vs Achieved / What Changed
  if (
    q.includes("filings") ||
    q.includes("what changed") ||
    q.includes("expected vs achieved") ||
    q.includes("did skouries slip") ||
    q.includes("did mcbay slip") ||
    q.includes("mcilvenna bay") && q.includes("slip") ||
    q.includes("milestone") && !q.includes("add") ||
    q.includes("expected vs actual")
  ) {
    return {
      type: "switch_mode",
      mode: "filings",
      response: "Switching to filings-diff / expected-vs-achieved view. Latest: Q2 2026 6-K (2026-07-30). Skouries first concentrate EXPECTED Q3 2026 (not achieved). McBay first copper ACHIEVED 2026-06-07 (June 8 NR). McBay commercial EXPECTED Q3 2026. All milestones sourced from public 6-K filings and news releases.",
      charts: ["expected-achieved"],
    };
  }

  // Services question (not supported)
  if (q.includes("services") && (q.includes("segment") || q.includes("business"))) {
    return {
      type: "answer",
      response: "Eldorado Gold does not report a 'services' segment in public filings. The company breaks out: (1) mine-level costs, (2) operating mines vs growth projects (Skouries + McIlvenna Bay), and (3) metal revenue (gold vs copper/zinc/silver). Ask about those instead.",
    };
  }

  // Filter operations (work in both default and profitability modes)
  if (q.includes("just") || q.includes("only") || q.includes("show only")) {
    if (q.includes("lamaque")) {
      return {
        type: "filter",
        target: "lamaque",
        response: "Filtering to Lamaque. Q2 2026 AISC: $1,192/oz (lowest cost operation).",
      };
    }
    if (q.includes("skouries")) {
      return {
        type: "filter",
        target: "skouries",
        response: "Filtering to Skouries. First concentrate targeted Q3 2026, commercial production Q4 2026.",
      };
    }
    if (q.includes("canada")) {
      return {
        type: "filter",
        target: "canada",
        response: "Filtering to Canadian operations: Lamaque (producing) and McIlvenna Bay (ramping).",
      };
    }
    if (q.includes("türkiye") || q.includes("turkey")) {
      return {
        type: "filter",
        target: "turkiye",
        response: "Filtering to Türkiye operations: Kışladağ and Efemçukuru.",
      };
    }
    if (q.includes("greece")) {
      return {
        type: "filter",
        target: "greece",
        response: "Filtering to Greek operations: Olympias (producing) and Skouries (commissioning for Q4 2026).",
      };
    }
  }

  // Hide/remove operations
  if (q.includes("hide") || q.includes("remove") || q.includes("delete")) {
    if (q.includes("canada")) {
      return {
        type: "filter",
        target: "exclude-canada",
        response: "Hiding Canadian operations.",
      };
    }
    if (q.includes("türkiye") || q.includes("turkey")) {
      return {
        type: "filter",
        target: "exclude-turkiye",
        response: "Hiding Türkiye operations.",
      };
    }
    if (q.includes("greece")) {
      return {
        type: "filter",
        target: "exclude-greece",
        response: "Hiding Greek operations.",
      };
    }
    if (q.includes("timeline") || q.includes("ramp")) {
      return {
        type: "remove",
        target: "ramp",
        response: "Removing ramp timeline chart.",
      };
    }
    if (q.includes("price")) {
      return {
        type: "remove",
        target: "price",
        response: "Removing ELD vs gold price chart.",
      };
    }
    if (q.includes("production")) {
      return {
        type: "remove",
        target: "production",
        response: "Removing production by mine chart.",
      };
    }
    if (q.includes("mix") || q.includes("asset")) {
      return {
        type: "remove",
        target: "mix",
        response: "Removing asset mix chart.",
      };
    }
    if (q.includes("aisc")) {
      return {
        type: "remove",
        target: "aisc",
        response: "Removing AISC chart.",
      };
    }
  }

  // Add charts
  if (q.includes("add")) {
    if (q.includes("cash") || q.includes("debt") || q.includes("liquidity")) {
      return {
        type: "answer",
        response: "Balance sheet data (cash, debt, liquidity) is not included in the current snapshot. Source from Q2 2026 10-Q/6-K if needed.",
      };
    }
    if (q.includes("production")) {
      return {
        type: "add",
        target: "production",
        response: "Adding production by mine chart.",
      };
    }
  }

  // Restyle operations
  if (q.includes("restyle") || q.includes("theme")) {
    if (q.includes("dark gold") || q.includes("gold")) {
      return {
        type: "modify",
        target: "theme",
        params: { theme: "dark-gold" },
        response: "Applying dark gold theme to charts.",
      };
    }
  }

  // Data questions
  if (q.includes("what is") || q.includes("what was")) {
    if (q.includes("aisc")) {
      return {
        type: "answer",
        response: "Q2 2026 consolidated AISC: $1,926/oz (USD). By mine: Lamaque $1,192, Kışladağ $2,407, Efemçukuru $2,252, Olympias $2,465. Source: Eldorado Gold Q2 2026 MD&A.",
      };
    }
    if (q.includes("production")) {
      return {
        type: "answer",
        response: "Q2 2026 production: 104,616 oz gold (Lamaque 52,340; Kışladağ 19,108; Efemçukuru 18,019; Olympias 15,125). Skouries/McBay gold oz = 0 until commercial production reported. H1 2026 total: 204,974 oz. FY 2026 guidance: 495–600 koz. Source: Eldorado Gold Q2 2026 MD&A.",
      };
    }
  }

  // Garbage filter
  if (q.length < 3 || q.includes("hello") || q.includes("hi ") || q === "test") {
    return {
      type: "answer",
      response: "Ask about profitability, production, costs, ramps, or tell me to filter/modify/add/remove a chart.",
    };
  }

  // Default: unclear intent
  return {
    type: "answer",
    response: "Try: 'what was profitability', 'show only Lamaque', 'hide Türkiye', 'add production', 'remove the timeline', or 'reset' to restore the default dashboard.",
  };
}
