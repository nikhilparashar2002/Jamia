/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      }
    ],
  },

  // Add redirect and rewrite rules
  async redirects() {
    return [
      {
        source: '/blog/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            value: '1',
          },
        ],
        destination: '/blog/:path*',
        permanent: true,
      },
    ];
  },

  // Handle trailing slashes consistently
  trailingSlash: false,

  // Optimize performance
  poweredByHeader: false,
};

export default nextConfig;