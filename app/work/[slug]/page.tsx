import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MiniSite } from "@/components/mini-site";
import { PageShell } from "@/components/page-shell";
import { Sticker } from "@/components/sticker";
import { getProject, projects } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Work" };
  return {
    title: project.name,
    description: `${project.summary} Sample concept by Flow With The Trend.`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <PageShell>
      <div className="page-grid">
        <article className="sheet sheet-yellow">
          <p className="kicker">
            {project.kind} · sample concept
          </p>
          <Sticker as="h1" text={project.name} />
          <p className="lede">{project.summary}</p>
          <MiniSite project={project} />
          <p>{project.note}</p>
          <Link className="btn" href="/start">
            start something like this
          </Link>
        </article>
        <aside className="sheet sheet-green">
          <h2 className="plain-title">On the site</h2>
          <ul className="aside-list">
            {project.pages.map((page) => (
              <li key={page}>{page}</li>
            ))}
          </ul>
          <div className="meta-row">
            {project.highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <Link href="/work">All sample concepts</Link>
        </aside>
      </div>
    </PageShell>
  );
}
