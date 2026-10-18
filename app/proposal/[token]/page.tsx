import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProposalDocument } from "@/components/proposal-document";
import { writeAudit } from "@/lib/proposals";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proposal",
  robots: { index: false, follow: false },
};

export default async function ProposalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) notFound();

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, client_name, title, description, expires_at, proposal_images(id, sort_order)")
    .eq("token", token)
    .maybeSingle();
  if (!proposal) notFound();

  const headerList = await headers();
  const ip = (headerList.get("x-forwarded-for") ?? "unknown").split(",")[0]?.trim() || "unknown";
  const closed = new Date(proposal.expires_at).getTime() < Date.now();
  if (closed) {
    await writeAudit(proposal.id, "expired", ip);
    return (
      <main className="desk-wrap">
        <section className="sheet sheet-yellow desk-card">
          <p className="kicker">proposal</p>
          <h1 className="plain-title">This link has closed.</h1>
          <p>Ask Flow With The Trend for a new one.</p>
        </section>
      </main>
    );
  }

  await writeAudit(proposal.id, "viewed", ip);
  const images = [...(proposal.proposal_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const closes = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(proposal.expires_at));

  return (
    <main className="desk-wrap">
      <article className="sheet sheet-yellow proposal-doc">
        <p className="kicker">Flow With The Trend · for {proposal.client_name}</p>
        <h1 className="plain-title">{proposal.title}</h1>
        <p>This link closes on {closes}. The pictures are marked with the studio name.</p>
        <ProposalDocument
          description={proposal.description}
          images={images.map((image) => ({ id: image.id, src: `/api/proposal/${token}/image/${image.id}` }))}
        />
      </article>
    </main>
  );
}
