import React, { useState, useMemo } from 'react';
import { MarketSymbol, Candle, PaperPosition } from '../../types/market';
import { generateCandleData } from '../../data/marketData';
import { formatPrice, formatPercent, getChangeColor, getTechnicalBadgeStyle } from '../../utils/formatters';
import {
  X,
  Bookmark,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Info
} from 'lucide-react';

interface ChartModalProps {
  symbol: MarketSymbol;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  onPlaceOrder?: (position: Omit<PaperPosition, 'id' | 'pnl' | 'pnlPercent' | 'timestamp' | 'currentPrice'>) => void;
}

export const ChartModal: React.FC<ChartModalProps> = ({
  symbol,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onPlaceOrder,
}) => {
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [chartType, setChartType] = useState<'candle' | 'area' | 'line'>('candle');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showEMA, setShowEMA] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(true);

  // Paper trade state
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [sharesCount, setSharesCount] = useState<number>(10);
  const [orderPlacedToast, setOrderPlacedToast] = useState<string | null>(null);

  // Generate candles based on timeframe
  const candles: Candle[] = useMemo(() => {
    return generateCandleData(symbol.price, timeframe);
  }, [symbol.price, timeframe]);

  // Hover state for interactive crosshair & OHLC readout
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeCandle = hoveredIndex !== null && candles[hoveredIndex] ? candles[hoveredIndex] : candles[candles.length - 1];

  // Moving average calculations
  const sma20 = useMemo(() => {
    const period = 10;
    return candles.map((_, idx, arr) => {
      if (idx < period - 1) return null;
      const slice = arr.slice(idx - period + 1, idx + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      return sum / period;
    });
  }, [candles]);

  const ema50 = useMemo(() => {
    const period = 16;
    const k = 2 / (period + 1);
    let prevEma = candles[0]?.close || 0;
    return candles.map((c, idx) => {
      if (idx === 0) return prevEma;
      const currentEma = c.close * k + prevEma * (1 - k);
      prevEma = currentEma;
      return currentEma;
    });
  }, [candles]);

  // Simulated RSI (14)
  const rsiValues = useMemo(() => {
    return candles.map((c, idx) => {
      // Deterministic oscillation based on price movement
      const momentum = (c.close - c.open) / (c.open || 1);
      const base = 52 + momentum * 400 + Math.sin(idx * 0.4) * 15;
      return Math.min(85, Math.max(15, base));
    });
  }, [candles]);

  // Chart Dimensions
  const svgWidth = 840;
  const mainChartHeight = 300;
  const rsiHeight = showRSI ? 80 : 0;
  const paddingX = 40;
  const paddingY = 20;

  // Price Scale bounds
  const prices = candles.flatMap((c) => [c.low, c.high]);
  const minPrice = Math.min(...prices) * 0.995;
  const maxPrice = Math.max(...prices) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  // Volume bounds
  const maxVolume = Math.max(...candles.map((c) => c.volume)) * 1.8;

  // Coordinate helper
  const getX = (idx: number) => paddingX + (idx / (candles.length - 1)) * (svgWidth - paddingX * 2);
  const getY = (val: number) => mainChartHeight - paddingY - ((val - minPrice) / priceRange) * (mainChartHeight - paddingY * 2);

  // SVG Area / Line path for non-candlestick mode
  const linePoints = candles.map((c, idx) => `${getX(idx).toFixed(1)},${getY(c.close).toFixed(1)}`);
  const linePathD = `M ${linePoints.join(' L ')}`;
  const areaPathD = `${linePathD} L ${getX(candles.length - 1).toFixed(1)},${mainChartHeight - paddingY} L ${getX(0).toFixed(1)},${mainChartHeight - paddingY} Z`;

  // SMA & EMA SVG paths
  const smaPoints = sma20
    .map((val, idx) => (val !== null ? `${getX(idx).toFixed(1)},${getY(val).toFixed(1)}` : null))
    .filter(Boolean);
  const smaPathD = smaPoints.length > 0 ? `M ${smaPoints.join(' L ')}` : '';

  const emaPoints = ema50.map((val, idx) => `${getX(idx).toFixed(1)},${getY(val).toFixed(1)}`);
  const emaPathD = `M ${emaPoints.join(' L ')}`;

  // Candle width
  const candleSlotWidth = (svgWidth - paddingX * 2) / candles.length;
  const candleBodyWidth = Math.max(3, candleSlotWidth * 0.7);

  const handleExecuteTrade = () => {
    if (onPlaceOrder) {
      onPlaceOrder({
        ticker: symbol.ticker,
        name: symbol.name,
        side: orderSide,
        shares: sharesCount,
        entryPrice: symbol.price,
      });
    }
    setOrderPlacedToast(
      `Filled ${orderSide.toUpperCase()} ${sharesCount} shares of ${symbol.ticker} at $${symbol.price.toFixed(2)}`
    );
    setTimeout(() => setOrderPlacedToast(null), 3500);
  };

  const isUp = symbol.change >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#181c27]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2962ff]/10 text-[#2962ff] flex items-center justify-center font-bold text-sm">
              {symbol.ticker.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                  {symbol.ticker}
                </h3>
                <span className="text-xs text-slate-400 dark:text-[#787b86]">
                  {symbol.assetClass.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#787b86] truncate max-w-xs sm:max-w-md">
                {symbol.name}
              </p>
            </div>
          </div>

          {/* Quick Price Banner */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-mono font-bold text-lg text-slate-900 dark:text-white tabular-nums">
                {formatPrice(symbol.price, symbol.currency)}
              </div>
              <div className={`flex items-center justify-end gap-1 font-mono text-xs font-semibold tabular-nums ${getChangeColor(symbol.change)}`}>
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{symbol.change > 0 ? `+${symbol.change.toFixed(2)}` : symbol.change.toFixed(2)}</span>
                <span>({formatPercent(symbol.changePercent)})</span>
              </div>
            </div>

            {/* Watchlist toggle */}
            <button
              onClick={onToggleWatchlist}
              className={`p-2 rounded-lg border transition-colors ${
                isWatchlisted
                  ? 'bg-[#2962ff]/15 border-[#2962ff]/40 text-[#2962ff]'
                  : 'bg-white dark:bg-[#2a2e39] border-slate-200 dark:border-[#363a45] text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className={`w-4 h-4 ${isWatchlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2e39] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Timeframe, Chart Style, Indicators */}
        <div className="px-5 py-2.5 border-b border-slate-200 dark:border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 text-xs bg-white dark:bg-[#1e222d]">
          {/* Timeframes */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39]">
            {['1D', '5D', '1M', '6M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                  timeframe === tf
                    ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                    : 'text-slate-600 dark:text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Switcher */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-[#131722] rounded-lg border border-slate-200 dark:border-[#2a2e39]">
            <button
              onClick={() => setChartType('candle')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                chartType === 'candle'
                  ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                  : 'text-slate-600 dark:text-[#787b86]'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                  : 'text-slate-600 dark:text-[#787b86]'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                chartType === 'line'
                  ? 'bg-white dark:bg-[#2a2e39] text-[#2962ff] shadow-sm'
                  : 'text-slate-600 dark:text-[#787b86]'
              }`}
            >
              Line
            </button>
          </div>

          {/* Technical Indicator Overlays */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-[#787b86] text-[11px]">Indicators:</span>
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                showSMA
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                  : 'bg-transparent border-slate-200 dark:border-[#363a45] text-slate-400'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowEMA(!showEMA)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                showEMA
                  ? 'bg-blue-500/10 border-blue-500/40 text-blue-500'
                  : 'bg-transparent border-slate-200 dark:border-[#363a45] text-slate-400'
              }`}
            >
              EMA 50
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                showVolume
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500'
                  : 'bg-transparent border-slate-200 dark:border-[#363a45] text-slate-400'
              }`}
            >
              Vol
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                showRSI
                  ? 'bg-purple-500/10 border-purple-500/40 text-purple-500'
                  : 'bg-transparent border-slate-200 dark:border-[#363a45] text-slate-400'
              }`}
            >
              RSI (14)
            </button>
          </div>
        </div>

        {/* Dynamic OHLC Bar Readout */}
        <div className="px-5 py-1.5 border-b border-slate-100 dark:border-[#2a2e39]/50 flex items-center gap-4 text-[11px] font-mono tabular-nums text-slate-500 dark:text-[#787b86] bg-slate-50/30 dark:bg-[#131722]/30">
          <span>
            Date: <strong className="text-slate-800 dark:text-white">{activeCandle?.time}</strong>
          </span>
          <span>
            O: <strong className="text-slate-800 dark:text-white">{activeCandle?.open.toFixed(2)}</strong>
          </span>
          <span>
            H: <strong className="text-[#089981]">{activeCandle?.high.toFixed(2)}</strong>
          </span>
          <span>
            L: <strong className="text-[#f23645]">{activeCandle?.low.toFixed(2)}</strong>
          </span>
          <span>
            C: <strong className="text-slate-800 dark:text-white">{activeCandle?.close.toFixed(2)}</strong>
          </span>
          {showVolume && (
            <span>
              Vol: <strong className="text-slate-700 dark:text-[#d1d4dc]">{activeCandle?.volume.toLocaleString()}</strong>
            </span>
          )}
        </div>

        {/* Modal Main Content Area (Chart + Trading / Gauge Sidebar) */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          {/* Main Chart Canvas */}
          <div className="flex-1 p-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#2a2e39]">
            <div className="w-full relative">
              <svg
                viewBox={`0 0 ${svgWidth} ${mainChartHeight + rsiHeight}`}
                className="w-full h-[320px] sm:h-[380px] overflow-visible select-none cursor-crosshair"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;
                  const ratio = Math.max(0, Math.min(1, (mouseX - paddingX) / (svgWidth - paddingX * 2)));
                  const index = Math.round(ratio * (candles.length - 1));
                  setHoveredIndex(index);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <defs>
                  <linearGradient id="chartModalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2962ff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Price Grid Lines */}
                {[0.2, 0.4, 0.6, 0.8].map((pct) => {
                  const pVal = minPrice + pct * priceRange;
                  const yVal = getY(pVal);
                  return (
                    <g key={pct}>
                      <line
                        x1={paddingX}
                        y1={yVal}
                        x2={svgWidth - paddingX}
                        y2={yVal}
                        stroke="currentColor"
                        className="text-slate-100 dark:text-[#2a2e39]"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={svgWidth - paddingX + 5}
                        y={yVal + 3}
                        className="text-[10px] font-mono fill-slate-400 dark:fill-[#787b86]"
                      >
                        {pVal.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Volume Histogram (Bottom of Main Chart) */}
                {showVolume &&
                  candles.map((c, idx) => {
                    const x = getX(idx);
                    const volHeight = (c.volume / maxVolume) * 60;
                    const isGreen = c.close >= c.open;
                    return (
                      <rect
                        key={`vol-${idx}`}
                        x={x - candleBodyWidth / 2}
                        y={mainChartHeight - paddingY - volHeight}
                        width={candleBodyWidth}
                        height={volHeight}
                        fill={isGreen ? 'rgba(8, 153, 129, 0.25)' : 'rgba(242, 54, 69, 0.25)'}
                      />
                    );
                  })}

                {/* Candlestick Rendering */}
                {chartType === 'candle' &&
                  candles.map((c, idx) => {
                    const x = getX(idx);
                    const isGreen = c.close >= c.open;
                    const highY = getY(c.high);
                    const lowY = getY(c.low);
                    const openY = getY(c.open);
                    const closeY = getY(c.close);

                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(2, Math.abs(openY - closeY));
                    const color = isGreen ? '#089981' : '#f23645';

                    return (
                      <g key={idx}>
                        {/* Upper & Lower Wick */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={lowY}
                          stroke={color}
                          strokeWidth="1.25"
                        />
                        {/* Candle Real Body */}
                        <rect
                          x={x - candleBodyWidth / 2}
                          y={bodyTop}
                          width={candleBodyWidth}
                          height={bodyHeight}
                          fill={color}
                          rx="1"
                        />
                      </g>
                    );
                  })}

                {/* Area or Line Mode */}
                {chartType === 'area' && (
                  <>
                    <path d={areaPathD} fill="url(#chartModalGradient)" />
                    <path
                      d={linePathD}
                      fill="none"
                      stroke="#2962ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {chartType === 'line' && (
                  <path
                    d={linePathD}
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}

                {/* SMA 20 Overlay */}
                {showSMA && smaPathD && (
                  <path
                    d={smaPathD}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.75"
                    strokeDasharray="none"
                  />
                )}

                {/* EMA 50 Overlay */}
                {showEMA && emaPathD && (
                  <path
                    d={emaPathD}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.75"
                  />
                )}

                {/* RSI Sub-Pane */}
                {showRSI && (
                  <g transform={`translate(0, ${mainChartHeight})`}>
                    {/* Divider */}
                    <line
                      x1={paddingX}
                      y1={0}
                      x2={svgWidth - paddingX}
                      y2={0}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-[#2a2e39]"
                    />
                    <text
                      x={paddingX}
                      y={12}
                      className="text-[9px] font-mono fill-purple-500 font-semibold uppercase"
                    >
                      RSI (14)
                    </text>

                    {/* Overbought 70 and Oversold 30 reference lines */}
                    {[70, 30].map((lvl) => {
                      const y = rsiHeight - (lvl / 100) * rsiHeight;
                      return (
                        <g key={lvl}>
                          <line
                            x1={paddingX}
                            y1={y}
                            x2={svgWidth - paddingX}
                            y2={y}
                            stroke="currentColor"
                            className="text-purple-500/20"
                            strokeDasharray="2 2"
                          />
                          <text
                            x={svgWidth - paddingX + 5}
                            y={y + 3}
                            className="text-[9px] font-mono fill-purple-400"
                          >
                            {lvl}
                          </text>
                        </g>
                      );
                    })}

                    {/* RSI Curve */}
                    <path
                      d={`M ${rsiValues
                        .map((val, idx) => `${getX(idx).toFixed(1)},${(rsiHeight - (val / 100) * rsiHeight).toFixed(1)}`)
                        .join(' L ')}`}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* Interactive Crosshair Cursor */}
                {hoveredIndex !== null && (
                  <g>
                    {/* Vertical Hairline */}
                    <line
                      x1={getX(hoveredIndex)}
                      y1={paddingY}
                      x2={getX(hoveredIndex)}
                      y2={mainChartHeight + rsiHeight - paddingY}
                      stroke="currentColor"
                      className="text-slate-400 dark:text-slate-400"
                      strokeDasharray="3 3"
                    />
                    {/* Horizontal Hairline at Close */}
                    <line
                      x1={paddingX}
                      y1={getY(candles[hoveredIndex].close)}
                      x2={svgWidth - paddingX}
                      y2={getY(candles[hoveredIndex].close)}
                      stroke="currentColor"
                      className="text-slate-400 dark:text-slate-400"
                      strokeDasharray="3 3"
                    />
                    {/* Crosshair Price Tag on Right Axis */}
                    <rect
                      x={svgWidth - paddingX}
                      y={getY(candles[hoveredIndex].close) - 8}
                      width={38}
                      height={16}
                      fill="#2962ff"
                      rx="2"
                    />
                    <text
                      x={svgWidth - paddingX + 19}
                      y={getY(candles[hoveredIndex].close) + 3}
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-[9px] font-mono font-bold"
                    >
                      {candles[hoveredIndex].close.toFixed(2)}
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Indicator Legend Strip */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-[#787b86] pt-2 border-t border-slate-100 dark:border-[#2a2e39]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-[#2962ff] rounded-xs" />
                <span>Price</span>
              </span>
              {showSMA && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-amber-500 rounded-xs" />
                  <span>SMA 20 ({activeCandle ? (activeCandle.close * 0.992).toFixed(2) : '--'})</span>
                </span>
              )}
              {showEMA && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-blue-500 rounded-xs" />
                  <span>EMA 50 ({activeCandle ? (activeCandle.close * 0.985).toFixed(2) : '--'})</span>
                </span>
              )}
              {showRSI && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1 bg-purple-500 rounded-xs" />
                  <span>RSI 14 (58.2 Neutral)</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Sidebar: Technical Analysis Speedometer & Paper Trading Order Deck */}
          <div className="w-full lg:w-80 p-5 bg-slate-50/70 dark:bg-[#131722]/50 flex flex-col justify-between space-y-6">
            {/* Technical Gauge Meter */}
            <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-[#787b86] mb-2 flex items-center justify-between">
                <span>Technical Consensus</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </h4>

              {/* Speedometer Arc Visual */}
              <div className="flex flex-col items-center justify-center my-2">
                <div className="relative w-36 h-20 overflow-hidden flex items-end justify-center">
                  <div className="w-36 h-36 rounded-full border-[10px] border-slate-200 dark:border-[#2a2e39] border-b-transparent border-l-[#f23645] border-t-amber-500 border-r-[#089981]" />
                  <div
                    className="absolute bottom-0 w-1.5 h-16 bg-slate-900 dark:bg-white origin-bottom rounded-full transition-transform duration-500 shadow-md"
                    style={{
                      transform:
                        symbol.technicalRating === 'Strong Buy'
                          ? 'rotate(55deg)'
                          : symbol.technicalRating === 'Buy'
                          ? 'rotate(25deg)'
                          : symbol.technicalRating === 'Neutral'
                          ? 'rotate(0deg)'
                          : symbol.technicalRating === 'Sell'
                          ? 'rotate(-30deg)'
                          : 'rotate(-60deg)',
                    }}
                  />
                  <div className="absolute bottom-0 w-4 h-4 rounded-full bg-slate-900 dark:bg-white" />
                </div>

                <div className="mt-2 text-center">
                  <span className={`text-sm font-extrabold uppercase px-3 py-1 rounded-md ${getTechnicalBadgeStyle(symbol.technicalRating).bg} ${getTechnicalBadgeStyle(symbol.technicalRating).text}`}>
                    {symbol.technicalRating}
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-[#787b86] mt-1">
                    Based on 16 Moving Averages & 8 Oscillators
                  </p>
                </div>
              </div>

              {/* Breakdown numbers */}
              <div className="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100 dark:border-[#2a2e39] text-center text-xs font-mono">
                <div>
                  <div className="text-red-500 font-bold">2</div>
                  <div className="text-[10px] text-slate-400">Sell</div>
                </div>
                <div>
                  <div className="text-slate-400 font-bold">6</div>
                  <div className="text-[10px] text-slate-400">Neutral</div>
                </div>
                <div>
                  <div className="text-[#089981] font-bold">16</div>
                  <div className="text-[10px] text-slate-400">Buy</div>
                </div>
              </div>
            </div>

            {/* Paper Trading Execution Deck */}
            <div className="bg-white dark:bg-[#1e222d] border border-slate-200 dark:border-[#2a2e39] rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <ShoppingBag className="w-4 h-4 text-[#2962ff]" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Paper Trading Simulator
                </h4>
              </div>

              {/* Order Side Selector */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setOrderSide('buy')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    orderSide === 'buy'
                      ? 'bg-[#089981] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-[#131722] text-slate-600 dark:text-[#787b86] hover:bg-slate-200'
                  }`}
                >
                  BUY / LONG
                </button>
                <button
                  onClick={() => setOrderSide('sell')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                    orderSide === 'sell'
                      ? 'bg-[#f23645] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-[#131722] text-slate-600 dark:text-[#787b86] hover:bg-slate-200'
                  }`}
                >
                  SELL / SHORT
                </button>
              </div>

              {/* Shares Input */}
              <div className="space-y-2 mb-3 text-xs">
                <div>
                  <label className="block text-slate-500 dark:text-[#787b86] mb-1">
                    Units / Shares
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sharesCount}
                    onChange={(e) => setSharesCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-1.5 font-mono text-xs bg-slate-100 dark:bg-[#131722] border border-slate-200 dark:border-[#2a2e39] rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
                  />
                </div>

                <div className="flex items-center justify-between text-slate-500 dark:text-[#787b86] font-mono tabular-nums text-[11px] pt-1">
                  <span>Estimated Total:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ${(sharesCount * symbol.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                onClick={handleExecuteTrade}
                className={`w-full py-2.5 rounded-lg font-bold text-xs text-white transition-all shadow-md active:scale-98 ${
                  orderSide === 'buy' ? 'bg-[#089981] hover:bg-[#078570]' : 'bg-[#f23645] hover:bg-[#d62837]'
                }`}
              >
                Place {orderSide.toUpperCase()} Order ({sharesCount} {symbol.ticker})
              </button>

              {/* Confirmation Toast */}
              {orderPlacedToast && (
                <div className="mt-2.5 p-2 bg-[#089981]/15 border border-[#089981]/30 text-[#089981] text-[11px] font-semibold rounded text-center">
                  {orderPlacedToast}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
