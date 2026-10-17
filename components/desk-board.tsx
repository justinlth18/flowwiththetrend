"use client";

import { useState } from "react";
import { DeskHeader } from "@/components/desk-header";

export function DeskBoard() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function createProposal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = event.currentTarget;
    const response = await fetch("/api/desk/proposals", { method: "POST", body: new FormData(form) });
    const body = (await response.json().catch(() => null)) as { error?: string; id?: string } | null;
    setPending(false);
    if (!response.ok || !body?.id) {
      setError(body?.error ?? "That proposal was not saved.");
      return;
    }
    window.location.assign(`/desk/proposals/${body.id}`);
  }

  return (
    <main className="desk-wrap">
      <DeskHeader title="New proposal" action={{ href: "/desk/proposals", label: "your proposals" }} />

      <form className="sheet sheet-yellow desk-card" onSubmit={createProposal}>
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
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "marking pictures" : "create the link"}
        </button>
      </form>
    </main>
  );
}
