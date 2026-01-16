/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude admin folder from TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
