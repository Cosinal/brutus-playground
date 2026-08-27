// General company data - loaded from config and fetched data sources
// This module provides data available for ANY public company

import companyConfig from "@/config/company.json";
import yahooMarketJson from "./yahoo-market.json";
import secFinancialsJson from "./sec-financials.json";

export interface MarketPriceData {
  date: string;
  [ticker: string]: number | null | string; // Dynamic ticker keys plus date
}

// Company configuration
export const company = {
  name: companyConfig.name,
  shortName: companyConfig.shortName,
  headquarters: companyConfig.headquarters,
  tickers: companyConfig.tickers,
  tickerDetails: companyConfig.tickerDetails,
  cik: companyConfig.cik,
  sector: companyConfig.sector,
  industry: companyConfig.industry,
  hasMiningOperationsPack: companyConfig.hasMiningOperationsPack,
  asOf: companyConfig.asOf,
  sources: companyConfig.sources,
  description: companyConfig.description,
  fiscalYearEnd: companyConfig.fiscalYearEnd,
  website: companyConfig.website,
};

// Market price data from Yahoo Finance
// Indexed to 100 at first non-null close for each ticker (relative performance)
function indexMarketData(rawData: any): MarketPriceData[] {
  if (!rawData || !rawData.series || rawData.series.length === 0) {
    return [];
  }

  const series = rawData.series;
  const tickers = rawData.tickers;
  
  // Find first non-null value for each ticker to use as base (index 100)
  const baseValues: { [key: string]: number | null } = {};
  
  for (const tickerKey of Object.keys(tickers)) {
    baseValues[tickerKey] = null;
    
    for (const row of series) {
      if (row[tickerKey] !== null && row[tickerKey] !== undefined) {
        baseValues[tickerKey] = row[tickerKey];
        break;
      }
    }
  }

  // Convert to indexed series
  return series.map((row: any) => {
    const indexedRow: MarketPriceData = { date: row.date };
    
    for (const tickerKey of Object.keys(tickers)) {
      const rawValue = row[tickerKey];
      const baseValue = baseValues[tickerKey];
      
      if (rawValue !== null && rawValue !== undefined && baseValue !== null) {
        indexedRow[tickerKey] = (rawValue / baseValue) * 100;
      } else {
        indexedRow[tickerKey] = null;
      }
    }
    
    return indexedRow;
  });
}

export const marketPriceData: MarketPriceData[] = indexMarketData(yahooMarketJson);

// Market data metadata
export const marketDataInfo = {
  source: yahooMarketJson.source || "Yahoo Finance v8 chart API",
  range: yahooMarketJson.range || "5y",
  interval: yahooMarketJson.interval || "1mo",
  asOf: yahooMarketJson.asOf || company.asOf,
  tickers: yahooMarketJson.tickers || {},
};

// SEC financials (if available)
export const secFinancials = {
  available: secFinancialsJson.metrics && Object.keys(secFinancialsJson.metrics).length > 0,
  cik: secFinancialsJson.cik,
  companyName: secFinancialsJson.companyName,
  source: secFinancialsJson.source,
  asOf: secFinancialsJson.asOf,
  framework: secFinancialsJson.framework || null,
  metrics: secFinancialsJson.metrics || {},
};

// Data sources summary
export const dataSources = {
  asOf: company.asOf,
  sources: company.sources,
  notes: [
    "Market data indexed to 100 at first non-null close for relative performance comparison",
    "Currencies preserved as reported: check tickerDetails for each ticker's currency",
    "Nulls in time series indicate missing data points (not interpolated)",
    "Company-specific operational data (if available) loaded from operations pack",
  ],
};
