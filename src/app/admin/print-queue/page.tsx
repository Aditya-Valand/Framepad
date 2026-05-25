'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell, PageHeader, Btn, Badge } from '@/components/admin';

interface QueueGroup {
  size_slug: string;
  size_name: string;
  finish_slug: string;
  finish_name: string;
  item_count: number;
  fits_per_sheet: number;
  columns: number;
  rows: number;
  sheets_needed: number;
  is_full: boolean;
  items: { order_item_id: string; design_snapshot_url: string; order_number: string; customer_name: string }[];
}

interface SheetItem {
  sheet_id: string;
  order_item_id: string;
  position: number;
  col: number;
  row: number;
  design_snapshot_url: string;
}

interface PrintSheet {
  id: string;
  sheet_number: string;
  status: string;
  capacity: number;
  items_count: number;
  is_full: boolean;
  sheet_url: string | null;
  generated_at: string | null;
  sent_to_shop_at: string | null;
  printed_at: string | null;
  print_shop_name: string | null;
  size_name: string;
  size_slug: string;
  finish_name: string;
  finish_slug: string;
  columns: number;
  rows: number;
  items: SheetItem[];
}

interface Stats {
  totalItems: number;
  totalSheetsNeeded: number;
  sheetsToday: number;
  groupCount: number;
}

interface GenerateResultSheet {
  sheetIndex: number;
  finish: string;
  itemCount: number;
  efficiency: number;
  sheetUrl: string;
  placedItems: { orderItemId: string; position: string }[];
}

interface GenerateResponse {
  sheetsCreated: number;
  itemsPlaced: number;
  areaSavedPct: number;
  sheets: GenerateResultSheet[];
  message: string;
}

