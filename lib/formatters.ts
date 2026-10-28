/**
 * Format numbers using Indian numbering system (e.g. 12,50,000 instead of 1,250,000)
 */
export function formatINR(amount: number, includeSymbol: boolean = true): string {
  if (typeof amount !== 'number' || isNaN(amount) || !Number.isFinite(amount)) {
    return includeSymbol ? '₹0' : '0';
  }

  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded);

  // Use Intl.NumberFormat for India locale
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absVal);

  const prefix = isNegative ? '-' : '';
  const symbol = includeSymbol ? '₹' : '';
  return `${prefix}${symbol}${formatted}`;
}

/**
 * Format numbers in Lakhs and Crores for compact display (e.g. ₹15 Lakh, ₹2.5 Crore)
 */
export function formatINRLakhs(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount) || !Number.isFinite(amount)) {
    return '₹0';
  }
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    const lk = amount / 100000;
    return `₹${lk % 1 === 0 ? lk : lk.toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k % 1 === 0 ? k : k.toFixed(1)}k`;
  }
  return formatINR(amount);
}

/**
 * Format date in Indian friendly format: "24 Nov 2026"
 */
export function formatDate(dateString: string): string {
  try {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Get human readable countdown to event date
 */
export function getDaysRemaining(targetDateStr: string): {
  days: number;
  label: string;
  isPast: boolean;
} {
  if (!targetDateStr) {
    return { days: 0, label: 'Date pending', isPast: false };
  }
  const target = new Date(targetDateStr);
  if (isNaN(target.getTime())) {
    return { days: 0, label: 'Invalid date', isPast: false };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: Math.abs(diffDays),
      label: `${Math.abs(diffDays)} days ago`,
      isPast: true,
    };
  }
  if (diffDays === 0) {
    return { days: 0, label: 'Today is the big day!', isPast: false };
  }
  if (diffDays === 1) {
    return { days: 1, label: 'Tomorrow', isPast: false };
  }
  return { days: diffDays, label: `${diffDays} days left`, isPast: false };
}
