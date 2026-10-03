import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Reduce dev-mode memory pressure
  typescript: {
    // Skip type-checking during `next dev` — run `tsc --noEmit` separately
    ignoreBuildErrors: false,
  },
  experimental: {
    // Reduce watcher overhead on Windows
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
