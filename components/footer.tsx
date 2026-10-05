import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="footer-mark">FLOW</p>
        <p>Restaurant websites and portfolios.</p>
      </div>
      <nav aria-label="Footer">
        <Link href="/restaurants">Restaurant sites</Link>
        <Link href="/portfolios">Portfolios</Link>
        <Link href="/work">Work</Link>
        <Link href="/start">Start a project</Link>
      </nav>
      <p className="footer-note">
        Work samples on this site are studio concepts, made to show the direction. They are not client projects.
      </p>
    </footer>
  );
}
