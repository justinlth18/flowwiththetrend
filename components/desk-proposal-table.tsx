"use client";

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

  function open(id: string) {
    router.push(`/desk/proposals/${id}`);
  }

  return (
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
          {rows.map((row) => (
            <tr
              key={row.id}
              className="desk-row"
              tabIndex={0}
              role="link"
              aria-label={`Open ${row.title}`}
              onClick={() => open(row.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  open(row.id);
                }
              }}
            >
              <td>{row.client}</td>
              <td>{row.title}</td>
              <td>{row.created}</td>
              <td>{row.closes}</td>
              <td>
                <span className={row.closed ? "desk-status is-closed" : "desk-status"}>{row.closed ? "closed" : "open"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
