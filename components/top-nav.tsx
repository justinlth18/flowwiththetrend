"use client";

import { useEffect, useState } from "react";
import { Burger, NavList } from "@/components/menu";

export function TopNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`inner-nav ${open ? "nav-open" : ""}`}>
      {open ? (
        <button type="button" className="backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />
      ) : null}
      <div className="inner-nav-bar">
        <Burger open={open} onClick={() => setOpen((value) => !value)} />
        <p className="inner-nav-label">the menu</p>
      </div>
      <nav className="inner-nav-panel" aria-label="Studio">
        <NavList onNavigate={() => setOpen(false)} />
      </nav>
    </div>
  );
}
