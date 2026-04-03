import type { Transaction } from '../types/database';
import type { FilterState, SortState } from '../types';

export function calculateTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expenses;

  return { income, expenses, balance };
}

export function getCategoryBreakdown(transactions: Transaction[]) {
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  return Object.entries(expensesByCategory)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function getMonthlyTrend(transactions: Transaction[]) {
  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      acc[month].income += Number(t.amount);
    } else {
      acc[month].expenses += Number(t.amount);
    }
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      balance: data.income - data.expenses,
    }))
    .reverse()
    .slice(0, 6)
    .reverse();
}

export function filterTransactions(transactions: Transaction[], filters: FilterState) {
  return transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.category.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType = filters.type === 'all' || t.type === filters.type;
    const matchesCategory = !filters.category || t.category === filters.category;

    return matchesSearch && matchesType && matchesCategory;
  });
}

export function sortTransactions(transactions: Transaction[], sort: SortState) {
  return [...transactions].sort((a, b) => {
    const aVal = sort.field === 'date' ? new Date(a.date).getTime() : Number(a.amount);
    const bVal = sort.field === 'date' ? new Date(b.date).getTime() : Number(b.amount);

    return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });
}

export function getUniqueCategories(transactions: Transaction[]) {
  return Array.from(new Set(transactions.map((t) => t.category))).sort();
}

export function formatCurrency(amount: number) {
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  // Use a regular space — visible gap, no Unicode overlap issues
  return `₹ ${formatted}`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
