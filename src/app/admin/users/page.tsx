'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell, PageHeader, Btn, Card, Badge, PillRow, SlidePanel } from '@/components/admin';

interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  banned_at: string | null;
  last_login_at: string | null;
  created_at: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  total_designs: number | null;
  total_orders: number | null;
  total_spent_paise: number | null;
}

interface UserDetail {
  user: User;
  orders: { id: string; order_number: string; status: string; total_paise: number; created_at: string }[];
  designs: { id: string; title: string | null; thumbnail_url: string | null; status: string; created_at: string }[];
  stats: { designCount: number; orderCount: number; totalSpentPaise: number };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, banned: 0 });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (activeFilter === 1) params.set('banned', 'false');
      if (activeFilter === 2) params.set('banned', 'true');
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setUsers(json.users || []);
      setCounts(json.counts || { total: 0, active: 0, banned: 0 });
    } catch (e) {
      console.error('Fetch users error:', e);
    } finally {
      setLoading(false);
    }
  }, [search, activeFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filterPills = [
    { label: 'All', count: counts.total },
    { label: 'Active', count: counts.active },
    { label: 'Banned', count: counts.banned },
  ];

  const formatPaise = (paise: number | null) => {
    if (!paise) return '₹0';
    return `₹${(paise / 100).toLocaleString('en-IN')}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminShell>
      <PageHeader title="Users" subtitle={`${counts.total} total · ${counts.banned} banned`}>
        <Btn variant="outline">Export CSV</Btn>
      </PageHeader>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' as const }}>
        <input
          type="search"
          placeholder="Search by name, email or city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input search"
          style={{ flex: '1', minWidth: '240px', maxWidth: '380px' }}
        />
      </div>

      <PillRow items={filterPills} active={activeFilter} onSelect={setActiveFilter} />

      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#A39080' }}>Loading users...</div>
          ) : (
            <table className="tbl" style={{ minWidth: '760px' }}>
              <thead>
                <tr>
                  {['Customer', 'City', 'Orders', 'Spent', 'Joined', 'Status', ''].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} onClick={() => setSelectedUserId(user.id)}>
                    <td>
                      <div className="who">
                        <div className="av">{(user.full_name || user.email)[0].toUpperCase()}</div>
                        <div>
                          <div className="nm">{user.full_name || 'No name'}</div>
                          <div className="em">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="num">{user.city || '—'}</td>
                    <td className="num">{user.total_orders || 0}</td>
                    <td className="amount">{formatPaise(user.total_spent_paise)}</td>
                    <td className="num">{formatDate(user.created_at)}</td>
                    <td><Badge variant={user.is_banned ? 'bad' : 'good'}>{user.is_banned ? 'Banned' : 'Active'}</Badge></td>
                    <td>
                      <button className="icon-btn">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#A39080' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <SlidePanel
        open={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        title="User detail"
        meta=""
      >
        {selectedUserId && <UserDetailPanel userId={selectedUserId} onUpdate={fetchUsers} onClose={() => setSelectedUserId(null)} />}
      </SlidePanel>
    </AdminShell>
  );
}

function UserDetailPanel({ userId, onUpdate, onClose }: { userId: string; onUpdate: () => void; onClose: () => void }) {
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBan, setShowBan] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banning, setBanning] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users/${userId}`)
      .then((r) => r.json())
      .then((json) => setDetail(json))
      .catch((e) => console.error('Fetch user detail error:', e))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleBan = async () => {
    if (!banReason.trim()) return;
    setBanning(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: banReason }),
      });
      if (!res.ok) throw new Error('Ban failed');
      setShowBan(false);
      setBanReason('');
      onUpdate();
      onClose();
    } catch (e) {
      console.error('Ban error:', e);
    } finally {
      setBanning(false);
    }
  };

  const handleUnban = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/unban`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Unban failed');
      onUpdate();
      onClose();
    } catch (e) {
      console.error('Unban error:', e);
    }
  };

  if (loading || !detail) {
    return <div style={{ padding: '30px', textAlign: 'center', color: '#A39080' }}>Loading...</div>;
  }

  const { user, orders, designs, stats } = detail;

  const formatPaise = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;
  const formatDate = (date: string | null) => date ? new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const timeAgo = (date: string | null) => {
    if (!date) return 'Never';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <>
      <div className="user-hero">
        <div className="user-avatar">{(user.full_name || user.email)[0].toUpperCase()}</div>
        <div>
          <div className="user-name">{user.full_name || 'No name'}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>

      <div className="user-facts">
        {[
          { lbl: 'Phone', val: user.phone || '—' },
          { lbl: 'City', val: user.city || '—' },
          { lbl: 'Joined', val: formatDate(user.created_at) },
          { lbl: 'Last login', val: timeAgo(user.last_login_at) },
        ].map((f) => (
          <div key={f.lbl} className="fact-item">
            <div className="fact-label">{f.lbl}</div>
            <div className="fact-val">{f.val}</div>
          </div>
        ))}
      </div>

      <div className="user-stats">
        {[
          { lbl: 'Designs', val: String(stats.designCount) },
          { lbl: 'Orders', val: String(stats.orderCount) },
          { lbl: 'Spent', val: formatPaise(stats.totalSpentPaise) },
        ].map((s) => (
          <div key={s.lbl} className="user-stat-item">
            <div className="user-stat-label">{s.lbl}</div>
            <div className="user-stat-val">{s.val}</div>
          </div>
        ))}
      </div>

      {orders.length > 0 && (
        <div className="user-section">
          <div className="user-section-head">
            <span>Recent orders</span>
            <a href="/admin/orders">All →</a>
          </div>
          {orders.map((o) => (
            <div key={o.id} className="order-mini">
              <span className="order-mini-id">#{o.order_number}</span>
              <Badge variant={o.status === 'cancelled' ? 'bad' : o.status === 'delivered' ? 'good' : 'info'}>{o.status}</Badge>
              <span className="order-mini-amt">{formatPaise(o.total_paise)}</span>
            </div>
          ))}
        </div>
      )}

      {designs.length > 0 && (
        <div className="user-section">
          <div className="user-section-head">
            <span>Recent designs</span>
            <span>Last {designs.length}</span>
          </div>
          <div className="design-grid">
            {designs.map((d) => (
              <div key={d.id} className="design-thumb">
                <div className="design-img" style={d.thumbnail_url ? { backgroundImage: `url(${d.thumbnail_url})`, backgroundSize: 'cover' } : { background: 'linear-gradient(135deg,#e8d5c0,#c4a882)' }} />
                <div className="design-cap"><span>{d.title || 'untitled'}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="user-ban">
        {user.is_banned ? (
          <>
            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(220,50,50,0.06)', border: '.5px solid rgba(220,50,50,0.15)', marginBottom: '12px', fontSize: '13px', color: '#8b3030' }}>
              <strong>Banned</strong> — {user.ban_reason || 'No reason provided'}
              {user.banned_at && <div style={{ marginTop: '4px', opacity: 0.7 }}>Since {formatDate(user.banned_at)}</div>}
            </div>
            <Btn variant="outline" onClick={handleUnban}>Unban this user</Btn>
          </>
        ) : (
          <>
            <Btn variant="danger" onClick={() => setShowBan(!showBan)}>Ban this user</Btn>
            {showBan && (
              <div className="ban-form">
                <div className="field-group">
                  <label>Reason for ban</label>
                  <textarea
                    placeholder="e.g. Repeated chargebacks · Abusive content uploads · Spam orders"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                  />
                </div>
                <div className="ban-actions">
                  <Btn variant="ghost" size="sm" onClick={() => setShowBan(false)}>Cancel</Btn>
                  <Btn variant="danger" size="sm" onClick={handleBan} disabled={banning || !banReason.trim()}>
                    {banning ? 'Banning…' : 'Confirm ban'}
                  </Btn>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
