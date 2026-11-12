import React, { useState } from 'react';
import { MarketSymbol } from '../../types/market';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Search, BarChart3, SlidersHorizontal } from 'lucide-react';

interface StocksScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const StocksScreen: React.FC<StocksScreenProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'gainers' | 'losers' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stocks = symbols.filter((s) => s.assetClass === 'stocks');

  const sectors = ['All', 'Technology', 'Communication Services', 'Consumer Cyclical', 'Financials', 'Healthcare', 'Energy'];

  const filteredStocks = stocks.filter((stock) => {
    const matchesSector = sectorFilter === 'All' || stock.sector === sectorFilter;
    const matchesSearch =
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (categoryFilter === 'gainers') return matchesSector && matchesSearch && stock.changePercent > 0;
    if (categoryFilter === 'losers') return matchesSector && matchesSearch && stock.changePercent < 0;
    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-[#2962ff]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Global Equities & Stocks
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#787b86]">
              Real-time stock quotes, institutional valuations, valuation multiples, and technical consensus.
            </p>
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39] overflow-x-auto no-scrollbar">
            {(['all', 'gainers', 'losers', 'active'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap capitalize ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                    : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Equities' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#2a2e39]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 dark:text-[#787b86] whitespace-nowrap">Sector:</span>
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSectorFilter(sec)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  sectorFilter === sec
                    ? 'bg-[#2962ff] text-white'
                    : 'bg-slate-100 dark:bg-[#131722] text-slate-600 dark:text-[#787b86] hover:bg-slate-200 dark:hover:bg-[#2a2e39]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by ticker or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2962ff]"
            />
          </div>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#181c27] border-b border-slate-200 dark:border-[#2a2e39] text-slate-400 dark:text-[#787b86] font-medium">
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Sector</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Change</th>
                <th className="py-3 px-4 text-right">Change %</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">Market Cap</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">P/E Ratio</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Volume</th>
                <th className="py-3 px-4 text-center hidden lg:table-cell">7D Chart</th>
                <th className="py-3 px-4 text-center">Technical</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2e39]/60">
              {filteredStocks.map((stock) => {
                const isUp = stock.change >= 0;
                const techStyle = getTechnicalBadgeStyle(stock.technicalRating);

                return (
                  <tr
                    key={stock.id}
                    onClick={() => onSelectSymbol(stock)}
                    className="hover:bg-slate-50 dark:hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-[#131722] flex items-center justify-center font-bold text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#2a2e39]">
                          {stock.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                            {stock.ticker}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-[#787b86] truncate max-w-[140px]">
                            {stock.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-[#787b86] hidden md:table-cell">
                      {stock.sector}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(stock.price, stock.currency)}
                    </td>

                    <td className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${getChangeColor(stock.change)}`}>
                      {stock.change > 0 ? `+${stock.change.toFixed(2)}` : stock.change.toFixed(2)}
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
                        {formatPercent(stock.changePercent)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800 dark:text-[#d1d4dc] hidden sm:table-cell tabular-nums">
                      {stock.marketCap || '--'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#787b86] hidden lg:table-cell tabular-nums">
                      {stock.peRatio ? stock.peRatio.toFixed(1) : '--'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 dark:text-[#787b86] hidden md:table-cell tabular-nums">
                      {stock.volume}
                    </td>

                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <div className="flex justify-center">
                        <Sparkline
                          data={stock.sparkline}
                          isUp={isUp}
                          width={75}
                          height={26}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${techStyle.bg} ${techStyle.text}`}>
                        {stock.technicalRating}
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
