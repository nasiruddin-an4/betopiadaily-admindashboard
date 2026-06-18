/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/erp/:path*',
        destination: 'https://dev.erp.betopialimited.com/:path*',
      },
    ];
  },
};

export default nextConfig;
