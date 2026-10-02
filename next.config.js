/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    // NOTE: COEP "require-corp" intentionally NOT set: it blocks the Sandpack
    // iframe (codesandbox.io bundler) and Monaco's CDN loader.
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

module.exports = nextConfig;
