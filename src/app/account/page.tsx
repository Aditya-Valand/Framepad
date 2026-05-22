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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 24px', flex: 1 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: '#1A1714', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#A39080', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 6 }}>
        {label}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#FFFCF8', borderRadius: 16, border: '0.5px solid rgba(26,23,20,0.08)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 24px', borderBottom: '0.5px solid rgba(26,23,20,0.06)', background: 'rgba(26,23,20,0.02)' }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, color: '#8B6F5C', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, readOnly, type = 'text', placeholder }: {
  label: string; value: string; onChange?: (v: string) => void;
  readOnly?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, color: '#A39080', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '11px 14px',
          borderRadius: 10,
          border: '0.5px solid rgba(26,23,20,0.14)',
          background: readOnly ? 'rgba(26,23,20,0.03)' : '#FFFFFF',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: readOnly ? '#8A7870' : '#3A2E28',
          outline: 'none',
          boxSizing: 'border-box' as const,
          cursor: readOnly ? 'default' : 'text',
          transition: 'border-color .15s ease, box-shadow .15s ease',
        }}
        onFocus={(e) => { if (!readOnly) e.currentTarget.style.borderColor = '#8B6F5C'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,111,92,0.1)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(26,23,20,0.14)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');

  useEffect(() => {
    async function load() {
      try {
        let r = await fetch('/api/account/profile', { credentials: 'include' });

        if (r.status === 401) {
          // Try silent token refresh
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
      <div style={{ minHeight: '100vh', background: '#EDE6DC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(139,111,92,0.2)', borderTopColor: '#8B6F5C', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#EDE6DC', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(237,230,220,0.92)', backdropFilter: 'blur(14px)',
        borderBottom: '0.5px solid rgba(26,23,20,0.08)',
      }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#8A7870', textDecoration: 'none' }}>
            ← Home
          </Link>
          <Link
            href="/editor"
            style={{ background: '#8B6F5C', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, padding: '8px 18px', borderRadius: 100, textDecoration: 'none', letterSpacing: '.01em' }}
          >
            Open Editor →
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Avatar + name header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B6F5C, #6B4F3A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 20px rgba(139,111,92,0.3)',
            fontSize: 28, fontWeight: 600, color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {initials}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, fontStyle: 'italic', color: '#1A1714', margin: '0 0 6px', letterSpacing: '-.01em' }}>
            {profile.fullName ?? profile.email.split('@')[0]}
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#A39080', letterSpacing: '.06em', margin: 0 }}>
            Member since {joinedDate}
          </p>
          {profile.role === 'admin' && (
            <span style={{ display: 'inline-block', marginTop: 8, padding: '3px 10px', borderRadius: 100, background: 'rgba(139,111,92,0.12)', fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#8B6F5C', letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Admin
            </span>
          )}
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          background: '#FFFCF8',
          borderRadius: 16,
          border: '0.5px solid rgba(26,23,20,0.08)',
          marginBottom: 24,
          overflow: 'hidden',
        }}>
          <Stat label="Designs" value={profile.totalDesigns} />
          <div style={{ width: '0.5px', background: 'rgba(26,23,20,0.08)', alignSelf: 'stretch' }} />
          <Stat label="Orders" value={profile.totalOrders} />
          <div style={{ width: '0.5px', background: 'rgba(26,23,20,0.08)', alignSelf: 'stretch' }} />
          <Stat label="Spent" value={profile.totalSpentPaise > 0 ? `₹${(profile.totalSpentPaise / 100).toFixed(0)}` : '₹0'} />
        </div>

        {/* Edit profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Section title="Account">
            <Field label="Email" value={profile.email} readOnly />
            <Field label="Role" value={profile.role === 'admin' ? 'Administrator' : 'Customer'} readOnly />
          </Section>

          <Section title="Profile">
            <form onSubmit={handleSave}>
              <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Your name" />
              <Field label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="+91 98765 43210" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <Field label="City" value={city} onChange={setCity} placeholder="Mumbai" />
                </div>
                <div>
                  <Field label="State" value={stateVal} onChange={setStateVal} placeholder="Maharashtra" />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: '#8B6F5C', color: '#fff', border: 'none', borderRadius: 100,
                    padding: '10px 24px', fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                    fontWeight: 500, cursor: 'pointer', opacity: saving ? 0.7 : 1,
                    transition: 'opacity .2s',
                  }}
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                {saveMsg && (
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#8B6F5C', letterSpacing: '.06em' }}>
                    ✓ {saveMsg}
                  </span>
                )}
              </div>
            </form>
          </Section>

          {/* Quick actions */}
          <Section title="Quick actions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                href="/editor"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 12,
                  border: '0.5px solid rgba(26,23,20,0.1)',
                  background: 'rgba(26,23,20,0.02)',
                  textDecoration: 'none', color: '#1A1714',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  transition: 'background .15s ease',
                }}
              >
                <span>Open Editor</span>
                <span style={{ color: '#A39080' }}>→</span>
              </Link>
              <Link
                href="/"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 12,
                  border: '0.5px solid rgba(26,23,20,0.1)',
                  background: 'rgba(26,23,20,0.02)',
                  textDecoration: 'none', color: '#1A1714',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  transition: 'background .15s ease',
                }}
              >
                <span>Browse templates</span>
                <span style={{ color: '#A39080' }}>→</span>
              </Link>
            </div>
          </Section>

          {/* Sign out */}
          <Section title="Session">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#8A7870', marginBottom: 16, lineHeight: 1.6 }}>
              Signing out will end your current session on this device.
            </p>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                background: 'transparent', color: '#C05A3A',
                border: '0.5px solid rgba(192,90,58,0.35)',
                borderRadius: 100, padding: '10px 24px',
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                fontWeight: 500, cursor: 'pointer',
                opacity: loggingOut ? 0.6 : 1,
                transition: 'opacity .2s, background .15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(192,90,58,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </Section>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          nav { padding: 12px 16px !important; }
        }
      `}</style>
    </div>
  );
}
