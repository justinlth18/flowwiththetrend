import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Sticker } from "@/components/sticker";

export default function NotFound() {
  return (
    <PageShell>
      <article className="sheet sheet-yellow not-found">
        <p className="kicker">404</p>
        <Sticker as="h1" text={"this page\nleft the pass"} />
        <p className="lede">That link is not on the menu.</p>
        <Link className="btn" href="/">
          back to the studio
        </Link>
      </article>
    </PageShell>
  );
}
