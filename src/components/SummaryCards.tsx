import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { CurrencyDisplay } from './CurrencyDisplay';

interface SummaryCardsProps { balance: number; income: number; expenses: number; }

export function SummaryCards({ balance, income, expenses }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

      {/* ── Total Balance ── warm beige/gold gradient ─────── */}
      <div className="rounded-2xl p-6 cursor-default transition-all duration-300 hover:scale-[1.015]"
           style={{
             background: 'linear-gradient(140deg, #D4C4A0 0%, #C2A96A 55%, #B09050 100%)',
             boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset, 0 12px 36px rgba(0,0,0,0.5)',
           }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(18,12,4,0.6)' }}>
            Total Balance
          </p>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(18,12,4,0.14)' }}>
            <Wallet className="w-4 h-4" style={{ color: 'rgba(18,12,4,0.85)' }} />
          </div>
        </div>
        <CurrencyDisplay amount={balance} className="text-[1.9rem] font-bold leading-tight"
                         style={{ color: '#130D06' }} />
        <p className="text-xs mt-2.5 font-medium" style={{ color: 'rgba(18,12,4,0.5)' }}>Net portfolio value</p>
      </div>

      {/* ── Total Income ── theme-aware green card ────── */}
      <div className="rounded-2xl p-6 cursor-default transition-all duration-300 hover:scale-[1.015]"
           style={{
             background: 'var(--card-income-bg)',
             border: '1px solid var(--card-income-border)',
             boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
           }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold tracking-widest uppercase"
             style={{ color: 'var(--card-income-text)', opacity: 0.7 }}>Total Income</p>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid var(--card-income-border)' }}>
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--card-income-text)' }} />
          </div>
        </div>
        <CurrencyDisplay amount={income} className="text-[1.9rem] font-bold leading-tight"
                         style={{ color: 'var(--card-income-text)' }} />
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--card-income-text)' }} />
          <p className="text-xs font-light" style={{ color: 'var(--card-income-text)', opacity: 0.75 }}>All time earnings</p>
        </div>
      </div>

      {/* ── Total Expenses ── theme-aware red card ────── */}
      <div className="rounded-2xl p-6 cursor-default transition-all duration-300 hover:scale-[1.015]"
           style={{
             background: 'var(--card-expense-bg)',
             border: '1px solid var(--card-expense-border)',
             boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
           }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold tracking-widest uppercase"
             style={{ color: 'var(--card-expense-text)', opacity: 0.7 }}>Total Expenses</p>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid var(--card-expense-border)' }}>
            <TrendingDown className="w-4 h-4" style={{ color: 'var(--card-expense-text)' }} />
          </div>
        </div>
        <CurrencyDisplay amount={expenses} className="text-[1.9rem] font-bold leading-tight"
                         style={{ color: 'var(--card-expense-text)' }} />
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--card-expense-text)' }} />
          <p className="text-xs font-light" style={{ color: 'var(--card-expense-text)', opacity: 0.75 }}>All time spending</p>
        </div>
      </div>

    </div>
  );
}
