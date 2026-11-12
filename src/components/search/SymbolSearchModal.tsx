import React, { useState, useEffect, useRef } from 'react';
import { MarketSymbol } from '../../types/market';
import { formatPrice, formatPercent, getChangeColor } from '../../utils/formatters';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface SymbolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['all', 'stocks', 'crypto', 'forex', 'futures', 'indices', 'bonds'];

  const filtered = symbols.filter((s) => {
    const matchesAsset = selectedAsset === 'all' || s.assetClass === selectedAsset;
    const matchesQuery =
      s.ticker.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      (s.sector && s.sector.toLowerCase().includes(query.toLowerCase()));
    return matchesAsset && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="w-full max-w-xl bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-[#2a2e39] flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbol, company name, or asset..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent border-0 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded bg-slate-100 dark:bg-[#2a2e39]"
          >
            Esc
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-[#2a2e39] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedAsset(cat)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors whitespace-nowrap ${
                selectedAsset === cat
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-slate-500 dark:text-[#787b86] hover:bg-slate-100 dark:hover:bg-[#2a2e39]'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-[#2a2e39]/50 p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 dark:text-[#787b86]">
              No instruments match &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((sym) => {
              const isUp = sym.change >= 0;
              return (
                <div
                  key={sym.id}
                  onClick={() => {
                    onSelectSymbol(sym);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-[#2a2e39]/60 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-[#131722] flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                      {sym.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-[#2962ff]">
                          {sym.ticker}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-[#787b86] uppercase">
                          {sym.assetClass}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-[#787b86] truncate max-w-[240px]">
                        {sym.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono tabular-nums text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatPrice(sym.price, sym.currency)}
                      </div>
                      <div className={`font-semibold ${getChangeColor(sym.changePercent)}`}>
                        {formatPercent(sym.changePercent)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-[#787b86] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
