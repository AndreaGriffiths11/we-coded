/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: [
      'media2.dev.to',
      'dev-to-uploads.s3.amazonaws.com',
      'res.cloudinary.com',
      'picsum.photos'
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;