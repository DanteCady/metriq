import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@metriq/ui", "@metriq/types", "@metriq/validators"],
};

export default nextConfig;

