export type ChartId = string;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChartAction {
  type: "filter" | "modify" | "add" | "remove" | "answer";
  target?: string;
  params?: Record<string, any>;
  response: string;
}

export function parseIntent(query: string): ChartAction {
  const q = query.toLowerCase().trim();

  // Filter operations
  if (q.includes("just") || q.includes("only") || q.includes("show only")) {
    if (q.includes("lamaque")) {
      return {
        type: "filter",
        target: "lamaque",
        response: "Filtering data to show only Lamaque operations. Note: Most charts show consolidated data; individual mine AISC available in bar chart view.",
      };
    }
    if (q.includes("skouries")) {
      return {
        type: "filter",
        target: "skouries",
        response: "Filtering to Skouries. Check the ramp timeline chart for Skouries milestones.",
      };
    }
  }

  // Chart type modifications
  if (q.includes("bar chart") || q.includes("bar graph")) {
    if (q.includes("aisc") || q.includes("cost")) {
      return {
        type: "modify",
        target: "aisc",
        params: { chartType: "bar" },
        response: "Switching AISC to bar chart by mine for Q2 2026.",
      };
    }
  }

  if (q.includes("line chart") || q.includes("line graph")) {
    if (q.includes("aisc") || q.includes("cost")) {
      return {
        type: "modify",
        target: "aisc",
        params: { chartType: "line" },
        response: "Switching AISC to line chart showing consolidated trend over time.",
      };
    }
  }

  // Add charts
  if (q.includes("add") || q.includes("show") && !q.includes("show only")) {
    if (q.includes("copper")) {
      return {
        type: "add",
        target: "copper",
        response: "Adding copper production chart. McIlvenna Bay producing since June 2026; Skouries first concentrate targeted Q3 2026.",
      };
    }
  }

  // Remove charts
  if (q.includes("remove") || q.includes("delete") || q.includes("hide")) {
    if (q.includes("price")) {
      return {
        type: "remove",
        target: "price",
        response: "Removing price chart.",
      };
    }
    if (q.includes("production")) {
      return {
        type: "remove",
        target: "production",
        response: "Removing production chart.",
      };
    }
    if (q.includes("aisc") || q.includes("cost")) {
      return {
        type: "remove",
        target: "aisc",
        response: "Removing AISC chart.",
      };
    }
    if (q.includes("ramp")) {
      return {
        type: "remove",
        target: "ramp",
        response: "Removing ramp timeline chart.",
      };
    }
    if (q.includes("mix") || q.includes("revenue")) {
      return {
        type: "remove",
        target: "mix",
        response: "Removing revenue mix chart.",
      };
    }
    if (q.includes("decision") || q.includes("callout")) {
      return {
        type: "remove",
        target: "decision",
        response: "Removing decision callout.",
      };
    }
    if (q.includes("copper")) {
      return {
        type: "remove",
        target: "copper",
        response: "Removing copper production chart.",
      };
    }
  }

  // Investment decision questions
  if (q.includes("skouries") && (q.includes("slip") || q.includes("delay") || q.includes("quarter"))) {
    return {
      type: "answer",
      response: "A one-quarter Skouries delay would push meaningful copper-gold production into Q1 2027, pressuring 2026 guidance and delaying the mix shift. However, McIlvenna Bay is already producing and derisking the polymetallic story. The 2027 decision hinges on cost performance—if Q3-Q4 AISC stays above $1,900/oz even with new production, margin compression at current gold prices becomes a concern. Watch Q3 results.",
    };
  }

  if (q.includes("cost") && (q.includes("high") || q.includes("concern") || q.includes("problem"))) {
    return {
      type: "answer",
      response: "Q2 2026 AISC of $1,926/oz is elevated vs. 2025 average ~$1,810/oz. Olympias remains high-cost, and Skouries is pre-commercial. If Skouries ramps successfully in Q4 and reaches commercial production, consolidated AISC should compress in 2027. The risk: if costs don't fall materially below $1,800/oz with new production online, margins weaken relative to peers.",
    };
  }

  if (q.includes("buy") || q.includes("sell") || q.includes("investment") && q.includes("recommend")) {
    return {
      type: "answer",
      response: "I don't provide buy/sell recommendations. This dashboard presents production, cost, and ramp data for you to assess whether Eldorado's 2026-2027 transformation (Skouries + McIlvenna Bay, copper exposure, cost trajectory) aligns with your investment thesis. The decision is yours.",
    };
  }

  // Garbage filter
  if (q.length < 3 || q.includes("hello") || q.includes("hi ") || q.includes("test") && !q.includes("aisc")) {
    return {
      type: "answer",
      response: "Please ask a question about Eldorado Gold's operations, costs, production, or ramp timeline—or tell me to filter, modify, add, or remove a chart.",
    };
  }

  // Default: unclear intent
  return {
    type: "answer",
    response: "I didn't understand that. Try: 'Just Lamaque', 'Show AISC as a bar chart', 'Add copper production', 'Remove the price chart', or ask about Skouries delay impact.",
  };
}
