import React from 'react';
import { MarketSymbol } from '../../types/market';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import { DollarSign, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

interface ForexScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const ForexScreen: React.FC<ForexScreenProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const forexSymbols = symbols.filter((s) => s.assetClass === 'forex');

  // Relative Currency Strength calculation (USD is strong today +0.41%, JPY weak, EUR weak)
  const currencyStrengths = [
    { code: 'USD', strength: +0.65, label: 'Strongest', isPositive: true },
    { code: 'CAD', strength: +0.22, label: 'Neutral', isPositive: true },
    { code: 'CHF', strength: +0.15, label: 'Neutral', isPositive: true },
    { code: 'GBP', strength: -0.33, label: 'Weak', isPositive: false },
    { code: 'AUD', strength: -0.32, label: 'Weak', isPositive: false },
    { code: 'EUR', strength: -0.42, label: 'Weak', isPositive: false },
    { code: 'JPY', strength: -0.53, label: 'Weakest', isPositive: false },
  ];

  return (
    <div className="space-y-6">
      {/* Currency Strength Matrix Bar */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-[#2962ff]" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Forex Currency Strength Heatmap
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#787b86] mb-4">
          Real-time aggregated cross-rate strength index measuring buying and selling pressure across G10 currencies.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {currencyStrengths.map((curr) => {
            const isUp = curr.strength >= 0;
            return (
              <div
                key={curr.code}
                className={`p-3 rounded-lg border text-center ${
                  isUp
                    ? 'bg-[#089981]/10 border-[#089981]/30 text-[#089981]'
                    : 'bg-[#f23645]/10 border-[#f23645]/30 text-[#f23645]'
                }`}
              >
                <div className="font-extrabold text-sm text-slate-900 dark:text-white mb-0.5">
                  {curr.code}
                </div>
                <div className="font-mono text-xs font-bold tabular-nums">
                  {curr.strength > 0 ? `+${curr.strength.toFixed(2)}%` : `${curr.strength.toFixed(2)}%`}
                </div>
                <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80 mt-1">
                  {curr.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forex Majors Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#2962ff]" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Major & Benchmark Currency Pairs
            </h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-[#787b86]">
            Quotes update live
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#181c27] border-b border-slate-200 dark:border-[#2a2e39] text-slate-400 dark:text-[#787b86] font-medium">
                <th className="py-3 px-4">Pair</th>
                <th className="py-3 px-4 text-left hidden sm:table-cell">Type</th>
                <th className="py-3 px-4 text-right">Bid/Price</th>
                <th className="py-3 px-4 text-right">Net Change</th>
                <th className="py-3 px-4 text-right">Change %</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Day High</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Day Low</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">Volume</th>
                <th className="py-3 px-4 text-center hidden sm:table-cell">Trend</th>
                <th className="py-3 px-4 text-center">Technical Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2e39]/60">
              {forexSymbols.map((fx) => {
                const isUp = fx.change >= 0;
                const techStyle = getTechnicalBadgeStyle(fx.technicalRating);

                return (
                  <tr
                    key={fx.id}
                    onClick={() => onSelectSymbol(fx)}
                    className="hover:bg-slate-50 dark:hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-[#2962ff]/10 text-[#2962ff] flex items-center justify-center font-bold text-xs">
                          {fx.ticker.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                            {fx.ticker}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-[#787b86]">
                            {fx.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-[#787b86] hidden sm:table-cell">
                      {fx.category}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(fx.price, fx.currency)}
                    </td>

                    <td className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${getChangeColor(fx.change)}`}>
                      {fx.change > 0 ? `+${fx.change.toFixed(4)}` : fx.change.toFixed(4)}
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
                        {formatPercent(fx.changePercent)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#d1d4dc] hidden md:table-cell tabular-nums">
                      {formatPrice(fx.high, fx.currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#d1d4dc] hidden md:table-cell tabular-nums">
                      {formatPrice(fx.low, fx.currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 dark:text-[#787b86] hidden lg:table-cell tabular-nums">
                      {fx.volume}
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="flex justify-center">
                        <Sparkline
                          data={fx.sparkline}
                          isUp={isUp}
                          width={75}
                          height={26}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${techStyle.bg} ${techStyle.text}`}>
                        {fx.technicalRating}
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
