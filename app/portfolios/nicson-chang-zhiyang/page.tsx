import type { Metadata } from "next";
import { NicsonSite } from "@/components/nicson-site";

export const metadata: Metadata = {
  title: { absolute: "Nicson Chang Zhiyang" },
  description:
    "Portfolio of Nicson Chang Zhiyang, regional manager for Mixue Malaysia, covering retail operations, franchise support, and sales.",
};

export default function NicsonPortfolioPage() {
  return <NicsonSite />;
}
