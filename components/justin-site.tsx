"use client";

import { useEffect, useRef, useState } from "react";
import ElectricBorder from "@/components/electric-border";
import { education, experience, justin, languages, skillGroups } from "@/lib/justin";

const pages = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "study", label: "Study" },
  { id: "contact", label: "Contact" },
] as const;

function PageBody({ index, ink }: { index: number; ink: boolean }) {
  if (index === 0) return <About ink={ink} />;
  if (index === 1) return <Experience ink={ink} />;
  if (index === 2) return <Skills ink={ink} />;
  if (index === 3) return <Study ink={ink} />;
  if (index === 4) return <Contact ink={ink} />;
  return null;
}

const GLYPHS = " =+xX0S8#@";

function mask(text: string) {
  return Array.from(text)
    .map((char, index) => (char === " " ? " " : GLYPHS[(index % (GLYPHS.length - 1)) + 1]))
    .join("");
}

type TechJob = {
  text: string;
  start: number;
  duration: number;
  done: boolean;
  set: (value: string) => void;
};

const techJobs = new Set<TechJob>();
let techFrame = 0;

function paintTech(job: TechJob, now: number) {
  if (now < job.start) {
    job.set(mask(job.text));
    return;
  }
  const letters = Array.from(job.text);
  const elapsed = (now - job.start) / job.duration;
  if (elapsed >= 1) {
    job.set(job.text);
    job.done = true;
    return;
  }
  const flicker = elapsed < 0.34;
  const revealed = flicker ? 0 : Math.floor(((elapsed - 0.34) / 0.66) * letters.length);
  const step = Math.floor(now / 36);
  job.set(
    letters
      .map((char, index) => {
        if (char === " " || index < revealed) return char;
        return GLYPHS[((index + step) % (GLYPHS.length - 1)) + 1];
      })
      .join(""),
  );
}

function runTech(now: number) {
  techFrame = 0;
  let busy = false;
  techJobs.forEach((job) => {
    if (job.done) return;
    paintTech(job, now);
    if (!job.done) busy = true;
  });
  if (busy) techFrame = window.requestAnimationFrame(runTech);
}

