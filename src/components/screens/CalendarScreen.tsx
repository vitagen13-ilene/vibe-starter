import React, { useState } from 'react';
import { ECONOMIC_EVENTS } from '../../data/marketData';
import { Calendar, AlertCircle } from 'lucide-react';

export const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<'All' | 'Today' | 'Tomorrow' | 'Friday'>('All');
  const [selectedImpact, setSelectedImpact] = useState<'all' | 'high' | 'medium'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  const countries = ['All', 'United States', 'Eurozone'];

  const filteredEvents = ECONOMIC_EVENTS.filter((evt) => {
    const matchesDate = selectedDate === 'All' || evt.date === selectedDate;
    const matchesImpact = selectedImpact === 'all' || evt.importance === selectedImpact;
    const matchesCountry = selectedCountry === 'All' || evt.country === selectedCountry;
    return matchesDate && matchesImpact && matchesCountry;
  });

  const getImpactBadge = (importance: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high':
        return 'bg-red-500/15 text-red-500 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
      case 'low':
        return 'bg-slate-500/15 text-slate-500 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-[#2962ff]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Global Macroeconomic Calendar
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#787b86]">
              Real-time schedule of interest rate decisions, inflation releases, labor metrics, and central bank testimony.
            </p>
          </div>

          {/* Quick Date Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39] overflow-x-auto no-scrollbar self-start sm:self-auto">
            {(['All', 'Today', 'Tomorrow', 'Friday'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  selectedDate === d
                    ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                    : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Impact & Country Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-[#787b86]">Impact:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedImpact('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedImpact === 'all'
                    ? 'bg-[#2962ff] text-white'
                    : 'bg-slate-100 dark:bg-[#131722] text-slate-600 dark:text-[#787b86]'
                }`}
              >
                All Impact
              </button>
              <button
                onClick={() => setSelectedImpact('high')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedImpact === 'high'
                    ? 'bg-red-500 text-white font-bold'
                    : 'bg-slate-100 dark:bg-[#131722] text-slate-600 dark:text-[#787b86]'
                }`}
              >
                High Volatility Only 🔥
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-[#787b86]">Country:</span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#181c27] border-b border-slate-200 dark:border-[#2a2e39] text-slate-400 dark:text-[#787b86] font-medium">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-center">Country</th>
                <th className="py-3 px-4">Economic Event</th>
                <th className="py-3 px-4 text-center">Impact</th>
                <th className="py-3 px-4 text-right">Actual</th>
                <th className="py-3 px-4 text-right">Forecast</th>
                <th className="py-3 px-4 text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2e39]/60">
              {filteredEvents.map((evt) => (
                <tr
                  key={evt.id}
                  className="hover:bg-slate-50 dark:hover:bg-[#2a2e39]/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-semibold text-slate-900 dark:text-white block sm:inline mr-2">
                      {evt.date}
                    </span>
                    <span className="text-slate-500 dark:text-[#787b86]">{evt.time}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-[#2a2e39] text-slate-800 dark:text-slate-200">
                      {evt.countryCode}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {evt.event}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getImpactBadge(evt.importance)}`}>
                      {evt.importance}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {evt.actual}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-[#d1d4dc] tabular-nums">
                    {evt.forecast}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-slate-400 dark:text-[#787b86] tabular-nums">
                    {evt.previous}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
