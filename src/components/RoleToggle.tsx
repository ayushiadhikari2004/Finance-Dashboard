import { CircleUser as UserCircle, Shield } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export function RoleToggle() {
  const { userRole, setUserRole } = useDashboard();

  const activeStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #C2A96A 0%, #D4B87A 100%)',
    color: '#0e0d0b',
    fontWeight: 600,
    boxShadow: '0 0 10px rgba(194,169,106,0.28)',
  };
  const inactiveStyle: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--toggle-text)',
    fontWeight: 400,
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] font-light tracking-widest uppercase hidden sm:block"
            style={{ color: 'var(--text-muted)' }}>Role</span>
      <div className="flex rounded-xl p-1 gap-1"
           style={{ background: 'var(--toggle-bg)', border: '1px solid var(--border-default)' }}>
        {(['viewer', 'admin'] as const).map((role) => (
          <button key={role} onClick={() => setUserRole(role)}
            className="px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 text-xs"
            style={userRole === role ? activeStyle : inactiveStyle}>
            {role === 'viewer' ? <UserCircle className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
            <span className="capitalize">{role}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
