import React, { useState } from 'react';
import { SP500_HEATMAP, CRYPTO_HEATMAP } from '../../data/marketData';
import { HeatmapItem, MarketSymbol } from '../../types/market';
import { formatPercent } from '../../utils/formatters';
import { Grid3X3, ArrowRight } from 'lucide-react';

interface HeatmapPreviewProps {
  onSelectTicker: (ticker: string) => void;
  onNavigateToFullHeatmap: () => void;
}

export const HeatmapPreview: React.FC<HeatmapPreviewProps> = ({
  onSelectTicker,
  onNavigateToFullHeatmap,
}) => {
  const [mode, setMode] = useState<'stocks' | 'crypto'>('stocks');
  const items = mode === 'stocks' ? SP500_HEATMAP.slice(0, 18) : CRYPTO_HEATMAP.slice(0, 14);

  // Group by sector
  const sectors = Array.from(new Set(items.map((i) => i.sector)));

  const getTileBg = (change: number) => {
    if (change >= 3) return 'bg-[#089981] text-white hover:brightness-110';
    if (change >= 1.5) return 'bg-[#089981]/80 text-white hover:brightness-110';
    if (change > 0) return 'bg-[#089981]/50 text-white hover:brightness-110';
    if (change <= -3) return 'bg-[#f23645] text-white hover:brightness-110';
    if (change <= -1.5) return 'bg-[#f23645]/80 text-white hover:brightness-110';
    if (change < 0) return 'bg-[#f23645]/50 text-white hover:brightness-110';
    return 'bg-slate-500 text-white hover:brightness-110';
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-[#2962ff]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Market Heatmap
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39]">
              <button
                onClick={() => setMode('stocks')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  mode === 'stocks'
                    ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                    : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                S&P 500
              </button>
              <button
                onClick={() => setMode('crypto')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  mode === 'crypto'
                    ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                    : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Crypto
              </button>
            </div>

            <button
              onClick={onNavigateToFullHeatmap}
              className="flex items-center gap-1 text-xs text-[#2962ff] hover:underline font-semibold whitespace-nowrap pl-2"
            >
              <span>Full Screen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sectors Treemap Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 min-h-[280px]">
          {items.map((item) => {
            const isLarge = item.marketCap > 1000 || item.ticker === 'BTC';
            return (
              <div
                key={item.ticker}
                onClick={() => onSelectTicker(item.ticker)}
                className={`p-2.5 rounded-lg flex flex-col justify-between cursor-pointer transition-transform transform active:scale-95 shadow-sm ${getTileBg(
                  item.changePercent
                )} ${isLarge ? 'col-span-2 row-span-1' : 'col-span-1'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide">
                    {item.ticker}
                  </span>
                  <span className="text-[10px] opacity-85 truncate max-w-[80px]">
                    {item.sector}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                  <span className="text-xs font-bold">
                    {formatPercent(item.changePercent)}
                  </span>
                  <span className="text-[10px] opacity-90">
                    ${item.price >= 1 ? item.price.toFixed(2) : item.price.toFixed(4)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Scale Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2a2e39]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#787b86]">
        <div className="flex items-center gap-1.5">
          <span>Scale:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-xs bg-[#f23645]" title="-3% or lower" />
            <span className="w-3 h-3 rounded-xs bg-[#f23645]/70" />
            <span className="w-3 h-3 rounded-xs bg-slate-400" />
            <span className="w-3 h-3 rounded-xs bg-[#089981]/70" />
            <span className="w-3 h-3 rounded-xs bg-[#089981]" title="+3% or higher" />
          </div>
        </div>
        <span>Market-Cap Weighted</span>
      </div>
    </div>
  );
};
