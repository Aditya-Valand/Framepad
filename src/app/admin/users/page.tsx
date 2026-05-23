'use client';

import { useState } from 'react';
import { AdminShell, PageHeader, Btn, Card, Badge, PillRow, SlidePanel } from '@/components/admin';

const USERS = [
  { name: 'Priya Sharma',  email: 'priya.s@gmail.com',       city: 'Mumbai',    orders: 14, spent: '₹4,820', joined: 'Mar 12, 2024', status: 'Active' },
  { name: 'Rohan Kapoor',  email: 'rohan.k@hey.com',          city: 'Bengaluru', orders: 9,  spent: '₹3,290', joined: 'Jul 04, 2024', status: 'Active' },
  { name: 'Anika Reddy',   email: 'anika.r@gmail.com',        city: 'Hyderabad', orders: 22, spent: '₹8,140', joined: 'Jan 28, 2024', status: 'Active' },
  { name: 'Vikram Singh',  email: 'vik.singh@outlook.com',    city: 'Delhi',     orders: 3,  spent: '₹620',   joined: 'Feb 11, 2025', status: 'Active' },
  { name: 'Meera Iyer',    email: 'meera.iyer@gmail.com',     city: 'Chennai',   orders: 11, spent: '₹5,460', joined: 'Aug 19, 2024', status: 'Active' },
  { name: 'Kabir Joshi',   email: 'kabir.j@gmail.com',        city: 'Pune',      orders: 6,  spent: '₹1,840', joined: 'Nov 02, 2024', status: 'Active' },
  { name: 'Nisha Patel',   email: 'nisha.p@gmail.com',        city: 'Ahmedabad', orders: 4,  spent: '₹1,290', joined: 'Apr 22, 2025', status: 'Active' },
  { name: 'Sahil Bansal',  email: 'sahil.b@hey.com',          city: 'Delhi',     orders: 1,  spent: '₹79',    joined: 'May 14, 2025', status: 'Banned' },
  { name: 'Tanvi Sen',     email: 'tanvi.s@gmail.com',        city: 'Kolkata',   orders: 18, spent: '₹7,210', joined: 'Dec 09, 2023', status: 'Active' },
  { name: 'Devansh Roy',   email: 'dev.roy@gmail.com',        city: 'Bengaluru', orders: 7,  spent: '₹2,440', joined: 'Jun 14, 2024', status: 'Active' },
];

const FILTER_PILLS = [
  { label: 'All', count: 342 },
  { label: 'Active', count: 336 },
  { label: 'Banned', count: 6 },
];

export default function UsersPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof USERS[number] | null>(null);

  const filtered = USERS.filter((u) => {
    if (activeFilter === 1 && u.status !== 'Active') return false;
    if (activeFilter === 2 && u.status !== 'Banned') return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase()) &&
        !u.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminShell>
      <PageHeader title="Users" subtitle="342 total · 14 new this week · 6 banned">
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

      <PillRow items={FILTER_PILLS} active={activeFilter} onSelect={setActiveFilter} />

      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl" style={{ minWidth: '760px' }}>
            <thead>
              <tr>
                {['Customer', 'City', 'Orders', 'Spent', 'Joined', 'Status', ''].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.email} onClick={() => setSelectedUser(user)}>
                  <td>
                    <div className="who">
                      <div className="av">{user.name[0]}</div>
                      <div>
                        <div className="nm">{user.name}</div>
                        <div className="em">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="num">{user.city}</td>
                  <td className="num">{user.orders}</td>
                  <td className="amount">{user.spent}</td>
                  <td className="num">{user.joined}</td>
                  <td><Badge variant={user.status === 'Banned' ? 'bad' : 'good'}>{user.status}</Badge></td>
                  <td>
                    <button className="icon-btn">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <SlidePanel
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User detail"
        meta={selectedUser?.status === 'Banned' ? 'Banned' : 'Active member'}
        footer={
          <>
            <Btn variant="outline" onClick={() => setSelectedUser(null)}>Close</Btn>
            <Btn variant="primary">Edit user</Btn>
          </>
        }
      >
        {selectedUser && <UserDetail user={selectedUser} />}
      </SlidePanel>
    </AdminShell>
  );
}

