export type ChartId = string;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChartAction {
  type: "filter" | "modify" | "add" | "remove" | "answer" | "reset";
  target?: string;
  params?: Record<string, any>;
  response: string;
}

export function parseIntent(query: string): ChartAction {
  const q = query.toLowerCase().trim();

  // Reset to default dashboard
  if (q.includes("reset") || q.includes("show the full dashboard") || q.includes("default dashboard")) {
    return {
      type: "reset",
      response: "Resetting to the default 5-chart dashboard.",
    };
  }

  // SOURCED Q2 2026 DATA QUESTIONS
  if (q.includes("what is") || q.includes("what was") || q.includes("q2 aisc")) {
    if (q.includes("aisc")) {
      return {
        type: "answer",
        response: "Q2 2026 consolidated AISC: exactly $1,926/oz sold (USD). By mine: Lamaque $1,192, Kışladağ $2,407, Efemçukuru $2,252, Olympias $2,465, plus $130 corporate allocation. Source: Q2 2026 MD&A. Above FY ops guidance ($1,670–1,870) but production is H2-weighted; not a concluded miss.",
      };
    }
    if (q.includes("production")) {
      return {
        type: "answer",
        response: "Q2 2026 production: 104,616 oz gold produced (Lamaque 52,340; Kışladağ 19,108; Efemçukuru 18,019; Olympias 15,125). H1 2026 total: 204,974 oz. FY 2026 guidance: 495–600 koz (incl. Skouries + McBay). Source: Q2 2026 NR.",
      };
    }
    if (q.includes("margin")) {
      return {
        type: "answer",
        response: "Q2 2026 margin: $2,453/oz (realized gold $4,379/oz minus AISC $1,926/oz). Source: Q2 2026 MD&A.",
      };
    }
  }

  // SKOURIES STATUS
  if (q.includes("skouries")) {
    if (q.includes("concentrate") || q.includes("produced") || q.includes("shipped")) {
      return {
        type: "answer",
        response: "Skouries first Cu-Au concentrate EXPECTED Q3 2026; NOT yet reported as of 2026-07-30. First ore crushed July 2026 on temp power. 97% complete at 2026-06-30. Final grid energization still required. Commercial production expected Q4 2026. Source: Q2 2026 NR.",
      };
    }
    if (q.includes("commercial")) {
      return {
        type: "answer",
        response: "Skouries commercial production EXPECTED Q4 2026. Not yet achieved. Source: Q2 2026 guidance.",
      };
    }
  }

  // MCILVENNA BAY STATUS
  if (q.includes("mcilvenna") || q.includes("mcbay")) {
    if (q.includes("commercial")) {
      return {
        type: "answer",
        response: "McIlvenna Bay commercial production EXPECTED Q3 2026; not yet achieved. First copper 2026-06-07 (happened), first zinc July 2026. Q2 2026: 5,405 t processed → 65,398 payable Cu lb. Not in AISC denominator until commercial. Source: Q2 2026 NR.",
      };
    }
    if (q.includes("first copper") || q.includes("first zinc")) {
      return {
        type: "answer",
        response: "McIlvenna Bay first copper: 2026-06-07 (achieved). First zinc: July 2026 (achieved). Commercial production expected Q3 2026 (not yet achieved). Source: Q2 2026 NR.",
      };
    }
  }

  // REFUSE INVENTED DATA
  if (q.includes("nav") || q.includes("net asset value") || q.includes("nav per share")) {
    return {
      type: "answer",
      response: "NAV/share is not disclosed in Q2 2026 filings. Refuse to invent. Market cap as of 2026-08-26: C$17.002B (ELD.TO) / $12.248B USD (EGO). Source: Yahoo Finance.",
    };
  }

  if (q.includes("q3 2026") || q.includes("q4 2026")) {
    return {
      type: "answer",
      response: "Q3 and Q4 2026 actual results not yet reported. Next quarterly print expected around Oct 29, 2026. Do not invent forward figures. FY 2026 guidance: 495–600 koz gold (incl. Skouries + McBay). Source: Q2 2026 guidance update.",
      };
  }

  // Filter operations
  if (q.includes("just") || q.includes("only") || q.includes("show only")) {
    if (q.includes("lamaque")) {
      return {
        type: "filter",
        target: "lamaque",
        response: "Filtering to Lamaque. Q2 2026: 52,340 oz, AISC $1,192/oz (lowest cost operation).",
      };
    }
    if (q.includes("skouries")) {
      return {
        type: "filter",
        target: "skouries",
        response: "Filtering to Skouries. First Cu-Au concentrate expected Q3 2026 (not yet shipped as of 2026-07-30). Commercial Q4 2026.",
      };
    }
    if (q.includes("canada")) {
      return {
        type: "filter",
        target: "canada",
        response: "Filtering to Canadian operations: Lamaque (producing) and McIlvenna Bay (ramping, commercial expected Q3 2026).",
      };
    }
    if (q.includes("turkey") || q.includes("türkiye")) {
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
        response: "Filtering to Greek operations: Olympias (producing) and Skouries (commissioning, commercial expected Q4 2026).",
      };
    }
  }

  // Remove charts
  if (q.includes("remove") || q.includes("delete") || q.includes("hide")) {
    if (q.includes("production")) {
      return { type: "remove", target: "production", response: "Removing production by mine chart." };
    }
    if (q.includes("aisc")) {
      return { type: "remove", target: "aisc", response: "Removing AISC vs realized chart." };
    }
    if (q.includes("mix") || q.includes("asset")) {
      return { type: "remove", target: "mix", response: "Removing asset mix chart." };
    }
    if (q.includes("ramp") || q.includes("timeline") || q.includes("status")) {
      return { type: "remove", target: "ramp", response: "Removing project status chart." };
    }
    if (q.includes("market") || q.includes("price")) {
      return { type: "remove", target: "market", response: "Removing market snapshot chart." };
    }
  }

  // Add charts
  if (q.includes("add")) {
    if (q.includes("production")) {
      return { type: "add", target: "production", response: "Adding production by mine chart." };
    }
    if (q.includes("aisc")) {
      return { type: "add", target: "aisc", response: "Adding AISC vs realized chart." };
    }
    if (q.includes("mix") || q.includes("asset")) {
      return { type: "add", target: "mix", response: "Adding asset mix chart." };
    }
    if (q.includes("ramp") || q.includes("status")) {
      return { type: "add", target: "ramp", response: "Adding project status chart." };
    }
    if (q.includes("market") || q.includes("price")) {
      return { type: "add", target: "market", response: "Adding market snapshot chart." };
    }
  }

  // Garbage filter
  if (q.length < 3 || q.includes("hello") || q.includes("hi ") || q === "test") {
    return {
      type: "answer",
      response: "Ask about Q2 2026 data, Skouries/McBay status, or tell me to add/remove/filter charts. Try: 'what is Q2 AISC', 'has Skouries produced concentrate', 'show only Lamaque', or 'reset'.",
    };
  }

  // Default: unclear intent
  return {
    type: "answer",
    response: "Try: 'what is Q2 AISC', 'has Skouries produced concentrate', 'show only Lamaque', 'remove the market chart', or 'reset' to restore the default dashboard.",
  };
}
