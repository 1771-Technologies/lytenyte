import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const withMdx = createMDX({});

const nextConfig: NextConfig = {};

export default withMdx(nextConfig);
