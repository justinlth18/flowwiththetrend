import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./portfolio.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: { absolute: "Nicson Chang Zhiyang" },
  description:
    "Portfolio of Nicson Chang Zhiyang, regional manager for Mixue Malaysia, covering retail operations, franchise support, and sales.",
};

export const viewport: Viewport = {
  themeColor: "#10130f",
  width: "device-width",
  initialScale: 1,
};

export default function NicsonLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${figtree.variable} ${fraunces.variable} nix`}>{children}</div>;
}
