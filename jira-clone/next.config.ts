import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/:path*", // Proxy to Backend
      },
    ];
  },
  images: {
    remotePatterns: [{
      protocol: 'http',
      hostname: 'localhost',
      port: "8080",
      pathname: "/image/**",
      search: ''
    }]
  }
};

export default nextConfig;
