/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // temporary until Sidekick has plugin autoselect
      {
        source: "/api/helloMoon/defi/tokenName",
        destination: "/api/handlers/tokenName",
      },
    ];
  },
};

module.exports = nextConfig;
