import type { Metadata } from "next";
import Link from "next/link";
import { MiniSite } from "@/components/mini-site";
import { PageShell } from "@/components/page-shell";
import { Sticker } from "@/components/sticker";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Sample restaurant websites and portfolios from Flow With The Trend. Studio concepts, not client projects.",
};

export default function WorkPage() {
  return (
    <PageShell>
      <article className="sheet sheet-yellow">
        <p className="kicker">recent plates</p>
        <Sticker as="h1" text={"sample\nconcepts"} />
        <p className="lede">
          These are directions we designed for the studio, so you can see the volume. They are not client projects.
        </p>
      </article>
      <div className="work-grid">
        {projects.map((project) => (
          <Link key={project.slug} href={`/work/${project.slug}`} className="work-card">
            <MiniSite project={project} />
            <p className="kicker">
              {project.kind} · sample concept
            </p>
            <p>{project.summary}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
