"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const storageKey = "studio-proposal";

function safeToken(value: string | null) {
  if (!value || !/^[A-Za-z0-9_-]{20,80}$/.test(value)) return "";
  return value;
}

export function ProposalReturn() {
  const params = useSearchParams();
  const [token, setToken] = useState("");

  useEffect(() => {
    const fromQuery = safeToken(params.get("proposal"));
    if (fromQuery) {
      sessionStorage.setItem(storageKey, fromQuery);
      setToken(fromQuery);
      return;
    }
    setToken(safeToken(sessionStorage.getItem(storageKey)));
  }, [params]);

  if (!token) return null;

  return (
    <a className="proposal-return" href={`/proposal/${token}`}>
      Back to the proposal
    </a>
  );
}
