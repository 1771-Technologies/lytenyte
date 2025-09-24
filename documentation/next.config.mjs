import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Esclude react-native from webpack
    config.resolve.alias["react-native"] = false; // Ignore react-native-fs
    config.resolve.alias["react-native-fs"] = false; // Ignore react-native-fs
    config.resolve.alias["react-native-fetch-blob"] = false; // Ignore react-native-fetch-blob
    return config;
  },
  basePath: "/",

  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
    ];
  },
};

export default withMDX(config);
