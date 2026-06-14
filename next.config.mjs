/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Disable strict type checking during build - address later
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amtmti.africa',
      },
      {
        protocol: 'https',
        hostname: 'supabase.co',
      },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
  // Optimize for production
  swcMinify: true,
  productionBrowserSourceMaps: false,
  compress: true,
}

export default nextConfig
