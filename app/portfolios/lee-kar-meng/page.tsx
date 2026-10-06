import type { Metadata } from "next";
import { LeeSite } from "@/components/lee-site";

export const metadata: Metadata = {
  title: { absolute: "Lee Kar Meng" },
  description:
    "Portfolio of Lee Kar Meng, a business administration graduate. Sales, media admin, and IT service desk experience.",
};

export default function LeePortfolioPage() {
  return <LeeSite />;
}
