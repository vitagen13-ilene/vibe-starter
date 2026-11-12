import React, { useState } from 'react';
import { MarketSymbol, AssetClass, TechnicalRating } from '../../types/market';
import { Sparkline } from '../common/Sparkline';
import { formatPrice, formatPercent, formatChange, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import { Filter, Download, ArrowUpDown, ArrowUpRight, ArrowDownRight, Search, Check } from 'lucide-react';

interface ScreenerScreenProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const ScreenerScreen: React.FC<ScreenerScreenProps> = ({
  symbols,
  onSelectSymbol,
}) => {
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [minChange, setMinChange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'price' | 'changePercent' | 'ticker'>('changePercent');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const assetClasses: { id: string; label: string }[] = [
    { id: 'all', label: 'All Assets' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'futures', label: 'Futures' },
    { id: 'indices', label: 'Indices' },
    { id: 'bonds', label: 'Bonds' },
  ];

  const ratings = ['all', 'Strong Buy', 'Buy', 'Neutral', 'Sell', 'Strong Sell'];

  let filtered = symbols.filter((s) => {
    const matchesAsset = selectedAssetClass === 'all' || s.assetClass === selectedAssetClass;
    const matchesRating = selectedRating === 'all' || s.technicalRating === selectedRating;
    const matchesSearch =
      s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesChange = true;
    if (minChange === 'gainers') matchesChange = s.changePercent > 0;
    if (minChange === 'losers') matchesChange = s.changePercent < 0;
    if (minChange === 'high_movers') matchesChange = Math.abs(s.changePercent) >= 2;

    return matchesAsset && matchesRating && matchesSearch && matchesChange;
  });

  filtered.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') {
      return sortAsc
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }
    return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const toggleSort = (field: 'price' | 'changePercent' | 'ticker') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Ticker', 'Name', 'AssetClass', 'Price', 'ChangePercent', 'Volume', 'MarketCap', 'TechnicalRating'];
    const rows = filtered.map((s) => [
      s.ticker,
      `"${s.name}"`,
      s.assetClass,
      s.price,
      s.changePercent,
      s.volume,
      s.marketCap || '',
      s.technicalRating,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tradingview_screener_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Control Deck */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Filter className="w-5 h-5 text-[#2962ff]" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Multi-Asset Financial Screener
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#787b86]">
              Scan and filter global equities, cryptocurrencies, currencies, and futures with custom criteria.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2962ff] rounded-lg hover:bg-[#1e53e5] transition-colors shadow-sm self-start sm:self-auto shrink-0"
          >
            {downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloadSuccess ? 'CSV Downloaded!' : 'Export CSV'}</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-[#2a2e39]">
          {/* Asset Class Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-[#787b86] mb-1">
              Asset Class
            </label>
            <select
              value={selectedAssetClass}
              onChange={(e) => setSelectedAssetClass(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
            >
              {assetClasses.map((ac) => (
                <option key={ac.id} value={ac.id}>
                  {ac.label}
                </option>
              ))}
            </select>
          </div>

          {/* Technical Signal Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-[#787b86] mb-1">
              Technical Rating
            </label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
            >
              {ratings.map((r) => (
                <option key={r} value={r}>
                  {r === 'all' ? 'All Signals' : r}
                </option>
              ))}
            </select>
          </div>

          {/* Performance Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-[#787b86] mb-1">
              Performance Filter
            </label>
            <select
              value={minChange}
              onChange={(e) => setMinChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
            >
              <option value="all">Any Performance</option>
              <option value="gainers">Positive Only (&gt; 0%)</option>
              <option value="losers">Negative Only (&lt; 0%)</option>
              <option value="high_movers">High Volatility (≥ 2%)</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 dark:text-[#787b86] mb-1">
              Symbol Search
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#2962ff]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-[#2a2e39] flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 dark:text-[#d1d4dc]">
            Found {filtered.length} matching instruments
          </span>
          <span className="text-slate-400 dark:text-[#787b86]">
            Click column headers to sort
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#181c27] border-b border-slate-200 dark:border-[#2a2e39] text-slate-400 dark:text-[#787b86] font-medium">
                <th
                  onClick={() => toggleSort('ticker')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Symbol</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left hidden sm:table-cell">Asset Class</th>
                <th
                  onClick={() => toggleSort('price')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Net Change</th>
                <th
                  onClick={() => toggleSort('changePercent')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right hidden md:table-cell">Market Cap</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell">Volume</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">7D Chart</th>
                <th className="py-3 px-4 text-center">Technical Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2a2e39]/60">
              {filtered.map((item) => {
                const isUp = item.change >= 0;
                const techStyle = getTechnicalBadgeStyle(item.technicalRating);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectSymbol(item)}
                    className="hover:bg-slate-50 dark:hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-[#131722] flex items-center justify-center font-bold text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#2a2e39]">
                          {item.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                            {item.ticker}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-[#787b86] truncate max-w-[140px]">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-[#787b86] hidden sm:table-cell capitalize">
                      {item.assetClass}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(item.price, item.currency)}
                    </td>

                    <td className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${getChangeColor(item.change)}`}>
                      {formatChange(item.change, item.currency)}
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
                        {formatPercent(item.changePercent)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-[#d1d4dc] hidden md:table-cell tabular-nums">
                      {item.marketCap || '--'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 dark:text-[#787b86] hidden lg:table-cell tabular-nums">
                      {item.volume}
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="flex justify-center">
                        <Sparkline
                          data={item.sparkline}
                          isUp={isUp}
                          width={70}
                          height={24}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${techStyle.bg} ${techStyle.text}`}>
                        {item.technicalRating}
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
