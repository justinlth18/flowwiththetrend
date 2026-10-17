"use client";

import { useEffect, useState } from "react";

type ImageRow = { id: string; sort_order: number };
type ProposalRow = {
  id: string;
  created_at: string;
  client_name: string;
  title: string;
  description: string;
  token: string;
  expires_at: string;
  proposal_images: ImageRow[];
};
type AuditRow = {
  id: string;
  proposal_id: string;
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

function when(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value));
}

export function DeskBoard() {
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function load() {
    const response = await fetch("/api/desk/proposals");
    if (response.status === 401) {
      window.location.assign("/desk");
      return;
    }
    const body = (await response.json()) as { proposals?: ProposalRow[]; audit?: AuditRow[] };
    setProposals(body.proposals ?? []);
    setAudit(body.audit ?? []);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function createProposal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");
    const form = event.currentTarget;
    const response = await fetch("/api/desk/proposals", { method: "POST", body: new FormData(form) });
    const body = (await response.json().catch(() => null)) as { error?: string; token?: string } | null;
    setPending(false);
    if (!response.ok || !body?.token) {
      setError(body?.error ?? "That proposal was not saved.");
      return;
    }
    form.reset();
    setNotice("Proposal saved. Copy the link below and send it to the client.");
    await load();
  }

  async function regenerate(id: string) {
    setError("");
    const response = await fetch(`/api/desk/proposals/${id}/regenerate`, { method: "POST" });
    if (!response.ok) {
      setError("The link was not replaced.");
      return;
    }
    setNotice("New link ready. The previous link no longer opens.");
    await load();
  }

  async function copy(token: string) {
    const url = `${window.location.origin}/proposal/${token}`;
    await navigator.clipboard.writeText(url);
    setNotice("Link copied.");
  }

  async function logout() {
    await fetch("/api/desk/logout", { method: "POST" });
    window.location.assign("/desk");
  }

  return (
    <main className="desk-wrap">
      <header className="desk-top">
        <div>
          <p className="kicker">studio desk</p>
          <h1 className="plain-title">Proposals</h1>
        </div>
        <button className="btn" type="button" onClick={() => void logout()}>
          lock the desk
        </button>
      </header>

      <form className="sheet sheet-yellow desk-card" onSubmit={createProposal}>
        <h2 className="plain-title">New proposal</h2>
        <p>Pictures are marked with the studio name before they are stored. The client link lasts 7 days.</p>
        <div className="field-row">
          <label className="field">
            Client
            <input name="clientName" required minLength={2} maxLength={80} />
          </label>
          <label className="field">
            Title
            <input name="title" required minLength={2} maxLength={120} />
          </label>
        </div>
        <label className="field">
          Description
          <textarea name="description" required minLength={10} maxLength={4000} />
        </label>
        <label className="field">
          Pictures
          <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple required />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        {notice ? <p className="desk-note">{notice}</p> : null}
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "marking pictures" : "create the link"}
        </button>
      </form>

      <section className="desk-list">
        {proposals.map((proposal) => {
          const closed = new Date(proposal.expires_at).getTime() < Date.now();
          const rows = audit.filter((item) => item.proposal_id === proposal.id).slice(0, 12);
          const images = [...(proposal.proposal_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
          return (
            <article className="sheet desk-card" key={proposal.id}>
              <p className="kicker">{closed ? "link closed" : "open for 7 days"}</p>
              <h2 className="plain-title">{proposal.title}</h2>
              <p>
                {proposal.client_name} · closes {when(proposal.expires_at)}
              </p>
              <p>{proposal.description}</p>
              <div className="desk-photos">
                {images.map((image) => (
                  <img key={image.id} src={`/api/desk/images/${image.id}`} alt="" />
                ))}
              </div>
              <p className="desk-link">/proposal/{proposal.token}</p>
              <div className="desk-actions">
                <button className="btn" type="button" onClick={() => void copy(proposal.token)}>
                  copy link
                </button>
                <button className="btn btn-green" type="button" onClick={() => void regenerate(proposal.id)}>
                  new 7-day link
                </button>
              </div>
              <h3>Audit</h3>
              {rows.length === 0 ? <p>No opens yet.</p> : null}
              <ul className="desk-audit">
                {rows.map((row) => (
                  <li key={row.id}>
                    <b>{eventLabel[row.event] ?? row.event}</b>
                    <span>
                      {when(row.created_at)}
                      {row.ip ? ` · ${row.ip}` : ""}
                      {row.detail ? ` · ${row.detail}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
    </main>
  );
}
