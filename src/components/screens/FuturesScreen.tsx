import React, { useState } from 'react';
import { MarketSymbol } from '../../types/market';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import { Flame, ArrowUpRight, ArrowDownRight, Droplet, Sun, Pickaxe } from 'lucide-react';

interface FuturesScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const FuturesScreen: React.FC<FuturesScreenProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const futuresSymbols = symbols.filter((s) => s.assetClass === 'futures');
  const categories = ['All', 'Energy', 'Precious Metals', 'Industrial Metals'];

  const filteredFutures = futuresSymbols.filter(
    (item) => categoryFilter === 'All' || item.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Futures & Commodities
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#787b86]">
              Continuous front-month contracts covering Energy (WTI, Brent, Natural Gas), Precious Metals (Gold, Silver), and Industrials.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39] overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                    : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Commodity Contracts Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#181c27] border-b border-slate-200 dark:border-[#2a2e39] text-slate-400 dark:text-[#787b86] font-medium">
                <th className="py-3 px-4">Contract</th>
                <th className="py-3 px-4 text-left hidden sm:table-cell">Commodity Group</th>
                <th className="py-3 px-4 text-right">Settlement Price</th>
                <th className="py-3 px-4 text-right">Net Change</th>
                <th className="py-3 px-4 text-right">Change %</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">High</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Low</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">Volume</th>
                <th className="py-3 px-4 text-center hidden sm:table-cell">Trend</th>
                <th className="py-3 px-4 text-center">Technical Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2e39]/60">
              {filteredFutures.map((fut) => {
                const isUp = fut.change >= 0;
                const techStyle = getTechnicalBadgeStyle(fut.technicalRating);

                return (
                  <tr
                    key={fut.id}
                    onClick={() => onSelectSymbol(fut)}
                    className="hover:bg-slate-50 dark:hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          {fut.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                            {fut.ticker}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-[#787b86]">
                            {fut.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-[#787b86] hidden sm:table-cell">
                      {fut.category}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(fut.price, fut.currency)}
                    </td>

                    <td className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${getChangeColor(fut.change)}`}>
                      {fut.change > 0 ? `+${fut.change.toFixed(2)}` : fut.change.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-mono font-bold text-xs tabular-nums ${
                          isUp
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : 'bg-[#f23645]/15 text-[#f23645]'
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {formatPercent(fut.changePercent)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#d1d4dc] hidden md:table-cell tabular-nums">
                      {formatPrice(fut.high, fut.currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#d1d4dc] hidden md:table-cell tabular-nums">
                      {formatPrice(fut.low, fut.currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 dark:text-[#787b86] hidden lg:table-cell tabular-nums">
                      {fut.volume}
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="flex justify-center">
                        <Sparkline
                          data={fut.sparkline}
                          isUp={isUp}
                          width={75}
                          height={26}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${techStyle.bg} ${techStyle.text}`}>
                        {fut.technicalRating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
