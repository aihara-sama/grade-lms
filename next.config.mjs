/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    outputFileTracingIncludes: {
      "/api/send-notification": ["./config/**/*"],
    },
  },
};

export default nextConfig;
