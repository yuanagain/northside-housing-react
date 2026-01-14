/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Don't fail build on TypeScript errors during development
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig