/** @type {import('next').NextConfig} */
const path = require("path");

const initiativeRoutes = [
  ["afghan-girls-tech-academy", "girls-tech"],
  ["afghan-youth-coalition", "youth-coalition"],
  ["change-digital-library", "digital-library"],
  ["maktab-dar-khana", "maktab-dar-khana"],
  ["additional-learning-programs", "additional-learning"],
  ["nycp", "youth-consensus"],
];

const nextConfig = {
  eslint: {
    dirs: ["src"],
  },

  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },

  async redirects() {
    return [
      {
        source: "/current-programs",
        has: [{ type: "query", key: "tab", value: "girls-education" }],
        destination: "/girls-education",
        permanent: true,
      },
      {
        source: "/current-programs",
        has: [{ type: "query", key: "tab", value: "advocacy" }],
        destination: "/advocacy",
        permanent: true,
      },
      {
        source: "/current-programs",
        destination: "/programs",
        permanent: true,
      },
      {
        source: "/current-programs/girls-education",
        destination: "/girls-education",
        permanent: true,
      },
      {
        source: "/current-programs/advocacy",
        destination: "/advocacy",
        permanent: true,
      },
      {
        source: "/current-programs/youth-empowerment",
        destination: "/programs",
        permanent: true,
      },
      {
        source: "/get-involved/join-our-programs",
        destination: "/join",
        permanent: true,
      },
      {
        source: "/get-involved/partner-with-us",
        destination: "/partner",
        permanent: true,
      },
      {
        source: "/get-involved/volunteer-with-us",
        destination: "/volunteer",
        permanent: true,
      },
      ...initiativeRoutes.map(([legacyId, slug]) => ({
        source: `/updates/${legacyId}`,
        destination: `/${slug}`,
        permanent: true,
      })),
      {
        source: "/apply",
        destination: "/opportunities",
        permanent: true,
      },
      {
        source: "/apply/:id",
        destination: "/opportunities/:id",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/girls-education",
        destination: "/current-programs?tab=girls-education",
      },
      {
        source: "/advocacy",
        destination: "/current-programs?tab=advocacy",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },

  webpack(config) {
    // Add alias for @
    config.resolve.alias["@"] = path.resolve(__dirname, "src");

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: { not: /\.(css|scss|sass)$/ },
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        loader: "@svgr/webpack",
        options: {
          dimensions: false,
          titleProp: true,
        },
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

module.exports = nextConfig;
