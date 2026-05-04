import { useState } from 'react';
import type { ReactNode } from 'react';
import { useStore } from './store';
import { PolaroidView } from './components/PolaroidView';
import { BottomSheet } from './components/BottomSheet';
import { FramePanel } from './components/panels/FramePanel';
import { EditPanel } from './components/panels/EditPanel';
import { TextPanel } from './components/panels/TextPanel';
import { MusicPanel } from './components/panels/MusicPanel';
import { ExportSuccessModal } from './components/ExportSuccessModal';
import { PrivacyPage } from './components/PrivacyPage';

export default function App() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  if (showPrivacy) {
    return <PrivacyPage onBack={() => setShowPrivacy(false)} />;
  }

  const handleTabClick = (tab: typeof activeTab) => {
    if (activeTab === tab && sheetOpen) {
      setSheetOpen(false);
    } else {
      setActiveTab(tab);
      setSheetOpen(true);
    }
  };

  return (
    <div className="h-dvh flex flex-col bg-[#FBF8F4] overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-[#FFFCF8] border-b border-[#F0E6DA] px-5 py-3 flex items-center justify-between z-10">
        <h1
          className="tracking-wide"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.35rem', lineHeight: 1 }}
        >
          <span style={{ fontWeight: 500, fontStyle: 'normal', color: '#1A1814', letterSpacing: '0.04em' }}>Pola</span><span style={{ fontWeight: 400, fontStyle: 'italic', color: '#8B6F5C', letterSpacing: '0.01em' }}>muse</span>
        </h1>
        <ExportButton onSuccess={() => setExportSuccess(true)} />
      </header>

      {/* Canvas Area */}
      <main className="flex-1 overflow-hidden relative">
        <PolaroidView />
      </main>

      {/* Bottom Sheet */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        {activeTab === 'frame' && <FramePanel />}
        {activeTab === 'edit' && <EditPanel />}
        {activeTab === 'text' && <TextPanel />}
        {activeTab === 'music' && <MusicPanel />}
      </BottomSheet>

      {/* Tab Bar */}
      <nav className="flex-shrink-0 bg-[#FFFCF8] border-t border-[#F0E6DA] flex z-20 relative">
        {(['frame', 'edit', 'text', 'music'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`flex-1 py-3 text-[10px] font-medium capitalize transition-all duration-200 ${
              activeTab === tab && sheetOpen ? 'text-[#5C4A3A]' : 'text-[#C4B5A6]'
            }`}
          >
            <span className={`block transition-transform duration-200 ${
              activeTab === tab && sheetOpen ? 'scale-110' : 'scale-100'
            }`}>
              {tabIcons[tab]}
            </span>
            <span className="block mt-0.5">{tab}</span>
          </button>
        ))}
      </nav>

      {/* Privacy link footer */}
      <div className="flex-shrink-0 bg-[#FFFCF8] pb-safe flex justify-center py-1 border-t border-[#F0E6DA]/50">
        <button
          onClick={() => setShowPrivacy(true)}
          className="text-[9px] text-[#C4B5A6] hover:text-[#A39080] transition-colors"
        >
          Privacy Policy
        </button>
      </div>

      {/* Export success + ad modal */}
      <ExportSuccessModal open={exportSuccess} onClose={() => setExportSuccess(false)} />
    </div>
  );
}

function ExportButton({ onSuccess }: { onSuccess: () => void }) {
  const handleClick = () => {
    // Trigger the canvas export (wired by PolaroidView via id)
    const btn = document.getElementById('export-btn-inner');
    btn?.click();
    // Show success modal after a short delay for the download to initiate
    setTimeout(onSuccess, 600);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-1.5 bg-[#8B6F5C] text-white text-xs font-semibold rounded-full hover:bg-[#7A6050] active:scale-95 transition-all shadow-sm"
    >
      {/* Hidden inner button that PolaroidView wires exportPNG to */}
      <span id="export-btn-inner" className="hidden" />
      Export
    </button>
  );
}

const tabIcons: Record<string, ReactNode> = {
  frame: <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/></svg>,
  edit: <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  text: <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"/></svg>,
  music: <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/></svg>,
};
