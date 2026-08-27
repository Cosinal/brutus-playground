#!/usr/bin/env python3
"""
Fetch financial data from SEC EDGAR company facts API.

Usage:
    python scripts/fetch-sec-financials.py [--config config/company.json]
    
    Or with explicit CIK:
    python scripts/fetch-sec-financials.py --cik 0000918608

Fetches a small standard set of financial metrics from SEC XBRL company facts:
- Revenues
- Net Income (Loss)
- Operating Cash Flow

Supports both US-GAAP and IFRS frameworks.
Only includes fields that exist in the company's XBRL filings.
Does not invent or interpolate missing data.
Does not compute Free Cash Flow (only includes if explicitly tagged).

Writes data/sec-financials.json with schema:
{
  "asOf": "YYYY-MM-DD",
  "source": "SEC EDGAR company facts API",
  "cik": "0000918608",
  "companyName": "...",
  "framework": "us-gaap" or "ifrs-full",
  "fiscalYearEnd": "12-31",
  "metrics": {
    "Revenues": [...],
    "NetIncome": [...],
    "OperatingCashFlow": [...],
    ...
  }
}

Note: Canadian-only filers without SEC registration (no CIK) cannot use this script.
"""

import argparse
import json
import sys
import time
import urllib.request
from datetime import datetime, timezone
from typing import Dict, List, Optional


# Standard metric mappings for US-GAAP and IFRS
METRIC_MAPPINGS = {
    "Revenues": [
        "us-gaap:Revenues",
        "us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax",
        "ifrs-full:Revenue",
        "ifrs-full:RevenueFromSaleOfGoods",
    ],
    "NetIncome": [
        "us-gaap:NetIncomeLoss",
        "us-gaap:ProfitLoss",
        "ifrs-full:ProfitLoss",
        "ifrs-full:NetIncomeLoss",
    ],
    "OperatingCashFlow": [
        "us-gaap:NetCashProvidedByUsedInOperatingActivities",
        "ifrs-full:CashFlowsFromUsedInOperatingActivitiesContinuingOperations",
        "ifrs-full:CashFlowsFromUsedInOperatingActivities",
    ],
    "GrossProfit": [
        "us-gaap:GrossProfit",
        "ifrs-full:GrossProfit",
    ],
}


def fetch_sec_company_facts(cik: str, user_agent: str = "Mozilla/5.0") -> Dict:
    """
    Fetch company facts from SEC EDGAR API.
    
    CIK must be 10 digits with leading zeros.
    SEC requires a User-Agent header.
    """
    # Ensure CIK is 10 digits with leading zeros
    cik_padded = cik.zfill(10)
    
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik_padded}.json"
    
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": user_agent,
            "Accept": "application/json"
        }
    )
    
    try:
        # SEC asks for reasonable rate limiting
        time.sleep(0.1)
        
        with urllib.request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read())
            return data
    except urllib.error.HTTPError as e:
        if e.code == 404:
            raise ValueError(f"CIK {cik} not found in SEC database")
        elif e.code == 429:
            raise ValueError("SEC rate limit exceeded. Wait and try again.")
        else:
            raise ValueError(f"SEC API error: HTTP {e.code}")
    except Exception as e:
        raise ValueError(f"Failed to fetch SEC data: {e}")


def extract_annual_data(facts_data: Dict, tag_candidates: List[str]) -> Optional[List[Dict]]:
    """
    Extract annual (10-K or 40-F) data for a metric by trying multiple tag candidates.
    
    Returns list of {period, fiscalYear, value, units, filed, form} or None if no tag found.
    Prefers FY facts, latest filed per period end.
    """
    # Try each framework (us-gaap first, then ifrs-full)
    for tag_full in tag_candidates:
        framework, tag_name = tag_full.split(":")
        
        facts = facts_data.get("facts", {}).get(framework, {})
        if tag_name not in facts:
            continue
        
        tag_data = facts[tag_name]
        units = tag_data.get("units", {})
        
        # Try USD first, then any available unit
        unit_key = None
        if "USD" in units:
            unit_key = "USD"
        elif units:
            unit_key = list(units.keys())[0]
        else:
            continue
        
        unit_data = units[unit_key]
        
        # Filter for annual filings (10-K or 40-F), latest filed per period end
        period_map = {}
        for item in unit_data:
            form = item.get("form", "")
            if form not in ["10-K", "40-F"]:
                continue
            
            # Only include FY facts (fp = FY or end)
            fp = item.get("fp", "")
            if fp not in ["FY", "end"]:
                continue
            
            period_end = item.get("end", "")
            filed = item.get("filed", "")
            
            if not period_end:
                continue
            
            # Keep latest filed for each period end
            if period_end not in period_map or filed > period_map[period_end]["filed"]:
                period_map[period_end] = {
                    "period": period_end,
                    "fiscalYear": item.get("fy", ""),
                    "fiscalPeriod": fp,
                    "value": item.get("val"),
                    "units": unit_key,
                    "filed": filed,
                    "form": form,
                    "frame": item.get("frame", "")
                }
        
        if not period_map:
            continue
        
        # Sort by period (most recent last)
        annual_data = sorted(period_map.values(), key=lambda x: x["period"])
        
        return annual_data if annual_data else None
    
    return None


