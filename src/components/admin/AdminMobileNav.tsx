'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { href: '/admin/orders', label: 'Orders', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 5h18l-2 14H5L3 5z"/><path d="M8 9h8"/></svg> },
  { href: '/admin/print-queue', label: 'Print', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> },
  { href: '/admin/users', label: 'Users', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  { href: '/admin/analytics', label: 'Stats', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18M7 14l4-4 4 4 5-7"/></svg> },
  { href: '/admin/coupons', label: 'Coupons', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9a3 3 0 016 0v6a3 3 0 01-6 0V9zM15 9a3 3 0 016 0v6a3 3 0 01-6 0V9zM9 12h6"/></svg> },
  { href: '/admin/settings', label: 'Settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top bar - mobile only */}
      <header
        className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-50"
        style={{
          background: 'rgba(237,231,220,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '0.5px solid var(--border)',
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '18px',
            fontWeight: 300,
          }}
        >
          <span className="inline-block w-[5px] h-[5px] rounded-full mr-1" style={{ background: 'var(--brown)', transform: 'translateY(-2px)' }} />
          Pola<em>muse</em>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'var(--text-3)', marginLeft: '6px', letterSpacing: '.14em', textTransform: 'uppercase' as const, fontStyle: 'normal' }}>admin</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ background: menuOpen ? 'var(--brown)' : 'transparent', color: menuOpen ? '#fff' : 'var(--text)' }}
        >
          {menuOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          )}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-[52px] bottom-0 z-40 overflow-y-auto"
          style={{ background: 'var(--cream-deep)' }}
        >
          <nav className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                  style={{
                    fontSize: '14px',
                    color: active ? '#fff' : 'var(--text-2)',
                    background: active ? 'var(--brown)' : 'transparent',
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2"
              style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-2)', letterSpacing: '.1em', textTransform: 'uppercase' as const }}
            >
              Log out
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
