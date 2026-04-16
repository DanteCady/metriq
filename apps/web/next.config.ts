import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@metriq/ui", "@metriq/types", "@metriq/validators"],
  webpack: (config, { dev }) => {
    // Avoid occasional ENOENT corruption in `.next/cache/webpack/*` pack files on dev machines.
    // This trades some rebuild speed for stability.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;

