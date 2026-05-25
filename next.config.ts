import type { NextConfig } from "next";

/** Matches Hero and other clients that default the API to localhost:8080 when unset */
const defaultPublicApiUrl = "http://localhost:8080";
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL ?? defaultPublicApiUrl;
const apiUrl = new URL(publicApiUrl);

function isLoopbackApiUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname === "::1"
    );
  } catch {
    return false;
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.finexbd.com'],
  images: {
    // Next 16+ refuses to optimize remote images that resolve to private IPs unless this is set.
    dangerouslyAllowLocalIP:
      apiUrl.hostname === "localhost" ||
      apiUrl.hostname === "127.0.0.1",

    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port || "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