function UserDetail({ user }: { user: typeof USERS[number] }) {
  const [showBan, setShowBan] = useState(false);

  const gradients = [
    'linear-gradient(135deg,#e8d5c0,#c4a882)',
    'linear-gradient(135deg,#c8d4f0,#a0b4e0)',
    'linear-gradient(160deg,#c8b8a0,#8b7060)',
    'linear-gradient(135deg,#f0c8a0,#d0a070)',
    'linear-gradient(135deg,#d4c0e8,#b0a0d0)',
    'linear-gradient(135deg,#a8c8a0,#78a870)',
  ];
  const caps = ['always you', 'besties', 'golden', '3 years', 'summer', 'goa'];

  return (
    <>
      <div className="user-hero">
        <div className="user-avatar">{user.name[0]}</div>
        <div>
          <div className="user-name">{user.name}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>

      <div className="user-facts">
        {[
          { lbl: 'Phone',      val: '+91 98201 22345' },
          { lbl: 'City',       val: user.city },
          { lbl: 'Joined',     val: user.joined },
          { lbl: 'Last login', val: '2 hours ago' },
        ].map((f) => (
          <div key={f.lbl} className="fact-item">
            <div className="fact-label">{f.lbl}</div>
            <div className="fact-val">{f.val}</div>
          </div>
        ))}
      </div>

      <div className="user-stats">
        {[
          { lbl: 'Designs', val: '38' },
          { lbl: 'Orders',  val: String(user.orders) },
          { lbl: 'Spent',   val: user.spent },
        ].map((s) => (
          <div key={s.lbl} className="user-stat-item">
            <div className="user-stat-label">{s.lbl}</div>
            <div className="user-stat-val">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="user-section">
        <div className="user-section-head">
          <span>Recent orders</span>
          <a href="/admin/orders">All →</a>
        </div>
        {[
          { id: '#PM-2026-00342', badge: 'good' as const, status: 'Confirmed', amt: '₹79'  },
          { id: '#PM-2026-00298', badge: 'good' as const, status: 'Delivered', amt: '₹349' },
          { id: '#PM-2026-00271', badge: 'good' as const, status: 'Delivered', amt: '₹79'  },
          { id: '#PM-2026-00244', badge: 'good' as const, status: 'Delivered', amt: '₹590' },
          { id: '#PM-2026-00219', badge: 'good' as const, status: 'Delivered', amt: '₹79'  },
        ].map((o) => (
          <div key={o.id} className="order-mini">
            <span className="order-mini-id">{o.id}</span>
            <Badge variant={o.badge}>{o.status}</Badge>
            <span className="order-mini-amt">{o.amt}</span>
          </div>
        ))}
      </div>

      <div className="user-section">
        <div className="user-section-head">
          <span>Recent designs</span>
          <span>Last 6</span>
        </div>
        <div className="design-grid">
          {gradients.map((g, i) => (
            <div key={i} className="design-thumb">
              <div className="design-img" style={{ background: g }} />
              <div className="design-cap"><span>{caps[i]}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="user-ban">
        <Btn variant="danger" onClick={() => setShowBan(!showBan)}>Ban this user</Btn>
        {showBan && (
          <div className="ban-form">
            <div className="field-group">
              <label>Reason for ban</label>
              <textarea placeholder="e.g. Repeated chargebacks · Abusive content uploads · Spam orders" />
            </div>
            <div className="ban-actions">
              <Btn variant="ghost" size="sm" onClick={() => setShowBan(false)}>Cancel</Btn>
              <Btn variant="danger" size="sm">Confirm ban</Btn>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
