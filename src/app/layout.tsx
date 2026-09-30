import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polamuse — Made by you. Felt by them.",
  description:
    "Create stunning polaroid frames, instant film photos, and aesthetic photo cards. Add Spotify codes, custom text, vintage filters, and download in high quality.",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Polamuse",
  },
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0EB" },
    { media: "(prefers-color-scheme: dark)",  color: "#1A1714" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content in standalone mode */}
        <style>{`
          @media (display-mode: standalone) {
            html { background: #F5F0EB; }
          }
        `}</style>
      </head>
      <body>
        {children}
        {/* PWA service worker — production only to avoid caching dev chunks */}
        {process.env.NODE_ENV === "production" && (
          <Script
            id="sw-register"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `if('serviceWorker'in navigator){navigator.serviceWorker.register('/sw.js').catch(function(){});}`,
            }}
          />
        )}
      </body>
    </html>
  );
}
