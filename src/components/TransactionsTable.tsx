import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUp, ArrowDown, ArrowUpDown, Pencil, Trash2, X } from 'lucide-react';
import type { Transaction } from '../types/database';
import { useDashboard } from '../context/DashboardContext';
import { filterTransactions, sortTransactions, getUniqueCategories, formatDate } from '../utils/calculations';
import { CurrencyCell } from './CurrencyDisplay';
import { EditTransactionModal } from './EditTransactionModal';

export function TransactionsTable() {
  const { transactions, filters, setFilters, sort, setSort, userRole, deleteTransaction } = useDashboard();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => getUniqueCategories(transactions), [transactions]);
  const rows = useMemo(
    () => sortTransactions(filterTransactions(transactions, filters), sort),
    [transactions, filters, sort]
  );

  const toggleSort = (field: 'date' | 'amount') => {
    if (sort.field === field) setSort({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    else setSort({ field, direction: 'desc' });
  };

  const SortIcon = ({ field }: { field: 'date' | 'amount' }) => {
    if (sort.field !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sort.direction === 'asc'
      ? <ArrowUp   className="w-3 h-3" style={{ color: 'var(--accent-gold)' }} />
      : <ArrowDown className="w-3 h-3" style={{ color: 'var(--accent-gold)' }} />;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this transaction?')) {
      try { await deleteTransaction(id); } catch (err) { alert(String(err)); }
    }
  };

  const clearFilters = () => setFilters({ search: '', type: 'all', category: '' });
  const activeFilters = filters.search || filters.type !== 'all' || filters.category;

  const thStyle: React.CSSProperties = {
    color: 'var(--table-header)',
    fontSize: '0.66rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent-gold)', letterSpacing: '0.09em' }}>Transactions</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search…" value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="dark-input w-full sm:w-48 pl-9 pr-3 py-2 rounded-xl text-xs" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 rounded-xl transition-all duration-200 flex items-center"
            style={showFilters || activeFilters
              ? { background: 'linear-gradient(135deg, #C8B48A, #D4B870)', color: '#121212', boxShadow: '0 0 10px rgba(200,180,138,0.25)' }
              : { background: 'var(--toggle-bg)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-5 p-4 rounded-xl fade-in"
             style={{ background: 'rgba(200,184,140,0.04)', border: '1px solid rgba(200,184,140,0.12)' }}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[130px]">
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select value={filters.type}
                onChange={e => setFilters({ ...filters, type: e.target.value as 'all' | 'income' | 'expense' })}
                className="dark-input w-full px-3 py-2 rounded-xl text-xs">
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="flex-1 min-w-[130px]">
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Category</label>
              <select value={filters.category}
                onChange={e => setFilters({ ...filters, category: e.target.value })}
                className="dark-input w-full px-3 py-2 rounded-xl text-xs">
                <option value="">All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {activeFilters && (
            <button onClick={clearFilters} className="mt-2 text-xs flex items-center gap-1"
              style={{ color: 'var(--accent-gold)' }}>
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              <th onClick={() => toggleSort('date')} className="text-left py-3 px-2 cursor-pointer select-none" style={thStyle}>
                <div className="flex items-center gap-1">Date <SortIcon field="date" /></div>
              </th>
              <th className="text-left py-3 px-2" style={thStyle}>Description</th>
              <th className="text-left py-3 px-2 hidden sm:table-cell" style={thStyle}>Category</th>
              <th className="text-left py-3 px-2" style={thStyle}>Type</th>
              <th onClick={() => toggleSort('amount')} className="text-right py-3 px-2 cursor-pointer select-none" style={thStyle}>
                <div className="flex items-center justify-end gap-1">Amount <SortIcon field="amount" /></div>
              </th>
              {userRole === 'admin' && <th className="py-3 px-2" style={thStyle} />}
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={t.id} className="group transition-colors stagger-row"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', animationDelay: `${i * 28}ms` }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,184,140,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="py-3 px-2 text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(t.date)}</td>
                <td className="py-3 px-2 text-sm max-w-[150px] truncate" style={{ color: 'var(--text-primary)' }}>{t.description}</td>
                <td className="py-3 px-2 hidden sm:table-cell">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs"
                        style={{ background: 'rgba(200,184,140,0.08)', color: 'var(--text-secondary)', border: '1px solid rgba(200,184,140,0.12)' }}>
                    {t.category}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                        style={t.type === 'income'
                          ? { background: 'rgba(74,222,128,0.1)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)' }
                          : { background: 'rgba(220,38,38,0.1)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.2)' }}>
                    {t.type}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <CurrencyCell amount={Number(t.amount)} type={t.type} />
                </td>
                {userRole === 'admin' && (
                  <td className="py-3 px-2">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingTransaction(t)}
                        className="p-1.5 rounded-lg" style={{ color: 'var(--accent-gold)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,180,138,0.12)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg" style={{ color: '#DC2626' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.12)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-10">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No transactions found</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {activeFilters ? 'Try clearing the filters' : 'Add a transaction to get started'}
          </p>
        </div>
      )}

      {editingTransaction && (
        <EditTransactionModal transaction={editingTransaction} onClose={() => setEditingTransaction(null)} />
      )}
    </div>
  );
}
