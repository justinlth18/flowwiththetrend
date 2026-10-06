"use client";

import { useLayoutEffect, useRef } from "react";
import { education, experience, languages, nicson, skills } from "@/lib/nicson";

const nav = [
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#study", label: "Study" },
  { href: "#contact", label: "Contact" },
];

export function NicsonSite() {
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
      if (node.getBoundingClientRect().top < window.innerHeight * 0.92) show(node);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) show(entry.target as HTMLElement);
        });
      },
      { threshold: 0.16 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="gridlines" aria-hidden="true" />
      <header className="bar">
        <a className="sig" href="#top">
          NCZ
        </a>
        <nav aria-label="Portfolio">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="bar-now" href="#experience">
          <i />
          Mixue · now
        </a>
      </header>

      <main id="top">
        <section className="intro">
          <p className="kicker">
            {nicson.role} · {nicson.place}
          </p>
          <h1>
            <span>
              <em>Nicson</em>
            </span>
            <span>
              <em>Chang Zhiyang</em>
            </span>
          </h1>
          <p className="lead">{nicson.summary}</p>
          <div className="actions">
            <a href={`mailto:${nicson.email}`}>{nicson.email}</a>
            <a href={nicson.phoneHref}>{nicson.phone}</a>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="section-head reveal">
            <p>Experience</p>
            <h2>Forty outlets, then the roles before that.</h2>
          </div>
          <ol>
            {experience.map((job, index) => (
              <li key={job.company} className={job.current ? "reveal is-now" : "reveal"} style={{ transitionDelay: `${index * 70}ms` }}>
                <div>
                  <small>0{index + 1}</small>
                  <b>{job.role}</b>
                  <strong>{job.company}</strong>
                  <em>
                    {job.when}
                    {job.place ? ` · ${job.place}` : ""}
                  </em>
                </div>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" id="skills">
          <div className="section-head reveal">
            <p>Skills</p>
            <h2>What the floor actually needs.</h2>
          </div>
          <ul className="pills">
            {skills.map((skill, index) => (
              <li key={skill} className="reveal" style={{ transitionDelay: `${index * 40}ms` }}>
                {skill}
              </li>
            ))}
          </ul>
          <ul className="langs reveal">
            {languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
        </section>

        <section className="section" id="study">
          <div className="section-head reveal">
            <p>Study</p>
            <h2>TAR UMT</h2>
          </div>
          <ul className="study">
            {education.map((item) => (
              <li key={item.credential} className="reveal">
                <b>{item.credential}</b>
                <span>{item.school}</span>
                <small>{item.when}</small>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="end" id="contact">
        <p>Contact</p>
        <a href={`mailto:${nicson.email}`}>{nicson.email}</a>
        <a href={nicson.phoneHref}>{nicson.phone}</a>
        <small>
          {nicson.name} · {nicson.place}
        </small>
      </footer>
    </div>
  );
}
