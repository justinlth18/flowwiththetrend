"use client";

import { useLayoutEffect, useRef } from "react";
import { education, experience, justin, languages, skillGroups } from "@/lib/justin";

const nav = [
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#study", label: "Study" },
  { href: "#contact", label: "Contact" },
];

export function JustinSite() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    root.classList.add("js");
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    const seen = new Set<HTMLElement>();

    function show(node: HTMLElement) {
      if (seen.has(node)) return;
      seen.add(node);
      node.classList.add("in");
    }

    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top < window.innerHeight * 0.94) show(node);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) show(entry.target as HTMLElement);
        });
      },
      { threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="desk" ref={rootRef}>
      <header className="tabs">
        <a href="#top">Justin</a>
        <nav aria-label="Notebook">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <article className="notebook" id="top">
        <div className="holes" aria-hidden="true" />
        <p className="date-line">
          <span>{justin.place}</span>
          <span>a working notebook</span>
        </p>
        <h1 className="write">
          {justin.name}
          <small>{justin.chineseName}</small>
        </h1>
        <p className="role">{justin.role}</p>
        <p className="lead write">{justin.summary}</p>
        <p className="links">
          {justin.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </p>

        <section id="experience">
          <h2 className="write">Where I have worked</h2>
          <ol>
            {experience.map((job) => (
              <li key={`${job.company}-${job.when}`} className="reveal">
                <div className="margin">
                  <b>{job.when}</b>
                  {job.meta ? <em>{job.meta}</em> : null}
                </div>
                <div>
                  <strong>{job.role}</strong>
                  <span>{job.company}</span>
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

        <section id="skills">
          <h2 className="write">In the margin</h2>
          {skillGroups.map((group) => (
            <div key={group.name} className="reveal">
              <h3>{group.name}</h3>
              <ul className="chips">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section id="study">
          <h2 className="write">Study</h2>
          <ul className="study">
            {education.map((item) => (
              <li key={item.school} className="reveal">
                <b>{item.when}</b>
                <span>
                  <strong>{item.school}</strong>
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

        <footer id="contact">
          <h2 className="write">Write me</h2>
          <a className="big" href={`mailto:${justin.email}`}>
            {justin.email}
          </a>
          <a className="big" href={justin.phoneHref}>
            {justin.phone}
          </a>
          <p className="signoff">— {justin.name}</p>
        </footer>
        <i className="stain" aria-hidden="true" />
      </article>
    </div>
  );
}
