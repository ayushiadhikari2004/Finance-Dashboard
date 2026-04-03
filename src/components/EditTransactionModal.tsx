import { useState } from 'react';
import { X } from 'lucide-react';
import type { Transaction } from '../types/database';
import { useDashboard } from '../context/DashboardContext';

interface EditTransactionModalProps { transaction: Transaction; onClose: () => void; }

export function EditTransactionModal({ transaction, onClose }: EditTransactionModalProps) {
  const { updateTransaction } = useDashboard();
  const [formData, setFormData] = useState({
    date: transaction.date, amount: transaction.amount.toString(),
    category: transaction.category, type: transaction.type, description: transaction.description,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTransaction(transaction.id, {
        date: formData.date, amount: parseFloat(formData.amount),
        category: formData.category, type: formData.type, description: formData.description,
      });
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update transaction');
    } finally { setLoading(false); }
  };

  const label: React.CSSProperties = {
    color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem',
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 fade-in"
         style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <div className="rounded-2xl w-full max-w-md modal-enter"
           style={{
             background: 'var(--modal-bg)',
             border: '1px solid rgba(212,175,55,0.2)',
             boxShadow: '0 0 40px rgba(212,175,55,0.08), var(--shadow-deep)',
           }}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4"
             style={{ borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Edit Transaction</h2>
          <button onClick={onClose} className="p-2 rounded-xl transition-all" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label style={label}>Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required className="dark-input w-full px-3 py-2.5 rounded-xl text-sm" /></div>
          <div><label style={label}>Amount (₹)</label>
            <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required className="dark-input w-full px-3 py-2.5 rounded-xl text-sm" /></div>
          <div><label style={label}>Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              required className="dark-input w-full px-3 py-2.5 rounded-xl text-sm">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select></div>
          <div><label style={label}>Category</label>
            <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required className="dark-input w-full px-3 py-2.5 rounded-xl text-sm" /></div>
          <div><label style={label}>Description</label>
            <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required className="dark-input w-full px-3 py-2.5 rounded-xl text-sm" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', background: 'transparent' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="gold-btn flex-1 px-4 py-2.5 rounded-xl text-sm disabled:opacity-50">
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
