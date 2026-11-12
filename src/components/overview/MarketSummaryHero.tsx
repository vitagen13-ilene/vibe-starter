import React, { useState } from 'react';
import { MarketSymbol } from '../../types/market';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';

interface MarketSummaryHeroProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const MarketSummaryHero: React.FC<MarketSummaryHeroProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '5D' | '1M' | '1Y'>('1D');

  const heroIds = ['SPX', 'NDX', 'BTC', 'US10Y', 'GC1!', 'CL1!'];
  const heroSymbols = heroIds
    .map((id) => symbols.find((s) => s.id === id))
    .filter(Boolean) as MarketSymbol[];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Global Markets Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#787b86]">
            Real-time composite benchmarks across Equities, Crypto, Rates, and Commodities
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-lg self-start sm:self-auto">
          {(['1D', '5D', '1M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                  : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Benchmark Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {heroSymbols.map((sym) => {
          const isUp = sym.change >= 0;
          const techStyle = getTechnicalBadgeStyle(sym.technicalRating);

          // Calculate Day range percentage
          const rangeSpan = sym.high - sym.low;
          const positionPercent = rangeSpan > 0 ? Math.min(100, Math.max(0, ((sym.price - sym.low) / rangeSpan) * 100)) : 50;

          return (
            <div
              key={sym.id}
              onClick={() => onSelectSymbol(sym)}
              className="group relative bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4 hover:border-slate-300 dark:hover:border-[#363a45] transition-all hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                      {sym.ticker}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-[#787b86]">
                      {sym.category || sym.assetClass.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#787b86] truncate max-w-[130px]" title={sym.name}>
                    {sym.name}
                  </p>
                </div>

                <button
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#2962ff] transition-all rounded"
                  title="Expand full chart"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Price & Change */}
              <div className="my-1.5">
                <div className="text-lg sm:text-xl font-bold tabular-nums font-mono text-slate-900 dark:text-white tracking-tight">
                  {formatPrice(sym.price, sym.currency)}
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold tabular-nums font-mono ${getChangeColor(sym.change)}`}>
                  {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{sym.change > 0 ? `+${sym.change.toFixed(2)}` : sym.change.toFixed(2)}</span>
                  <span>({formatPercent(sym.changePercent)})</span>
                </div>
              </div>

              {/* Sparkline */}
              <div className="my-2 py-1 w-full flex justify-center">
                <Sparkline
                  data={sym.sparkline}
                  isUp={isUp}
                  width={150}
                  height={36}
                  showGradient={true}
                />
              </div>

              {/* Day Range Bar */}
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#2a2e39]/60 text-[10px]">
                <div className="flex justify-between text-slate-400 dark:text-[#787b86] mb-1 font-mono tabular-nums">
                  <span>L: {formatPrice(sym.low, sym.currency)}</span>
                  <span>H: {formatPrice(sym.high, sym.currency)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-[#2a2e39] rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${isUp ? 'bg-[#089981]' : 'bg-[#f23645]'} rounded-full`}
                    style={{ width: `${positionPercent}%` }}
                  />
                </div>
              </div>

              {/* Technical Indicator Rating */}
              <div className="mt-2.5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 dark:text-[#787b86]">Technical:</span>
                <span className={`px-2 py-0.5 rounded font-semibold ${techStyle.bg} ${techStyle.text}`}>
                  {sym.technicalRating}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
