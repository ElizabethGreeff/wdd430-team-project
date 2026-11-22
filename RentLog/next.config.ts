import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // Condition report photos are sent through a Server Action. The default limit is 1 MB;
    // lib/upload-rules.ts caps photos at 4 MB per report, and Vercel caps requests at 4.5 MB.
    serverActions: {
      bodySizeLimit: "4.5mb",
    },
  },
  images: {
    // Condition report photos are stored in Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
