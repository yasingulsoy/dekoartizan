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
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || process.env.API_URL || '';
    
    // Eğer backendUrl boşsa veya geçersizse rewrites ekleme
    if (!backendUrl || backendUrl.trim() === '') {
      return [];
    }
    
    try {
      // URL'in geçerli olup olmadığını kontrol et
      new URL(backendUrl);
      
      return [
        {
          source: '/uploads/:path*',
          destination: `${backendUrl}/uploads/:path*`,
        },
      ];
    } catch (error) {
      // Geçersiz URL durumunda boş array döndür
      console.warn('Invalid BACKEND_URL, skipping rewrites:', backendUrl);
      return [];
    }
  },
};

export default nextConfig;
