export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          date: string;
          amount: number;
          category: string;
          type: 'income' | 'expense';
          description: string;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          date?: string;
          amount: number;
          category: string;
          type: 'income' | 'expense';
          description: string;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          amount?: number;
          category?: string;
          type?: 'income' | 'expense';
          description?: string;
          user_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Transaction = Database['public']['Tables']['transactions']['Row'];
