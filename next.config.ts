import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Helps Next.js choose the correct workspace root in environments with multiple lockfiles (e.g., Vercel)
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
