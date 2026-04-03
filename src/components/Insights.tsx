import { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles } from 'lucide-react';
import type { Transaction } from '../types/database';
import { getCategoryBreakdown } from '../utils/calculations';
import { CurrencyDisplay } from './CurrencyDisplay';

interface InsightsProps { transactions: Transaction[]; }

export function Insights({ transactions }: InsightsProps) {
  const data = useMemo(() => {
    const breakdown = getCategoryBreakdown(transactions);
    const topCat = breakdown[0] ?? null;

    const now = new Date();
    const m  = now.getMonth(), y  = now.getFullYear();
    const pm = m === 0 ? 11 : m - 1;
    const py = m === 0 ? y - 1 : y;

    const inM = (t: Transaction, mo: number, yr: number) => {
      const d = new Date(t.date);
      return d.getMonth() === mo && d.getFullYear() === yr;
    };
    const sum = (list: Transaction[], type: 'income' | 'expense') =>
      list.filter(t => t.type === type).reduce((s, t) => s + Number(t.amount), 0);

    const cur = transactions.filter(t => inM(t, m, y));
    const prv = transactions.filter(t => inM(t, pm, py));

    const thisInc = sum(cur, 'income');
    const thisExp = sum(cur, 'expense');
    const lastExp = sum(prv, 'expense');
    const expChg  = lastExp > 0 ? ((thisExp - lastExp) / lastExp) * 100 : 0;
    const savAmt  = thisInc - thisExp;
    const savRate = thisInc > 0 ? (savAmt / thisInc) * 100 : 0;

    return { topCat, expChg, savAmt, savRate, lastExp };
  }, [transactions]);

  const { topCat, expChg, savAmt, savRate, lastExp } = data;

  return (
    <div className="glass-card p-6 h-full flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-gold)' }} />
        <h3 className="text-xs font-semibold uppercase tracking-[0.1em]"
            style={{ color: 'var(--accent-gold)' }}>Insights</h3>
      </div>

      {topCat && (
        <InsCard icon={<AlertTriangle className="w-3.5 h-3.5" />}
          title="Top Spending" desc={topCat.category}
          accent="#C2A96A" bg="rgba(194,169,106,0.07)" border="rgba(194,169,106,0.18)">
          <CurrencyDisplay amount={topCat.amount} className="text-lg font-bold" style={{ color: '#C2A96A' }} />
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>this period</p>
        </InsCard>
      )}

      <InsCard
        icon={expChg > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        title="vs Last Month"
        desc={expChg > 0 ? `Expenses ↑ ${Math.abs(expChg).toFixed(1)}%` : expChg < 0 ? `Expenses ↓ ${Math.abs(expChg).toFixed(1)}%` : 'Unchanged'}
        accent={expChg > 0 ? '#EF4444' : '#4ADE80'}
        bg={expChg > 0 ? 'rgba(239,68,68,0.07)' : 'rgba(74,222,128,0.07)'}
        border={expChg > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.18)'}>
        <p className="text-lg font-bold" style={{ color: expChg > 0 ? '#EF4444' : '#4ADE80' }}>
          {expChg >= 0 ? '+' : ''}{expChg.toFixed(1)}%
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          prev: ₹{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(lastExp)}
        </p>
      </InsCard>

      <InsCard icon={<TrendingUp className="w-3.5 h-3.5" />}
        title="Monthly Savings"
        desc={savRate > 20 ? 'Excellent rate!' : savRate > 0 ? 'Positive savings' : 'Review your expenses'}
        accent={savRate > 0 ? '#4ADE80' : '#EF4444'}
        bg={savRate > 0 ? 'rgba(74,222,128,0.07)' : 'rgba(239,68,68,0.07)'}
        border={savRate > 0 ? 'rgba(74,222,128,0.18)' : 'rgba(239,68,68,0.2)'}>
        <CurrencyDisplay amount={savAmt} className="text-lg font-bold"
          style={{ color: savRate > 0 ? '#4ADE80' : '#EF4444' }} />
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {savRate.toFixed(1)}% of income
        </p>
      </InsCard>
    </div>
  );
}

function InsCard({
  icon, title, desc, accent, bg, border, children
}: {
  icon: React.ReactNode; title: string; desc: string;
  accent: string; bg: string; border: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-4 transition-all duration-200"
         style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0" style={{ color: accent }}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{title}</p>
          <p className="text-xs font-light mb-2 leading-snug" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
