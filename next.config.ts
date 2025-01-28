import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    dirs: ["src"],
  },
  images: {
    remotePatterns: [
      {
        hostname: 'picsum.photos',
      },
    ]
  }
};

export default nextConfig;