function Tech({ text, on, delay = 0, mark = false }: { text: string; on: boolean; delay?: number; mark?: boolean }) {
  const [shown, setShown] = useState(() => mask(text));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!on || reduce) {
      setShown(on ? text : mask(text));
      return;
    }
    const job: TechJob = {
      text,
      start: performance.now() + delay * 1000,
      duration: Math.min(1700, 420 + Array.from(text).length * 26),
      done: false,
      set: setShown,
    };
    techJobs.add(job);
    if (!techFrame) techFrame = window.requestAnimationFrame(runTech);
    return () => {
      techJobs.delete(job);
    };
  }, [on, text, delay]);

  return (
    <span className={mark ? "hl tech" : "tech"} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

export function JustinSite() {
  const [page, setPage] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const settleRef = useRef<(index: number, force?: boolean) => void>(() => {});

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const last = pages.length - 1;
    let shown = 0;
    let locked = false;
    let hold = 0;
    let touchStartY = 0;
    let overscroll = 0;
    let wheelBucket = 0;

    function settle(index: number, force = false) {
      const next = Math.min(last, Math.max(0, index));
      if (next === shown) return;
      if (locked && !force) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      shown = next;
      locked = true;
      wheelBucket = 0;
      overscroll = 0;
      setPage(next);
      window.clearTimeout(hold);
      hold = window.setTimeout(() => {
        locked = false;
      }, reduce ? 80 : 2200);
    }

    settleRef.current = settle;

    function panel() {
      return sheetRef.current;
    }

    function wheelDelta(event: WheelEvent, scroller: HTMLElement) {
      if (event.deltaMode === 1) return event.deltaY * 18;
      if (event.deltaMode === 2) return event.deltaY * scroller.clientHeight;
      return event.deltaY;
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const scroller = panel();
      if (scroller) {
        const max = scroller.scrollHeight - scroller.clientHeight;
        const delta = wheelDelta(event, scroller);
        if (max > 2) {
          const atTop = scroller.scrollTop <= 1;
          const atBottom = scroller.scrollTop >= max - 1;
          if (delta > 0 && !atBottom) {
            scroller.scrollTop = Math.min(max, scroller.scrollTop + delta);
            return;
          }
          if (delta < 0 && !atTop) {
            scroller.scrollTop = Math.max(0, scroller.scrollTop + delta);
            return;
          }
        }
      }
      if (locked) return;
      const delta = scroller ? wheelDelta(event, scroller) : event.deltaY;
      wheelBucket += delta;
      if (Math.abs(wheelBucket) < 70) return;
      const direction = wheelBucket > 0 ? 1 : -1;
      wheelBucket = 0;
      settle(shown + direction);
    }

    function onTouchStart(event: TouchEvent) {
      touchStartY = event.touches[0]?.clientY ?? 0;
      overscroll = 0;
    }

    function onTouchMove(event: TouchEvent) {
      event.preventDefault();
      const y = event.touches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - y;
      touchStartY = y;
      const scroller = panel();
      if (!scroller) return;
      const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const next = scroller.scrollTop + delta;
      if (next < 0) {
        overscroll += next;
        scroller.scrollTop = 0;
      } else if (next > max) {
        overscroll += next - max;
        scroller.scrollTop = max;
      } else {
        overscroll = 0;
        scroller.scrollTop = next;
      }
    }

    function onTouchEnd() {
      if (locked) return;
      if (overscroll > 56) settle(shown + 1);
      else if (overscroll < -56) settle(shown - 1);
    }

    function onKey(event: KeyboardEvent) {
      const key = event.key;
      if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "PageDown" && key !== "PageUp" && key !== " ") return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      event.preventDefault();
      if (locked) return;
      const forward = key === "ArrowDown" || key === "PageDown" || key === " ";
      settle(shown + (forward ? 1 : -1));
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(hold);
      settleRef.current = () => {};
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function goTo(index: number) {
    settleRef.current(index, true);
  }

  return (
    <div className="track" ref={trackRef}>
      <div className="stage">
        <header className="tabs">
          <nav aria-label="Notebook pages">
            {pages.map((item, index) => (
              <button key={item.id} type="button" aria-current={index === page ? "page" : undefined} onClick={() => goTo(index)}>
                <Tech text={item.label} on delay={index * 0.08} />
              </button>
            ))}
          </nav>
        </header>

        <div className="book">
          <article
            className="sheet"
            key={pages[page].id}
            ref={sheetRef}
            aria-label={`${pages[page].label}, page ${page + 1} of ${pages.length}`}
          >
            <Sheet index={page} place={justin.place} count={pages.length} ink />
            <div className="gloss" />
          </article>
        </div>
      </div>
    </div>
  );
}

function Sheet({ index, place, count, ink }: { index: number; place: string; count: number; ink: boolean }) {
  return (
    <>
      <div className="holes" aria-hidden="true" />
      <p className="date-line">
        <span>
          <Tech text={place} on={ink} />
        </span>
        <span>
          <Tech text={`${index + 1} / ${count}`} on={ink} delay={0.12} />
        </span>
      </p>
      <PageBody index={index} ink={ink} />
    </>
  );
}

function TechPhoto({ src, on, delay = 0 }: { src: string; on: boolean; delay?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clear, setClear] = useState(false);

  useEffect(() => {
    setClear(false);
    const canvas = canvasRef.current;
    if (!canvas || !on) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setClear(true);
      return;
    }
    const image = new Image();
    image.src = src;
    const sample = document.createElement("canvas");
    const cols = 22;
    const rows = 30;
    let frame = 0;
    let dead = false;

    function paint(now: number, started: number) {
      if (dead) return;
      const ctx = canvas.getContext("2d");
      const probe = sample.getContext("2d", { willReadFrequently: true });
      if (!ctx || !probe || !image.complete || image.naturalWidth === 0) {
        frame = window.requestAnimationFrame((time) => paint(time, started));
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      sample.width = cols;
      sample.height = rows;
      const scale = Math.max(cols / image.naturalWidth, rows / image.naturalHeight);
      const dw = image.naturalWidth * scale;
      const dh = image.naturalHeight * scale;
      probe.clearRect(0, 0, cols, rows);
      probe.drawImage(image, (cols - dw) / 2, (rows - dh) * 0.15, dw, dh);
      const pixels = probe.getImageData(0, 0, cols, rows).data;
      const elapsed = Math.min(1, Math.max(0, (now - started) / 2400));
      const reveal = elapsed < 0.34 ? 0 : (elapsed - 0.34) / 0.66;
      const step = Math.floor(now / 42);
      const cellW = width / cols;
      const cellH = height / rows;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(8, 4, 12, 0.94)";
      ctx.fillRect(reveal * width, 0, width, height);
      ctx.font = `${Math.max(8, Math.floor(cellH * 0.92))}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          if (x / cols < reveal) continue;
          const offset = (y * cols + x) * 4;
          const lum = (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3;
          if (lum < 18) continue;
          ctx.fillStyle = `rgb(${pixels[offset]}, ${pixels[offset + 1]}, ${pixels[offset + 2]})`;
          ctx.fillText(GLYPHS[((x + y + step) % (GLYPHS.length - 1)) + 1], x * cellW + cellW / 2, y * cellH + cellH / 2);
        }
      }
      if (elapsed < 1) frame = window.requestAnimationFrame((time) => paint(time, started));
      else setClear(true);
    }

    const started = performance.now() + delay * 1000;
    frame = window.requestAnimationFrame((time) => paint(time, started));
    return () => {
      dead = true;
      window.cancelAnimationFrame(frame);
    };
  }, [on, src, delay]);

  return (
    <div className={clear ? "portrait is-live" : "portrait"}>
      <img src={src} alt="Justin Looi Teng Hein" />
      <canvas ref={canvasRef} className={clear ? "glyph portrait-clear" : "glyph"} aria-hidden="true" />
      {clear ? (
        <ElectricBorder
          color="#c45c78"
          glowColor="#c45c78"
          borderRadius={0}
          chaos={0.5}
          thickness={1.15}
          spread={0.48}
          glow={0.7}
          intensity={0.9}
          interactive
        />
      ) : null}
    </div>
  );
}

function About({ ink }: { ink: boolean }) {
  return (
    <>
      <div className="profile">
        <TechPhoto src="/justin-portrait.jpg" on={ink} />
        <div className="identity">
          <h1>
            <Tech text={justin.name} on={ink} mark />
          </h1>
          <p className="zh">
            <Tech text={justin.chineseName} on={ink} delay={0.28} />
          </p>
          <p className="role">
            <Tech text={justin.role} on={ink} mark delay={0.55} />
          </p>
        </div>
      </div>
      <p className="lead">
        <Tech text={justin.summary} on={ink} delay={0.8} />
      </p>
      <p className="links">
        {justin.links.map((link, linkIndex) => (
          <a key={link.href} href={link.href}>
            <Tech text={link.label} on={ink} delay={1.05 + linkIndex * 0.06} />
          </a>
        ))}
      </p>
    </>
  );
}

function Experience({ ink }: { ink: boolean }) {
  return (
    <section>
      <h2>
        <Tech text="Where I have worked" on={ink} />
      </h2>
      <ol>
        {experience.map((job, jobIndex) => (
          <li key={`${job.company}-${job.when}`}>
            <div className="margin">
              <b>
                <Tech text={job.when} on={ink} mark={job.meta === "Contract"} delay={0.12 + jobIndex * 0.08} />
              </b>
              {job.meta ? (
                <em>
                  <Tech text={job.meta} on={ink} mark delay={0.18 + jobIndex * 0.08} />
                </em>
              ) : null}
            </div>
            <div>
              <strong>
                <Tech text={job.role} on={ink} mark delay={0.16 + jobIndex * 0.08} />
              </strong>
              <span>
                <Tech text={job.company} on={ink} mark delay={0.22 + jobIndex * 0.08} />
              </span>
              <ul>
                {job.points.map((point, pointIndex) => (
                  <li key={point}>
                    <Tech text={point} on={ink} delay={0.28 + jobIndex * 0.08 + pointIndex * 0.04} />
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Skills({ ink }: { ink: boolean }) {
  return (
    <section>
      <h2>
        <Tech text="In the margin" on={ink} />
      </h2>
      {skillGroups.map((group, groupIndex) => (
        <div key={group.name}>
          <h3>
            <Tech text={group.name} on={ink} mark={group.name === "From CROSSUB"} delay={0.2 + groupIndex * 0.1} />
          </h3>
          <ul className="chips">
            {group.items.map((item, itemIndex) => (
              <li key={item}>
                <Tech text={item} on={ink} delay={0.28 + groupIndex * 0.1 + itemIndex * 0.03} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function Study({ ink }: { ink: boolean }) {
  return (
    <section>
      <h2>
        <Tech text="Study" on={ink} />
      </h2>
      <ul className="study">
        {education.map((item, itemIndex) => (
          <li key={item.school}>
            <b>
              <Tech text={item.when} on={ink} delay={0.12 + itemIndex * 0.08} />
            </b>
            <strong>
              <Tech text={item.school} on={ink} mark delay={0.16 + itemIndex * 0.08} />
            </strong>
            <span className="credential">
              <Tech text={item.credential} on={ink} delay={0.24 + itemIndex * 0.08} />
            </span>
          </li>
        ))}
      </ul>
      <h3>
        <Tech text="Languages" on={ink} delay={0.4} />
      </h3>
      <ul className="chips">
        {languages.map((item, itemIndex) => (
          <li key={item.name}>
            <Tech text={`${item.name} · ${item.level}`} on={ink} delay={0.48 + itemIndex * 0.06} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact({ ink }: { ink: boolean }) {
  return (
    <footer>
      <h2>
        <Tech text="Write me" on={ink} />
      </h2>
      <div className="write">
        <a className="big hl" href={`mailto:${justin.email}`}>
          <Tech text={justin.email} on={ink} delay={0.16} />
        </a>
        <a className="big" href={justin.phoneHref}>
          <Tech text={justin.phone} on={ink} delay={0.28} />
        </a>
      </div>
      <p className="signoff">
        <Tech text={`— ${justin.name}`} on={ink} delay={0.4} />
      </p>
    </footer>
  );
}
