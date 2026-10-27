import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // In Codespaces the page opens at https://<name>-3000.app.github.dev. Next's dev server
  // blocks origins it does not know; this entry allows the Codespaces addresses.
  // https://nextjs.org/docs/pages/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: ['*.app.github.dev'],
}

export default nextConfig
