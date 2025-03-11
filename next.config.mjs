/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/wecoded-game-new' : '',
  images: {
    unoptimized: true,
  },
  // Disable server API route to make static build work
  rewrites: () => [],
  // Ensure trailingSlash for proper routing on GitHub Pages
  trailingSlash: true,
  // Turn off image optimization that doesn't work with static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media2.dev.to',
      },
      {
        protocol: 'https',
        hostname: 'dev-to-uploads.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;