/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Explicitly define the app directory
  // dir: process.cwd(),
}

module.exports = nextConfig
