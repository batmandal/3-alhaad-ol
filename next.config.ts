import type { NextConfig } from "next"
import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
      // Гадны домэйнээс зураг авах зөвшөөрөл
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'http', 
          hostname: 'localhost',
          port: '8080',
          pathname: '/**',
        },
      ],
    },
    
  reactStrictMode: true,
};

export default nextConfig;
