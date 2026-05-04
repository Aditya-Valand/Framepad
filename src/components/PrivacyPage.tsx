interface PrivacyPageProps {
  onBack: () => void;
}

export function PrivacyPage({ onBack }: PrivacyPageProps) {
  return (
    <div className="h-dvh flex flex-col bg-[#FBF8F4] overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-[#FFFCF8] border-b border-[#F0E6DA] px-5 py-3 flex items-center gap-3 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0E6DA] transition-colors"
          aria-label="Back"
        >
          <svg className="w-4 h-4 text-[#5C4A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1
          className="tracking-wide"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.35rem', lineHeight: 1 }}
        >
          <span style={{ fontWeight: 500, fontStyle: 'normal', color: '#1A1814', letterSpacing: '0.04em' }}>Pola</span><span style={{ fontWeight: 400, fontStyle: 'italic', color: '#8B6F5C', letterSpacing: '0.01em' }}>muse</span>
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-5 py-6 max-w-2xl mx-auto w-full">
        <h2 className="text-xl font-semibold text-[#1A1814] mb-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          Privacy Policy
        </h2>
        <p className="text-xs text-[#A39080] mb-6">Last updated: May 4, 2026</p>

        {[
          {
            title: '1. Overview',
            body: 'Polamuse ("we", "our", "us") is a free web-based polaroid photo editor. We are committed to protecting your privacy. This policy explains what information we collect and how it is used.',
          },
          {
            title: '2. Information We Collect',
            body: 'Polamuse processes all photos entirely in your browser. No images you upload are ever sent to our servers. We do not collect, store, or share your photos.\n\nWe may collect anonymous usage analytics (page views, feature interactions) to improve the product. This data contains no personally identifiable information.',
          },
          {
            title: '3. Google AdSense',
            body: 'We use Google AdSense to display advertisements. Google may use cookies and similar technologies to show you relevant ads based on your browsing activity across websites. Google\'s use of advertising cookies enables it and its partners to serve ads based on your visit to Polamuse and other sites on the internet.\n\nYou may opt out of personalised advertising by visiting https://www.google.com/settings/ads.',
          },
          {
            title: '4. Cookies',
            body: 'We do not set first-party cookies. Third-party services (Google AdSense) may set cookies on your device. You can control cookies through your browser settings.',
          },
          {
            title: '5. Third-Party Services',
            body: 'Polamuse integrates with the Spotify Scannables API to generate Spotify codes. Your Spotify URL is sent directly to Spotify\'s servers to fetch the barcode image. Please refer to Spotify\'s privacy policy for details on how they handle this data.',
          },
          {
            title: '6. Children\'s Privacy',
            body: 'Polamuse is not directed at children under the age of 13. We do not knowingly collect personal information from children.',
          },
          {
            title: '7. Changes to This Policy',
            body: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.',
          },
          {
            title: '8. Contact',
            body: 'If you have questions about this Privacy Policy, please contact us at: privacy@polamuse.app',
          },
        ].map(({ title, body }) => (
          <section key={title} className="mb-6">
            <h3 className="text-sm font-semibold text-[#5C4A3A] mb-2">{title}</h3>
            <p className="text-sm text-[#7A6A5A] leading-relaxed whitespace-pre-line">{body}</p>
          </section>
        ))}
      </main>
    </div>
  );
}
