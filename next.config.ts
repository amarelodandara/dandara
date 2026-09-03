import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
