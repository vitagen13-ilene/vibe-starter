import React, { useState } from 'react';
import { MarketSymbol } from '../../types/market';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Flame, Trophy, TrendingDown, Activity } from 'lucide-react';

interface MarketMoversProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const MarketMovers: React.FC<MarketMoversProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'active' | 'tech'>('gainers');

  // Filter stocks & crypto for movers
  const eligibleSymbols = symbols.filter(
    (s) => s.assetClass === 'stocks' || s.assetClass === 'crypto'
  );

  let displayedSymbols: MarketSymbol[] = [];

  if (activeTab === 'gainers') {
    displayedSymbols = [...eligibleSymbols]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 6);
  } else if (activeTab === 'losers') {
    displayedSymbols = [...eligibleSymbols]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 6);
  } else if (activeTab === 'active') {
    // Sort by volume
    displayedSymbols = [...eligibleSymbols]
      .sort((a, b) => {
        const parseVol = (v: string) => {
          if (v.endsWith('B')) return parseFloat(v) * 1000;
          if (v.endsWith('M')) return parseFloat(v);
          return 0;
        };
        return parseVol(b.volume) - parseVol(a.volume);
      })
      .slice(0, 6);
  } else {
    // Mega tech
    displayedSymbols = symbols.filter((s) =>
      ['NVDA', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA'].includes(s.ticker)
    );
  }

  return (
    <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2962ff]" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Market Movers
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'gainers'
                ? 'bg-white dark:bg-[#2a2e39] text-[#089981] shadow-sm'
                : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Top Gainers</span>
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'losers'
                ? 'bg-white dark:bg-[#2a2e39] text-[#f23645] shadow-sm'
                : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Top Losers</span>
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'active'
                ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Most Active</span>
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'tech'
                ? 'bg-white dark:bg-[#2a2e39] text-purple-500 shadow-sm'
                : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Mega Tech</span>
          </button>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#2a2e39] text-slate-400 dark:text-[#787b86] font-medium">
              <th className="py-2.5 px-2">Symbol</th>
              <th className="py-2.5 px-2 text-right">Price</th>
              <th className="py-2.5 px-2 text-right">Change</th>
              <th className="py-2.5 px-2 text-right">Change %</th>
              <th className="py-2.5 px-2 text-right hidden md:table-cell">Volume</th>
              <th className="py-2.5 px-2 text-center hidden sm:table-cell">7D Trend</th>
              <th className="py-2.5 px-2 text-center">Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#2a2e39]/60">
            {displayedSymbols.map((sym) => {
              const isUp = sym.change >= 0;
              const techStyle = getTechnicalBadgeStyle(sym.technicalRating);

              return (
                <tr
                  key={sym.id}
                  onClick={() => onSelectSymbol(sym)}
                  className="hover:bg-slate-50 dark:hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-100 dark:bg-[#131722] flex items-center justify-center font-bold text-[10px] text-slate-700 dark:text-slate-300">
                        {sym.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                          {sym.ticker}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-[#787b86] truncate max-w-[130px]">
                          {sym.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-2 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatPrice(sym.price, sym.currency)}
                  </td>

                  <td className={`py-3 px-2 text-right font-mono font-semibold tabular-nums ${getChangeColor(sym.change)}`}>
                    {sym.change > 0 ? `+${sym.change.toFixed(2)}` : sym.change.toFixed(2)}
                  </td>

                  <td className="py-3 px-2 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-mono font-bold text-[11px] tabular-nums ${
                        isUp
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : 'bg-[#f23645]/15 text-[#f23645]'
                      }`}
                    >
                      {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {formatPercent(sym.changePercent)}
                    </span>
                  </td>

                  <td className="py-3 px-2 text-right font-mono text-slate-500 dark:text-[#787b86] hidden md:table-cell tabular-nums">
                    {sym.volume}
                  </td>

                  <td className="py-3 px-2 hidden sm:table-cell">
                    <div className="flex justify-center">
                      <Sparkline
                        data={sym.sparkline}
                        isUp={isUp}
                        width={70}
                        height={24}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${techStyle.bg} ${techStyle.text}`}>
                      {sym.technicalRating}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
