/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Add this line
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // Add this line
}

module.exports = nextConfig