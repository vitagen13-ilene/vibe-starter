import React, { useState } from 'react';
import { MarketSymbol } from '../../types/market';
import { YIELD_CURVE_DATA } from '../../data/marketData';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import { Scale, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface BondsScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const BondsScreen: React.FC<BondsScreenProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const bondSymbols = symbols.filter((s) => s.assetClass === 'bonds');
  const [hoveredMaturity, setHoveredMaturity] = useState<string | null>(null);

  // SVG yield curve calculations
  const minYield = 4.0;
  const maxYield = 5.0;
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = YIELD_CURVE_DATA.map((item, idx) => {
    const x = paddingX + (idx / (YIELD_CURVE_DATA.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((item.yield - minYield) / (maxYield - minYield)) * (svgHeight - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const areaD = `${pathD} L ${points[points.length - 1].x},${svgHeight - paddingY} L ${points[0].x},${svgHeight - paddingY} Z`;

  return (
    <div className="space-y-6">
      {/* Interactive Yield Curve Visualizer */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-5 h-5 text-[#2962ff]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                US Treasury Yield Curve (Active Benchmark)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#787b86]">
              Real-time sovereign rate structure from 1-Month Treasury Bills to 30-Year Bonds.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2962ff]" />
              <span className="text-slate-600 dark:text-[#d1d4dc]">Current Curve</span>
            </div>
            <div className="text-slate-500 dark:text-[#787b86]">
              10Y - 2Y Spread: <span className="font-bold text-[#089981]">+13.4 bps</span>
            </div>
          </div>
        </div>

        {/* Yield Curve SVG */}
        <div className="w-full overflow-x-auto no-scrollbar py-2">
          <div className="min-w-[650px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 overflow-visible">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2962ff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[4.2, 4.4, 4.6, 4.8].map((gridYield) => {
                const y = svgHeight - paddingY - ((gridYield - minYield) / (maxYield - minYield)) * (svgHeight - paddingY * 2);
                return (
                  <g key={gridYield}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-[#2a2e39]"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[10px] fill-slate-400 dark:fill-[#787b86] font-mono"
                    >
                      {gridYield.toFixed(2)}%
                    </text>
                  </g>
                );
              })}

              {/* Area & Line */}
              <path d={areaD} fill="url(#curveGradient)" />
              <path
                d={pathD}
                fill="none"
                stroke="#2962ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((p) => {
                const isHovered = hoveredMaturity === p.maturity;
                return (
                  <g
                    key={p.maturity}
                    onMouseEnter={() => setHoveredMaturity(p.maturity)}
                    onMouseLeave={() => setHoveredMaturity(null)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6 : 4}
                      fill="#ffffff"
                      stroke="#2962ff"
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all"
                    />
                    {/* Maturity Label */}
                    <text
                      x={p.x}
                      y={svgHeight - 10}
                      textAnchor="middle"
                      className="text-[11px] fill-slate-500 dark:fill-[#787b86] font-mono font-semibold"
                    >
                      {p.maturity}
                    </text>
                    {/* Yield Label */}
                    <text
                      x={p.x}
                      y={p.y - 10}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-bold fill-slate-900 dark:fill-white ${
                        isHovered ? 'opacity-100 font-extrabold' : 'opacity-80'
                      }`}
                    >
                      {p.yield.toFixed(2)}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Sovereign Bond Benchmarks Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-[#2a2e39] flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Global Sovereign Benchmark Rates
          </h3>
          <span className="text-xs text-slate-400 dark:text-[#787b86]">
            Constant Maturity Yields
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#181c27] border-b border-slate-200 dark:border-[#2a2e39] text-slate-400 dark:text-[#787b86] font-medium">
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-4 text-left hidden sm:table-cell">Country / Area</th>
                <th className="py-3 px-4 text-right">Yield</th>
                <th className="py-3 px-4 text-right">Change (bps)</th>
                <th className="py-3 px-4 text-right">Change %</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Day High</th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Day Low</th>
                <th className="py-3 px-4 text-center hidden sm:table-cell">Trend</th>
                <th className="py-3 px-4 text-center">Technical Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2e39]/60">
              {bondSymbols.map((bond) => {
                const isUp = bond.change >= 0;
                const techStyle = getTechnicalBadgeStyle(bond.technicalRating);

                return (
                  <tr
                    key={bond.id}
                    onClick={() => onSelectSymbol(bond)}
                    className="hover:bg-slate-50 dark:hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-[#2962ff]/10 text-[#2962ff] flex items-center justify-center font-bold text-xs">
                          {bond.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                            {bond.ticker}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-[#787b86]">
                            {bond.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-[#787b86] hidden sm:table-cell">
                      {bond.category}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(bond.price, bond.currency)}
                    </td>

                    <td className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${getChangeColor(bond.change)}`}>
                      {bond.change > 0 ? `+${(bond.change * 100).toFixed(1)}` : `${(bond.change * 100).toFixed(1)}`} bps
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
                        {formatPercent(bond.changePercent)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#d1d4dc] hidden md:table-cell tabular-nums">
                      {formatPrice(bond.high, bond.currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#d1d4dc] hidden md:table-cell tabular-nums">
                      {formatPrice(bond.low, bond.currency)}
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="flex justify-center">
                        <Sparkline
                          data={bond.sparkline}
                          isUp={isUp}
                          width={75}
                          height={26}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${techStyle.bg} ${techStyle.text}`}>
                        {bond.technicalRating}
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
