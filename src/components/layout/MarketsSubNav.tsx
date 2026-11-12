import React from 'react';
import {
  Globe,
  TrendingUp,
  Coins,
  DollarSign,
  Flame,
  Scale,
  Grid3X3,
  Filter,
  Calendar,
  Layers
} from 'lucide-react';

export type ScreenType =
  | 'overview'
  | 'indices'
  | 'stocks'
  | 'crypto'
  | 'forex'
  | 'futures'
  | 'bonds'
  | 'heatmaps'
  | 'screener'
  | 'calendar';

interface MarketsSubNavProps {
  activeScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
}

const NAV_ITEMS: { id: ScreenType; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
  { id: 'indices', label: 'Indices', icon: <Globe className="w-4 h-4" /> },
  { id: 'stocks', label: 'Stocks', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'crypto', label: 'Crypto', icon: <Coins className="w-4 h-4" /> },
  { id: 'forex', label: 'Forex', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'futures', label: 'Futures', icon: <Flame className="w-4 h-4" /> },
  { id: 'bonds', label: 'Bonds', icon: <Scale className="w-4 h-4" /> },
  { id: 'heatmaps', label: 'Heatmaps', icon: <Grid3X3 className="w-4 h-4" /> },
  { id: 'screener', label: 'Screener', icon: <Filter className="w-4 h-4" /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
];

export const MarketsSubNav: React.FC<MarketsSubNavProps> = ({
  activeScreen,
  onSelectScreen,
}) => {
  return (
    <div className="w-full bg-white dark:bg-[#131722] border-b border-slate-200 dark:border-[#2a2e39] overflow-x-auto no-scrollbar">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`flex items-center gap-2 py-3 px-3 sm:px-3.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-[#2962ff] text-[#2962ff] dark:text-[#2962ff] font-semibold'
                  : 'border-transparent text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-[#d1d4dc] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className={isActive ? 'text-[#2962ff]' : 'text-slate-400 dark:text-[#787b86]'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
