import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ["@prisma/client"],
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
