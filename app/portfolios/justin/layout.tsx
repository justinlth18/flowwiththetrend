import type { Metadata, Viewport } from "next";
import { Caveat, Kalam } from "next/font/google";
import "./portfolio.css";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pen",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: { absolute: "Justin Looi Teng Hein" },
  description:
    "Portfolio of Justin Looi Teng Hein, frontend developer and UI/UX designer in Petaling Jaya. CROSSUB contract, white-label React and Next.js, and a cybersecurity degree.",
};

export const viewport: Viewport = {
  themeColor: "#c4a574",
  width: "device-width",
  initialScale: 1,
};

export default function JustinLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${kalam.variable} ${caveat.variable} note`}>{children}</div>;
}
