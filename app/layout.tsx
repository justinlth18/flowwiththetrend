import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { Fredoka, Lilita_One } from "next/font/google";
import { EnterAnimation } from "@/components/enter-animation";
import { Footer } from "@/components/footer";
import { ProposalReturn } from "@/components/proposal-return";
import { ThemeBackground } from "@/components/theme-background";
import { studio } from "@/lib/content";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});

const lilita = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lilita",
});

export const metadata: Metadata = {
  title: {
    default: "Flow With The Trend — restaurant websites and portfolios",
    template: "%s · Flow With The Trend",
  },
  description: studio.description,
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#fff200",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const solo =
    pathname.startsWith("/portfolios/lee-kar-meng") ||
    pathname.startsWith("/portfolios/nicson-chang-zhiyang") ||
    pathname.startsWith("/portfolios/justin");
  const quiet = pathname.startsWith("/desk") || pathname.startsWith("/proposal");

  return (
    <html lang="en" className={solo ? undefined : `${fredoka.variable} ${lilita.variable}`}>
      <body>
        {solo ? (
          children
        ) : quiet ? (
          <>
            <ThemeBackground />
            <div id="content">{children}</div>
          </>
        ) : (
          <>
            <ThemeBackground />
            <a className="skip" href="#content">
              Skip to content
            </a>
            <EnterAnimation />
            <div id="content">{children}</div>
            <Footer />
            <Suspense fallback={null}>
              <ProposalReturn />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}
