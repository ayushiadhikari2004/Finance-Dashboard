export type UserRole = 'viewer' | 'admin';

export type TransactionType = 'income' | 'expense';

export interface FilterState {
  search: string;
  type: TransactionType | 'all';
  category: string;
}

export type SortField = 'date' | 'amount';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}
