import React, { useState, useEffect } from 'react';
import { INITIAL_SYMBOLS } from './data/marketData';
import { MarketSymbol, PaperPosition } from './types/market';
import { Header } from './components/layout/Header';
import { TickerTape } from './components/layout/TickerTape';
import { MarketsSubNav, ScreenType } from './components/layout/MarketsSubNav';
import { MarketSummaryHero } from './components/overview/MarketSummaryHero';
import { MarketMovers } from './components/overview/MarketMovers';
import { HeatmapPreview } from './components/overview/HeatmapPreview';
import { EconomicCalendarWidget } from './components/overview/EconomicCalendarWidget';
import { NewsFeed } from './components/overview/NewsFeed';
import { IndicesScreen } from './components/screens/IndicesScreen';
import { StocksScreen } from './components/screens/StocksScreen';
import { CryptoScreen } from './components/screens/CryptoScreen';
import { ForexScreen } from './components/screens/ForexScreen';
import { FuturesScreen } from './components/screens/FuturesScreen';
import { BondsScreen } from './components/screens/BondsScreen';
import { HeatmapScreen } from './components/screens/HeatmapScreen';
import { ScreenerScreen } from './components/screens/ScreenerScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { ChartModal } from './components/chart/ChartModal';
import { WatchlistDrawer } from './components/watchlist/WatchlistDrawer';
import { SymbolSearchModal } from './components/search/SymbolSearchModal';

