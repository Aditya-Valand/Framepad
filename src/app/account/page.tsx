'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';

interface Profile {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  totalDesigns: number;
  totalOrders: number;
  totalSpentPaise: number;
  emailMarketing: boolean;
  preferredFinish: string;
}

// ── Icons ──────────────────────────────────────────────────────────────────
const EditorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const DesignsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const OrdersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h14M5 8a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v0a2 2 0 01-2 2M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

// ── Input field ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, readOnly, type = 'text', placeholder }: {
  label: string; value: string; onChange?: (v: string) => void;
  readOnly?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: "'DM Mono', monospace",
        fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase' as const,
        color: '#A39080', marginBottom: 7,
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 10,
          border: readOnly ? '0.5px solid rgba(26,23,20,0.07)' : '0.5px solid rgba(26,23,20,0.14)',
          background: readOnly ? 'rgba(26,23,20,0.025)' : 'rgba(255,255,255,0.85)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, color: readOnly ? '#A39080' : '#1A1714',
          outline: 'none', cursor: readOnly ? 'default' : 'text',
          transition: 'border .15s, box-shadow .15s',
          boxSizing: 'border-box' as const,
        }}
        onFocus={(e) => {
          if (!readOnly) {
            e.currentTarget.style.border = '1px solid rgba(139,99,71,0.55)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,99,71,0.08)';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = readOnly ? '0.5px solid rgba(26,23,20,0.07)' : '0.5px solid rgba(26,23,20,0.14)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

// ── Action card ────────────────────────────────────────────────────────────
function ActionCard({ href, icon, label, sub }: { href: string; icon: React.ReactNode; label: string; sub: string }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: '18px 18px 16px', borderRadius: 14, textDecoration: 'none',
        border: hov ? '0.5px solid rgba(139,99,71,0.22)' : '0.5px solid rgba(26,23,20,0.07)',
        background: hov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
        boxShadow: hov ? '0 4px 20px rgba(26,23,20,0.08), 0 1px 4px rgba(26,23,20,0.04)' : '0 1px 3px rgba(26,23,20,0.04)',
        transform: hov ? 'translateY(-2px)' : 'none',
        transition: 'all 0.22s cubic-bezier(0.34,1.3,0.64,1)',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: hov ? 'rgba(139,99,71,0.1)' : 'rgba(139,99,71,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#8B6347', transition: 'background .2s',
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A1714', marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, color: '#A39080', letterSpacing: '.04em' }}>{sub}</div>
      </div>
    </Link>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');

  useEffect(() => {
    async function load() {
      try {
        let r = await fetch('/api/account/profile', { credentials: 'include' });
        if (r.status === 401) {
          const refresh = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
          if (!refresh.ok) { router.push('/auth?redirect=/account'); return; }
          r = await fetch('/api/account/profile', { credentials: 'include' });
        }
        if (r.status === 401) { router.push('/auth?redirect=/account'); return; }
        if (!r.ok) return;
        const data: Profile = await r.json();
        setProfile(data);
        setFullName(data.fullName ?? '');
        setPhone(data.phone ?? '');
        setCity(data.city ?? '');
        setStateVal(data.state ?? '');
      } catch {
        router.push('/auth?redirect=/account');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName: fullName || undefined, phone: phone || undefined, city: city || undefined, state: stateVal || undefined }),
      });
      if (res.ok) {
        setSaveMsg('Saved!');
        setProfile((p) => p ? { ...p, fullName, phone, city, state: stateVal } : p);
        setTimeout(() => setSaveMsg(''), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  }

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : profile?.email?.[0]?.toUpperCase() ?? '?';

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#EDE6DC 0%,#DDD4C8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 28, height: 28, border: '2px solid rgba(139,99,71,0.2)', borderTopColor: '#8B6347', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!profile) return null;

  const spentFormatted = profile.totalSpentPaise > 0
    ? `₹${(profile.totalSpentPaise / 100).toFixed(0)}`
    : '₹0';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#EDE6DC 0%,#DDD4C8 100%)', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Sticky nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 32px',
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(237,230,220,0.88)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid rgba(26,23,20,0.07)',
      }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/designs" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#5C4A3A',
            textDecoration: 'none', padding: '7px 14px', borderRadius: 8,
            border: '0.5px solid rgba(26,23,20,0.1)',
            background: 'rgba(255,255,255,0.5)',
            transition: 'background .14s',
          }}>
            My Designs
          </Link>
          <Link href="/editor" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
            color: '#fff', textDecoration: 'none',
            padding: '7px 16px', borderRadius: 8,
            background: 'linear-gradient(135deg,#9B7B68,#8B6347)',
            boxShadow: '0 2px 8px rgba(139,99,71,0.22)',
          }}>
            Editor →
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '36px 20px 100px' }}>

        {/* ── HERO CARD — dark, cinematic ── */}
        <div style={{
          borderRadius: 22, overflow: 'hidden',
          background: 'linear-gradient(145deg,#1A1714 0%,#2C2218 60%,#3A2A1A 100%)',
          border: '0.5px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 40px rgba(26,23,20,0.22), 0 2px 8px rgba(26,23,20,0.14)',
          marginBottom: 20,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle glow */}
          <div aria-hidden style={{
            position: 'absolute', top: -60, right: -60,
            width: 240, height: 240,
            background: 'radial-gradient(circle, rgba(139,99,71,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Content */}
          <div style={{ padding: '36px 32px 28px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22 }}>

              {/* Monogram */}
              <div style={{
                flexShrink: 0,
                width: 72, height: 72, borderRadius: 18,
                background: 'linear-gradient(135deg,rgba(139,99,71,0.4),rgba(90,60,35,0.6))',
                border: '0.5px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 30, fontWeight: 300, fontStyle: 'italic',
                  color: 'rgba(242,237,228,0.92)',
                  letterSpacing: '-.02em',
                }}>
                  {initials}
                </span>
              </div>

              {/* Name + meta */}
              <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28, fontWeight: 300, fontStyle: 'italic',
                  color: 'rgba(242,237,228,0.95)', margin: '0 0 5px',
                  letterSpacing: '-.01em', lineHeight: 1.1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                }}>
                  {profile.fullName ?? profile.email.split('@')[0]}
                </h1>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10.5, letterSpacing: '.06em',
                  color: 'rgba(242,237,228,0.35)', margin: '0 0 12px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                }}>
                  {profile.email}
                </p>

                {/* Badges row */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase' as const,
                    color: 'rgba(242,237,228,0.35)',
                    padding: '3px 10px', borderRadius: 100,
                    border: '0.5px solid rgba(242,237,228,0.1)',
                    whiteSpace: 'nowrap' as const,
                  }}>
                    since {joinedDate}
                  </span>
                  {profile.role === 'admin' && (
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase' as const,
                      color: '#C4A882',
                      padding: '3px 10px', borderRadius: 100,
                      background: 'rgba(196,168,130,0.1)',
                      border: '0.5px solid rgba(196,168,130,0.2)',
                    }}>
                      ✦ Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row inside hero */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: 1, marginTop: 28,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 12, overflow: 'hidden',
              border: '0.5px solid rgba(255,255,255,0.07)',
            }}>
              {[
                { value: profile.totalDesigns, label: 'Designs' },
                { value: profile.totalOrders, label: 'Orders' },
                { value: spentFormatted, label: 'Spent' },
              ].map((s, i) => (
                <div key={s.label} style={{
                  padding: '16px 0', textAlign: 'center',
                  borderLeft: i > 0 ? '0.5px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 26, fontWeight: 300, lineHeight: 1,
                    color: 'rgba(242,237,228,0.9)',
                    marginBottom: 5,
                  }}>
                    {s.value}
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase' as const,
                    color: 'rgba(242,237,228,0.3)',
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 20 }} className="actions-grid">
          <ActionCard href="/editor"  icon={<EditorIcon />}  label="Editor"    sub="Open studio" />
          <ActionCard href="/designs" icon={<DesignsIcon />} label="Designs"   sub="My gallery"  />
          <ActionCard href="/order"   icon={<OrdersIcon />}  label="Order"     sub="Print photos" />
          <ActionCard href="/"        icon={<HomeIcon />}    label="Home"      sub="Landing page" />
        </div>

        {/* ── EDIT PROFILE ── */}
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          background: 'rgba(255,252,248,0.9)',
          border: '0.5px solid rgba(26,23,20,0.07)',
          boxShadow: '0 2px 8px rgba(26,23,20,0.04), 0 8px 32px rgba(26,23,20,0.05)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          marginBottom: 12,
        }}>
          {/* Section label */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '0.5px solid rgba(26,23,20,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase' as const,
              color: '#A39080',
            }}>
              Profile
            </span>
            {saveMsg && (
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, color: '#8B6347', letterSpacing: '.06em',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSave} style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="form-grid">
                <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Your name" />
                <Field label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="+91 98765 43210" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="form-grid">
                <Field label="City" value={city} onChange={setCity} placeholder="Mumbai" />
                <Field label="State" value={stateVal} onChange={setStateVal} placeholder="Maharashtra" />
              </div>
            </div>

            <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: saving ? 'rgba(139,99,71,0.45)' : 'linear-gradient(135deg,#9B7B68,#8B6347)',
                  color: '#fff', border: 'none', borderRadius: 10,
                  padding: '11px 22px',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: saving ? 'none' : '0 2px 10px rgba(139,99,71,0.25)',
                  transition: 'all .18s ease',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={(e) => { if (!saving) e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,99,71,0.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = saving ? 'none' : '0 2px 10px rgba(139,99,71,0.25)'; }}
              >
                {saving && (
                  <div style={{ width: 13, height: 13, border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                )}
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>

        {/* ── ACCOUNT (read-only) ── */}
        <div style={{
          borderRadius: 18,
          background: 'rgba(255,252,248,0.9)',
          border: '0.5px solid rgba(26,23,20,0.07)',
          boxShadow: '0 2px 8px rgba(26,23,20,0.04)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          marginBottom: 12, overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(26,23,20,0.06)' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase' as const, color: '#A39080' }}>
              Account
            </span>
          </div>
          <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Email" value={profile.email} readOnly />
            <Field label="Role" value={profile.role === 'admin' ? 'Administrator' : 'Customer'} readOnly />
          </div>
        </div>

        {/* ── SIGN OUT ── */}
        <div style={{
          borderRadius: 18,
          background: 'rgba(255,252,248,0.9)',
          border: '0.5px solid rgba(26,23,20,0.07)',
          boxShadow: '0 2px 8px rgba(26,23,20,0.04)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 24px', borderBottom: '0.5px solid rgba(26,23,20,0.06)' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase' as const, color: '#A39080' }}>
              Session
            </span>
          </div>
          <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#A39080', margin: 0, lineHeight: 1.5 }}>
              Signing out ends your session on this device.
            </p>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                flexShrink: 0,
                background: 'transparent', color: '#C0604A',
                border: '0.5px solid rgba(192,96,74,0.3)',
                borderRadius: 10, padding: '10px 20px',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                cursor: loggingOut ? 'not-allowed' : 'pointer',
                opacity: loggingOut ? 0.5 : 1,
                transition: 'background .15s, border .15s',
                display: 'flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap' as const,
              }}
              onMouseEnter={(e) => { if (!loggingOut) { e.currentTarget.style.background = 'rgba(192,96,74,0.06)'; e.currentTarget.style.border = '0.5px solid rgba(192,96,74,0.45)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.border = '0.5px solid rgba(192,96,74,0.3)'; }}
            >
              {loggingOut ? (
                <>
                  <div style={{ width: 12, height: 12, border: '1.5px solid rgba(192,96,74,0.3)', borderTopColor: '#C0604A', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                  Signing out…
                </>
              ) : 'Sign out'}
            </button>
          </div>
        </div>

      </main>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .actions-grid { grid-template-columns: 1fr 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          nav { padding: 0 16px !important; }
          main { padding-top: 24px !important; }
        }
        @media (max-width: 380px) {
          .actions-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }
      `}</style>
    </div>
  );
}
