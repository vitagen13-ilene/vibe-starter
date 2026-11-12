export type AssetClass = 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface MarketSymbol {
  id: string;
  ticker: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  high: number;
  low: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  sector?: string;
  category?: string;
  sparkline: number[];
  technicalRating: TechnicalRating;
  logo?: string;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HeatmapItem {
  ticker: string;
  name: string;
  sector: string;
  marketCap: number; // in billions USD
  changePercent: number;
  price: number;
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  country: string;
  countryCode: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  actual: string;
  forecast: string;
  previous: string;
}

export interface MarketNews {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  symbols: string[];
  summary: string;
  category: string;
}

export interface PaperPosition {
  id: string;
  ticker: string;
  name: string;
  side: 'buy' | 'sell';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
}
