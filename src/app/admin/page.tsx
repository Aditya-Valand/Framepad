'use client';

import Link from 'next/link';
import { AdminShell, PageHeader, StatCard, Card, CardHeader, Badge, Btn, Sparkline } from '@/components/admin';

const RECENT_ORDERS = [
  { init: 'P', name: 'Priya Sharma',  id: '#PM-2026-00342', badge: 'good'  as const, badgeText: 'Confirmed', desc: 'Single · Glossy',       amt: '₹79',  when: '2 min ago'  },
  { init: 'R', name: 'Rohan Kapoor',  id: '#PM-2026-00341', badge: 'warn'  as const, badgeText: 'Pending',   desc: 'Pack of 10 · Matte',   amt: '₹590', when: '14 min ago' },
  { init: 'A', name: 'Anika Reddy',   id: '#PM-2026-00340', badge: 'brown' as const, badgeText: 'Printing',  desc: 'Pack of 5 · Glossy',   amt: '₹349', when: '42 min ago' },
  { init: 'V', name: 'Vikram Singh',  id: '#PM-2026-00339', badge: 'info'  as const, badgeText: 'Shipped',   desc: 'Single · Glossy',       amt: '₹79',  when: '1 hr ago'   },
  { init: 'M', name: 'Meera Iyer',    id: '#PM-2026-00338', badge: 'good'  as const, badgeText: 'Delivered', desc: 'Pack of 20 · Matte',   amt: '₹999', when: '2 hr ago'   },
  { init: 'K', name: 'Kabir Joshi',   id: '#PM-2026-00337', badge: 'good'  as const, badgeText: 'Confirmed', desc: 'Single · Glossy',       amt: '₹79',  when: '3 hr ago'   },
  { init: 'N', name: 'Nisha Patel',   id: '#PM-2026-00336', badge: 'brown' as const, badgeText: 'Printing',  desc: 'Pack of 5 · Matte',    amt: '₹349', when: '4 hr ago'   },
  { init: 'S', name: 'Sahil Bansal',  id: '#PM-2026-00335', badge: 'bad'   as const, badgeText: 'Cancelled', desc: 'Single · Glossy',       amt: '₹79',  when: '5 hr ago'   },
];

const TOP_TEMPLATES = [
  { name: 'Classic Polaroid', pct: 38, width: '78%' },
  { name: 'Instax Mini',      pct: 18, width: '42%' },
  { name: 'Vintage 600',      pct: 14, width: '32%' },
  { name: 'Movie Poster',     pct: 11, width: '24%' },
  { name: 'Instax Square',    pct: 8,  width: '18%' },
];

export default function AdminDashboard() {
  return (
    <AdminShell>
      <PageHeader title="Good morning, Aanya." subtitle="Saturday, 23 May 2026 · Here's how Polamuse is doing today.">
        <Btn variant="outline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Export
        </Btn>
        <Btn variant="primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 5v14M5 12h14"/></svg>
          New coupon
        </Btn>
      </PageHeader>

      {/* Stats */}
      <div className="stat-row">
        <StatCard label="Today's revenue" value="₹12,400" delta="▲ 18.2% vs yesterday" deltaType="up" spark={<Sparkline points="0,22 10,18 20,20 30,14 40,16 50,10 60,12 70,6 80,8" />} />
        <StatCard label="New orders"      value="8"       delta="▲ 2 vs yesterday"      deltaType="up" spark={<Sparkline points="0,18 10,22 20,16 30,20 40,12 50,18 60,14 70,10 80,12" />} />
        <StatCard label="Pending prints"  value="23"      delta="Action needed · 4 sheets" alert />
        <StatCard label="Total users"     value="342"     delta="▲ 14 this week"         deltaType="up" spark={<Sparkline points="0,28 10,26 20,24 30,22 40,20 50,18 60,14 70,10 80,6" />} />
      </div>

      {/* Two column */}
      <div className="two-col">
        {/* Recent Orders */}
        <Card>
          <CardHeader title="Recent orders" action="View all →" actionHref="/admin/orders" />
          {RECENT_ORDERS.map((o) => (
            <div key={o.id} className="recent-row">
              <div className="av">{o.init}</div>
              <div className="info">
                <div className="top">
                  <span className="nm">{o.name}</span>
                  <span className="ord">{o.id}</span>
                </div>
                <div className="bot">
                  <Badge variant={o.badge}>{o.badgeText}</Badge>
                  <span>{o.desc}</span>
                </div>
              </div>
              <div className="amt">
                {o.amt}
                <span className="when">{o.when}</span>
              </div>
            </div>
          ))}
        </Card>

        {/* Right column */}
        <div>
          {/* Print queue alert */}
          <div className="alert-card">
            <div className="hd">
              <div className="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
              </div>
              <div className="ttl">23 items waiting to print</div>
            </div>
            <p>4 sheets needed across 3 size + finish groups. Batching cuts setup time by ~40%.</p>
            <Link href="/admin/print-queue">
              <Btn variant="primary">Go to Print Queue →</Btn>
            </Link>
          </div>

          {/* Top templates */}
          <Card>
            <CardHeader title="Top templates this week" action="7 days" />
            {TOP_TEMPLATES.map((t) => (
              <div key={t.name} className="bar-row">
                <div className="lbl">{t.name}</div>
                <div className="track"><div className="fill" style={{ width: t.width }} /></div>
                <div className="pct">{t.pct}%</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
