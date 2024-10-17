/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
  images: {
    domains: ['res.cloudinary.com', 'cloudinary.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        url: 'url/',
        zlib: 'browserify-zlib',
        http: 'stream-http',
        https: 'https-browserify',
        assert: 'assert/',
        os: 'os-browserify/browser',
        path: 'path-browserify',
      };
    }
    return config;
  },
};

export default nextConfig;
