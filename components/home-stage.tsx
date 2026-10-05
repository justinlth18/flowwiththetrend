"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { ConsultScene, FeatureScene, HeroScene, RailSmile, TileScene } from "@/components/art";
import { Burger, NavList } from "@/components/menu";
import { Sticker } from "@/components/sticker";

export function HomeStage() {
  const [open, setOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    if (window.matchMedia("(max-width: 980px)").matches) setOpen(false);
    setHydrated(true);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 980px)").matches;
    document.body.style.overflow = open && mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section className={`stage ${open ? "nav-open" : "nav-closed"} ${hydrated ? "hydrated" : ""}`}>
      <button type="button" className="backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />
      <aside className="rail">
        <div className="wordmark-wrap">
          <Link href="/" className="wordmark">
            FLOW
          </Link>
        </div>
        <div className="rail-tools">
          <RailSmile />
          <Burger className="burger-rail" open={open} onClick={() => setOpen((value) => !value)} />
        </div>
      </aside>

      <nav className="menu-card" aria-label="Studio">
        <div className="menu-top">
          <Burger open={open} onClick={() => setOpen((value) => !value)} />
        </div>
        <NavList onNavigate={() => setOpen(false)} />
      </nav>

      <article className="panel hero">
        <div className="panel-copy">
          <p className="kicker">biggest lil studio</p>
          <Sticker as="h1" text={"sites\nwith flavor"} />
          <p className="lede">Restaurant websites and portfolios, designed to be sent to a friend.</p>
          <p className="fine-note">now booking winter builds</p>
          <Link className="btn" href="/start">
            book a tasting call
          </Link>
        </div>
        <HeroScene />
      </article>

      <article className="panel feature">
        <FeatureScene />
        <div className="panel-copy panel-copy-low">
          <p className="kicker">the studio</p>
          <Sticker as="h2" tone="ink" text={"flow with\nthe trend"} />
          <p className="lede">The place for a restaurant site or a portfolio with the volume turned up.</p>
          <div className="btn-row">
            <Link className="btn" href="/work">
              see the work
            </Link>
            <Link className="btn btn-green" href="/restaurants">
              restaurant sites
            </Link>
          </div>
        </div>
      </article>

      <Link href="/start" className="panel consult">
        <ConsultScene />
        <span className="pill">free tasting call</span>
      </Link>

      <Link href="/work/marea-nights" className="panel tile">
        <TileScene tone="sea" />
        <span className="tile-label">
          <span className="kicker">sample concept · restaurant</span>
          <strong>Marea Nights</strong>
          <span>seafood after dark</span>
        </span>
      </Link>

      <Link href="/work/ada-cho" className="panel tile tile-chef">
        <TileScene tone="chef" />
        <span className="tile-label">
          <span className="kicker">sample concept · portfolio</span>
          <strong>Ada Cho</strong>
          <span>a chef, on one link</span>
        </span>
      </Link>
    </section>
  );
}
