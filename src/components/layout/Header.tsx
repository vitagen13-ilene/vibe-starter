import React from 'react';
import { Search, Sun, Moon, Bookmark, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  watchlistCount: number;
  onToggleWatchlist: () => void;
  activeScreen: string;
  onSelectScreen: (screen: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onOpenSearch,
  watchlistCount,
  onToggleWatchlist,
  activeScreen,
  onSelectScreen,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#131722] border-b border-slate-200 dark:border-[#2a2e39] transition-colors duration-150">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectScreen('overview')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2962ff] rounded-md"
          >
            {/* TradingView Iconic 3-Bar Logo Mark */}
            <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center text-white shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 14H8V20H4V14Z" fill="currentColor" />
                <path d="M10 8H14V20H10V8Z" fill="currentColor" />
                <path d="M16 4H20V20H16V4Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              TradingView <span className="font-semibold text-slate-500 dark:text-slate-400">Markets</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-[#787b86]">
          <button
            onClick={() => onSelectScreen('overview')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
              activeScreen === 'overview' ? 'text-[#2962ff] dark:text-[#2962ff] font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectScreen('stocks')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
              activeScreen === 'stocks' ? 'text-[#2962ff] dark:text-[#2962ff] font-semibold' : ''
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => onSelectScreen('crypto')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
              activeScreen === 'crypto' ? 'text-[#2962ff] dark:text-[#2962ff] font-semibold' : ''
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => onSelectScreen('heatmaps')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
              activeScreen === 'heatmaps' ? 'text-[#2962ff] dark:text-[#2962ff] font-semibold' : ''
            }`}
          >
            Heatmaps
          </button>
          <button
            onClick={() => onSelectScreen('screener')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
              activeScreen === 'screener' ? 'text-[#2962ff] dark:text-[#2962ff] font-semibold' : ''
            }`}
          >
            Screener
          </button>
          <button
            onClick={() => onSelectScreen('calendar')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
              activeScreen === 'calendar' ? 'text-[#2962ff] dark:text-[#2962ff] font-semibold' : ''
            }`}
          >
            Calendar
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Bar trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-[#787b86] bg-slate-100 dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-md hover:border-slate-300 dark:hover:border-[#363a45] transition-colors whitespace-nowrap"
            title="Search symbols (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search markets...</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#2a2e39] rounded border border-slate-200 dark:border-[#363a45] text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Watchlist Drawer Toggle */}
          <button
            onClick={onToggleWatchlist}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-[#d1d4dc] bg-slate-100 dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-md hover:bg-slate-200 dark:hover:bg-[#2a2e39] transition-colors"
            title="Open Watchlist"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#2962ff]" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-[#2962ff] text-white rounded-full">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-[#1e222d] transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
