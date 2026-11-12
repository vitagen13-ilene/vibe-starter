import React, { useState } from 'react';
import { MarketSymbol, PaperPosition } from '../../types/market';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, getChangeColor } from '../../utils/formatters';
import { X, Bookmark, Trash2, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: MarketSymbol[];
  watchlistIds: string[];
  onRemoveWatchlist: (id: string) => void;
  onSelectSymbol: (symbol: MarketSymbol) => void;
  positions: PaperPosition[];
  onClosePosition: (positionId: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  symbols,
  watchlistIds,
  onRemoveWatchlist,
  onSelectSymbol,
  positions,
  onClosePosition,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'portfolio'>('watchlist');

  if (!isOpen) return null;

  const watchlistedSymbols = symbols.filter((s) => watchlistIds.includes(s.id));

  // Compute total portfolio P&L
  const totalPnL = positions.reduce((acc, pos) => {
    const sym = symbols.find((s) => s.ticker === pos.ticker);
    const currentPrice = sym ? sym.price : pos.entryPrice;
    const itemPnL =
      pos.side === 'buy'
        ? (currentPrice - pos.entryPrice) * pos.shares
        : (pos.entryPrice - currentPrice) * pos.shares;
    return acc + itemPnL;
  }, 0);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-[#1e222d] border-l border-slate-200 dark:border-[#2a2e39] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-[#2a2e39] flex items-center justify-between">
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39]">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                : 'text-slate-600 dark:text-[#787b86]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Watchlist ({watchlistedSymbols.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'portfolio'
                ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                : 'text-slate-600 dark:text-[#787b86]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Paper Trades ({positions.length})</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2e39]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeTab === 'watchlist' ? (
          watchlistedSymbols.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-[#d1d4dc] mb-1">
                Your watchlist is empty
              </p>
              <p className="text-xs text-slate-400 dark:text-[#787b86]">
                Click the bookmark icon on any ticker or chart to pin assets here for instant monitoring.
              </p>
            </div>
          ) : (
            watchlistedSymbols.map((sym) => {
              const isUp = sym.change >= 0;
              return (
                <div
                  key={sym.id}
                  className="group p-3 rounded-xl border border-slate-100 dark:border-[#2a2e39] bg-slate-50/50 dark:bg-[#131722]/50 hover:bg-slate-100/70 dark:hover:bg-[#2a2e39]/60 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  onClick={() => onSelectSymbol(sym)}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-[#2962ff]">
                        {sym.ticker}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-[#787b86]">
                        {sym.assetClass.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#787b86] truncate max-w-[120px]">
                      {sym.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sparkline data={sym.sparkline} isUp={isUp} width={50} height={20} />

                    <div className="text-right font-mono tabular-nums">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {formatPrice(sym.price, sym.currency)}
                      </div>
                      <div className={`text-[10px] font-semibold ${getChangeColor(sym.changePercent)}`}>
                        {formatPercent(sym.changePercent)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveWatchlist(sym.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )
        ) : (
          <div>
            {/* Total Portfolio P&L Header */}
            <div className="p-3 mb-3 bg-slate-100 dark:bg-[#131722] rounded-xl border border-slate-200 dark:border-[#2a2e39]">
              <div className="text-[11px] text-slate-400 dark:text-[#787b86] mb-0.5">
                Total Unrealized Paper P&L
              </div>
              <div className={`text-base font-bold font-mono tabular-nums ${totalPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {totalPnL >= 0 ? `+$${totalPnL.toFixed(2)}` : `-$${Math.abs(totalPnL).toFixed(2)}`}
              </div>
            </div>

            {positions.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700 dark:text-[#d1d4dc] mb-1">
                  No active paper positions
                </p>
                <p className="text-xs text-slate-400 dark:text-[#787b86]">
                  Open any symbol chart to execute simulated paper Buy / Sell trades!
                </p>
              </div>
            ) : (
              positions.map((pos) => {
                const sym = symbols.find((s) => s.ticker === pos.ticker);
                const currentPrice = sym ? sym.price : pos.entryPrice;
                const posPnL =
                  pos.side === 'buy'
                    ? (currentPrice - pos.entryPrice) * pos.shares
                    : (pos.entryPrice - currentPrice) * pos.shares;
                const posPercent = ((currentPrice - pos.entryPrice) / pos.entryPrice) * 100 * (pos.side === 'buy' ? 1 : -1);

                return (
                  <div
                    key={pos.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-[#2a2e39] bg-slate-50/50 dark:bg-[#131722]/50 text-xs mb-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">{pos.ticker}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${pos.side === 'buy' ? 'bg-[#089981]/15 text-[#089981]' : 'bg-[#f23645]/15 text-[#f23645]'}`}>
                          {pos.side}
                        </span>
                        <span className="text-slate-400">×{pos.shares}</span>
                      </div>

                      <button
                        onClick={() => onClosePosition(pos.id)}
                        className="text-[10px] text-red-500 hover:underline font-semibold"
                      >
                        Close
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 dark:text-[#787b86] font-mono tabular-nums text-[11px]">
                      <span>Entry: ${pos.entryPrice.toFixed(2)}</span>
                      <span>Now: ${currentPrice.toFixed(2)}</span>
                    </div>

                    <div className={`mt-1 font-mono font-bold text-right tabular-nums ${posPnL >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {posPnL >= 0 ? `+$${posPnL.toFixed(2)}` : `-$${Math.abs(posPnL).toFixed(2)}`} ({posPercent >= 0 ? `+${posPercent.toFixed(2)}%` : `${posPercent.toFixed(2)}%`})
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
