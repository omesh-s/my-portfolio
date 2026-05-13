import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGitHubActions && repositoryName ? `/${repositoryName}` : "",
  assetPrefix: isGitHubActions && repositoryName ? `/${repositoryName}/` : undefined,
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
