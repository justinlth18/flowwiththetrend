"use client";

import { useRef, useState, type PointerEvent } from "react";
import { education, experience, justin, languages, skillGroups } from "@/lib/justin";

const pages = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "study", label: "Study" },
  { id: "contact", label: "Contact" },
] as const;

export function JustinSite() {
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState(0);
  const [motion, setMotion] = useState(true);
  const turnRef = useRef(0);
  const bookRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, moved: false });
  const busy = useRef(false);

  function setTurnTo(value: number) {
    turnRef.current = value;
    setTurn(value);
  }

  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function turnTo(index: number) {
    if (busy.current || index === page || index < 0 || index >= pages.length) return;
    if (reduced()) {
      setTurnTo(0);
      setPage(index);
      return;
    }
    busy.current = true;
    if (index > page) {
      setMotion(true);
      setTurnTo(1);
      window.setTimeout(() => {
        setMotion(false);
        setPage(index);
        setTurnTo(0);
        requestAnimationFrame(() => {
          setMotion(true);
          busy.current = false;
        });
      }, 680);
      return;
    }
    setMotion(false);
    setTurnTo(1);
    setPage(index);
    requestAnimationFrame(() => {
      setMotion(true);
      setTurnTo(0);
      window.setTimeout(() => {
        busy.current = false;
      }, 680);
    });
  }

  function onEdgeDown(event: PointerEvent<HTMLButtonElement>) {
    if (page >= pages.length - 1 || busy.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { active: true, x: event.clientX, moved: false };
  }

  function onEdgeMove(event: PointerEvent<HTMLButtonElement>) {
    if (!drag.current.active) return;
    const pulled = drag.current.x - event.clientX;
    if (pulled > 8) drag.current.moved = true;
    const width = bookRef.current?.clientWidth ?? 640;
    setMotion(false);
    setTurnTo(Math.min(1, Math.max(0, pulled / (width * 0.62))));
  }

  function onEdgeUp() {
    if (!drag.current.active) return;
    const moved = drag.current.moved;
    drag.current.active = false;
    setMotion(true);
    if (!moved || turnRef.current > 0.34) turnTo(page + 1);
    else setTurnTo(0);
  }

  return (
    <div className="desk">
      <header className="tabs">
        <nav aria-label="Notebook pages">
          {pages.map((item, index) => (
            <button key={item.id} type="button" aria-current={index === page ? "page" : undefined} onClick={() => turnTo(index)}>
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="book" ref={bookRef}>
        <div className="under" aria-hidden="true" />
        <article
          className={motion ? "notebook" : "notebook still"}
          style={{ ["--turn" as string]: turn }}
          aria-label={`${pages[page].label}, page ${page + 1} of ${pages.length}`}
        >
          <div className="holes" aria-hidden="true" />
          <p className="date-line">
            <span>{justin.place}</span>
            <span>
              {page + 1} / {pages.length}
            </span>
          </p>
          {page === 0 ? <About /> : null}
          {page === 1 ? <Experience /> : null}
          {page === 2 ? <Skills /> : null}
          {page === 3 ? <Study /> : null}
          {page === 4 ? <Contact /> : null}
          {page < pages.length - 1 ? (
            <button
              type="button"
              className="edge"
              aria-label="Pull the page to turn it"
              onPointerDown={onEdgeDown}
              onPointerMove={onEdgeMove}
              onPointerUp={onEdgeUp}
              onPointerCancel={onEdgeUp}
            />
          ) : null}
        </article>
      </div>

      <div className="pager">
        <button type="button" onClick={() => turnTo(page - 1)} disabled={page === 0}>
          back
        </button>
        <button type="button" onClick={() => turnTo(page + 1)} disabled={page === pages.length - 1}>
          next
        </button>
      </div>
    </div>
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
