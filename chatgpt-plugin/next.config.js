/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      // {
      //   source: "/",
      //   destination: "https://solana.com/developers/ai",
      //   permanent: false,
      // },
    ];
  },
};

module.exports = nextConfig;
