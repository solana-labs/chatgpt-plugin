/** @type {import('next').NextConfig} */
const nextConfig = {
  //   headers() {
  //     return [
  //       {
  //         headers: [
  //           { key: "Access-Control-Allow-Credentials", value: "true" },
  //           { key: "Access-Control-Allow-Origin", value: "chat.openai.com" },
  //           {
  //             key: "Access-Control-Allow-Methods",
  //             value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  //           },
  //           {
  //             key: "Access-Control-Allow-Headers",
  //             value:
  //               "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  //           },
  //         ],
  //         source: "/.well-known/:path*",
  //       },
  //     ];
  //   },
  //   async redirects() {
  //     return [
  //         {
  //           source: "/.well-known/:path*",
  //           destination: "/api/.well-known/:path*",
  //           permanent: true,
  //         },
  //     ];
  //   },
};

module.exports = nextConfig;