export default function PrintQueuePage() {
  const [groups, setGroups] = useState<QueueGroup[]>([]);
  const [sheets, setSheets] = useState<PrintSheet[]>([]);
  const [stats, setStats] = useState<Stats>({ totalItems: 0, totalSheetsNeeded: 0, sheetsToday: 0, groupCount: 0 });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null); // key or 'all'
  const [markSent, setMarkSent] = useState<string | null>(null);
  const [shopName, setShopName] = useState('');
  const [lastResult, setLastResult] = useState<GenerateResponse | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/print-queue');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setGroups(json.groups || []);
      setSheets(json.sheets || []);
      setStats(json.stats || { totalItems: 0, totalSheetsNeeded: 0, sheetsToday: 0, groupCount: 0 });
    } catch (e) {
      console.error('Fetch queue error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const handleGenerateGroup = async (sizeSlug: string, finishSlug: string) => {
    const key = `${sizeSlug}_${finishSlug}`;
    setGenerating(key);
    setLastResult(null);
    try {
      const res = await fetch('/api/admin/print-sheets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finish: finishSlug }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const json = await res.json();
      setLastResult(json);
      await fetchQueue();
    } catch (e) {
      console.error('Generate error:', e);
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateAll = async () => {
    setGenerating('all');
    setLastResult(null);
    try {
      const res = await fetch('/api/admin/print-sheets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const json = await res.json();
      setLastResult(json);
      await fetchQueue();
    } catch (e) {
      console.error('Generate all error:', e);
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadSheet = (sheetId: string) => {
    window.open(`/api/admin/print-sheets/${sheetId}/download`, '_blank');
  };

  const handleMarkSent = async (sheetId: string) => {
    if (!shopName.trim()) return;
    try {
      const res = await fetch(`/api/admin/print-sheets/${sheetId}/sent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printShopName: shopName.trim() }),
      });
      if (!res.ok) throw new Error('Failed to mark sent');
      setMarkSent(null);
      setShopName('');
      await fetchQueue();
    } catch (e) {
      console.error('Mark sent error:', e);
    }
  };

  const handleMarkPrinted = async (sheetId: string) => {
    try {
      const res = await fetch(`/api/admin/print-sheets/${sheetId}/printed`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to mark printed');
      await fetchQueue();
    } catch (e) {
      console.error('Mark printed error:', e);
    }
  };

  const [regenerating, setRegenerating] = useState<string | null>(null);
  const handleRegenerate = async (sheetId: string) => {
    setRegenerating(sheetId);
    try {
      const res = await fetch(`/api/admin/print-sheets/${sheetId}/regenerate`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Regenerate failed');
      await fetchQueue();
    } catch (e) {
      console.error('Regenerate error:', e);
    } finally {
      setRegenerating(null);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <PageHeader title="Print Queue" subtitle="Loading..." />
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#A39080' }}>Loading print queue...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <PageHeader title="Print Queue" subtitle="Batch items into A4 sheets for the print shop.">
        <Btn variant="outline" onClick={() => { setLoading(true); fetchQueue(); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Refresh
        </Btn>
        <Btn variant="primary" onClick={handleGenerateAll} disabled={generating === 'all' || stats.totalItems === 0}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 5v14M5 12h14"/></svg>
          {generating === 'all' ? 'Generating…' : 'Generate all sheets'}
        </Btn>
      </PageHeader>

      {/* Stats */}
      <div className="queue-stats">
        {[
          { val: String(stats.totalItems), label: 'items waiting' },
          { val: String(stats.totalSheetsNeeded), label: 'sheets needed' },
          { val: String(stats.sheetsToday), label: 'sheets today' },
          { val: `${stats.groupCount}`, label: 'groups' },
        ].map((s) => (
          <div key={s.label} className="queue-stat">
            <strong>{s.val}</strong>{s.label}
          </div>
        ))}
      </div>

      {/* Generation Result Banner */}
      {lastResult && lastResult.sheetsCreated > 0 && (
        <div className="pq-result-banner">
          <div className="pq-result-head">
            <strong>✓ Generated {lastResult.sheetsCreated} sheet{lastResult.sheetsCreated > 1 ? 's' : ''}</strong>
            <span className="pq-result-meta">
              {lastResult.itemsPlaced} items packed · {lastResult.areaSavedPct}% paper saved (SFFD)
            </span>
            <Btn variant="outline" size="sm" onClick={() => setLastResult(null)}>✕</Btn>
          </div>
          <div className="pq-result-sheets">
            {lastResult.sheets.map((s) => (
              <div key={s.sheetIndex} className="pq-result-sheet">
                <span className="pq-result-idx">Sheet {s.sheetIndex + 1}</span>
                <Badge variant={s.finish === 'glossy' ? 'info' : 'brown'}>{s.finish}</Badge>
                <span>{s.itemCount} items</span>
                <span className="pq-result-eff">{s.efficiency}% filled</span>
                {s.sheetUrl && (
                  <a href={s.sheetUrl} target="_blank" rel="noopener noreferrer" className="pq-result-link">View PNG ↗</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue Groups */}
      {groups.length > 0 && (
        <>
          <div className="pq-section-head">
            <span>Print Queue — {stats.totalItems} items waiting</span>
            <span className="pq-section-tag">{stats.groupCount} group{stats.groupCount !== 1 ? 's' : ''}</span>
          </div>

          <div className="pq-groups">
            {groups.map((g) => {
              const key = `${g.size_slug}_${g.finish_slug}`;
              return (
                <div key={key} className="pq-group">
                  <div className="pq-group-head">
                    <div className="pq-group-title">
                      <span className="pq-dot" />
                      <em>{g.size_name}</em>
                      <span className="pq-finish">· {g.finish_name}</span>
                    </div>
                    <div className="pq-group-meta">
                      <span className="pq-count">{g.item_count}</span>
                      <span className="pq-count-sub">items · needs {g.sheets_needed} sheet{g.sheets_needed > 1 ? 's' : ''} of {g.fits_per_sheet}</span>
                    </div>
                  </div>

                  <div className="pq-thumbs">
                    {g.items.slice(0, 8).map((item, j) => (
                      <div key={j} className="pq-thumb">
                        <div className="pq-thumb-img" style={item.design_snapshot_url ? { backgroundImage: `url(${item.design_snapshot_url})`, backgroundSize: 'cover' } : undefined} />
                        <div className="pq-thumb-cap"><span>♡</span></div>
                      </div>
                    ))}
                    {g.item_count > 8 && <div className="pq-thumb-more">+{g.item_count - 8}</div>}
                  </div>

                  <div className="pq-group-foot">
                    <div className="pq-layout-info">
                      → <strong>{g.sheets_needed} sheet{g.sheets_needed > 1 ? 's' : ''}</strong> of {g.fits_per_sheet} ({g.columns}×{g.rows} layout)
                      {!g.is_full && <span className="pq-hold"> · {g.fits_per_sheet - g.item_count} slots empty — hold for more</span>}
                    </div>
                    <Btn
                      variant={g.is_full ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleGenerateGroup(g.size_slug, g.finish_slug)}
                      disabled={generating === key}
                    >
                      {generating === key ? 'Generating…' : `Generate ${g.sheets_needed > 1 ? 'sheets' : g.is_full ? 'sheet' : 'anyway'} →`}
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Generated Sheets */}
      {sheets.length > 0 && (
        <>
          <div className="pq-section-head" style={{ marginTop: '36px' }}>
            <span>Print Sheets</span>
            <span className="pq-section-tag">{sheets.length} sheet{sheets.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="pq-sheets">
            {sheets.map((sh) => (
              <div key={sh.id} className="pq-sheet">
                <div className="pq-sheet-head">
                  <div>
                    <div className="pq-sheet-id">{sh.sheet_number}</div>
                    <div className="pq-sheet-meta">{sh.size_name} · {sh.finish_name} · {sh.items_count} items</div>
                  </div>
                  <Badge variant={sh.status === 'sent' ? 'info' : sh.status === 'printed' ? 'good' : 'brown'}>
                    {sh.status === 'generated' ? 'Generated' : sh.status === 'sent' ? 'Sent to print' : sh.status === 'printed' ? 'Printed' : sh.status}
                  </Badge>
                </div>

                {sh.sheet_url ? (
                  <div className="pq-sheet-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sh.sheet_url} alt={`Sheet ${sh.sheet_number}`} style={{ width: '100%', borderRadius: '8px', border: '0.5px solid rgba(26,23,20,0.08)' }} />
                  </div>
                ) : (
                  <div className={`admin-a4 grid-${sh.columns}x${sh.rows}`}>
                    {Array.from({ length: sh.capacity }).map((_, i) => {
                      const item = sh.items.find((si) => si.position === i + 1);
                      return (
                        <div key={i} className="slot">
                          <div className="si" style={item?.design_snapshot_url ? { backgroundImage: `url(${item.design_snapshot_url})`, backgroundSize: 'cover' } : undefined} />
                          <div className="sc"><span>♡</span></div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {sh.print_shop_name && sh.sent_to_shop_at && (
                  <div className="pq-sent-info">↗ Sent to <strong>{sh.print_shop_name}</strong> · {new Date(sh.sent_to_shop_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                )}

                <div className="pq-sheet-actions">
                  <Btn variant="outline" size="sm" onClick={() => handleRegenerate(sh.id)} disabled={regenerating === sh.id}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15A9 9 0 115.64 5.64L1 10"/><polyline points="1 4 1 10 7 10"/></svg>
                    {regenerating === sh.id ? 'Regenerating…' : 'Regenerate'}
                  </Btn>
                  <Btn variant="outline" size="sm" onClick={() => handleDownloadSheet(sh.id)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Download PDF
                  </Btn>
                  {sh.status === 'generated' && (
                    <Btn variant="primary" size="sm" onClick={() => setMarkSent(sh.id)}>Mark sent →</Btn>
                  )}
                  {sh.status === 'sent' && (
                    <Btn variant="primary" size="sm" onClick={() => handleMarkPrinted(sh.id)}>Mark printed →</Btn>
                  )}
                </div>

                {markSent === sh.id && (
                  <div className="pq-mark-sent">
                    <input
                      type="text"
                      placeholder="Print shop name (e.g. Roy Photo, Bandra)"
                      className="input"
                      style={{ flex: '1' }}
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                    />
                    <Btn variant="primary" size="sm" onClick={() => handleMarkSent(sh.id)}>Confirm</Btn>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {groups.length === 0 && sheets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#A39080', fontSize: '14px' }}>
          No items in the print queue. Orders will appear here once confirmed.
        </div>
      )}
    </AdminShell>
  );
}
