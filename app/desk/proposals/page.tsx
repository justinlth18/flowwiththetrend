import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DeskHeader } from "@/components/desk-header";
import { DeskLogin } from "@/components/desk-login";
import { DeskProposalTable } from "@/components/desk-proposal-table";
import { deskConfigured, deskCookie, sessionValid } from "@/lib/desk-auth";
import { deskWhen } from "@/lib/desk-time";
import { listDeskProposals } from "@/lib/proposals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proposals",
  robots: { index: false, follow: false },
};

export default async function DeskProposalsPage() {
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

  const proposals = await listDeskProposals();

  return (
    <main className="desk-wrap">
      <DeskHeader title="Your proposals" action={{ href: "/desk", label: "new proposal" }} />
      {proposals.length === 0 ? (
        <section className="sheet sheet-yellow desk-card">
          <p>No proposals yet. Create one and it will show up in this table.</p>
        </section>
      ) : (
        <DeskProposalTable
          rows={proposals.map((proposal) => ({
            id: proposal.id,
            client: proposal.client_name,
            title: proposal.title,
            created: deskWhen(proposal.created_at),
            closes: deskWhen(proposal.expires_at),
            closed: new Date(proposal.expires_at).getTime() < Date.now(),
          }))}
        />
      )}
    </main>
  );
}
