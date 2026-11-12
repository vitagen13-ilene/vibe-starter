import React from 'react';
import { MARKET_NEWS } from '../../data/marketData';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsFeedProps {
  onSelectTicker: (ticker: string) => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ onSelectTicker }) => {
  return (
    <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#2962ff]" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Market News & Sentiment
          </h3>
        </div>
        <span className="text-xs text-slate-400 dark:text-[#787b86]">
          Real-time wire
        </span>
      </div>

      <div className="space-y-3.5">
        {MARKET_NEWS.map((news) => (
          <div
            key={news.id}
            className="pb-3 border-b border-slate-100 dark:border-[#2a2e39]/60 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-[#787b86] mb-1">
              <span className="font-semibold text-[#2962ff]">{news.source}</span>
              <span>·</span>
              <span>{news.time}</span>
              <span>·</span>
              <span className="text-slate-500 dark:text-slate-400">{news.category}</span>
            </div>

            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-[#2962ff] transition-colors leading-snug mb-1 cursor-pointer">
              {news.title}
            </h4>

            <p className="text-xs text-slate-500 dark:text-[#787b86] line-clamp-2 mb-2 leading-relaxed">
              {news.summary}
            </p>

            {/* Clickable Ticker Mentions */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {news.symbols.map((sym) => (
                <button
                  key={sym}
                  onClick={() => onSelectTicker(sym)}
                  className="px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-slate-100 dark:bg-[#2a2e39] text-[#2962ff] hover:bg-slate-200 dark:hover:bg-[#363a45] transition-colors"
                >
                  ${sym}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
