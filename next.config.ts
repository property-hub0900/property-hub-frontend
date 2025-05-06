import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "images.unsplash.com",
      "cdn.jsdelivr.net",
      "avatars.githubusercontent.com",
    ],
  },
};

export default withNextIntl(nextConfig);
