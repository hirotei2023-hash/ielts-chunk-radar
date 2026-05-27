import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/ielts-chunk-radar" : "",
  images: { unoptimized: true },
};

export default nextConfig;
