/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://nklg.thisisdarkstar.xyz/api/:path*', // Proxy to backend
      },
    ]
  },
};

export default nextConfig;
