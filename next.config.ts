import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Matches any domain name (e.g., res.cloudinary.com, images.unsplash.com)
        pathname: '/**', // Matches any file path on those domains
      },
      {
        protocol: 'http',
        hostname: '**', // Also matches insecure http links if any external images use them
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;