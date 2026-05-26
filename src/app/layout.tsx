import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polamuse — Made by you. Felt by them.",
  description:
    "Create stunning polaroid frames, instant film photos, and aesthetic photo cards online for free. Add Spotify codes, custom text, vintage filters, and download in high quality.",
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
