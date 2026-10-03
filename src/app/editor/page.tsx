"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { useAutoSave, useGuestAutoSave, useSaveDesign, loadDesignById, restoreGuestDesign } from "@/hooks/useDesignSave";
import { PolaroidView } from "@/components/PolaroidView";
import { BottomSheet } from "@/components/BottomSheet";
import { FramePanel } from "@/components/panels/FramePanel";
import { EditPanel } from "@/components/panels/EditPanel";
import { TextPanel } from "@/components/panels/TextPanel";
import { MusicPanel } from "@/components/panels/MusicPanel";
// ExportSuccessModal replaced by toast — import kept for future use
// import { ExportSuccessModal } from "@/components/ExportSuccessModal";
import { PrivacyPage } from "@/components/PrivacyPage";
import { BatchModal } from "@/components/BatchModal";
import { LivePreviewProvider } from "@/contexts/LivePreviewContext";
import { WatermarkModal } from "@/components/WatermarkModal";
import { useUnlockStatus } from "@/hooks/useUnlockStatus";
import { useCoins } from "@/hooks/useCoins";
import { CoinBadge } from "@/components/CoinBadge";
import { CoinPurchaseSheet } from "@/components/CoinPurchaseSheet";
import { useToast } from "@/contexts/ToastContext";
import { useShutterEffect } from "@/hooks/useShutterEffect";
import { haptic } from "@/lib/haptic";

const TABS = ["frame", "edit", "text", "music"] as const;
type Tab = (typeof TABS)[number];

/* ── Icons ── */
const FrameIcon = () => (
  <svg width="21" height="21" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" strokeWidth="2.2" />
    <rect x="6.5" y="6.5" width="11" height="8" rx="1" strokeWidth="2" />
  </svg>
);
const EditIcon = () => (
  <svg width="21" height="21" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TextIcon = () => (
  <svg width="21" height="21" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h10M4 18h14" />
  </svg>
);
const MusicIcon = () => (
  <svg width="21" height="21" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" strokeWidth="2.2" />
    <circle cx="18" cy="16" r="3" strokeWidth="2.2" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TAB_META: Record<Tab, { label: string; icon: ReactNode }> = {
  frame: { label: "Frame", icon: <FrameIcon /> },
  edit:  { label: "Edit",  icon: <EditIcon /> },
  text:  { label: "Text",  icon: <TextIcon /> },
  music: { label: "Music", icon: <MusicIcon /> },
};

/* ── Sub-components ── */

function Logo() {
  return (
    <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.3rem", lineHeight: 1, letterSpacing: "0.02em" }}>
      <span style={{ fontWeight: 500, fontStyle: "normal", color: "#1A1714" }}>Pola</span>
      <span style={{ fontWeight: 400, fontStyle: "italic", color: "#8B6F5C" }}>muse</span>
    </h1>
  );
}

function ExportButton({ onExport }: { onExport: () => void }) {
  return (
    <button
      onClick={onExport}
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 13,
        fontWeight: 500,
        background: "#8B6F5C",
        color: "#fff",
        border: "none",
        borderRadius: 100,
        padding: "9px 18px",
        cursor: "pointer",
        transition: "background .2s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        letterSpacing: ".01em",
        boxShadow: "0 1px 4px rgba(139,111,92,0.28)",
        flexShrink: 0,
      }}
      className="hover:!bg-[#7A6050] active:scale-[0.97]"
    >
      <span id="export-btn-inner" className="hidden" />
      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
      </svg>
      Export
    </button>
  );
}

function SidebarTooltip({ children }: { children: string }) {
  return (
    <span
      className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 11,
        fontWeight: 500,
        background: "#1A1714",
        color: "#F5F0EB",
        borderRadius: 8,
        padding: "5px 10px",
        letterSpacing: ".04em",
        boxShadow: "0 2px 10px rgba(26,23,20,0.22)",
      }}
    >
      {children}
    </span>
  );
}

