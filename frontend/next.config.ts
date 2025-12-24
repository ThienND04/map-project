import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  reactCompiler: true,
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
};

export default nextConfig;
