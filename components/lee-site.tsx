"use client";

import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { education, experience, languages, lee, skills } from "@/lib/lee";

const nav = [
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#study", label: "Study" },
  { href: "#contact", label: "Contact" },
];

export function LeeSite() {
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
      const box = node.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.92) show(node);
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

  function onMove(event: MouseEvent<HTMLElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
  }

  return (
    <div ref={rootRef}>
      <div className="wash" aria-hidden="true">
        <i />
        <i />
      </div>

      <header className="bar">
        <a className="sig" href="#top">
          LKM
        </a>
        <nav aria-label="Portfolio">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="bar-mail" href={`mailto:${lee.email}`}>
          Email
        </a>
      </header>

      <main id="top">
        <section className="intro" onMouseMove={onMove}>
          <p className="kicker">{lee.role}</p>
          <h1>
            <span>
              <em>Lee Kar</em>
            </span>
            <span>
              <em>Meng</em>
            </span>
          </h1>
          <p className="field">{lee.field}</p>
          <p className="lead">{lee.summary}</p>
          <div className="actions">
            <a href={`mailto:${lee.email}`}>{lee.email}</a>
            <a href={lee.phoneHref}>{lee.phone}</a>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div>
            {[0, 1].map((copy) => (
              <p key={copy}>
                {skills.map((skill) => (
                  <span key={`${copy}-${skill}`}>{skill}</span>
                ))}
              </p>
            ))}
          </div>
        </div>

        <section className="section" id="experience">
          <div className="section-head reveal">
            <p>Experience</p>
            <h2>Roles, as written on the resume.</h2>
          </div>
          <ol>
            {experience.map((job, index) => (
              <li key={job.company} className="reveal" style={{ transitionDelay: `${index * 60}ms` }}>
                <div>
                  <small>0{index + 1}</small>
                  <b>{job.role}</b>
                  <strong>{job.company}</strong>
                  <em>{job.when}</em>
                </div>
                {job.points.length > 0 ? (
                  <ul>
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="section" id="skills">
          <div className="section-head reveal">
            <p>Skills</p>
            <h2>Tools and the way I work.</h2>
          </div>
          <ul className="pills reveal">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
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
            <h2>Education</h2>
          </div>
          <ul className="study">
            {education.map((item) => (
              <li key={item.credential} className="reveal">
                <b>{item.school}</b>
                <span>{item.credential}</span>
                <small>
                  {item.when}
                  {item.note ? ` · ${item.note}` : ""}
                </small>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="end" id="contact">
        <p>Contact</p>
        <a href={`mailto:${lee.email}`}>{lee.email}</a>
        <a href={lee.phoneHref}>{lee.phone}</a>
        <small>{lee.name}</small>
      </footer>
    </div>
  );
}
