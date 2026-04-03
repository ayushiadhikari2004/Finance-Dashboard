import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Transaction } from '../types/database';
import type { UserRole, FilterState, SortState } from '../types';

interface DashboardContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  sort: SortState;
  setSort: (sort: SortState) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const STORAGE_KEY = 'finance_dashboard_transactions';

function loadLocal(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal(txns: Transaction[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
  } catch {
    // ignore quota errors
  }
}

function makeId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Use untyped client to bypass Supabase strict generics issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    category: '',
  });
  const [sort, setSort] = useState<SortState>({
    field: 'date',
    direction: 'desc',
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await db
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (!fetchError && data && data.length > 0) {
        // Merge remote data with local-only records
        const localOnly = loadLocal().filter((t: Transaction) => t.id.startsWith('local_'));
        const merged: Transaction[] = [...data, ...localOnly].sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(merged);
        saveLocal(merged);
      } else {
        const local = loadLocal();
        setTransactions(local);
      }
    } catch {
      const local = loadLocal();
      setTransactions(local);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (
    transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>
  ) => {
    // Always create locally first — UI is never blocked
    const localEntry: Transaction = {
      ...transaction,
      id: makeId(),
      created_at: new Date().toISOString(),
      user_id: null,
    };

    setTransactions((prev) => {
      const updated = [localEntry, ...prev].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      saveLocal(updated);
      return updated;
    });

    // Silently sync to Supabase
    try {
      const { data, error: insertError } = await db
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (!insertError && data) {
        // Replace temp local entry with the real Supabase record functionally
        setTransactions((prev) => {
          const synced = prev.map((t) => (t.id === localEntry.id ? data : t));
          saveLocal(synced);
          return synced;
        });
      }
    } catch {
      // Supabase unreachable — local entry persists
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const updated = transactions.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTransactions(updated);
    saveLocal(updated);

    if (!id.startsWith('local_')) {
      try {
        await db.from('transactions').update(updates).eq('id', id);
      } catch {
        // ignore
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveLocal(updated);

    if (!id.startsWith('local_')) {
      try {
        await db.from('transactions').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        transactions,
        loading,
        error,
        userRole,
        setUserRole,
        filters,
        setFilters,
        sort,
        setSort,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshTransactions: fetchTransactions,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
