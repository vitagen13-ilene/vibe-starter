import React, { useState } from 'react';
import { MarketSymbol } from '../../types/market';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import { Coins, ArrowUpRight, ArrowDownRight, Search, ShieldCheck, Flame, PieChart } from 'lucide-react';

interface CryptoScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const CryptoScreen: React.FC<CryptoScreenProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const cryptoSymbols = symbols.filter((s) => s.assetClass === 'crypto');

  const categories = ['All', 'Layer 1', 'Payment', 'Meme'];

  const filteredCrypto = cryptoSymbols.filter((coin) => {
    const matchesCategory = categoryFilter === 'All' || coin.category === categoryFilter;
    const matchesSearch =
      coin.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Crypto Macro Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4">
          <div className="text-xs text-slate-400 dark:text-[#787b86] mb-1 flex items-center justify-between">
            <span>Global Market Cap</span>
            <PieChart className="w-3.5 h-3.5 text-[#2962ff]" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            $3.12 Trillion
          </div>
          <div className="text-xs font-semibold text-[#089981] font-mono tabular-nums mt-0.5">
            +3.84% (24h)
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4">
          <div className="text-xs text-slate-400 dark:text-[#787b86] mb-1 flex items-center justify-between">
            <span>24h Global Volume</span>
            <Coins className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            $128.45 Billion
          </div>
          <div className="text-xs text-slate-400 dark:text-[#787b86] font-mono mt-0.5">
            Across 84 exchanges
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4">
          <div className="text-xs text-slate-400 dark:text-[#787b86] mb-1 flex items-center justify-between">
            <span>Bitcoin Dominance</span>
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            58.4%
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#131722] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: '58.4%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4">
          <div className="text-xs text-slate-400 dark:text-[#787b86] mb-1 flex items-center justify-between">
            <span>Fear & Greed Index</span>
            <Flame className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-500 tabular-nums">
            78 / 100
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            Extreme Greed
          </div>
        </div>
      </div>

      {/* Main Filter & Search bar */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-xs text-slate-400 dark:text-[#787b86] mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'bg-slate-100 dark:bg-[#131722] text-slate-600 dark:text-[#787b86] hover:bg-slate-200 dark:hover:bg-[#2a2e39]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search crypto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2962ff]"
            />
          </div>
        </div>
      </div>

      {/* Crypto Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#181c27] border-b border-slate-200 dark:border-[#2a2e39] text-slate-400 dark:text-[#787b86] font-medium">
                <th className="py-3 px-4">Coin</th>
                <th className="py-3 px-4 text-left hidden sm:table-cell">Category</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-right">24h %</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Market Cap</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">24h Volume</th>
                <th className="py-3 px-4 text-center hidden sm:table-cell">7D Chart</th>
                <th className="py-3 px-4 text-center">Technical Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2e39]/60">
              {filteredCrypto.map((coin) => {
                const isUp = coin.change >= 0;
                const techStyle = getTechnicalBadgeStyle(coin.technicalRating);

                return (
                  <tr
                    key={coin.id}
                    onClick={() => onSelectSymbol(coin)}
                    className="hover:bg-slate-50 dark:hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                          {coin.ticker.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                            {coin.ticker}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-[#787b86]">
                            {coin.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-[#787b86] hidden sm:table-cell">
                      {coin.category || 'Crypto'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      ${formatPrice(coin.price, coin.currency)}
                    </td>

                    <td className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${getChangeColor(coin.change)}`}>
                      {coin.change > 0 ? `+$${coin.change >= 1 ? coin.change.toFixed(2) : coin.change.toFixed(4)}` : `-$${Math.abs(coin.change) >= 1 ? Math.abs(coin.change).toFixed(2) : Math.abs(coin.change).toFixed(4)}`}
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
                        {formatPercent(coin.changePercent)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800 dark:text-[#d1d4dc] hidden md:table-cell tabular-nums">
                      {coin.marketCap || '--'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 dark:text-[#787b86] hidden lg:table-cell tabular-nums">
                      {coin.volume}
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="flex justify-center">
                        <Sparkline
                          data={coin.sparkline}
                          isUp={isUp}
                          width={75}
                          height={26}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${techStyle.bg} ${techStyle.text}`}>
                        {coin.technicalRating}
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
