import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
    "theme-color": "#F5F0EB",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Courier+Prime&family=Dancing+Script:wght@400;500;600;700&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&family=Great+Vibes&family=Inter:wght@400;500;600;700&family=Lora:wght@400;700&family=Montserrat:wght@400;600;700&family=Parisienne&family=Playfair+Display:wght@400;700&family=Sacramento&family=Satisfy&family=Special+Elite&family=Caveat:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  );
}
