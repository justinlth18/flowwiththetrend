import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/api/desk/proposals": ["./lib/fonts/LilitaOne-Regular.ttf"],
    "/api/desk/proposals/[id]": ["./lib/fonts/LilitaOne-Regular.ttf"],
    "/api/desk/proposals/template": [
      "./lib/fonts/LilitaOne-Regular.ttf",
      "./content/proposals/schmidt-hr/mbo-a-1.png",
      "./content/proposals/schmidt-hr/mbo-a-2.png",
      "./content/proposals/schmidt-hr/mbo-a-3.jpg",
      "./content/proposals/schmidt-hr/mbo-b-1.png",
      "./content/proposals/schmidt-hr/increment-a-1.jpg",
      "./content/proposals/schmidt-hr/increment-b-1.png",
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
