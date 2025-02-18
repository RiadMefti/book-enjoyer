import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
