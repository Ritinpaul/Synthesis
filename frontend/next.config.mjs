/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/workspaces/:path*',
        destination: 'http://127.0.0.1:8001/workspaces/:path*',
      },
      {
        source: '/workspaces',
        destination: 'http://127.0.0.1:8001/workspaces',
      },
      {
        source: '/query/:path*',
        destination: 'http://127.0.0.1:8001/query/:path*',
      },
      {
        source: '/pr/:path*',
        destination: 'http://127.0.0.1:8001/pr/:path*',
      },
      {
        source: '/repos/:path*',
        destination: 'http://127.0.0.1:8001/repos/:path*',
      },
      {
        source: '/health/:path*',
        destination: 'http://127.0.0.1:8001/health/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://127.0.0.1:8001/auth/:path*',
      },
      {
        source: '/docs',
        destination: 'http://127.0.0.1:8001/docs',
      },
      {
        source: '/openapi.json',
        destination: 'http://127.0.0.1:8001/openapi.json',
      },
    ];
  },
};

export default nextConfig;