const THEMES = {
  light: {
    bg: '#EAE4DB',
    bgGradient: 'linear-gradient(160deg, #EDE8E0 0%, #E0D8CC 100%)',
    bgDot: 'rgba(139,111,92,0.08)',
    // Pure white chrome creates clear visual separation from warm canvas (Lightroom/iOS pattern)
    chrome: 'rgba(255,255,255,0.97)',
    chromeBlur: 'saturate(180%) blur(20px)',
    chromeBorder: 'rgba(0,0,0,0.08)',
    text: '#1C1917',
    textMuted: '#6B7280',
    tabActive: '#8B6F5C',
    tabInactive: '#AEAEB2',   // iOS system grey — canonical inactive icon color
    tabPill: 'rgba(139,111,92,0.1)',
    logoAccent: '#8B6F5C',
  },
  dark: {
    bg: '#16120F',
    bgGradient: 'linear-gradient(148deg, #1C1713 0%, #181410 45%, #131008 100%)',
    bgDot: 'rgba(255,255,255,0.05)',
    chrome: 'rgba(18,15,12,0.95)',
    chromeBlur: 'saturate(160%) blur(20px)',
    chromeBorder: 'rgba(255,255,255,0.06)',
    text: '#F0E8DF',
    textMuted: '#8E8E93',
    tabActive: '#C9A882',
    tabInactive: '#636366',   // iOS dark system grey
    tabPill: 'rgba(201,168,130,0.15)',
    logoAccent: '#C9A882',
  },
} as const;
type EditorTheme = keyof typeof THEMES;

function CanvasBackground({ dot }: { dot?: string }) {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(148deg, #EDE6DC 0%, #E5DDD3 45%, #DDD4C8 100%)" }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, ${dot ?? "rgba(139,111,92,0.15)"} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(26,23,20,0.07) 100%)",
      }} />
    </>
  );
}

function SaveIndicator({ isSaving, lastSavedAt }: { isSaving: boolean; lastSavedAt: Date | null }) {
  if (isSaving) {
    return (
      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#A39080", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#C4A882" }} />
        Saving…
      </span>
    );
  }
  if (lastSavedAt) {
    return (
      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: "#A39080", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#8B9E6B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8.5l3.5 3.5 6.5-7" />
        </svg>
        Saved
      </span>
    );
  }
  return null;
}

/* ── Main ── */

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen" style={{ background: '#EDE6DC' }}><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B6F5C] border-t-transparent" /></div>}>
      <EditorPageInner />
    </Suspense>
  );
}

