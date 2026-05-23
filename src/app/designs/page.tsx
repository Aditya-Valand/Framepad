'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';

type Status = 'Draft' | 'Exported' | 'Ordered';

const DESIGNS = [
  {
    id: '1',  name: 'Always you',             caption: 'always you',   sub: '26 · 04 · 2025',
    status: 'Draft' as Status,    date: 'Today, 14:32',
    dark: false, taped: false, gradient: 'linear-gradient(135deg,#e8d5c0,#c4a882)',
  },
  {
    id: '2',  name: 'A polaroid from Amalfi', caption: 'amalfi',       sub: '29 · 04 · 2026',
    status: 'Ordered' as Status,  date: 'Apr 29, 2026',
    dark: false, taped: false, gradient: 'linear-gradient(135deg,#a8c8a0,#78a870)',
  },
  {
    id: '3',  name: 'Besties forever',        caption: 'besties',      sub: 'since day one',
    status: 'Exported' as Status, date: 'May 18, 2026',
    dark: false, taped: false, gradient: 'linear-gradient(135deg,#c8d4f0,#a0b4e0)',
  },
  {
    id: '4',  name: 'Three years (set)',      caption: '3 years ✦',   sub: '12 · 04 · 2026',
    status: 'Ordered' as Status,  date: 'Apr 12, 2026',
    dark: false, taped: true,  gradient: 'linear-gradient(135deg,#f0c8a0,#d0a070)',
  },
  {
    id: '5',  name: '',                       caption: 'memory',       sub: '04 · 05 · 2026',
    status: 'Exported' as Status, date: 'May 04, 2026',
    dark: true,  taped: false, gradient: 'linear-gradient(135deg,#c9d6df,#e0e8f0)',
  },
  {
    id: '6',  name: "Summer '24 series",     caption: "summer '24",   sub: 'vintage 600',
    status: 'Ordered' as Status,  date: 'Mar 14, 2026',
    dark: false, taped: false, gradient: 'linear-gradient(135deg,#c8b8a0,#8b7060)',
  },
  {
    id: '7',  name: 'We made it',            caption: 'we made it',   sub: '02 · 04 · 2026',
    status: 'Exported' as Status, date: 'Apr 02, 2026',
    dark: false, taped: false, gradient: 'linear-gradient(135deg,#d4c0e8,#b0a0d0)',
  },
  {
    id: '8',  name: '',                       caption: 'home',         sub: 'just because',
    status: 'Draft' as Status,    date: 'Yesterday',
    dark: false, taped: false, gradient: 'linear-gradient(135deg,#f0d0c0,#d0a090)',
  },
  {
    id: '9',  name: 'Just because',          caption: 'just because', sub: '04 · 02 · 2026',
    status: 'Exported' as Status, date: 'Feb 04, 2026',
    dark: false, taped: false, gradient: 'linear-gradient(135deg,#f0e8c0,#d0c890)',
  },
  {
    id: '10', name: 'Goa, January',          caption: 'goa',          sub: 'jan · 2026',
    status: 'Ordered' as Status,  date: 'Jan 28, 2026',
    dark: false, taped: false, gradient: 'linear-gradient(135deg,#e0ceb8,#b89878)',
  },
  {
    id: '11', name: 'First day of school',   caption: 'first day',    sub: 'b&w · 600',
    status: 'Exported' as Status, date: 'Dec 10, 2025',
    dark: false, taped: false, gradient: 'linear-gradient(135deg,#555,#1a1a1a)',
  },
  {
    id: '12', name: 'Always you (v2)',        caption: 'always you',   sub: '23 · 05 · 2026',
    status: 'Draft' as Status,    date: '23 May · 09:41',
    dark: false, taped: true,  gradient: 'linear-gradient(135deg,#f8e8d4,#d4b896)',
  },
];

const STATUS_BADGE: Record<Status, 'good' | 'brown' | 'muted'> = {
  Draft: 'muted', Exported: 'good', Ordered: 'brown',
};

const PILLS: { label: string; filter: 'all' | Status }[] = [
  { label: 'All',      filter: 'all'      },
  { label: 'Draft',    filter: 'Draft'    },
  { label: 'Exported', filter: 'Exported' },
  { label: 'Ordered',  filter: 'Ordered'  },
];

const COUNTS: Record<string, number> = {
  all: 38, Draft: 4, Exported: 22, Ordered: 12,
};

export default function DesignsPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | Status>('all');
  const [sort, setSort] = useState('Recently edited');

  const filtered = activeFilter === 'all'
    ? DESIGNS
    : DESIGNS.filter((d) => d.status === activeFilter);

  return (
    <>
      {/* Nav */}
      <Navbar />

      {/* Main */}
      <main className="dp-page">
        <div className="dp-head">
          <div>
            <h1>My Designs</h1>
            <p className="sub">38 designs · 12 printed · 4 drafts saved</p>
          </div>
          <div className="dp-head-actions">
            <Link href="/editor" className="dp-btn primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>
              New Design
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="dp-controls">
          <div className="dp-pills">
            {PILLS.map((p) => (
              <button
                key={p.filter}
                className={`dp-pill${activeFilter === p.filter ? ' active' : ''}`}
                onClick={() => setActiveFilter(p.filter)}
              >
                {p.label}
                <span className="cnt">{COUNTS[p.filter]}</span>
              </button>
            ))}
          </div>
          <select className="dp-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Recently edited</option>
            <option>Newest first</option>
            <option>Oldest first</option>
            <option>By template</option>
          </select>
        </div>

        {/* Grid */}
        <div className="dp-grid">
          {/* "New design" card — always first */}
          {activeFilter === 'all' && (
            <Link href="/editor" className="dp-card new">
              <div className="pola">
                <div className="new-lbl">Start a new one</div>
                <div className="new-desc">Upload a photo, choose a frame, write a caption</div>
              </div>
            </Link>
          )}

          {filtered.map((d) => (
            <DesignCard key={d.id} design={d} />
          ))}
        </div>

        {/* Empty state when a filter matches nothing */}
        {filtered.length === 0 && (
          <div className="dp-empty">
            <div className="dp-empty-frame">
              <div className="ph">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ color: '#B5A99E', opacity: .5 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="fc">your first one</div>
            </div>
            <h2>Nothing here <em>yet.</em></h2>
            <p>Every polaroid starts with a moment worth keeping. Pick a photo, choose a frame, write the caption only you would write.</p>
            <Link href="/editor" className="dp-btn primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>
              Make your first Polaroid →
            </Link>
          </div>
        )}
      </main>
    </>
  );
}

type Design = typeof DESIGNS[number];

function DesignCard({ design: d }: { design: Design }) {
  const cls = ['dp-card', d.dark ? 'dark' : '', d.taped ? 'taped' : ''].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      {/* Hover buttons */}
      <div className="card-acts">
        <button className="ic-btn" onClick={(e) => e.stopPropagation()} title="Open in editor">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className="ic-btn del" onClick={(e) => e.stopPropagation()} title="Delete">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </button>
      </div>

      {/* Polaroid */}
      <div className="pola">
        <div className="img" style={{ background: d.gradient }} />
        <div className="cap">
          <div className="ttl">{d.caption}</div>
          <div className="sub">{d.sub}</div>
        </div>
      </div>

      {/* Meta */}
      <div className="dp-meta">
        <div className={`nm${!d.name ? ' untitled' : ''}`}>
          {d.name || 'Untitled'}
        </div>
        <div className="row">
          <span className={`dp-badge ${STATUS_BADGE[d.status]}`}>{d.status}</span>
          <span>{d.date}</span>
        </div>
      </div>
    </div>
  );
}
