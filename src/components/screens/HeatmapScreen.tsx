import React, { useState } from 'react';
import { SP500_HEATMAP, CRYPTO_HEATMAP } from '../../data/marketData';
import { HeatmapItem } from '../../types/market';
import { formatPercent } from '../../utils/formatters';
import { Grid3X3, Search, ZoomIn } from 'lucide-react';

interface HeatmapScreenProps {
  onSelectTicker: (ticker: string) => void;
}

export const HeatmapScreen: React.FC<HeatmapScreenProps> = ({ onSelectTicker }) => {
  const [datasetType, setDatasetType] = useState<'stocks' | 'crypto'>('stocks');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const rawItems = datasetType === 'stocks' ? SP500_HEATMAP : CRYPTO_HEATMAP;

  // Sectors list
  const sectors = ['All', ...Array.from(new Set(rawItems.map((i) => i.sector)))];

  const items = rawItems.filter((item) => {
    const matchesSector = selectedSector === 'All' || item.sector === selectedSector;
    const matchesSearch =
      item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const getTileBg = (change: number) => {
    if (change >= 3) return 'bg-[#089981] text-white hover:brightness-110';
    if (change >= 1.5) return 'bg-[#089981]/85 text-white hover:brightness-110';
    if (change > 0) return 'bg-[#089981]/60 text-white hover:brightness-110';
    if (change <= -3) return 'bg-[#f23645] text-white hover:brightness-110';
    if (change <= -1.5) return 'bg-[#f23645]/85 text-white hover:brightness-110';
    if (change < 0) return 'bg-[#f23645]/60 text-white hover:brightness-110';
    return 'bg-slate-500 text-white hover:brightness-110';
  };

  // Group items by sector for structured hierarchical layout
  const sectorsMap = items.reduce<Record<string, HeatmapItem[]>>((acc, item) => {
    if (!acc[item.sector]) acc[item.sector] = [];
    acc[item.sector].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Control Deck */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Grid3X3 className="w-5 h-5 text-[#2962ff]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Interactive Market Heatmaps
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#787b86]">
              Visualizing market capitalizations and daily performance distributions across industry sectors.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39] self-start sm:self-auto">
            <button
              onClick={() => {
                setDatasetType('stocks');
                setSelectedSector('All');
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                datasetType === 'stocks'
                  ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                  : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              S&P 500 Stocks
            </button>
            <button
              onClick={() => {
                setDatasetType('crypto');
                setSelectedSector('All');
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                datasetType === 'crypto'
                  ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                  : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Top Crypto Assets
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#2a2e39]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 dark:text-[#787b86] mr-1">Sector:</span>
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedSector === sec
                    ? 'bg-[#2962ff] text-white font-semibold'
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
              placeholder="Search ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2962ff]"
            />
          </div>
        </div>
      </div>

      {/* Full Heatmap Canvas */}
      <div className="space-y-4">
        {Object.entries(sectorsMap).map(([sectorName, sectorItems]) => (
          <div
            key={sectorName}
            className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-[#787b86]">
                {sectorName}
              </h3>
              <span className="text-xs text-slate-400 dark:text-[#787b86] font-mono tabular-nums">
                {sectorItems.length} assets
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {sectorItems.map((item) => {
                const isMega = item.marketCap >= 1000;
                return (
                  <div
                    key={item.ticker}
                    onClick={() => onSelectTicker(item.ticker)}
                    className={`p-3 rounded-lg flex flex-col justify-between cursor-pointer transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-sm min-h-[95px] ${getTileBg(
                      item.changePercent
                    )} ${isMega ? 'col-span-2 row-span-1 border-2 border-white/20' : 'col-span-1'}`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="font-black text-sm sm:text-base tracking-wide">
                          {item.ticker}
                        </span>
                        <span className="text-[10px] opacity-80 font-mono tabular-nums">
                          ${item.marketCap}B
                        </span>
                      </div>
                      <div className="text-[11px] opacity-90 truncate max-w-[120px]">
                        {item.name}
                      </div>
                    </div>

                    <div className="flex items-end justify-between font-mono tabular-nums pt-2">
                      <span className="text-sm font-extrabold">
                        {formatPercent(item.changePercent)}
                      </span>
                      <span className="text-xs opacity-90">
                        ${item.price >= 1 ? item.price.toFixed(2) : item.price.toFixed(4)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap Legend & Color Distribution */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#787b86]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-[#d1d4dc]">Performance Scale:</span>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-[#f23645] font-bold">-3%</span>
            <div className="flex items-center gap-0.5">
              <span className="w-5 h-3.5 rounded-xs bg-[#f23645]" />
              <span className="w-5 h-3.5 rounded-xs bg-[#f23645]/80" />
              <span className="w-5 h-3.5 rounded-xs bg-[#f23645]/50" />
              <span className="w-5 h-3.5 rounded-xs bg-slate-500" />
              <span className="w-5 h-3.5 rounded-xs bg-[#089981]/50" />
              <span className="w-5 h-3.5 rounded-xs bg-[#089981]/80" />
              <span className="w-5 h-3.5 rounded-xs bg-[#089981]" />
            </div>
            <span className="text-[#089981] font-bold">+3%</span>
          </div>
        </div>

        <div>
          Click any block to inspect candlestick charts and technical indicators.
        </div>
      </div>
    </div>
  );
};
