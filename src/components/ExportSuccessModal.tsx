'use client';

import { AdBanner } from '@/components/AdBanner';

interface ExportSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Shown after a successful export.
 * Contains a single AdSense rectangle unit — the highest-converting placement
 * because the user has just completed their goal and is in a receptive moment.
 */
export function ExportSuccessModal({ open, onClose }: ExportSuccessModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full max-w-md bg-[#FFFCF8] rounded-t-2xl px-5 pt-5 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-[#E0D5C9] rounded-full mx-auto mb-5" />

        {/* Success message */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#8B6F5C]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#8B6F5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1A1814]">Saved to your device</p>
            <p className="text-xs text-[#A39080] mt-0.5">Your polaroid is ready to share</p>
          </div>
        </div>

        {/* Ad unit */}
        <AdBanner
          slot="XXXXXXXXXX"
          format="rectangle"
          className="w-full min-h-[100px] rounded-xl overflow-hidden bg-[#F5EDE5]"
        />

        {/* Dismiss */}
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-xl border border-[#E8DFD6] text-sm text-[#8B7B6B] font-medium active:bg-[#F5EDE5] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
