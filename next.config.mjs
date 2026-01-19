/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude admin folder from TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dekoartizan.com',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
