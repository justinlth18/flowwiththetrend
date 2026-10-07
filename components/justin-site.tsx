"use client";

import { useEffect, useRef, useState } from "react";
import { education, experience, justin, languages, skillGroups } from "@/lib/justin";

const pages = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "study", label: "Study" },
  { id: "contact", label: "Contact" },
] as const;

function PageBody({ index }: { index: number }) {
  if (index === 0) return <About />;
  if (index === 1) return <Experience />;
  if (index === 2) return <Skills />;
  if (index === 3) return <Study />;
  if (index === 4) return <Contact />;
  return null;
}

export function JustinSite() {
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState(0);
  const [lift, setLift] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function read() {
      const node = trackRef.current;
      if (!node) return;
      const height = node.offsetHeight - window.innerHeight;
      const y = Math.min(Math.max(0, window.scrollY - node.offsetTop), Math.max(height, 0));
      const progress = height <= 0 ? 0 : y / height;
      const scaled = progress * (pages.length - 1);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPage(Math.min(pages.length - 1, Math.round(scaled)));
        setTurn(0);
        setLift(0);
        return;
      }
      if (scaled >= pages.length - 1 - 0.001) {
        setPage(pages.length - 1);
        setTurn(0);
        setLift(0);
        return;
      }
      const index = Math.floor(scaled);
      const fraction = scaled - index;
      setPage(index);
      setTurn(fraction);
      setLift(Math.sin(fraction * Math.PI));
    }

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  function goTo(index: number) {
    const node = trackRef.current;
    if (!node) return;
    const height = node.offsetHeight - window.innerHeight;
    const top = node.offsetTop + (index / (pages.length - 1)) * height;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }

  const next = page < pages.length - 1 ? page + 1 : page;

  return (
    <div className="track" ref={trackRef}>
      <div className="stage">
        <header className="tabs">
          <nav aria-label="Notebook pages">
            {pages.map((item, index) => (
              <button key={item.id} type="button" aria-current={index === page ? "page" : undefined} onClick={() => goTo(index)}>
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="book" style={{ ["--turn" as string]: turn, ["--lift" as string]: lift }}>
          <article className="sheet under" aria-hidden={next === page}>
            <Sheet index={next} place={justin.place} count={pages.length} />
            <div className="shade" />
          </article>
          <div className="leaf">
            <article className="sheet face front" aria-label={`${pages[page].label}, page ${page + 1} of ${pages.length}`}>
              <Sheet index={page} place={justin.place} count={pages.length} />
              <div className="sheen" />
            </article>
            <div className="sheet face back" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Sheet({ index, place, count }: { index: number; place: string; count: number }) {
  return (
    <>
      <div className="holes" aria-hidden="true" />
      <p className="date-line">
        <span>{place}</span>
        <span>
          {index + 1} / {count}
        </span>
      </p>
      <PageBody index={index} />
      {index === 0 ? <i className="stain" aria-hidden="true" /> : null}
    </>
  );
}

function About() {
  return (
    <>
      <h1>
        <span className="hl">{justin.name}</span>
        <small>{justin.chineseName}</small>
      </h1>
      <p className="role">
        <span className="hl">{justin.role}</span>
      </p>
      <p className="lead">{justin.summary}</p>
      <p className="links">
        {justin.links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </p>
      <i className="stain" aria-hidden="true" />
    </>
  );
}

function Experience() {
  return (
    <section>
      <h2>Where I have worked</h2>
      <ol>
        {experience.map((job) => (
          <li key={`${job.company}-${job.when}`}>
            <div className="margin">
              <b className={job.meta === "Contract" ? "hl" : undefined}>{job.when}</b>
              {job.meta ? <em className="hl">{job.meta}</em> : null}
            </div>
            <div>
              <strong className="hl">{job.role}</strong>
              <span className="hl">{job.company}</span>
              <ul>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Skills() {
  return (
    <section>
      <h2>In the margin</h2>
      {skillGroups.map((group) => (
        <div key={group.name}>
          <h3>
            <span className={group.name === "From CROSSUB" ? "hl" : undefined}>{group.name}</span>
          </h3>
          <ul className="chips">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function Study() {
  return (
    <section>
      <h2>Study</h2>
      <ul className="study">
        {education.map((item) => (
          <li key={item.school}>
            <b>{item.when}</b>
            <span>
              <strong className="hl">{item.school}</strong>
              {item.credential}
            </span>
          </li>
        ))}
      </ul>
      <h3>Languages</h3>
      <ul className="chips">
        {languages.map((item) => (
          <li key={item.name}>
            {item.name} · {item.level}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  return (
    <footer>
      <h2>Write me</h2>
      <a className="big hl" href={`mailto:${justin.email}`}>
        {justin.email}
      </a>
      <a className="big" href={justin.phoneHref}>
        {justin.phone}
      </a>
      <p className="signoff">— {justin.name}</p>
    </footer>
  );
}
