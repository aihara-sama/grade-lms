import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    outputFileTracingIncludes: {
      "/api/send-notification": ["./config/**/*"],
    },
  },
};

export default withNextIntl(nextConfig);
