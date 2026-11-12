import React from 'react';
import { MarketSymbol } from '../../types/market';
import { formatPrice, formatPercent, getChangeColor } from '../../utils/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ symbols, onSelectSymbol }) => {
  // Take core global representative tickers for ticker tape
  const tapeSymbols = symbols.filter(s =>
    ['SPX', 'NDX', 'DJI', 'BTC', 'ETH', 'SOL', 'NVDA', 'AAPL', 'TSLA', 'EURUSD', 'GC1!', 'CL1!', 'US10Y'].includes(s.id)
  );

  // Duplicate for seamless loop
  const displayItems = [...tapeSymbols, ...tapeSymbols];

  return (
    <div className="w-full bg-slate-50 dark:bg-[#181c27] border-b border-slate-200 dark:border-[#2a2e39] overflow-hidden whitespace-nowrap py-1.5 select-none text-xs">
      <div className="animate-ticker flex items-center">
        {displayItems.map((sym, index) => {
          const isUp = sym.change >= 0;
          return (
            <button
              key={`${sym.id}-${index}`}
              onClick={() => onSelectSymbol(sym)}
              className="inline-flex items-center gap-2 px-4 py-0.5 hover:bg-slate-200/50 dark:hover:bg-[#2a2e39]/50 transition-colors border-r border-slate-200 dark:border-[#2a2e39] text-left shrink-0 cursor-pointer"
            >
              <span className="font-semibold text-slate-800 dark:text-[#d1d4dc]">{sym.ticker}</span>
              <span className="tabular-nums font-mono text-slate-900 dark:text-white">
                {formatPrice(sym.price, sym.currency)}
              </span>
              <span className={`inline-flex items-center gap-0.5 tabular-nums font-mono ${getChangeColor(sym.changePercent)}`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatPercent(sym.changePercent)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
