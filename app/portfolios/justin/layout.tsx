import type { Metadata, Viewport } from "next";
import { Rajdhani } from "next/font/google";
import GradientASCII from "@/components/gradient-ascii";
import "./portfolio.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-holo",
});

export const metadata: Metadata = {
  title: { absolute: "Justin Looi Teng Hein" },
  description:
    "Portfolio of Justin Looi Teng Hein, frontend developer and UI/UX designer in Petaling Jaya. CROSSUB contract, white-label React and Next.js, and a cybersecurity degree.",
};

export const viewport: Viewport = {
  themeColor: "#1a0a16",
  width: "device-width",
  initialScale: 1,
};

export default function JustinLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${rajdhani.variable} note`}>
      <GradientASCII className="desk" colors={["#12060e", "#4a1830", "#c45c78", "#1c0a12"]} />
      {children}
    </div>
  );
}
