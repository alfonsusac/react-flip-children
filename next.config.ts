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
      {
        hostname: 'images.genius.com',
      },
      {
        hostname: 'www.heroui.com',
      },
    ]
  }
};

export default nextConfig;
