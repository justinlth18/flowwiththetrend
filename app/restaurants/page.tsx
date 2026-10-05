import type { Metadata } from "next";
import Link from "next/link";
import { MiniSite } from "@/components/mini-site";
import { PageShell } from "@/components/page-shell";
import { Sticker } from "@/components/sticker";
import { getProject } from "@/lib/content";

export const metadata: Metadata = {
  title: "Restaurant websites",
  description: "Websites for restaurants: a menu people can read, a room with a mood, and a booking button that is hard to miss.",
};

const sample = getProject("marea-nights");

export default function RestaurantsPage() {
  return (
    <PageShell>
      <div className="page-grid">
        <article className="sheet sheet-yellow">
          <p className="kicker">restaurant sites</p>
          <Sticker as="h1" text={"a site that\nfeels like service"} />
          <p className="lede">
            Most restaurant websites are a PDF, a map pin, and a prayer. We design the page your regulars send to a friend.
          </p>
          {sample ? <MiniSite project={sample} /> : null}
          <h2 className="plain-title">What you get</h2>
          <ul className="check-list">
            <li>A home page with the mood of the room, not a stock dining table.</li>
            <li>A menu guests can read on a phone, and that you can change when the specials do.</li>
            <li>Private dining, events, hours, a map, and one booking button.</li>
            <li>Photos that feel like dinner. We will art-direct if you are still shooting.</li>
          </ul>
          <Link className="btn" href="/start">
            start a restaurant site
          </Link>
        </article>
        <aside className="sheet sheet-green">
          <h2 className="plain-title">Pages we usually design</h2>
          <ul className="aside-list">
            <li>The arrival</li>
            <li>The menu</li>
            <li>The room</li>
            <li>Private dining</li>
            <li>Visit</li>
          </ul>
          <p>A good fit if the current “site” is a Facebook album, a link-in-bio, or a PDF from 2019.</p>
        </aside>
      </div>
    </PageShell>
  );
}
