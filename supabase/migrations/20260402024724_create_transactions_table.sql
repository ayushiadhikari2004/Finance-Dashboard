/*
  # Finance Dashboard Schema

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `date` (date) - transaction date
      - `amount` (decimal) - transaction amount
      - `category` (text) - spending/income category
      - `type` (text) - 'income' or 'expense'
      - `description` (text) - transaction description
      - `created_at` (timestamptz) - record creation timestamp
      - `user_id` (uuid) - for future auth integration

  2. Security
    - Enable RLS on `transactions` table
    - Add policy for public read access (demo purposes)
    - Add policy for authenticated insert/update/delete

  3. Sample Data
    - Insert demo transactions for dashboard visualization
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  amount decimal(10, 2) NOT NULL,
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  description text NOT NULL,
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON transactions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated insert"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO transactions (date, amount, category, type, description) VALUES
  ('2026-03-15', 5000.00, 'Salary', 'income', 'Monthly salary payment'),
  ('2026-03-14', 1200.00, 'Freelance', 'income', 'Website development project'),
  ('2026-03-13', 450.00, 'Food', 'expense', 'Grocery shopping'),
  ('2026-03-12', 80.00, 'Transportation', 'expense', 'Gas and parking'),
  ('2026-03-11', 150.00, 'Entertainment', 'expense', 'Movie and dinner'),
  ('2026-03-10', 2000.00, 'Housing', 'expense', 'Monthly rent payment'),
  ('2026-03-09', 200.00, 'Utilities', 'expense', 'Electricity and water bill'),
  ('2026-03-08', 500.00, 'Investment', 'income', 'Dividend payment'),
  ('2026-03-07', 120.00, 'Shopping', 'expense', 'Clothing purchase'),
  ('2026-03-06', 60.00, 'Food', 'expense', 'Restaurant dinner'),
  ('2026-03-05', 300.00, 'Healthcare', 'expense', 'Medical checkup'),
  ('2026-03-04', 95.00, 'Transportation', 'expense', 'Monthly metro pass'),
  ('2026-03-03', 180.00, 'Entertainment', 'expense', 'Concert tickets'),
  ('2026-03-02', 75.00, 'Food', 'expense', 'Weekly groceries'),
  ('2026-03-01', 3000.00, 'Freelance', 'income', 'Consulting project'),
  ('2026-02-28', 400.00, 'Food', 'expense', 'Monthly groceries'),
  ('2026-02-27', 250.00, 'Shopping', 'expense', 'Electronics purchase'),
  ('2026-02-26', 5000.00, 'Salary', 'income', 'Monthly salary payment'),
  ('2026-02-25', 100.00, 'Entertainment', 'expense', 'Streaming subscriptions'),
  ('2026-02-24', 2000.00, 'Housing', 'expense', 'Monthly rent payment'),
  ('2026-02-23', 180.00, 'Utilities', 'expense', 'Internet and phone bill'),
  ('2026-02-22', 90.00, 'Transportation', 'expense', 'Taxi and rideshare'),
  ('2026-02-21', 350.00, 'Food', 'expense', 'Grocery shopping'),
  ('2026-02-20', 800.00, 'Investment', 'income', 'Stock dividends'),
  ('2026-02-19', 150.00, 'Healthcare', 'expense', 'Pharmacy and medicine'),
  ('2026-01-15', 5000.00, 'Salary', 'income', 'Monthly salary payment'),
  ('2026-01-14', 2000.00, 'Housing', 'expense', 'Monthly rent payment'),
  ('2026-01-13', 500.00, 'Food', 'expense', 'Monthly groceries'),
  ('2026-01-12', 1500.00, 'Freelance', 'income', 'Design project'),
  ('2026-01-11', 200.00, 'Entertainment', 'expense', 'Weekend activities');

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);