#!/usr/bin/env python3
"""
Fetch recent SEC filings list from EDGAR submissions JSON.

Usage:
    python scripts/fetch-sec-filings.py [--config config/company.json]
    
    Or with explicit CIK:
    python scripts/fetch-sec-filings.py --cik 0000918608

Fetches the SEC EDGAR submissions index for a company and extracts recent filings.
For Eldorado Gold (CIK 0000918608), 6-K filings are the US wrappers for Canadian NRs/MD&As.

Writes data/sec-filings.json with schema:
{
  "asOf": "YYYY-MM-DD",
  "source": "SEC EDGAR submissions API",
  "cik": "0000918608",
  "companyName": "...",
  "recentFilings": [
    {
      "accessionNumber": "0001193125-26-123456",
      "filingDate": "2026-07-30",
      "reportDate": "2026-06-30",
      "form": "6-K",
      "primaryDocument": "d123456d6k.htm",
      "primaryDocUrl": "https://www.sec.gov/Archives/edgar/data/918608/000119312526123456/d123456d6k.htm"
    },
    ...
  ]
}

Note: Only includes filings from the last 24 months by default.
Does not download or parse filing HTML content.
"""

import argparse
import json
import sys
import time
import urllib.request
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional


def fetch_sec_submissions(cik: str, user_agent: str = "Mozilla/5.0") -> Dict:
    """
    Fetch submissions index from SEC EDGAR API.
    
    CIK must be 10 digits with leading zeros.
    SEC requires a User-Agent header.
    """
    # Ensure CIK is 10 digits with leading zeros
    cik_padded = cik.zfill(10)
    
    url = f"https://data.sec.gov/submissions/CIK{cik_padded}.json"
    
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
        if e.code == 403:
            print(f"Error: SEC EDGAR returned 403 Forbidden. User-Agent may be blocked.", file=sys.stderr)
            print(f"Tried User-Agent: {user_agent}", file=sys.stderr)
        else:
            print(f"Error fetching SEC submissions: HTTP {e.code} {e.reason}", file=sys.stderr)
        raise
    except Exception as e:
        print(f"Error fetching SEC submissions: {e}", file=sys.stderr)
        raise


def parse_recent_filings(submissions_data: Dict, lookback_months: int = 24) -> List[Dict]:
    """
    Extract recent filings from SEC submissions data.
    
    Returns list of filings from the last `lookback_months` months.
    Includes accession number, filing date, report date, form type, and primary document URL.
    """
    filings = submissions_data.get("filings", {}).get("recent", {})
    
    if not filings:
        return []
    
    # Get filing arrays
    accession_numbers = filings.get("accessionNumber", [])
    filing_dates = filings.get("filingDate", [])
    report_dates = filings.get("reportDate", [])
    forms = filings.get("form", [])
    primary_documents = filings.get("primaryDocument", [])
    primary_doc_descriptions = filings.get("primaryDocDescription", [])
    
    # Compute cutoff date
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=lookback_months * 30)
    cutoff_date_str = cutoff_date.strftime("%Y-%m-%d")
    
    # Build filings list
    result = []
    cik_raw = submissions_data.get("cik", "")
    
    for i in range(len(accession_numbers)):
        filing_date = filing_dates[i] if i < len(filing_dates) else None
        
        # Filter by date
        if filing_date and filing_date < cutoff_date_str:
            continue
        
        accession_number = accession_numbers[i]
        report_date = report_dates[i] if i < len(report_dates) else None
        form = forms[i] if i < len(forms) else None
        primary_document = primary_documents[i] if i < len(primary_documents) else None
        primary_doc_description = primary_doc_descriptions[i] if i < len(primary_doc_descriptions) else None
        
        # Build primary document URL
        primary_doc_url = None
        if primary_document and accession_number and cik_raw:
            # Format: https://www.sec.gov/Archives/edgar/data/{cik}/{accessionNumberNoDashes}/{primaryDocument}
            accession_no_dashes = accession_number.replace("-", "")
            primary_doc_url = f"https://www.sec.gov/Archives/edgar/data/{cik_raw}/{accession_no_dashes}/{primary_document}"
        
        result.append({
            "accessionNumber": accession_number,
            "filingDate": filing_date,
            "reportDate": report_date,
            "form": form,
            "primaryDocument": primary_document,
            "primaryDocDescription": primary_doc_description,
            "primaryDocUrl": primary_doc_url,
        })
    
    # Sort by filing date descending (most recent first)
    result.sort(key=lambda x: x.get("filingDate", ""), reverse=True)
    
    return result


def main():
    parser = argparse.ArgumentParser(
        description="Fetch recent SEC filings list from EDGAR submissions JSON"
    )
    parser.add_argument(
        "--config",
        type=str,
        default="config/company.json",
        help="Path to company config JSON (default: config/company.json)"
    )
    parser.add_argument(
        "--cik",
        type=str,
        help="SEC CIK number (overrides config)"
    )
    parser.add_argument(
        "--lookback",
        type=int,
        default=24,
        help="Lookback period in months (default: 24)"
    )
    parser.add_argument(
        "--output",
        type=str,
        default="data/sec-filings.json",
        help="Output JSON file path (default: data/sec-filings.json)"
    )
    
    args = parser.parse_args()
    
    # Load CIK from config or command line
    cik = args.cik
    
    if not cik:
        try:
            with open(args.config, "r") as f:
                config = json.load(f)
                cik = config.get("cik")
        except FileNotFoundError:
            print(f"Error: Config file not found: {args.config}", file=sys.stderr)
            print("Use --cik to specify CIK directly", file=sys.stderr)
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in config file: {e}", file=sys.stderr)
            sys.exit(1)
    
    if not cik:
        print("Error: No CIK found in config or command line", file=sys.stderr)
        sys.exit(1)
    
    print(f"Fetching SEC filings for CIK {cik}...")
    
    try:
        submissions_data = fetch_sec_submissions(cik)
    except Exception:
        sys.exit(1)
    
    company_name = submissions_data.get("name", "")
    print(f"Company: {company_name}")
    
    recent_filings = parse_recent_filings(submissions_data, lookback_months=args.lookback)
    
    print(f"Found {len(recent_filings)} filings in the last {args.lookback} months")
    
    # Write output
    output = {
        "asOf": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "source": "SEC EDGAR submissions API",
        "cik": cik,
        "companyName": company_name,
        "lookbackMonths": args.lookback,
        "recentFilings": recent_filings,
    }
    
    with open(args.output, "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"Wrote {args.output}")
    
    # Print summary of recent filings by form type
    form_counts = {}
    for filing in recent_filings:
        form = filing.get("form", "unknown")
        form_counts[form] = form_counts.get(form, 0) + 1
    
    print("\nFilings by form type:")
    for form, count in sorted(form_counts.items(), key=lambda x: -x[1]):
        print(f"  {form}: {count}")


if __name__ == "__main__":
    main()
