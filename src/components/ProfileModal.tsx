import { useState, useEffect } from 'react';
import { User, X, Check, LogOut } from 'lucide-react';

interface ProfileModalProps {
  name: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

const AVATAR_COLORS = [
  ['#C2A96A', '#D4B87A'],
  ['#4ADE80', '#22C55E'],
  ['#60A5FA', '#3B82F6'],
  ['#F472B6', '#EC4899'],
  ['#A78BFA', '#8B5CF6'],
];

function getColorForName(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function ProfileModal({ name, onSave, onClose }: ProfileModalProps) {
  const [input, setInput] = useState(name);
  const colors = getColorForName(input || 'A');
  const initial = (input || 'U')[0].toUpperCase();

  const handleSave = () => {
    const trimmed = input.trim();
    if (trimmed) { onSave(trimmed); onClose(); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 fade-in"
         style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
      <div className="rounded-2xl w-full max-w-sm modal-enter"
           style={{
             background: 'var(--modal-bg)',
             border: '1px solid var(--border-gold)',
             boxShadow: '0 0 40px rgba(196,172,120,0.1), var(--shadow-deep)',
           }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4"
             style={{ borderBottom: '1px solid var(--border-default)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Your Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center pt-7 pb-5 px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg"
               style={{
                 background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
                 color: '#0e0d0b',
                 boxShadow: `0 0 24px ${colors[0]}40`,
               }}>
            {initial}
          </div>
          <p className="text-xs font-light mb-6" style={{ color: 'var(--text-muted)' }}>
            Your name appears in the dashboard greeting
          </p>

          {/* Name input */}
          <div className="w-full space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                     style={{ color: 'var(--text-muted)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="Enter your name…"
                maxLength={32}
                className="dark-input w-full px-4 py-2.5 rounded-xl text-sm"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                style={{ border: '1px solid var(--border-default)', color: 'var(--text-secondary)', background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={!input.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 gold-btn disabled:opacity-40">
                <Check className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-6 pb-5">
          <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
           
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Avatar button used in the header ─────────────────── */
interface ProfileButtonProps {
  name: string;
  onClick: () => void;
}

export function ProfileButton({ name, onClick }: ProfileButtonProps) {
  const colors = getColorForName(name || 'A');
  const initial = (name || 'U')[0].toUpperCase();

  return (
    <button onClick={onClick}
      className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-all duration-200"
      style={{ border: '1px solid var(--border-default)', background: 'var(--toggle-bg)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-gold)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'; }}
      title="View profile">
      {/* Avatar circle */}
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
           style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`, color: '#0e0d0b' }}>
        {initial}
      </div>
      <span className="text-xs font-medium hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
        {name || 'Set name'}
      </span>
    </button>
  );
}
