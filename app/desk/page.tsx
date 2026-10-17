import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DeskBoard } from "@/components/desk-board";
import { DeskLogin } from "@/components/desk-login";
import { deskConfigured, deskCookie, sessionValid } from "@/lib/desk-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Desk",
  robots: { index: false, follow: false },
};

export default async function DeskPage() {
  if (!deskConfigured()) {
    return (
      <main className="desk-wrap">
        <section className="sheet sheet-yellow desk-card">
          <p className="kicker">studio desk</p>
          <h1 className="plain-title">Not set up yet.</h1>
          <p>Add the desk secrets on the server, then open this page again.</p>
        </section>
      </main>
    );
  }

  const jar = await cookies();
  if (!sessionValid(jar.get(deskCookie)?.value)) return <DeskLogin />;
  return <DeskBoard />;
}