def load_config(config_path: str) -> Dict:
    """Load company configuration."""
    try:
        with open(config_path) as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"✗ Config file not found: {config_path}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"✗ Invalid JSON in config file: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Fetch financial data from SEC EDGAR company facts API",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--config",
        default="config/company.json",
        help="Path to company config JSON (default: config/company.json)"
    )
    parser.add_argument(
        "--cik",
        help="Explicit CIK number (overrides config)"
    )
    parser.add_argument(
        "--user-agent",
        default="Mozilla/5.0 (Brutus Dashboard)",
        help="User-Agent header for SEC requests"
    )
    
    args = parser.parse_args()
    
    # Determine CIK
    if args.cik:
        cik = args.cik
        company_name = f"CIK {cik}"
        print(f"Using explicit CIK: {cik}")
    else:
        config = load_config(args.config)
        cik = config.get("cik")
        company_name = config.get("name", "Unknown")
        
        if not cik:
            print("✗ No CIK found in config or command line", file=sys.stderr)
            print("  Note: Canadian-only filers without SEC registration cannot use this script.", file=sys.stderr)
            sys.exit(1)
        
        print(f"Loaded config: {company_name}")
        print(f"CIK: {cik}")
    
    print("\nFetching SEC company facts...")
    
    try:
        facts_data = fetch_sec_company_facts(cik, args.user_agent)
    except ValueError as e:
        print(f"✗ {e}", file=sys.stderr)
        sys.exit(1)
    
    entity_name = facts_data.get("entityName", company_name)
    print(f"✓ Found: {entity_name}")
    
    # Detect framework (us-gaap or ifrs-full)
    facts = facts_data.get("facts", {})
    framework = None
    if "us-gaap" in facts and facts["us-gaap"]:
        framework = "us-gaap"
    elif "ifrs-full" in facts and facts["ifrs-full"]:
        framework = "ifrs-full"
    
    if framework:
        print(f"  Framework: {framework.upper()}")
    
    # Extract standard metrics
    metrics = {}
    
    print("\nExtracting annual (10-K / 40-F) metrics:")
    
    for metric_name, tag_candidates in METRIC_MAPPINGS.items():
        data = extract_annual_data(facts_data, tag_candidates)
        
        if data:
            metrics[metric_name] = data
            print(f"  ✓ {metric_name}: {len(data)} annual periods")
        else:
            print(f"  - {metric_name}: not found")
    
    if not metrics:
        print("\n✗ No standard financial metrics found in SEC filings", file=sys.stderr)
        print("  This company may not file standard XBRL data.", file=sys.stderr)
        sys.exit(1)
    
    # Build output
    output = {
        "asOf": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "source": f"SEC EDGAR company facts API ({framework.upper() if framework else 'XBRL'})",
        "cik": cik,
        "companyName": entity_name,
        "framework": framework,
        "metrics": metrics
    }
    
    # Write to data/sec-financials.json
    output_path = "data/sec-financials.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✓ Written {output_path}")
    
    # Show sample of most recent data
    print("\nMost recent annual data:")
    for metric_name, data in metrics.items():
        if data:
            recent = data[-1]
            value_str = f"{recent['value']:,.0f}" if recent['value'] else "null"
            print(f"  {metric_name} (FY {recent['fiscalYear']}): {value_str} {recent['units']}")


if __name__ == "__main__":
    main()
