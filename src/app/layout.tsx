import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#F5F0EB",
};

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  title: "Polamuse — Made by you. Felt by them.",
  description:
    "Create stunning polaroid frames, instant film photos, and aesthetic photo cards online for free. Add Spotify codes, custom text, vintage filters, and download in high quality.",
  keywords:
    "polaroid frame maker, polaroid photo editor, instant film photo, polaroid filter online, polaroid template, aesthetic photo frame, polaroid with spotify, vintage photo frame",
  authors: [{ name: "Polamuse" }],
  openGraph: {
    type: "website",
    url: "https://polamuse.netlify.app/",
    siteName: "Polamuse",
    title: "Polamuse — Free Polaroid Photo Frame Maker",
    description:
      "Turn any photo into a beautiful polaroid or instant film frame online. Add Spotify codes, captions, vintage effects, and more. Free & instant.",
    images: [
      {
        url: "https://polamuse.netlify.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Polamuse — Polaroid Photo Frame Maker",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@polamuse",
    title: "Polamuse — Free Polaroid Photo Frame Maker",
    description:
      "Turn any photo into a beautiful polaroid or instant film frame online. Add Spotify codes, captions, vintage effects, and more. Free & instant.",
    images: ["https://polamuse.netlify.app/og-image.jpg"],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Polamuse",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
