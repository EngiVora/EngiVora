import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  // Fix for multiple lockfiles warning
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