export default function App() {
  const [symbols, setSymbols] = useState<MarketSymbol[]>(INITIAL_SYMBOLS);
  const [activeScreen, setActiveScreen] = useState<ScreenType>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedSymbol, setSelectedSymbol] = useState<MarketSymbol | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);

  // Watchlist state
  const [watchlistIds, setWatchlistIds] = useState<string[]>([
    'NVDA',
    'BTC',
    'SPX',
    'TSLA',
    'GC1!',
    'EURUSD',
  ]);

  // Paper trading positions state
  const [positions, setPositions] = useState<PaperPosition[]>([
    {
      id: 'pos-1',
      ticker: 'NVDA',
      name: 'NVIDIA Corporation',
      side: 'buy',
      shares: 25,
      entryPrice: 142.5,
      currentPrice: 147.25,
      pnl: 118.75,
      pnlPercent: 3.33,
      timestamp: 'Today 10:14 AM',
    },
    {
      id: 'pos-2',
      ticker: 'BTC/USD',
      name: 'Bitcoin',
      side: 'buy',
      shares: 0.5,
      entryPrice: 89200,
      currentPrice: 91480,
      pnl: 1140,
      pnlPercent: 2.55,
      timestamp: 'Today 09:30 AM',
    },
  ]);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcut Cmd+K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live market ticking simulator (gently updates random assets every 3.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbols((prevSymbols) => {
        return prevSymbols.map((sym) => {
          // 30% chance for an asset to tick each interval
          if (Math.random() > 0.3) return sym;

          const tickPercent = (Math.random() - 0.48) * 0.003; // tiny tick +/- 0.15%
          const newPrice = Number((sym.price * (1 + tickPercent)).toFixed(sym.price < 1 ? 4 : 2));
          const priceDelta = newPrice - sym.price;
          const newChange = sym.change + priceDelta;
          const newChangePercent = Number((sym.changePercent + tickPercent * 100).toFixed(2));
          const newHigh = Math.max(sym.high, newPrice);
          const newLow = Math.min(sym.low, newPrice);

          // Update sparkline
          const newSparkline = [...sym.sparkline.slice(1), newPrice];

          return {
            ...sym,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high: newHigh,
            low: newLow,
            sparkline: newSparkline,
          };
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Watchlist helpers
  const handleToggleWatchlist = (id: string) => {
    setWatchlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Find symbol by ticker or id (e.g. from heatmap or news click)
  const handleSelectTickerByName = (tickerOrId: string) => {
    const found = symbols.find(
      (s) =>
        s.id.toLowerCase() === tickerOrId.toLowerCase() ||
        s.ticker.toLowerCase() === tickerOrId.toLowerCase() ||
        s.name.toLowerCase().includes(tickerOrId.toLowerCase())
    );
    if (found) {
      setSelectedSymbol(found);
    }
  };

  // Paper trading order execution
  const handlePlaceOrder = (
    order: Omit<PaperPosition, 'id' | 'pnl' | 'pnlPercent' | 'timestamp' | 'currentPrice'>
  ) => {
    const newPos: PaperPosition = {
      ...order,
      id: `pos-${Date.now()}`,
      currentPrice: order.entryPrice,
      pnl: 0,
      pnlPercent: 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setPositions((prev) => [newPos, ...prev]);
  };

  const handleClosePosition = (id: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#131722] text-slate-900 dark:text-[#d1d4dc] flex flex-col transition-colors duration-150">
      {/* 1. Header (Top Bar Contract: Brand, 4-5 Nav Links, Primary Tools) */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setIsSearchOpen(true)}
        watchlistCount={watchlistIds.length}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        activeScreen={activeScreen}
        onSelectScreen={(screen) => setActiveScreen(screen as ScreenType)}
      />

      {/* 2. TradingView Live Ticker Tape */}
      <TickerTape
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
      />

      {/* 3. Markets Sub-Navigation Bar */}
      <MarketsSubNav
        activeScreen={activeScreen}
        onSelectScreen={(screen) => setActiveScreen(screen)}
      />

      {/* 4. Main Viewport Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {activeScreen === 'overview' && (
          <div className="space-y-8">
            {/* Spotlight Benchmark Cards */}
            <MarketSummaryHero
              symbols={symbols}
              onSelectSymbol={(sym) => setSelectedSymbol(sym)}
            />

            {/* 2-Column Split: Market Movers & Heatmap Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <MarketMovers
                symbols={symbols}
                onSelectSymbol={(sym) => setSelectedSymbol(sym)}
              />
              <HeatmapPreview
                onSelectTicker={handleSelectTickerByName}
                onNavigateToFullHeatmap={() => setActiveScreen('heatmaps')}
              />
            </div>

            {/* 2-Column Split: Economic Calendar & Financial News Wire */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <EconomicCalendarWidget
                onNavigateToCalendar={() => setActiveScreen('calendar')}
              />
              <NewsFeed
                onSelectTicker={handleSelectTickerByName}
              />
            </div>
          </div>
        )}

        {activeScreen === 'indices' && (
          <IndicesScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeScreen === 'stocks' && (
          <StocksScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeScreen === 'crypto' && (
          <CryptoScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeScreen === 'forex' && (
          <ForexScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeScreen === 'futures' && (
          <FuturesScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeScreen === 'bonds' && (
          <BondsScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeScreen === 'heatmaps' && (
          <HeatmapScreen
            onSelectTicker={handleSelectTickerByName}
          />
        )}

        {activeScreen === 'screener' && (
          <ScreenerScreen
            symbols={symbols}
            onSelectSymbol={(sym) => setSelectedSymbol(sym)}
          />
        )}

        {activeScreen === 'calendar' && <CalendarScreen />}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-[#131722] border-t border-slate-200 dark:border-[#2a2e39] py-6 px-4 sm:px-6 transition-colors duration-150">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#787b86]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#2962ff] flex items-center justify-center text-white font-bold text-[10px]">
              TV
            </div>
            <span className="font-semibold text-slate-700 dark:text-[#d1d4dc]">
              TradingView Markets Terminal
            </span>
            <span>·</span>
            <span>Global Market Data &amp; Analytics</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveScreen('overview')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveScreen('heatmaps')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Heatmaps
            </button>
            <button
              onClick={() => setActiveScreen('screener')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Screener
            </button>
            <button
              onClick={() => setActiveScreen('calendar')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Economic Calendar
            </button>
          </div>
        </div>
      </footer>

      {/* 5. Full Interactive Chart Terminal Modal */}
      {selectedSymbol && (
        <ChartModal
          symbol={selectedSymbol}
          onClose={() => setSelectedSymbol(null)}
          isWatchlisted={watchlistIds.includes(selectedSymbol.id)}
          onToggleWatchlist={() => handleToggleWatchlist(selectedSymbol.id)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {/* 6. Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        symbols={symbols}
        watchlistIds={watchlistIds}
        onRemoveWatchlist={handleToggleWatchlist}
        onSelectSymbol={(sym) => {
          setSelectedSymbol(sym);
          setIsWatchlistOpen(false);
        }}
        positions={positions}
        onClosePosition={handleClosePosition}
      />

      {/* 7. Quick Symbol Search Palette */}
      <SymbolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
      />
    </div>
  );
}
