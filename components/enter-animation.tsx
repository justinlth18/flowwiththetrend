"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Spark } from "@/components/art";

const HOLD_MS = 980;
const LEAVE_MS = 1580;

export function EnterAnimation() {
  const [phase, setPhase] = useState<"play" | "leave" | "done">("play");
  const dismissRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPhase("done");
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const content = document.getElementById("content");
    const footer = document.querySelector("footer");
    content?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    function release() {
      content?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    }

    const leaveTimer = window.setTimeout(() => setPhase("leave"), HOLD_MS);
    const doneTimer = window.setTimeout(() => {
      release();
      setPhase("done");
    }, LEAVE_MS);

    function dismiss() {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
      release();
      setPhase("done");
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") dismiss();
    }

    dismissRef.current = dismiss;
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("keydown", onKey);
      release();
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`enter ${phase === "leave" ? "is-leaving" : ""}`} aria-hidden="true" onClick={() => dismissRef.current()}>
      <Spark className="enter-spark enter-spark-a" color="#ff3d92" />
      <Spark className="enter-spark enter-spark-b" color="#c77dff" />
      <Spark className="enter-spark enter-spark-c" color="#7fd4ff" />
      <Spark className="enter-spark enter-spark-d" color="#37e85c" />
      <div className="enter-stage">
        <div className="enter-card">
          <p className="enter-kicker">the studio</p>
          <p className="enter-mark">FLOW</p>
          <p className="enter-sub">with the trend</p>
        </div>
      </div>
    </div>
  );
}
