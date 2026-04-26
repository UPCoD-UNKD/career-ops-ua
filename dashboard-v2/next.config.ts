import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, ".."),
  outputFileTracingIncludes: {
    "/*": [
      "./scripts/**/*",
      "./templates/**/*",
      "./portals/**/*",
      "./config/**/*",
      "./data/**/*",
      "./fonts/**/*",
      "../portals/**/*",
      "../templates/**/*",
      "../generate-pdf.mjs",
    ],
  },
};

export default nextConfig;
