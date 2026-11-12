export function formatPrice(price: number, currency: string = 'USD'): string {
  if (currency === '%') {
    return `${price.toFixed(3)}%`;
  }
  if (currency === 'points') {
    return price.toFixed(2);
  }
  if (currency === 'USD/oz' || currency === 'USD/bbl' || currency === 'USD/MMBtu' || currency === 'USD/lb') {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`;
  }

  if (price >= 1000) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 1) {
    return price.toFixed(2);
  } else if (price >= 0.01) {
    return price.toFixed(4);
  } else {
    return price.toFixed(6);
  }
}

export function formatChange(change: number, currency: string = 'USD'): string {
  const sign = change > 0 ? '+' : '';
  if (currency === '%') {
    return `${sign}${change.toFixed(3)}%`;
  }
  if (currency === 'points') {
    return `${sign}${change.toFixed(2)}`;
  }
  return `${sign}${change >= 1 || change <= -1 ? change.toFixed(2) : change.toFixed(4)}`;
}

export function formatPercent(percent: number): string {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

export function getChangeColor(change: number): string {
  if (change > 0) return 'text-[#089981]';
  if (change < 0) return 'text-[#f23645]';
  return 'text-[#787b86]';
}

export function getChangeBgColor(change: number): string {
  if (change > 0) return 'bg-[#089981]/10 text-[#089981] border-[#089981]/20';
  if (change < 0) return 'bg-[#f23645]/10 text-[#f23645] border-[#f23645]/20';
  return 'bg-[#787b86]/10 text-[#787b86] border-[#787b86]/20';
}

export function getTechnicalBadgeStyle(rating: string): { bg: string; text: string } {
  switch (rating) {
    case 'Strong Buy':
      return { bg: 'bg-[#089981]/15', text: 'text-[#089981]' };
    case 'Buy':
      return { bg: 'bg-[#089981]/10', text: 'text-[#089981]' };
    case 'Neutral':
      return { bg: 'bg-[#787b86]/15', text: 'text-[#787b86]' };
    case 'Sell':
      return { bg: 'bg-[#f23645]/10', text: 'text-[#f23645]' };
    case 'Strong Sell':
      return { bg: 'bg-[#f23645]/15', text: 'text-[#f23645]' };
    default:
      return { bg: 'bg-[#787b86]/10', text: 'text-[#787b86]' };
  }
}
