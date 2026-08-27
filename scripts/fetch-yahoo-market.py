#!/usr/bin/env python3
"""
Fetch market history from Yahoo Finance for specified tickers.

Usage:
    python scripts/fetch-yahoo-market.py [--config config/company.json] [--range 5y] [--interval 1mo]
    
    Or with explicit tickers:
    python scripts/fetch-yahoo-market.py --tickers EGO ELD.TO GC=F --range 5y --interval 1mo

Performs outer-join on date, leaving nulls for missing closes.
Drops any trailing rows that have ONLY benchmark ticker data (e.g., intraday-only gold ticks).
Writes data/yahoo-market.json with schema:
{
  "asOf": "YYYY-MM-DD",
  "source": "Yahoo Finance v8 chart API",
  "range": "5y",
  "interval": "1mo",
  "tickers": {...},
  "series": [
    {"date": "YYYY-MM-DD", "TICKER1": float|null, "TICKER2": float|null, ...}
  ]
}
"""

import argparse
import json
import sys
import urllib.request
from datetime import datetime, timezone
from typing import Dict, List, Optional


def fetch_ticker_data(ticker: str, range_val: str, interval: str) -> Dict:
    """Fetch market data for a ticker from Yahoo Finance."""
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?range={range_val}&interval={interval}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read())
    except Exception as e:
        print(f"✗ Failed to fetch {ticker}: {e}", file=sys.stderr)
        return {
            "ticker": ticker,
            "currency": "unknown",
            "data": [],
            "error": str(e)
        }
        
    if not data.get("chart", {}).get("result"):
        return {
            "ticker": ticker,
            "currency": "unknown",
            "data": [],
            "error": "No data returned from Yahoo Finance"
        }
    
    result = data["chart"]["result"][0]
    timestamps = result.get("timestamp", [])
    closes = result["indicators"]["quote"][0].get("close", [])
    currency = result["meta"].get("currency", "unknown")
    
    # Convert timestamps to YYYY-MM-DD dates
    data_points = []
    for ts, close in zip(timestamps, closes):
        date = datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
        data_points.append({"date": date, "close": close})
    
    return {
        "ticker": ticker,
        "currency": currency,
        "data": data_points
    }


def merge_ticker_data(ticker_datasets: List[Dict], benchmark_ticker: Optional[str] = None) -> List[Dict]:
    """Outer-join multiple ticker datasets on date, preserving nulls."""
    
    # Collect all dates and build per-ticker maps
    all_dates = set()
    ticker_maps = {}
    
    for dataset in ticker_datasets:
        ticker = dataset["ticker"]
        # Normalize ticker name for JSON key (replace dots with underscores)
        ticker_key = ticker.replace(".", "_")
        ticker_maps[ticker_key] = {
            "map": {item["date"]: item["close"] for item in dataset["data"]},
            "currency": dataset["currency"],
            "original": ticker
        }
        all_dates.update(ticker_maps[ticker_key]["map"].keys())
    
    # Build merged series
    series = []
    for date in sorted(all_dates):
        row = {"date": date}
        for ticker_key, ticker_data in ticker_maps.items():
            row[ticker_key] = ticker_data["map"].get(date)
        series.append(row)
    
    # Drop trailing rows that have ONLY benchmark ticker data (intraday benchmark ticks)
    # Keep only rows where at least one non-benchmark equity ticker has a value
    if benchmark_ticker:
        benchmark_key = benchmark_ticker.replace(".", "_")
        non_benchmark_keys = [k for k in ticker_maps.keys() if k != benchmark_key]
        
        while series:
            last_row = series[-1]
            has_equity_data = any(last_row.get(key) is not None for key in non_benchmark_keys)
            if has_equity_data:
                break
            series.pop()
    
    return series, ticker_maps


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
        description="Fetch market history from Yahoo Finance",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--config",
        default="config/company.json",
        help="Path to company config JSON (default: config/company.json)"
    )
    parser.add_argument(
        "--tickers",
        nargs="+",
        help="Explicit list of tickers to fetch (overrides config)"
    )
    parser.add_argument(
        "--range",
        default="5y",
        help="Time range (e.g., 1y, 5y, max) (default: 5y)"
    )
    parser.add_argument(
        "--interval",
        default="1mo",
        help="Data interval (e.g., 1d, 1wk, 1mo) (default: 1mo)"
    )
    
    args = parser.parse_args()
    
    # Determine which tickers to fetch
    if args.tickers:
        tickers = args.tickers
        benchmark_ticker = None
        print(f"Using explicit tickers: {', '.join(tickers)}")
    else:
        config = load_config(args.config)
        ticker_config = config.get("tickers", {})
        
        tickers = []
        if "primary" in ticker_config:
            tickers.append(ticker_config["primary"])
        if "secondary" in ticker_config:
            tickers.append(ticker_config["secondary"])
        if "benchmark" in ticker_config:
            tickers.append(ticker_config["benchmark"])
        
        benchmark_ticker = ticker_config.get("benchmark")
        
        if not tickers:
            print("✗ No tickers found in config or command line", file=sys.stderr)
            sys.exit(1)
        
        print(f"Loaded config: {config.get('name', 'Unknown')}")
        print(f"Fetching tickers: {', '.join(tickers)}")
    
    print(f"Range: {args.range}, Interval: {args.interval}\n")
    
    # Fetch all tickers
    datasets = []
    for ticker in tickers:
        dataset = fetch_ticker_data(ticker, args.range, args.interval)
        if "error" in dataset:
            print(f"✗ {ticker}: {dataset['error']}")
        else:
            print(f"✓ Fetched {ticker} ({dataset['currency']}): {len(dataset['data'])} data points")
        datasets.append(dataset)
    
    # Merge on date
    series, ticker_maps = merge_ticker_data(datasets, benchmark_ticker)
    print(f"\n✓ Merged series: {len(series)} rows")
    
    # Show last complete snapshot
    if series:
        last_row = series[-1]
        print(f"\nLast snapshot: {last_row['date']}")
        for ticker_key, ticker_data in ticker_maps.items():
            value = last_row.get(ticker_key)
            if value is not None:
                print(f"  {ticker_data['original']}: {ticker_data['currency']} {value:.2f}")
            else:
                print(f"  {ticker_data['original']}: null")
    
    # Build output JSON
    output = {
        "asOf": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "source": "Yahoo Finance v8 chart API",
        "range": args.range,
        "interval": args.interval,
        "tickers": {
            ticker_key: {
                "symbol": ticker_data["original"],
                "currency": ticker_data["currency"]
            }
            for ticker_key, ticker_data in ticker_maps.items()
        },
        "series": series
    }
    
    # Write to data/yahoo-market.json
    output_path = "data/yahoo-market.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✓ Written {output_path}")


if __name__ == "__main__":
    main()
