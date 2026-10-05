import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioPicker } from "@/components/portfolio-picker";
import { PageShell } from "@/components/page-shell";
import { Sticker } from "@/components/sticker";

export const metadata: Metadata = {
  title: "Portfolios",
  description: "Pick a 2026 portfolio direction and see a mockup. Vibrant color, kinetic type, broken grids, liquid glass, retro future, and dark mode.",
};

export default function PortfoliosPage() {
  return (
    <PageShell>
      <section className="sheet sheet-yellow" id="directions">
        <p className="kicker">portfolios · 2026</p>
        <Sticker as="h1" text={"pick a\ntrend"} />
        <p className="lede">
          Six directions we are designing portfolios in this year. Choose one and the mockup changes.
        </p>
        <PortfolioPicker />
      </section>
      <div className="page-grid">
        <article className="sheet sheet-yellow">
          <h2 className="plain-title">What you get</h2>
          <ul className="check-list">
            <li>Selected work, arranged so a stranger understands you in a minute.</li>
            <li>A story that sounds like you, not a template about passion.</li>
            <li>Press, services, or a diary — only the pages you will actually keep fresh.</li>
            <li>A contact link you can put in a bio, a pitch, and an email signature.</li>
          </ul>
          <Link className="btn" href="/start">
            start a portfolio
          </Link>
        </article>
        <aside className="sheet sheet-pink">
          <h2 className="plain-title">Bring</h2>
          <ul className="aside-list">
            <li>Ten pieces you are proud of</li>
            <li>The job you want the link to get you</li>
            <li>Any site or PDF you use today</li>
            <li>A date you want it live</li>
          </ul>
          <p>If the pictures are not ready, we start with the structure and a photography plan.</p>
        </aside>
      </div>
    </PageShell>
  );
}
