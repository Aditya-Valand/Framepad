"use client";

import { useState, useEffect, Suspense } from "react";
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
import { ExportSuccessModal } from "@/components/ExportSuccessModal";
import { PrivacyPage } from "@/components/PrivacyPage";

const TABS = ["frame", "edit", "text", "music"] as const;
type Tab = (typeof TABS)[number];

/* ── Icons ── */
const FrameIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.8" />
    <rect x="6" y="6" width="12" height="9" rx="1" strokeWidth="1.5" />
  </svg>
);
const EditIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const TextIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h8m-8 6h16" />
  </svg>
);
const MusicIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
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

function ExportButton({ onSuccess }: { onSuccess: () => void }) {
  const handleClick = () => {
    document.getElementById("export-btn-inner")?.click();
    setTimeout(onSuccess, 600);
  };
  return (
    <button
      onClick={handleClick}
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

function CanvasBackground() {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(148deg, #EDE6DC 0%, #E5DDD3 45%, #DDD4C8 100%)" }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(139,111,92,0.15) 1px, transparent 1px)",
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const isLoggedIn = !!user;

  // Auto-save hooks
  useAutoSave(isLoggedIn);
  useGuestAutoSave(isLoggedIn);
  const { saveDesign } = useSaveDesign();

  useEffect(() => { setMounted(true); }, []);

  // Load design from URL param or start fresh
  useEffect(() => {
    if (!mounted || authLoading) return;
    const designId = searchParams.get('id');
    const store = useStore.getState();

    if (designId) {
      loadDesignById(designId);
    } else {
      // No ?id= means "New Design" — reset to fresh state
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

      // For guests, restore pending work from localStorage
      if (!isLoggedIn) {
        const guest = restoreGuestDesign();
        if (guest) {
          store.updateFrame(store.activeFrameId, guest);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, authLoading]);

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
    <>
      {/* ══════════════════════════════
          MOBILE  (< lg)
      ══════════════════════════════ */}
      <div className="lg:hidden flex flex-col" style={{ height: "100dvh", overflow: "hidden", background: "#EAE2D8" }}>

        {/* Glass header */}
        <header
          role="banner"
          style={{
            flexShrink: 0,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            background: "rgba(251,248,244,0.93)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "0.5px solid rgba(26,23,20,0.08)",
            zIndex: 10,
            boxShadow: "0 1px 0 rgba(255,255,255,0.45) inset",
          }}
        >
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SaveIndicator isSaving={isSaving} lastSavedAt={lastSavedAt} />
            {isLoggedIn && (
              <button
                onClick={() => saveDesign()}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12,
                  fontWeight: 500,
                  background: "transparent",
                  color: "#8B6F5C",
                  border: "0.5px solid rgba(139,111,92,0.3)",
                  borderRadius: 100,
                  padding: "7px 14px",
                  cursor: "pointer",
                  transition: "all .2s ease",
                  letterSpacing: ".01em",
                }}
                className="hover:!bg-[rgba(139,111,92,0.07)] active:scale-[0.97]"
              >
                Save
              </button>
            )}
            <ExportButton onSuccess={() => setExportSuccess(true)} />
          </div>
        </header>

        {/* Canvas */}
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }} aria-label="Polaroid frame editor">
          <CanvasBackground />
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <PolaroidView />
          </div>
        </main>

        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          {panelContent}
        </BottomSheet>

        {/* Bottom tab nav */}
        <nav
          aria-label="Editor tools"
          style={{
            flexShrink: 0,
            display: "flex",
            padding: "4px 8px",
            gap: 2,
            background: "rgba(251,248,244,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "0.5px solid rgba(26,23,20,0.07)",
            zIndex: 20,
            boxShadow: "0 -1px 0 rgba(255,255,255,0.55) inset",
            paddingBottom: "max(4px, env(safe-area-inset-bottom))",
          }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab && sheetOpen;
            return (
              <button
                key={tab}
                onClick={() => handleMobileTabClick(tab)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  padding: "7px 4px",
                  borderRadius: 11,
                  border: "none",
                  background: active ? "rgba(139,111,92,0.09)" : "transparent",
                  color: active ? "#6B4F3A" : "#B8A89E",
                  cursor: "pointer",
                  transition: "all .18s ease",
                  minHeight: 44,
                }}
              >
                <span style={{ display: "block", transform: active ? "scale(1.08)" : "scale(1)", transition: "transform .18s ease" }}>
                  {TAB_META[tab].icon}
                </span>
                <span style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 9,
                  fontWeight: active ? 600 : 400,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}>
                  {TAB_META[tab].label}
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
              onClick={() => {
                document.getElementById("export-btn-inner")?.click();
                setTimeout(() => setExportSuccess(true), 600);
              }}
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
            <PolaroidView />
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
        </aside>
      </div>

      <ExportSuccessModal open={exportSuccess} onClose={() => setExportSuccess(false)} />
    </>
  );
}
