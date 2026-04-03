import React from 'react';

/* ──────────────────────────────────────────────
   Currency Display Component
────────────────────────────────────────────── */

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  style?: React.CSSProperties;
  showSign?: boolean;
}

export function CurrencyDisplay({
  amount,
  className = '',
  style,
  showSign = false,
}: CurrencyDisplayProps) {
  const isNegative = amount < 0;

  const digits = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return (
    <span
      className={className + " leading-normal"}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.18em', 
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {/* Optional sign */}
      {showSign && (
        <span
          style={{
            fontSize: '0.9em',
            fontWeight: 500,
          }}
        >
          {isNegative ? '−' : '+'}
        </span>
      )}

      {/* Rupee symbol - separated and scaled without tabular-nums to prevent missing glyphs */}
      <span
        style={{
          fontSize: '0.85em',
          fontWeight: 400,
          opacity: 0.9,
          lineHeight: 'inherit',
          fontFamily: 'sans-serif' /* Fallback to guarantee Rupee sign renders */
        }}
      >
        ₹
      </span>

      {/* Digits - with tabular nums for alignment */}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{digits}</span>
    </span>
  );
}

/* ──────────────────────────────────────────────
   Currency Cell (for tables / lists)
────────────────────────────────────────────── */

interface CurrencyCellProps {
  amount: number;
  type: 'income' | 'expense';
}

export function CurrencyCell({ amount, type }: CurrencyCellProps) {
  const isIncome = type === 'income';

  const color = isIncome
    ? 'var(--income-color)'
    : 'var(--expense-color)';

  const digits = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return (
    <span
      className="leading-normal"
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.12em',
        color,
        whiteSpace: 'nowrap',
        fontWeight: 600,
      }}
    >
      {/* Sign */}
      <span style={{ fontSize: '0.9em', fontWeight: 500 }}>
        {isIncome ? '+' : '−'}
      </span>

      {/* ₹ symbol */}
      <span style={{ fontSize: '0.85em', fontFamily: 'sans-serif', lineHeight: 'inherit' }}>
        ₹
      </span>

      {/* Digits */}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{digits}</span>
    </span>
  );
}

/* ──────────────────────────────────────────────
   Optional Helper (Reusable Formatter)
────────────────────────────────────────────── */

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}