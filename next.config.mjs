/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Set the base path to /we-coded in production
  basePath: process.env.NODE_ENV === 'production' ? '/we-coded' : '',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Other settings
  reactStrictMode: true,
};

export default nextConfig;