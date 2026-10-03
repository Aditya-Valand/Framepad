'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { DesignPreview } from '@/components/DesignPreview';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Skeleton } from '@/components/ui';
import { useCart } from '@/store/cart';
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

export default function DesignsPageWrapper() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE6DC' }}><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B6F5C] border-t-transparent" /></div>}>
      <DesignsPage />
    </Suspense>
  );
}

function DesignsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useCart();
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

  // Enter modify mode if redirected from order page
  useEffect(() => {
    if (searchParams.get('modify') === 'true') {
      setSelectMode(true);
      const cartIds = cart.getDesignIds();
      if (cartIds.length > 0) {
        setSelected(new Set(cartIds));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
                <button
                  className="dp-btn"
                  onClick={() => {
                    cart.setItems(Array.from(selected));
                    setSelectMode(false);
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  Update Cart
                </button>
                {selected.size > 0 && (
                  <button
                    className="dp-btn primary"
                    onClick={() => {
                      cart.setItems(Array.from(selected));
                      router.push('/order');
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    Order {selected.size} print{selected.size > 1 ? 's' : ''}
                  </button>
                )}
                <button
                  className="dp-btn danger"
                  onClick={() => { cart.clearCart(); setSelected(new Set()); setSelectMode(false); }}
                >
                  Empty Cart
                </button>
              </>
            ) : (
              <>
                {cart.items.length > 0 && (
                  <button
                    className="dp-btn primary"
                    onClick={() => router.push('/order')}
                    style={{ position: 'relative' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    Cart ({cart.items.length})
                  </button>
                )}
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

        {/* Loading state — skeleton grid */}
        {fetching && (
          <div className="dp-grid">
            {activeFilter === 'all' && (
              <div style={{ width: '100%', borderRadius: 16, overflow: 'hidden' }}>
                <Skeleton height={200} borderRadius={12} />
              </div>
            )}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Polaroid card skeleton */}
                <div style={{
                  background: '#FFFCF8',
                  borderRadius: 12,
                  padding: '10px 10px 24px',
                  boxShadow: '0 1px 3px rgba(26,23,20,0.06), 0 8px 24px rgba(139,111,92,0.10)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  <Skeleton height={140} borderRadius={8} />
                  <Skeleton height={14} width="60%" borderRadius={6} style={{ margin: '4px auto 0' }} />
                </div>
                {/* Meta skeleton */}
                <Skeleton height={12} width="70%" borderRadius={6} />
                <Skeleton height={10} width="40%" borderRadius={6} />
              </div>
            ))}
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '72px 24px 96px',
            gap: 0,
            textAlign: 'center',
          }}>
            {/* Floating polaroid illustration */}
            <div style={{
              width: 82,
              height: 98,
              background: '#FFFCF8',
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(26,23,20,0.10), 0 1px 3px rgba(26,23,20,0.06)',
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 8px 0',
              marginBottom: 32,
              transform: 'rotate(-3deg)',
              animation: 'dp-empty-float 5s ease-in-out infinite',
            }}>
              <div style={{
                flex: 1,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #EDE6DC 0%, #D8CFC4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4B5A8" strokeWidth="1.4">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 28, height: 3, borderRadius: 2, background: '#EDE6DC' }} />
              </div>
            </div>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontStyle: 'italic',
              fontSize: 28,
              color: '#1A1714',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              marginBottom: 10,
            }}>
              {activeFilter === 'all' ? 'Your first frame is waiting' : `No ${activeFilter} designs yet`}
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: '#A39080',
              lineHeight: 1.65,
              maxWidth: 300,
              fontWeight: 400,
              marginBottom: 28,
            }}>
              {activeFilter === 'all'
                ? 'Create something beautiful in the editor — every polaroid starts with a moment worth keeping.'
                : 'Try a different filter or create a new design.'}
            </p>

            <Link
              href="/editor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '11px 22px',
                borderRadius: 10,
                background: '#6B4F3A',
                color: '#fff',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13.5,
                fontWeight: 500,
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(107,79,58,0.18), 0 4px 14px rgba(107,79,58,0.24)',
                transition: 'background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
                letterSpacing: '.005em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5E4332';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(107,79,58,0.22), 0 8px 20px rgba(107,79,58,0.24)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#6B4F3A';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(107,79,58,0.18), 0 4px 14px rgba(107,79,58,0.24)';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
              Create your first design
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
