import { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { useState } from 'react';
import type { Transaction } from '../types/database';
import { getMonthlyTrend, getCategoryBreakdown } from '../utils/calculations';

interface ChartsProps { transactions: Transaction[]; }

const INCOME_LINE  = '#4ADE80';
const EXPENSE_LINE = '#EF4444';
const PIE_PALETTE  = ['#C2A96A','#4ADE80','#D4B87A','#22C55E','#B09050','#EF4444','#E0D4BC','#16A34A'];

import { CurrencyDisplay } from './CurrencyDisplay';

function shortINRText(v: number) {
  if (v >= 1_00_000) return ` ${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000)    return ` ${(v / 1_000).toFixed(0)}K`;
  return ` ${v}`;
}

const CustomYAxisTick = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x - 4},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="var(--chart-axis)" fontSize={11}>
        <tspan fontSize={10} fontFamily="sans-serif">₹</tspan>
        <tspan dx="0.5">{shortINRText(payload.value)}</tspan>
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={TTStyle}>
        <p style={{ color: '#E0D4BC', fontWeight: 600, marginBottom: 8 }}>{label}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{entry.name}:</span>
              <CurrencyDisplay amount={Number(entry.value)} style={{ color: '#E0D4BC', fontSize: 12 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Shared tooltip style object (not as contentStyle prop — passed separately)
const TTStyle: React.CSSProperties = {
  background: '#1c1814',
  border: '1px solid rgba(196,172,120,0.28)',
  borderRadius: 10,
  boxShadow: '0 8px 24px rgba(0,0,0,0.55)',
  color: '#E0D4BC',
  fontSize: 12,
  padding: '10px 14px',
};

export function Charts({ transactions }: ChartsProps) {
  const monthly  = useMemo(() => getMonthlyTrend(transactions),    [transactions]);
  const category = useMemo(() => getCategoryBreakdown(transactions), [transactions]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <LineChartCard  data={monthly} />
      <DonutChartCard data={category} />
    </div>
  );
}

interface MonthlyData { month: string; income: number; expenses: number; balance: number; }

function LineChartCard({ data }: { data: MonthlyData[] }) {
  return (
    <div className="glass-card p-6" style={{ minHeight: 320 }}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.1em] mb-5"
          style={{ color: 'var(--accent-gold)' }}>Income vs Expenses</h3>
      {data.length === 0 ? <Empty /> : (
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,172,120,0.08)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--chart-axis)', fontSize: 11 }}
                     axisLine={{ stroke: 'rgba(196,172,120,0.1)' }} tickLine={false} />
              <YAxis tick={<CustomYAxisTick />} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(196,172,120,0.15)', strokeWidth: 1 }} />
              <Legend wrapperStyle={{ paddingTop: 14, fontSize: 12, color: 'rgba(224,212,188,0.65)' }} />
              <Line type="monotone" dataKey="income" name="Income" stroke={INCOME_LINE} strokeWidth={2.5}
                    dot={{ fill: INCOME_LINE, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: INCOME_LINE, stroke: '#0e0d0b', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke={EXPENSE_LINE} strokeWidth={2.5}
                    dot={{ fill: EXPENSE_LINE, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: EXPENSE_LINE, stroke: '#0e0d0b', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

interface CatData { category: string; amount: number; }

function DonutChartCard({ data }: { data: CatData[] }) {
  const [active, setActive] = useState<number | null>(null);
  const top8  = data.slice(0, 8);
  const total = top8.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="glass-card p-6" style={{ minHeight: 320 }}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.1em] mb-4"
          style={{ color: 'var(--accent-gold)' }}>Spending by Category</h3>
      {top8.length === 0 ? <Empty /> : (
        <>
          <div style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={top8} dataKey="amount" nameKey="category"
                     cx="50%" cy="50%" innerRadius={50} outerRadius={82}
                     paddingAngle={3} strokeWidth={0}
                     onMouseEnter={(_: unknown, i: number) => setActive(i)}
                     onMouseLeave={() => setActive(null)}>
                  {top8.map((_, i) => (
                    <Cell key={i} fill={PIE_PALETTE[i % PIE_PALETTE.length]}
                          opacity={active === null || active === i ? 1 : 0.4} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2 overflow-y-auto" style={{ maxHeight: 124 }}>
            {top8.map((item, i) => {
              const pct = total > 0 ? (item.amount / total) * 100 : 0;
              return (
                <div key={item.category}
                     className="flex items-center gap-2 text-xs cursor-default"
                     style={{ opacity: active === null || active === i ? 1 : 0.35, transition: 'opacity 0.2s' }}
                     onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                  {/* colour dot */}
                  <div className="shrink-0 w-2 h-2 rounded-full"
                       style={{ background: PIE_PALETTE[i % PIE_PALETTE.length] }} />
                  {/* category name — truncates if long */}
                  <span className="flex-1 min-w-0 truncate"
                        style={{ color: 'var(--text-secondary)' }}>{item.category}</span>
                  {/* amount — never shrinks */}
                  <CurrencyDisplay amount={item.amount} className="shrink-0 font-semibold" style={{ color: PIE_PALETTE[i % PIE_PALETTE.length] }} />
                  {/* percentage */}
                  <span className="shrink-0 w-8 text-right"
                        style={{ color: 'var(--text-muted)' }}>{pct.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Empty() {
  return (
    <div className="flex-1 flex items-center justify-center h-40">
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No data yet. Add transactions to see charts.</p>
    </div>
  );
}
