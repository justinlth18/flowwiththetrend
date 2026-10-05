import Link from "next/link";
import { packages, process, marquee } from "@/lib/content";
import { Sticker } from "@/components/sticker";

export function Marquee() {
  const line = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {line.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            <i>★</i>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Packages() {
  return (
    <section className="band" id="packages">
      <div className="band-intro">
        <p className="kicker">pick a plate</p>
        <Sticker as="h2" text={"three ways\nto build"} />
        <p className="lede">Scope and timing, settled on the tasting call. No public rate card — every room is different.</p>
      </div>
      <div className="package-grid">
        {packages.map((item) => (
          <article key={item.name} className={`sheet sheet-${item.tone}`}>
            <p className="kicker">{item.time}</p>
            <h3>{item.name}</h3>
            <p>{item.summary}</p>
            <ul>
              {item.includes.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link className="btn" href="/start">
              start with this
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="band" id="process">
      <div className="band-intro">
        <p className="kicker">the process</p>
        <Sticker as="h2" tone="ink" text={"from call\nto launch"} />
      </div>
      <ol className="process-grid">
        {process.map((item) => (
          <li key={item.step} className="sheet sheet-yellow">
            <span>{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ClosingBand() {
  return (
    <section className="closing">
      <Sticker as="h2" text={"bring the\nmenu"} />
      <p>Or the portfolio. Tell us what you want the link to do.</p>
      <Link className="btn" href="/start">
        start a project
      </Link>
    </section>
  );
}
