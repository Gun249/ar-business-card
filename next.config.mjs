/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // เพิ่ม optimization สำหรับความเร็ว
  experimental: {
    turbo: {
      rules: {
        '*.scss': {
          loaders: ['sass-loader'],
        },
      },
    },
  },
  // ปรับปรุง performance
  swcMinify: true,
  reactStrictMode: true,
  // ลด memory usage
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
