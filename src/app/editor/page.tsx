"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useStore } from "@/store";
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

const TAB_META: Record<Tab, { label: string; icon: ReactNode }> = {
  frame: {
    label: "Frame",
    icon: (
      <svg style={{ width: 20, height: 20, display: 'block', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.8" />
        <rect x="6" y="6" width="12" height="9" rx="1" strokeWidth="1.5" />
      </svg>
    ),
  },
  edit: {
    label: "Edit",
    icon: (
      <svg style={{ width: 20, height: 20, display: 'block', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  text: {
    label: "Text",
    icon: (
      <svg style={{ width: 20, height: 20, display: 'block', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
  },
  music: {
    label: "Music",
    icon: (
      <svg style={{ width: 20, height: 20, display: 'block', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
      </svg>
    ),
  },
};

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

function Logo() {
  return (
    <h1
      className="tracking-wide"
      style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "1.35rem", lineHeight: 1 }}
    >
      <span style={{ fontWeight: 500, fontStyle: "normal", color: "#1A1814", letterSpacing: "0.04em" }}>Pola</span>
      <span style={{ fontWeight: 400, fontStyle: "italic", color: "#8B6F5C", letterSpacing: "0.01em" }}>muse</span>
    </h1>
  );
}

function ExportButton({ onSuccess }: { onSuccess: () => void }) {
  const handleClick = () => {
    const btn = document.getElementById("export-btn-inner");
    btn?.click();
    setTimeout(onSuccess, 600);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-1.5 bg-[#8B6F5C] text-white text-xs font-semibold rounded-full hover:bg-[#7A6050] active:scale-95 transition-all shadow-sm"
    >
      <span id="export-btn-inner" className="hidden" />
      Export
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Editor Page
───────────────────────────────────────────────────────────── */

export default function EditorPage() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  if (showPrivacy) {
    return <PrivacyPage onBack={() => setShowPrivacy(false)} />;
  }

  const handleMobileTabClick = (tab: Tab) => {
    if (activeTab === tab && sheetOpen) {
      setSheetOpen(false);
    } else {
      setActiveTab(tab);
      setSheetOpen(true);
    }
  };

  const handleDesktopTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  const panelContent = (
    <>
      {activeTab === "frame" && <FramePanel />}
      {activeTab === "edit" && <EditPanel />}
      {activeTab === "text" && <TextPanel />}
      {activeTab === "music" && <MusicPanel />}
    </>
  );

  return (
    <div className="editor-page">
      <style>{`
        body::before { display: none !important; }
        .editor-page input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 2px;
          background: #E8DFD6;
          outline: none;
          accent-color: #8B6F5C;
        }
        .editor-page input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 2px;
          background: #E8DFD6;
        }
        .editor-page input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #8B6F5C;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(139,111,92,0.3);
          margin-top: -6px;
          border: none;
        }
        .editor-page input[type="range"]::-moz-range-track {
          height: 4px;
          border-radius: 2px;
          background: #E8DFD6;
          border: none;
        }
        .editor-page input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #8B6F5C;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(139,111,92,0.3);
          border: none;
        }
        .editor-page input[type="color"] {
          -webkit-appearance: none;
          appearance: none;
          border: none;
          padding: 0;
          background: none;
        }
        .editor-page input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        .editor-page input[type="color"]::-webkit-color-swatch {
          border: 2px solid #E8DFD6;
          border-radius: 999px;
        }
      `}</style>
      {/* ═══════════════════════════════════════════════
          MOBILE LAYOUT (hidden on lg+)
      ═══════════════════════════════════════════════ */}
      <div className="lg:hidden h-dvh flex flex-col bg-[#FBF8F4] overflow-hidden">
        <header className="shrink-0 bg-[#FFFCF8] border-b border-[#F0E6DA] px-5 py-3 flex items-center justify-between z-10" role="banner">
          <Logo />
          <ExportButton onSuccess={() => setExportSuccess(true)} />
        </header>

        <main className="flex-1 overflow-hidden relative" aria-label="Polaroid frame editor">
          <PolaroidView />
        </main>

        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          {panelContent}
        </BottomSheet>

        <nav className="shrink-0 bg-[#FFFCF8] border-t border-[#F0E6DA] flex z-20 relative" aria-label="Editor tools">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleMobileTabClick(tab)}
              className={`flex-1 py-3 text-[10px] font-medium capitalize transition-all duration-200 ${
                activeTab === tab && sheetOpen ? "text-[#5C4A3A]" : "text-[#C4B5A6]"
              }`}
            >
              <span className={`block transition-transform duration-200 ${activeTab === tab && sheetOpen ? "scale-110" : "scale-100"}`}>
                {TAB_META[tab].icon}
              </span>
              <span className="block mt-0.5">{TAB_META[tab].label.toLowerCase()}</span>
            </button>
          ))}
        </nav>

        <div className="shrink-0 bg-[#FFFCF8] pb-safe flex justify-center py-1 border-t border-[#F0E6DA]/50">
          <button onClick={() => setShowPrivacy(true)} className="text-[9px] text-[#C4B5A6] hover:text-[#A39080] transition-colors">
            Privacy Policy
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          DESKTOP LAYOUT (hidden on < lg)
      ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex h-screen bg-[#F0EBE4] overflow-hidden">
        {/* Left icon sidebar */}
        <aside className="shrink-0 flex flex-col items-center py-5 gap-1 z-20 w-[68px] bg-[#FFFCF8] border-r border-[#EDE5DC]">
          {/* Logo mark */}
          <div className="mb-5 flex flex-col items-center">
            <span
              className="text-[1.1rem] leading-none font-medium italic text-[#8B6F5C] tracking-[0.02em]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              P
            </span>
          </div>

          {/* Tool buttons */}
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <div key={tab} className="relative group">
                <button
                  onClick={() => handleDesktopTabClick(tab)}
                  aria-label={TAB_META[tab].label}
                  className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-150 active:scale-95 ${
                    active
                      ? "bg-[#F0E8E0] text-[#6B4F3A] border border-[#DDD0C4]"
                      : "bg-transparent text-[#B5A396] border border-transparent hover:bg-[#F7F3EF]"
                  }`}
                >
                  {TAB_META[tab].icon}
                </button>
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 bg-[#1A1814] text-[#F5F0EB] tracking-[0.04em]">
                  {TAB_META[tab].label}
                </span>
              </div>
            );
          })}

          <div className="flex-1" />

          {/* Desktop export button */}
          <div className="relative group">
            <button
              onClick={() => {
                document.getElementById("export-btn-inner")?.click();
                setTimeout(() => setExportSuccess(true), 600);
              }}
              aria-label="Export image"
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#8B6F5C] text-[#FFFCF8] transition-all duration-150 active:scale-95 hover:bg-[#7A6050]"
            >
              <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
            <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 bg-[#1A1814] text-[#F5F0EB] tracking-[0.04em]">
              Export PNG
            </span>
          </div>

          {/* Privacy dot */}
          <div className="relative group mt-2">
            <button
              onClick={() => setShowPrivacy(true)}
              aria-label="Privacy Policy"
              className="flex items-center justify-center w-11 h-11 rounded-xl text-[#D4C5B8] transition-all duration-150 hover:text-[#A39080]"
            >
              <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </button>
            <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 bg-[#1A1814] text-[#F5F0EB] tracking-[0.04em]">
              Privacy Policy
            </span>
          </div>
        </aside>

        {/* Canvas center */}
        <main
          className="flex-1 overflow-hidden relative flex items-center justify-center"
          aria-label="Polaroid frame editor"
          style={{ background: "linear-gradient(135deg, #F5F0EA 0%, #EDE5DA 100%)" }}
        >
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #C8B9AC44 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative w-full h-full">
            <PolaroidView />
          </div>

          {/* Desktop watermark */}
          <div
            className="absolute bottom-4 right-5 pointer-events-none select-none text-xs italic text-[#8B6F5C]/35 tracking-[0.06em]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            polamuse
          </div>
        </main>

        {/* Right panel */}
        <aside className="shrink-0 flex flex-col overflow-hidden w-80 bg-[#FFFCF8] border-l border-[#EDE5DC]">
          {/* Panel header */}
          <div className="shrink-0 flex items-center gap-2.5 px-5 py-4 border-b border-[#F0E8E0]">
            <span className="text-[#8B6F5C]">{TAB_META[activeTab].icon}</span>
            <span
              className="text-[1.05rem] font-medium text-[#1A1814] tracking-[0.04em]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              {TAB_META[activeTab].label}
            </span>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 text-[#5C4A3A] overscroll-contain">
            {panelContent}
          </div>
        </aside>
      </div>

      {/* Shared export success modal */}
      <ExportSuccessModal open={exportSuccess} onClose={() => setExportSuccess(false)} />
    </div>
  );
}
