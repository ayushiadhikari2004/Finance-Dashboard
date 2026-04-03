import { useState, useMemo } from 'react';
import { Plus, Gem, Sun, Moon } from 'lucide-react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { useTheme } from './context/ThemeContext';
import { SummaryCards } from './components/SummaryCards';
import { Charts } from './components/Charts';
import { TransactionsTable } from './components/TransactionsTable';
import { Insights } from './components/Insights';
import { RoleToggle } from './components/RoleToggle';
import { AddTransactionModal } from './components/AddTransactionModal';
import { ProfileModal, ProfileButton } from './components/ProfileModal';
import { useProfile } from './hooks/useProfile';
import { calculateTotals } from './utils/calculations';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function DashboardContent() {
  const { transactions, loading, error, userRole } = useDashboard();
  const { theme, toggleTheme } = useTheme();
  const { name, saveName } = useProfile();
  const [showAddModal,     setShowAddModal]     = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const totals = useMemo(() => calculateTotals(transactions), [transactions]);

  /* ── First-run: open profile if name is still default ── */
  const [prompted, setPrompted] = useState(false);
  if (!prompted && name === 'Alex') {
    // only auto-open once and only if no custom name saved
    try {
      if (!localStorage.getItem('dashboard_profile_name')) {
        // will be handled by the modal
      }
    } catch { /* ignore */ }
    setPrompted(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center fade-in">
          <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-3"
               style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
          <p className="text-sm font-light" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-8 text-center max-w-sm w-full slide-up">
          <p className="font-semibold mb-1" style={{ color: 'var(--expense-color)' }}>Error loading data</p>
          <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ── Sticky header ─────────────────────────────────── */}
      <header className="sticky top-0 z-40"
              style={{
                background: 'var(--header-bg)',
                borderBottom: '1px solid var(--border-default)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-wrap justify-between items-center gap-3">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                   style={{
                     background: 'linear-gradient(135deg, #C2A96A 0%, #D4B87A 100%)',
                     boxShadow: '0 0 14px rgba(194,169,106,0.3)',
                   }}>
                <Gem className="w-4 h-4" style={{ color: '#0e0d0b' }} />
              </div>
              <div>
                <h1 className="text-base font-semibold tracking-tight leading-none"
                    style={{ color: 'var(--text-primary)' }}>Finance Dashboard</h1>
                <p className="text-[10px] font-light tracking-[0.14em] uppercase mt-0.5"
                   style={{ color: 'var(--accent-gold)' }}></p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <RoleToggle />

              {/* Theme toggle */}
              <button onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: 'var(--toggle-bg)', border: '1px solid var(--border-default)', color: 'var(--text-muted)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent-gold)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Profile button */}
              <ProfileButton name={name} onClick={() => setShowProfileModal(true)} />

              {userRole === 'admin' && (
                <button onClick={() => setShowAddModal(true)}
                  className="gold-btn px-4 py-2 rounded-xl flex items-center gap-1.5 text-sm">
                  <Plus className="w-3.5 h-3.5" />
                  Add Transaction
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Personalised greeting */}
        <div className="mb-7 fade-in">
          <h2 className="text-2xl font-semibold leading-tight"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            {getGreeting()}, <span style={{ color: 'var(--accent-beige)' }}>{name}</span>.
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Track your income, expenses, and trends all in one place
          </p>
        </div>

        <div className="space-y-6">
          <section className="slide-up" style={{ animationDelay: '0ms' }}>
            <SummaryCards balance={totals.balance} income={totals.income} expenses={totals.expenses} />
          </section>

          <section className="slide-up" style={{ animationDelay: '60ms' }}>
            <Charts transactions={transactions} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 slide-up" style={{ animationDelay: '120ms' }}>
            <div className="lg:col-span-2"><TransactionsTable /></div>
            <div><Insights transactions={transactions} /></div>
          </section>
        </div>
      </main>

      {showAddModal     && <AddTransactionModal onClose={() => setShowAddModal(false)} />}
      {showProfileModal && (
        <ProfileModal name={name} onSave={saveName} onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
