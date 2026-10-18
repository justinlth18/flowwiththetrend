import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { DeskLogin } from "@/components/desk-login";
import { DeskProposalPage } from "@/components/desk-proposal-page";
import { deskConfigured, deskCookie, sessionValid } from "@/lib/desk-auth";
import { loadDeskProposal } from "@/lib/proposals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proposal",
  robots: { index: false, follow: false },
};

export default async function DeskProposalRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  if (!deskConfigured()) {
    return (
      <main className="desk-wrap">
        <section className="sheet sheet-yellow desk-card">
          <p className="kicker">studio desk</p>
          <h1 className="plain-title">Not set up yet.</h1>
        </section>
      </main>
    );
  }

  const jar = await cookies();
  if (!sessionValid(jar.get(deskCookie)?.value)) return <DeskLogin />;

  const { id } = await params;
  const { edit } = await searchParams;
  const loaded = await loadDeskProposal(id);
  if (!loaded) notFound();

  return <DeskProposalPage proposal={loaded.proposal} audit={loaded.audit} startEditing={edit === "1"} />;
}
