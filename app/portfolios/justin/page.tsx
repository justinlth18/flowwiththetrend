import type { Metadata } from "next";
import { JustinSite } from "@/components/justin-site";

export const metadata: Metadata = {
  title: { absolute: "Justin Looi Teng Hein" },
  description:
    "Portfolio of Justin Looi Teng Hein, frontend developer and UI/UX designer in Petaling Jaya. CROSSUB contract, white-label React and Next.js, and a cybersecurity degree.",
};

export default function JustinPortfolioPage() {
  return <JustinSite />;
}
