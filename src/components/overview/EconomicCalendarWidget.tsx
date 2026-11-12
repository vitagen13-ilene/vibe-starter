import React from 'react';
import { ECONOMIC_EVENTS } from '../../data/marketData';
import { Calendar, ArrowRight } from 'lucide-react';

interface EconomicCalendarWidgetProps {
  onNavigateToCalendar: () => void;
}

export const EconomicCalendarWidget: React.FC<EconomicCalendarWidgetProps> = ({
  onNavigateToCalendar,
}) => {
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low':
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#2962ff]" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Economic Calendar
          </h3>
        </div>

        <button
          onClick={onNavigateToCalendar}
          className="flex items-center gap-1 text-xs text-[#2962ff] hover:underline font-semibold"
        >
          <span>All Events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {ECONOMIC_EVENTS.slice(0, 4).map((evt) => (
          <div
            key={evt.id}
            className="p-2.5 rounded-lg border border-slate-100 dark:border-[#2a2e39] bg-slate-50/60 dark:bg-[#131722]/50 hover:bg-slate-100 dark:hover:bg-[#2a2e39]/50 transition-colors flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-[#787b86] shrink-0">
                {evt.time}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 bg-slate-200 dark:bg-[#2a2e39] text-slate-700 dark:text-slate-300">
                {evt.countryCode}
              </span>
              <span className="font-medium text-slate-900 dark:text-[#d1d4dc] truncate">
                {evt.event}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums text-[11px]">
              <div>
                <span className="text-slate-400 dark:text-[#787b86] text-[10px] mr-1">Act:</span>
                <span className="font-bold text-slate-900 dark:text-white">{evt.actual}</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-slate-400 dark:text-[#787b86] text-[10px] mr-1">Frcst:</span>
                <span className="text-slate-600 dark:text-[#d1d4dc]">{evt.forecast}</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${getImpactColor(evt.importance)}`}>
                {evt.importance}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
