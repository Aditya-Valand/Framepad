'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { DesignPreview } from '@/components/DesignPreview';
import { ConfirmModal } from '@/components/ConfirmModal';
import type { FrameData } from '@/store';

interface Design {
  id: string;
  title: string;
  thumbnail_url: string | null;
  canvas_state: { version: number; frameData: Record<string, unknown> } | null;
  frame_style: string;
  frame_color: string;
  template_id: string | null;
  status: string;
  has_caption: boolean;
  has_spotify_code: boolean;
  filter_preset: string;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const STATUS_BADGE: Record<string, string> = {
  draft: 'muted',
  exported: 'good',
  ordered: 'brown',
};

const PILLS = [
  { label: 'All', filter: 'all' },
  { label: 'Draft', filter: 'draft' },
  { label: 'Exported', filter: 'exported' },
  { label: 'Ordered', filter: 'ordered' },
];

export default function DesignsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [fetching, setFetching] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchDesigns = useCallback(async (page = 1) => {
    setFetching(true);
    try {
      const res = await fetch(`/api/designs?page=${page}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setDesigns(data.designs);
        setPagination(data.pagination);
      }
    } catch {
      // Silent
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/auth?redirect=/designs');
      return;
    }
    fetchDesigns();
  }, [user, authLoading, router, fetchDesigns]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/designs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDesigns((prev) => prev.filter((d) => d.id !== id));
    }
    setDeleteTarget(null);
  };

  const filtered = activeFilter === 'all'
    ? designs
    : designs.filter((d) => d.status === activeFilter);

  const counts = {
    all: designs.length,
    draft: designs.filter((d) => d.status === 'draft').length,
    exported: designs.filter((d) => d.status === 'exported').length,
    ordered: designs.filter((d) => d.status === 'ordered').length,
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE6DC' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B6F5C] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="dp-page">
        <div className="dp-head">
          <div>
            <h1>My Designs</h1>
            <p className="sub">
              {pagination ? `${pagination.total} design${pagination.total !== 1 ? 's' : ''}` : '...'}
            </p>
          </div>
          <div className="dp-head-actions">
            {selectMode ? (
              <>
                <span style={{ fontSize: 13, color: '#5C4A3A', fontWeight: 500 }}>
                  {selected.size} selected
                </span>
                <button
                  className="dp-btn"
                  onClick={() => { setSelectMode(false); setSelected(new Set()); }}
                >
                  Cancel
                </button>
                {selected.size > 0 && (
                  <Link
                    href={`/order?ids=${Array.from(selected).join(',')}`}
                    className="dp-btn primary"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    Order {selected.size} print{selected.size > 1 ? 's' : ''}
                  </Link>
                )}
              </>
            ) : (
              <>
                <button className="dp-btn" onClick={() => setSelectMode(true)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  Select &amp; Order
                </button>
                <Link href="/editor" className="dp-btn primary">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>
                  New Design
                </Link>
              </>
            )}
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
                <span className="cnt">{counts[p.filter as keyof typeof counts]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {fetching && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B6F5C] border-t-transparent" />
          </div>
        )}

        {/* Grid */}
        {!fetching && (
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
              <DesignCard
                key={d.id}
                design={d}
                onDelete={(id) => setDeleteTarget(id)}
                selectMode={selectMode}
                isSelected={selected.has(d.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!fetching && filtered.length === 0 && (
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

        {/* Pagination */}
        {!fetching && pagination && pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '32px 0' }}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchDesigns(p)}
                className="dp-pill"
                style={{
                  fontWeight: p === pagination.page ? 600 : 400,
                  background: p === pagination.page ? 'rgba(139,111,92,0.12)' : undefined,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </main>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); }}
        variant="danger"
        title="Delete this design?"
        message="This action cannot be undone. Your design and all its versions will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Keep it"
      />
    </>
  );
}

function DesignCard({ design: d, onDelete, selectMode, isSelected, onToggleSelect }: {
  design: Design;
  onDelete: (id: string) => void;
  selectMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const formattedDate = new Date(d.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      className="dp-card"
      onClick={selectMode ? () => onToggleSelect(d.id) : undefined}
      style={{ cursor: selectMode ? 'pointer' : undefined, position: 'relative' }}
    >
      {/* Selection checkbox overlay */}
      {selectMode && (
        <div style={{
          position: 'absolute', top: 8, left: 8, zIndex: 10,
          width: 22, height: 22, borderRadius: '50%',
          background: isSelected ? '#8B6F5C' : 'rgba(255,252,248,0.9)',
          border: isSelected ? '2px solid #8B6F5C' : '2px solid rgba(26,23,20,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}>
          {isSelected && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
      )}
      {/* Hover buttons */}
      <div className="card-acts">
        <Link
          href={`/editor?id=${d.id}`}
          className="ic-btn"
          title="Open in editor"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </Link>
        <button className="ic-btn del" onClick={(e) => { e.stopPropagation(); onDelete(d.id); }} title="Delete">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </button>
      </div>

      {/* Polaroid card — click to open */}
      <Link href={`/editor?id=${d.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="pola">
          {d.canvas_state?.frameData ? (
            <DesignPreview frameData={d.canvas_state.frameData as Partial<FrameData>} />
          ) : (
            <>
              <div className="img" style={{
                background: `linear-gradient(135deg, ${d.frame_color}22, ${d.frame_color}44)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: '#B5A99E', opacity: .5 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="cap">
                <div className="ttl">{d.has_caption ? '✎' : ''}</div>
                <div className="sub">{d.filter_preset !== 'none' ? d.filter_preset : ''}</div>
              </div>
            </>
          )}
        </div>
      </Link>

      {/* Meta */}
      <div className="dp-meta">
        <div className={`nm${d.title === 'Untitled' ? ' untitled' : ''}`}>
          {d.title}
        </div>
        <div className="row">
          <span className={`dp-badge ${STATUS_BADGE[d.status] || 'muted'}`}>{d.status}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
