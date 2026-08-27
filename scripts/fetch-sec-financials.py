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
- Free Cash Flow (if tagged)

Only includes fields that exist in the company's XBRL filings.
Does not invent or interpolate missing data.

Writes data/sec-financials.json with schema:
{
  "asOf": "YYYY-MM-DD",
  "source": "SEC EDGAR company facts API",
  "cik": "0000918608",
  "companyName": "...",
  "fiscalYearEnd": "12-31",
  "metrics": {
    "Revenues": [...],
    "NetIncomeLoss": [...],
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


# Standard XBRL tags we'll try to fetch (US-GAAP)
STANDARD_METRICS = {
    "Revenues": "us-gaap:Revenues",
    "NetIncomeLoss": "us-gaap:NetIncomeLoss",
    "OperatingCashFlow": "us-gaap:NetCashProvidedByUsedInOperatingActivities",
    "FreeCashFlow": "us-gaap:FreeCashFlow",
    # Alternative common tags
    "RevenuesAlt": "us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax",
    "ProfitLoss": "us-gaap:ProfitLoss",
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


def extract_annual_data(facts_data: Dict, tag: str) -> Optional[List[Dict]]:
    """
    Extract annual (10-K) data for a specific XBRL tag.
    
    Returns list of {period, value, units, filed} or None if tag not found.
    """
    try:
        # Navigate: facts -> us-gaap -> TAG -> units -> USD (or first available unit)
        us_gaap = facts_data.get("facts", {}).get("us-gaap", {})
        
        if tag not in us_gaap:
            return None
        
        tag_data = us_gaap[tag]
        units = tag_data.get("units", {})
        
        # Try USD first, then any available unit
        unit_key = None
        if "USD" in units:
            unit_key = "USD"
        elif units:
            unit_key = list(units.keys())[0]
        else:
            return None
        
        unit_data = units[unit_key]
        
        # Filter for annual filings (10-K) only
        annual_data = []
        for item in unit_data:
            form = item.get("form", "")
            if form == "10-K":
                annual_data.append({
                    "period": item.get("end", ""),
                    "fiscalYear": item.get("fy", ""),
                    "fiscalPeriod": item.get("fp", ""),
                    "value": item.get("val"),
                    "units": unit_key,
                    "filed": item.get("filed", ""),
                    "frame": item.get("frame", "")
                })
        
        # Sort by period (most recent last)
        annual_data.sort(key=lambda x: x["period"])
        
        return annual_data if annual_data else None
        
    except Exception as e:
        print(f"  Warning: Failed to extract {tag}: {e}", file=sys.stderr)
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
    
    # Extract standard metrics
    metrics = {}
    
    print("\nExtracting annual (10-K) metrics:")
    
    for metric_name, tag in STANDARD_METRICS.items():
        # Extract base tag name (after colon)
        tag_name = tag.split(":")[-1]
        data = extract_annual_data(facts_data, tag_name)
        
        if data:
            metrics[metric_name] = data
            print(f"  ✓ {metric_name}: {len(data)} annual periods")
        else:
            print(f"  - {metric_name}: not found")
    
    if not metrics:
        print("\n✗ No standard financial metrics found in SEC filings", file=sys.stderr)
        print("  This company may not file standard US-GAAP XBRL data.", file=sys.stderr)
        sys.exit(1)
    
    # Build output
    output = {
        "asOf": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "source": "SEC EDGAR company facts API",
        "cik": cik,
        "companyName": entity_name,
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
