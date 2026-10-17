"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeskHeader } from "@/components/desk-header";
import { PhotoGrid } from "@/components/photo-grid";
import { deskWhen } from "@/lib/desk-time";

type ImageRow = { id: string; sort_order: number };
type Proposal = {
  id: string;
  created_at: string;
  client_name: string;
  title: string;
  description: string;
  token: string;
  expires_at: string;
  proposal_images: ImageRow[] | null;
};
type AuditRow = {
  id: string;
  created_at: string;
  event: string;
  detail: string | null;
  ip: string | null;
};

const eventLabel: Record<string, string> = {
  created: "Link created",
  viewed: "Opened by a client",
  regenerated: "New link, old one stopped",
  expired: "Opened after it closed",
};

export function DeskProposalPage({ proposal, audit }: { proposal: Proposal; audit: AuditRow[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const closed = new Date(proposal.expires_at).getTime() < Date.now();
  const images = [...(proposal.proposal_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  async function copy() {
    await navigator.clipboard.writeText(`${window.location.origin}/proposal/${proposal.token}`);
    setNotice("Link copied.");
  }

  async function regenerate() {
    setError("");
    const response = await fetch(`/api/desk/proposals/${proposal.id}/regenerate`, { method: "POST" });
    if (!response.ok) {
      setError("The link was not replaced.");
      return;
    }
    setNotice("New link ready. The previous link no longer opens.");
    router.refresh();
  }

  return (
    <main className="desk-wrap">
      <DeskHeader title={proposal.title} action={{ href: "/desk/proposals", label: "all proposals" }} />
      <article className="sheet sheet-yellow desk-card">
        <p className="kicker">{closed ? "link closed" : "open for 7 days"}</p>
        <p>
          {proposal.client_name} · created {deskWhen(proposal.created_at)} · closes {deskWhen(proposal.expires_at)}
        </p>
        <p>{proposal.description}</p>
        <PhotoGrid images={images.map((image) => ({ id: image.id, src: `/api/desk/images/${image.id}` }))} />
        <p className="desk-link">/proposal/{proposal.token}</p>
        <div className="desk-actions">
          <button className="btn" type="button" onClick={() => void copy()}>
            copy link
          </button>
          <button className="btn btn-green" type="button" onClick={() => void regenerate()}>
            new 7-day link
          </button>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        {notice ? <p className="desk-note">{notice}</p> : null}
        <h3>Audit</h3>
        {audit.length === 0 ? <p>No opens yet.</p> : null}
        <ul className="desk-audit">
          {audit.map((row) => (
            <li key={row.id}>
              <b>{eventLabel[row.event] ?? row.event}</b>
              <span>
                {deskWhen(row.created_at)}
                {row.ip ? ` · ${row.ip}` : ""}
                {row.detail ? ` · ${row.detail}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}