function EditorPageInner() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const isSaving = useStore((s) => s.isSaving);
  const lastSavedAt = useStore((s) => s.lastSavedAt);
  const currentDesignId = useStore((s) => s.currentDesignId);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const [editorTheme, setEditorTheme] = useState<EditorTheme>('light');
  const theme = THEMES[editorTheme];
  const toggleTheme = () => setEditorTheme(t => t === 'light' ? 'dark' : 'light');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);
  const [showCoinSheet, setShowCoinSheet] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Coins
  const { balance: coinBalance, loading: coinsLoading, refresh: coinsRefresh } = useCoins();
  const { toast } = useToast();
  const { trigger: triggerShutter } = useShutterEffect();

  // Watermark: ref read at export-time (no re-render needed when it changes)
  const addWatermarkRef = useRef(false);
  const { isUnlocked, refetch: refetchUnlock } = useUnlockStatus(currentDesignId);

  // Keep watermark ref in sync: add watermark when design is saved but not unlocked
  useEffect(() => {
    addWatermarkRef.current = !!currentDesignId && isUnlocked === false;
  }, [currentDesignId, isUnlocked]);

  // Central export handler — shows watermark modal if locked
  const handleExport = useCallback(() => {
    if (currentDesignId && isUnlocked === false) {
      setShowWatermarkModal(true);
    } else {
      haptic.success();
      triggerShutter();
      document.getElementById("export-btn-inner")?.click();
      setTimeout(() => toast('Saved to your device ✦', 'success'), 600);
    }
  }, [currentDesignId, isUnlocked, toast, triggerShutter]);

  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const isLoggedIn = !!user;

  // Auto-save hooks
  useAutoSave(isLoggedIn);
  useGuestAutoSave(isLoggedIn);
  const { saveDesign: _saveDesign } = useSaveDesign();
  const saveDesign = useCallback(async () => {
    try {
      await _saveDesign();
      toast('Saved to memories', 'success');
    } catch {
      toast('Save failed — please retry', 'error');
    }
  }, [_saveDesign, toast]);

  // On mount: reset state BEFORE showing canvas to prevent flash of old data
  useEffect(() => {
    const store = useStore.getState();
    const designId = searchParams.get('id');

    if (!designId) {
      // "New Design" — reset immediately before canvas renders
      store.setDesignId(null);
      store.updateFrame(store.activeFrameId, {
        imageDataUrl: null,
        imageUrl: null,
        cloudinaryId: null,
        topLabelText: '',
        bottomCaptionText: '',
        musicUrl: '',
        filters: { brightness: 0, contrast: 0, saturation: 0, warmth: 0 },
        imageRotation: 0,
        imagePanX: 0,
        imagePanY: 0,
        imageScale: 1,
        templateId: 'polaroid-600',
        frameColor: '#FFFFFF',
        frameStyle: 'classic',
        borderTop: 54,
        borderLeft: 54,
        borderRight: 54,
        borderBottom: 210,
        borderRadius: 0,
        movieTitle: '',
        movieYear: '',
        movieDirector: '',
        movieCast: '',
        captionSubtext: '',
      });

      // For guests, immediately restore pending work so no blank flash
      const guest = restoreGuestDesign();
      if (guest) {
        store.updateFrame(store.activeFrameId, guest);
      }
    }

    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load design from URL param (after auth resolves)
  useEffect(() => {
    if (!mounted || authLoading) return;
    const designId = searchParams.get('id');

    if (designId) {
      loadDesignById(designId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, authLoading]);

  // Undo / redo keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('input, textarea, [contenteditable]')) return;
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  if (!mounted) {
    return (
      <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EDE6DC" }}>
        <div className="animate-pulse" style={{ color: "#8B6F5C" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <rect x="6" y="6" width="12" height="9" rx="1" />
          </svg>
        </div>
      </div>
    );
  }

  if (showPrivacy) return <PrivacyPage onBack={() => setShowPrivacy(false)} />;

  const handleMobileTabClick = (tab: Tab) => {
    if (activeTab === tab && sheetOpen) setSheetOpen(false);
    else { setActiveTab(tab); setSheetOpen(true); }
  };

  const panelContent = (
    <>
      {activeTab === "frame" && <FramePanel />}
      {activeTab === "edit"  && <EditPanel />}
      {activeTab === "text"  && <TextPanel />}
      {activeTab === "music" && <MusicPanel />}
    </>
  );

  return (
    <LivePreviewProvider>
    <>
      {/* ══════════════════════════════
          MOBILE  (< lg)
      ══════════════════════════════ */}
      <div className="lg:hidden flex flex-col" style={{ height: "100dvh", overflow: "hidden", background: theme.bg, transition: "background 0.3s ease" }}>

        {/* ── Minimal glass header ── */}
        <header
          role="banner"
          style={{
            flexShrink: 0,
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px 0 16px",
            background: editorTheme === 'dark' ? '#141210' : '#FFFFFF',
            borderBottom: `1px solid ${editorTheme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
            zIndex: 10,
            transition: "background 0.3s ease",
          }}
        >
          {/* Logo */}
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: theme.text,
            userSelect: "none",
          }}>
            Pola<em style={{ fontStyle: "italic", color: theme.logoAccent, fontWeight: 400 }}>muse</em>
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isLoggedIn && (
              <CoinBadge balance={coinBalance} loading={coinsLoading} onClick={() => setShowCoinSheet(true)} />
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={editorTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              style={{
                width: 34, height: 34, borderRadius: 10,
                border: "none", background: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: theme.tabInactive, cursor: "pointer",
                transition: "color 0.2s ease",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {editorTheme === 'light' ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </button>

            {/* Save — icon only (logged in) */}
            {isLoggedIn && (
              <button
                onClick={() => saveDesign()}
                aria-label="Save design"
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  border: "none", background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isSaving ? theme.tabActive : theme.tabInactive,
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                  WebkitTapHighlightColor: "transparent",
                  position: "relative",
                }}
              >
                {isSaving && (
                  <span className="animate-pulse" style={{
                    position: "absolute", top: 7, right: 7,
                    width: 5, height: 5, borderRadius: "50%",
                    background: theme.tabActive,
                  }} />
                )}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
              </button>
            )}

            {/* Export — icon-only CTA */}
            <button
              onClick={handleExport}
              style={{
                width: 36, height: 36,
                borderRadius: 100,
                background: "linear-gradient(135deg, #9B7B68 0%, #7A5538 100%)",
                color: "#fff",
                border: "none",
                boxShadow: "0 2px 10px rgba(122,85,56,0.38), inset 0 1px 0 rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span id="export-btn-inner" className="hidden" />
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Canvas */}
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }} aria-label="Polaroid frame editor">
          {/* Themed canvas bg */}
          <div style={{ position: "absolute", inset: 0, background: theme.bgGradient, transition: "background 0.3s ease" }} />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `radial-gradient(circle, ${theme.bgDot} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            transition: "background-image 0.3s ease",
          }} />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(26,23,20,0.07) 100%)",
          }} />
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <PolaroidView addWatermarkRef={addWatermarkRef} />
          </div>

          {/* Floating ORDER PRINT — icon-only pill */}
          <a
            href="/designs"
            aria-label="Order print"
            style={{
              position: "absolute",
              bottom: 14, right: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 44, height: 44,
              background: editorTheme === 'dark'
                ? "rgba(10,8,6,0.88)"
                : "rgba(20,16,12,0.84)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "50%",
              textDecoration: "none",
              border: "0.5px solid rgba(255,255,255,0.10)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08)",
              zIndex: 5,
              color: "#F2EDE4",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </a>
        </main>

        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          {panelContent}
        </BottomSheet>

        {/* ── Icon-only tab bar ── */}
        <nav
          aria-label="Editor tools"
          style={{
            flexShrink: 0,
            position: "relative",
            display: "flex",
            padding: "6px 4px",
            paddingBottom: "max(6px, env(safe-area-inset-bottom))",
            background: editorTheme === 'dark' ? '#141210' : '#FFFFFF',
            borderTop: `1px solid ${editorTheme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
            zIndex: 20,
            transition: "background 0.3s ease",
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => { haptic.light(); handleMobileTabClick(tab); }}
                aria-label={TAB_META[tab].label}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 44,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 1,
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <div style={{
                  position: "absolute",
                  inset: "2px 4px",
                  borderRadius: 10,
                  background: isActive
                    ? (editorTheme === 'dark' ? 'rgba(201,168,130,0.18)' : 'rgba(139,111,92,0.12)')
                    : "transparent",
                  transition: "background 0.2s ease",
                }} />
                <span style={{
                  display: "flex",
                  color: isActive ? theme.tabActive : theme.tabInactive,
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), color 0.18s ease",
                  position: "relative",
                  zIndex: 1,
                  opacity: isActive ? 1 : 0.55,
                }}>
                  {TAB_META[tab].icon}
                </span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* ══════════════════════════════
          DESKTOP  (≥ lg)
      ══════════════════════════════ */}
      <div className="hidden lg:flex" style={{ height: "100vh", overflow: "hidden" }}>

        {/* ── Left icon sidebar ── */}
        <aside
          style={{
            flexShrink: 0,
            width: 72,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 16,
            gap: 4,
            background: "rgba(251,248,244,0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRight: "0.5px solid rgba(26,23,20,0.08)",
            zIndex: 20,
            boxShadow: "1px 0 0 rgba(255,255,255,0.5) inset",
          }}
        >
          {/* Logo P mark */}
          <div style={{ marginBottom: 14, width: "100%", display: "flex", justifyContent: "center" }}>
            <span style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "1.55rem",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#8B6F5C",
              lineHeight: 1,
            }}>
              P
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: 28, height: "0.5px", background: "rgba(26,23,20,0.1)", marginBottom: 10 }} />

          {/* Tab buttons */}
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <div key={tab} className="group" style={{ position: "relative" }}>
                <button
                  onClick={() => setActiveTab(tab)}
                  aria-label={TAB_META[tab].label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: active ? "0.5px solid rgba(139,111,92,0.2)" : "0.5px solid transparent",
                    background: active ? "rgba(139,111,92,0.09)" : "transparent",
                    color: active ? "#6B4F3A" : "#B8A89E",
                    cursor: "pointer",
                    transition: "all .16s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(139,111,92,0.06)"; e.currentTarget.style.color = "#8B7060"; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#B8A89E"; } }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.94)"; }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {/* Active indicator strip */}
                  {active && (
                    <span style={{
                      position: "absolute",
                      left: -1,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 2.5,
                      height: 18,
                      background: "#8B6F5C",
                      borderRadius: "0 3px 3px 0",
                    }} />
                  )}
                  {TAB_META[tab].icon}
                </button>
                <SidebarTooltip>{TAB_META[tab].label}</SidebarTooltip>
              </div>
            );
          })}

          <div style={{ flex: 1 }} />

          {/* Coin badge (logged in only) */}
          {isLoggedIn && (
            <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}>
              <CoinBadge balance={coinBalance} loading={coinsLoading} onClick={() => setShowCoinSheet(true)} />
            </div>
          )}

          {/* Save button (logged in only) */}
          {isLoggedIn && (
            <div className="group" style={{ position: "relative", marginBottom: 6 }}>
              <button
                onClick={() => saveDesign()}
                aria-label="Save design"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "transparent",
                  border: "0.5px solid rgba(139,111,92,0.25)",
                  color: "#8B6F5C",
                  cursor: "pointer",
                  transition: "all .18s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,111,92,0.07)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.93)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.7">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              </button>
              <SidebarTooltip>Save</SidebarTooltip>
            </div>
          )}

          {/* Export button */}
          <div className="group" style={{ position: "relative" }}>
            <button
              onClick={handleExport}
              aria-label="Export image"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#8B6F5C",
                color: "#FFFCF8",
                border: "none",
                cursor: "pointer",
                transition: "background .18s ease, transform .12s ease",
                boxShadow: "0 2px 8px rgba(139,111,92,0.32)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#7A6050")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#8B6F5C")}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.93)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <DownloadIcon />
            </button>
            <SidebarTooltip>Export PNG</SidebarTooltip>
          </div>

          {/* Batch button */}
          <div className="group" style={{ position: "relative", marginTop: 6 }}>
            <button
              onClick={() => setShowBatch(true)}
              aria-label="Batch apply"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "transparent",
                border: "0.5px solid rgba(139,111,92,0.25)",
                color: "#8B6F5C",
                cursor: "pointer",
                transition: "all .18s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,111,92,0.07)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.93)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.7">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <SidebarTooltip>Batch</SidebarTooltip>
          </div>

          {/* Privacy button */}
          <div className="group" style={{ position: "relative", marginTop: 6 }}>
            <button
              onClick={() => setShowPrivacy(true)}
              aria-label="Privacy Policy"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "transparent",
                border: "none",
                color: "#D4C5B8",
                cursor: "pointer",
                transition: "color .18s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#A39080")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#D4C5B8")}
            >
              <ShieldIcon />
            </button>
            <SidebarTooltip>Privacy Policy</SidebarTooltip>
          </div>
        </aside>

        {/* ── Canvas center ── */}
        <main
          aria-label="Polaroid frame editor"
          style={{ flex: 1, overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <CanvasBackground />
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <PolaroidView addWatermarkRef={addWatermarkRef} />
          </div>
          {/* Watermark */}
          <div style={{
            position: "absolute",
            bottom: 16,
            right: 20,
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 11,
            fontStyle: "italic",
            color: "rgba(139,111,92,0.27)",
            letterSpacing: ".1em",
          }}>
            polamuse
          </div>
        </main>

        {/* ── Right control panel ── */}
        <aside
          style={{
            flexShrink: 0,
            width: 320,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#FFFCF8",
            borderLeft: "0.5px solid rgba(26,23,20,0.08)",
          }}
        >
          {/* Save indicator */}
          <div style={{ flexShrink: 0, padding: "8px 14px 0", display: "flex", justifyContent: "flex-end" }}>
            <SaveIndicator isSaving={isSaving} lastSavedAt={lastSavedAt} />
          </div>
          {/* Panel tab header — pill nav */}
          <div style={{
            flexShrink: 0,
            padding: "12px 14px 11px",
            borderBottom: "0.5px solid rgba(26,23,20,0.06)",
            background: "rgba(251,248,244,0.7)",
          }}>
            <div style={{
              display: "flex",
              gap: 2,
              background: "rgba(26,23,20,0.04)",
              border: "0.5px solid rgba(26,23,20,0.06)",
              borderRadius: 100,
              padding: 3,
            }}>
              {TABS.map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: "7px 0",
                      borderRadius: 100,
                      border: "none",
                      background: active ? "#fff" : "transparent",
                      color: active ? "#1A1714" : "#A39080",
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 11.5,
                      fontWeight: active ? 500 : 400,
                      cursor: "pointer",
                      transition: "all .16s ease",
                      boxShadow: active ? "0 1px 3px rgba(26,23,20,0.09), 0 1px 1px rgba(26,23,20,0.04)" : "none",
                      letterSpacing: ".02em",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#6B5040"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#A39080"; }}
                  >
                    {TAB_META[tab].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel content */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "22px 20px 32px",
            color: "#5C4A3A",
            overscrollBehavior: "contain",
          }}>
            {panelContent}
          </div>

          {/* Order Print CTA */}
          <div style={{
            flexShrink: 0,
            padding: "14px 16px",
            borderTop: "0.5px solid rgba(26,23,20,0.07)",
            background: "rgba(251,248,244,0.8)",
          }}>
            <a
              href="/designs"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "11px 14px",
                background: "linear-gradient(135deg, #2A1F1A 0%, #3D2B22 100%)",
                borderRadius: 12,
                textDecoration: "none",
                transition: "opacity .18s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <div>
                <div style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 15, fontStyle: "italic", fontWeight: 300,
                  color: "#F2EDE4", lineHeight: 1.2, marginBottom: 2,
                }}>
                  Hold it in your hands
                </div>
                <div style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase",
                  color: "rgba(242,237,228,0.45)",
                }}>
                  Order a print · from ₹149
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,237,228,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </aside>
      </div>

      {showBatch && <BatchModal onClose={() => setShowBatch(false)} />}
      {showWatermarkModal && currentDesignId && (
        <WatermarkModal
          designId={currentDesignId}
          coinBalance={coinBalance}
          onUnlocked={() => {
            setShowWatermarkModal(false);
            refetchUnlock();
            coinsRefresh();
            setTimeout(() => {
              document.getElementById("export-btn-inner")?.click();
              setTimeout(() => toast('Saved to your device ✦', 'success'), 600);
            }, 300);
          }}
          onDownloadFree={() => {
            setShowWatermarkModal(false);
            document.getElementById("export-btn-inner")?.click();
            setTimeout(() => toast('Saved to your device', 'info'), 600);
          }}
          onClose={() => setShowWatermarkModal(false)}
        />
      )}
      {showCoinSheet && (
        <CoinPurchaseSheet
          currentBalance={coinBalance}
          onClose={() => setShowCoinSheet(false)}
          onPurchased={(newBalance) => {
            coinsRefresh();
            setShowCoinSheet(false);
            void newBalance;
          }}
        />
      )}
    </>
    </LivePreviewProvider>
  );
}
