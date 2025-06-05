import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, // Proxy to Backend
      },
    ];
  },
  images: {
    remotePatterns: [
      process.env.NODE_ENV === "development" ?
        {
          protocol: 'http',
          hostname: 'localhost',
          port: "8080",
          pathname: "/image/**",
        } : {
          protocol: 'https',
          hostname: (process.env.NEXT_PUBLIC_API_URL)?.slice(7) ?? '',
          pathname: "/image/**"
        }]
  }
};

export default nextConfig;
