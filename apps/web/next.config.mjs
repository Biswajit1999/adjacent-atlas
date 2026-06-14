/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@adjacent-atlas/engine", "@adjacent-atlas/ui"],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
