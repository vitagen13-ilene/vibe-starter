import React from 'react';

interface SparklineProps {
  data: number[];
  isUp: boolean;
  width?: number;
  height?: number;
  showGradient?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  isUp,
  width = 90,
  height = 32,
  showGradient = false,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const usableHeight = height - padding * 2;
  const usableWidth = width - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const strokeColor = isUp ? '#089981' : '#f23645';
  const fillColor = isUp ? 'rgba(8, 153, 129, 0.15)' : 'rgba(242, 54, 69, 0.15)';
  const gradientId = `spark-grad-${Math.random().toString(36).substr(2, 9)}`;

  const areaD = `${pathD} L ${usableWidth + padding},${height} L ${padding},${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible block">
      {showGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>
      )}
      {showGradient && (
        <path d={areaD} fill={`url(#${gradientId})`} />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
