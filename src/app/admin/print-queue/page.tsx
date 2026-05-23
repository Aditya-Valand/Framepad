'use client';

import { useState } from 'react';
import { AdminShell, PageHeader, Btn, Badge } from '@/components/admin';

const GROUPS = [
  { name: 'Classic Polaroid', finish: 'Glossy', items: 12, sheets: 2, layout: '2×3', capacity: 6, full: true },
  { name: 'Instax Mini',      finish: 'Glossy', items: 9,  sheets: 1, layout: '3×3', capacity: 9, full: true },
  { name: 'Classic Polaroid', finish: 'Matte',  items: 2,  sheets: 1, layout: '2×3', capacity: 6, full: false },
];

const SHEETS = [
  { id: 'PSH-2026-00012', meta: 'Classic · Glossy · 6 items',    status: 'Generated',     grid: 'grid-2x3', slots: 6, sentTo: null },
  { id: 'PSH-2026-00011', meta: 'Instax Mini · Glossy · 9 items', status: 'Sent to print', grid: 'grid-3x3', slots: 9, sentTo: 'Roy Photo, Bandra' },
];

export default function PrintQueuePage() {
  const [markSent, setMarkSent] = useState<string | null>(null);

  return (
    <AdminShell>
      <PageHeader title="Print Queue" subtitle="Batch items into A4 sheets for the print shop.">
        <Btn variant="outline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Refresh
        </Btn>
        <Btn variant="primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 5v14M5 12h14"/></svg>
          Generate all sheets
        </Btn>
      </PageHeader>

      {/* Stats */}
      <div className="queue-stats">
        {[
          { val: '23',   label: 'items waiting' },
          { val: '4',    label: 'sheets needed' },
          { val: '2',    label: 'sheets today' },
          { val: '~38m', label: 'time saved by batching' },
        ].map((s) => (
          <div key={s.label} className="queue-stat">
            <strong>{s.val}</strong>{s.label}
          </div>
        ))}
      </div>

      {/* Queue Groups */}
      <div className="pq-section-head">
        <span>Print Queue — 23 items waiting</span>
        <span className="pq-section-tag">3 groups</span>
      </div>

      <div className="pq-groups">
        {GROUPS.map((g, i) => (
          <div key={i} className="pq-group">
            <div className="pq-group-head">
              <div className="pq-group-title">
                <span className="pq-dot" />
                <em>{g.name}</em>
                <span className="pq-finish">· {g.finish}</span>
              </div>
              <div className="pq-group-meta">
                <span className="pq-count">{g.items}</span>
                <span className="pq-count-sub">items · needs {g.sheets} sheet{g.sheets > 1 ? 's' : ''} of {g.capacity}</span>
              </div>
            </div>

            <div className="pq-thumbs">
              {Array.from({ length: Math.min(g.items, 8) }).map((_, j) => (
                <div key={j} className="pq-thumb">
                  <div className="pq-thumb-img" />
                  <div className="pq-thumb-cap"><span>♡</span></div>
                </div>
              ))}
              {g.items > 8 && <div className="pq-thumb-more">+{g.items - 8}</div>}
            </div>

            <div className="pq-group-foot">
              <div className="pq-layout-info">
                → <strong>{g.sheets} sheet{g.sheets > 1 ? 's' : ''}</strong> of {g.capacity} ({g.layout} layout)
                {!g.full && <span className="pq-hold"> · 4 slots empty — hold for more</span>}
              </div>
              <Btn variant={g.full ? 'primary' : 'outline'} size="sm">
                Generate {g.sheets > 1 ? 'sheets' : g.full ? 'sheet' : 'anyway'} →
              </Btn>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Sheets */}
      <div className="pq-section-head" style={{ marginTop: '36px' }}>
        <span>Print Sheets</span>
        <span className="pq-section-tag">Today&apos;s batch</span>
      </div>

      <div className="pq-sheets">
        {SHEETS.map((sh) => (
          <div key={sh.id} className="pq-sheet">
            <div className="pq-sheet-head">
              <div>
                <div className="pq-sheet-id">{sh.id}</div>
                <div className="pq-sheet-meta">{sh.meta}</div>
              </div>
              <Badge variant={sh.sentTo ? 'info' : 'brown'}>{sh.status}</Badge>
            </div>

            <div className={`admin-a4 ${sh.grid}`}>
              {Array.from({ length: sh.slots }).map((_, i) => (
                <div key={i} className="slot">
                  <div className="si" />
                  <div className="sc"><span>♡</span></div>
                </div>
              ))}
            </div>

            {sh.sentTo && (
              <div className="pq-sent-info">↗ Sent to <strong>{sh.sentTo}</strong> · 13:02</div>
            )}

            <div className="pq-sheet-actions">
              <Btn variant="outline" size="sm">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Download PDF
              </Btn>
              {!sh.sentTo ? (
                <Btn variant="primary" size="sm" onClick={() => setMarkSent(sh.id)}>Mark sent →</Btn>
              ) : (
                <Btn variant="primary" size="sm">Mark printed →</Btn>
              )}
            </div>

            {markSent === sh.id && (
              <div className="pq-mark-sent">
                <input
                  type="text"
                  placeholder="Print shop name (e.g. Roy Photo, Bandra)"
                  className="input"
                  style={{ flex: '1' }}
                />
                <Btn variant="primary" size="sm" onClick={() => setMarkSent(null)}>Confirm</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
