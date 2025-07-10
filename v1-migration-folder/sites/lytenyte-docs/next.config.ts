import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMdx = createMDX({});

const nextConfig: NextConfig = {
  webpack: (webpackConfig, { webpack }) => {
    webpackConfig.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    };
    return webpackConfig;
  },
};

export default withMdx(nextConfig);
