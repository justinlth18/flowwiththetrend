import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { PageShell } from "@/components/page-shell";
import { Sticker } from "@/components/sticker";
import { getTrend } from "@/lib/trends";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell Flow With The Trend about your restaurant website or portfolio. We reply within two weekdays.",
};

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ direction?: string }>;
}) {
  const { direction } = await searchParams;
  const trend = getTrend(direction);

  return (
    <PageShell>
      <div className="page-grid">
        <article className="sheet sheet-yellow">
          <p className="kicker">start a project</p>
          <Sticker as="h1" text={"tell us\nabout the room"} />
          <p className="lede">A restaurant, a portfolio, or both. A person reads this.</p>
          <InquiryForm direction={trend?.name} />
        </article>
        <aside className="sheet sheet-green">
          <h2 className="plain-title">What happens next</h2>
          <ol className="aside-list">
            <li>
              <strong>01 · We read it</strong>
              Within two weekdays.
            </li>
            <li>
              <strong>02 · Tasting call</strong>
              Thirty minutes if it is a fit.
            </li>
            <li>
              <strong>03 · A scope</strong>
              Timeline, pages, and a price.
            </li>
          </ol>
          <h2 className="plain-title">Useful to include</h2>
          <ul className="check-list">
            <li>The restaurant or your name</li>
            <li>A link to anything that exists now</li>
            <li>The date you want to launch</li>
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
