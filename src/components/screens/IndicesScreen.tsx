import React, { useState } from 'react';
import { MarketSymbol } from '../../types/market';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import { Globe, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';

interface IndicesScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const IndicesScreen: React.FC<IndicesScreenProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const [regionFilter, setRegionFilter] = useState<'all' | 'Americas' | 'Europe' | 'Asia-Pacific'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const indices = symbols.filter((s) => s.assetClass === 'indices');

  const filteredIndices = indices.filter((idx) => {
    const matchesRegion = regionFilter === 'all' || idx.category === regionFilter;
    const matchesSearch =
      idx.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idx.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-[#2962ff]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Major World Stock Indices
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#787b86]">
              Real-time benchmarks across North America, Europe, Asia-Pacific, and global markets.
            </p>
          </div>

          {/* Controls: Search and Region tabs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search indices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2962ff]"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39]">
              {(['all', 'Americas', 'Europe', 'Asia-Pacific'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    regionFilter === r
                      ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                      : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r === 'all' ? 'All Regions' : r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#181c27] border-b border-slate-200 dark:border-[#2a2e39] text-slate-400 dark:text-[#787b86] font-medium">
                <th className="py-3 px-4">Index</th>
                <th className="py-3 px-4 text-left">Region</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Change</th>
                <th className="py-3 px-4 text-right">Change %</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">Day High</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">Day Low</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Volume</th>
                <th className="py-3 px-4 text-center hidden lg:table-cell">Trend</th>
                <th className="py-3 px-4 text-center">Technical Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2e39]/60">
              {filteredIndices.map((idx) => {
                const isUp = idx.change >= 0;
                const techStyle = getTechnicalBadgeStyle(idx.technicalRating);

                return (
                  <tr
                    key={idx.id}
                    onClick={() => onSelectSymbol(idx)}
                    className="hover:bg-slate-50 dark:hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-[#2962ff]/10 text-[#2962ff] flex items-center justify-center font-bold text-xs">
                          {idx.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                            {idx.ticker}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-[#787b86]">
                            {idx.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-[#d1d4dc] font-medium">
                      {idx.category}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(idx.price, idx.currency)}
                    </td>

                    <td className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${getChangeColor(idx.change)}`}>
                      {idx.change > 0 ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)}
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
                        {formatPercent(idx.changePercent)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#d1d4dc] hidden sm:table-cell tabular-nums">
                      {formatPrice(idx.high, idx.currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#d1d4dc] hidden sm:table-cell tabular-nums">
                      {formatPrice(idx.low, idx.currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 dark:text-[#787b86] hidden md:table-cell tabular-nums">
                      {idx.volume}
                    </td>

                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <div className="flex justify-center">
                        <Sparkline
                          data={idx.sparkline}
                          isUp={isUp}
                          width={75}
                          height={26}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${techStyle.bg} ${techStyle.text}`}>
                        {idx.technicalRating}
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
