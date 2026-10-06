import type { Metadata, Viewport } from "next";
import { Manrope, Syne } from "next/font/google";
import "./portfolio.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: { absolute: "Lee Kar Meng" },
  description:
    "Portfolio of Lee Kar Meng, a business administration graduate. Sales, media admin, and IT service desk experience.",
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
  width: "device-width",
  initialScale: 1,
};

export default function LeeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${manrope.variable} ${syne.variable} lee`}>{children}</div>;
}
