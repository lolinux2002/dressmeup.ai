/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  images: {
    domains: ['storage.theapi.app', 'i.ibb.co'],
    formats: ['image/avif', 'image/webp'],
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
}

module.exports = nextConfig 