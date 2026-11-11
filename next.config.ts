import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Demo prototype: keep it out of search engines so it is never mistaken for an official Beez site.
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

// `npm run build:static` sets STATIC_EXPORT=1 to produce a server-less preview in ./out
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isStatic ? {
  output: "export",
  trailingSlash: true,
  // GitHub Pages serves a project site under /<repo>; the workflow sets BASE_PATH.
  basePath: process.env.BASE_PATH || undefined,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_STATIC_DEMO: "1" },
} : {
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
