import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "firebasestorage.googleapis.com", "cdn.jsdelivr.net", "avatars.githubusercontent.com"],
  },
};

export default withNextIntl(nextConfig);
