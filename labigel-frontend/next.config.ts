import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploaded images are served by our own backend on the Docker network,
    // which Next's image optimizer refuses to fetch (private-IP/SSRF guard).
    // Skip optimization and let the browser load them directly.
    unoptimized: true,
  },
};

export default nextConfig;
