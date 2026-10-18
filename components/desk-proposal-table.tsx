"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  client: string;
  title: string;
  created: string;
  closes: string;
  closed: boolean;
};

export function DeskProposalTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState("");

  function open(id: string) {
    router.push(`/desk/proposals/${id}`);
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setPendingId(id);
    setError("");
    const response = await fetch(`/api/desk/proposals/${id}`, { method: "DELETE" });
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setPendingId("");
    if (!response.ok) {
      setError(body?.error ?? "That proposal was not deleted.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="desk-table-wrap">
      {error ? <p className="form-error desk-table-error">{error}</p> : null}
      <table className="desk-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Title</th>
            <th>Created</th>
            <th>Closes</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="desk-row"
              tabIndex={0}
              role="link"
              aria-label={`Open ${row.title}`}
              onClick={() => open(row.id)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                open(row.id);
              }}
            >
              <td>{row.client}</td>
              <td>{row.title}</td>
              <td>{row.created}</td>
              <td>{row.closes}</td>
              <td>
                <span className={row.closed ? "desk-status is-closed" : "desk-status"}>{row.closed ? "closed" : "open"}</span>
              </td>
              <td onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                <div className="desk-row-actions">
                  <button className="btn btn-green" type="button" onClick={() => router.push(`/desk/proposals/${row.id}?edit=1`)}>
                    edit
                  </button>
                  <button className="btn btn-pink" type="button" disabled={pendingId === row.id} onClick={() => void remove(row.id, row.title)}>
                    {pendingId === row.id ? "deleting" : "delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
