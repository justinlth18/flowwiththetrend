import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DeskHeader } from "@/components/desk-header";
import { DeskLogin } from "@/components/desk-login";
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
        <div className="desk-table-wrap">
          <table className="desk-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Title</th>
                <th>Created</th>
                <th>Closes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => {
                const closed = new Date(proposal.expires_at).getTime() < Date.now();
                return (
                  <tr key={proposal.id}>
                    <td>{proposal.client_name}</td>
                    <td>
                      <a href={`/desk/proposals/${proposal.id}`}>{proposal.title}</a>
                    </td>
                    <td>{deskWhen(proposal.created_at)}</td>
                    <td>{deskWhen(proposal.expires_at)}</td>
                    <td>
                      <span className={closed ? "desk-status is-closed" : "desk-status"}>{closed ? "closed" : "open"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
