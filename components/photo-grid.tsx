"use client";

import { useEffect, useRef, useState } from "react";

const closest = 2.6;

function phoneSized() {
  return window.matchMedia("(max-width: 800px)").matches;
}

export function PhotoGrid({ images }: { images: { id: string; src: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const zoomingOut = useRef(false);
  const frame = useRef<HTMLDivElement>(null);

  function close() {
    zoomingOut.current = false;
    setOpen(null);
    setZoom(1);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      zoomingOut.current = false;
      setOpen(null);
      setZoom(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const node = frame.current;
    if (!node || !open) return;
    function onWheel(event: WheelEvent) {
      if (phoneSized()) return;
      event.preventDefault();
      const step = event.deltaY > 0 ? -0.25 : 0.25;
      setZoom((current) => Math.min(closest, Math.max(1, Math.round((current + step) * 100) / 100)));
    }
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [open]);

  return (
    <>
      <div className="proposal-photos">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            className="photo-thumb"
            onClick={() => {
              setZoom(1);
              setOpen(image.src);
            }}
          >
            <img src={image.src} alt="" draggable={false} />
          </button>
        ))}
      </div>
      {open ? (
        <div
          ref={frame}
          className={zoom > 1 ? "photo-lightbox is-zoomed" : "photo-lightbox"}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged picture"
          onClick={close}
        >
          <img
            src={open}
            alt=""
            className={zoom >= closest ? "is-zoomed is-max" : zoom > 1 ? "is-zoomed" : undefined}
            style={{ "--zoom": zoom } as React.CSSProperties}
            onClick={(event) => {
              event.stopPropagation();
              if (phoneSized()) {
                close();
                return;
              }
              setZoom((current) => {
                if (current <= 1 || !zoomingOut.current) {
                  const next = Math.min(closest, Math.round((current + 0.8) * 10) / 10);
                  if (next >= closest) zoomingOut.current = true;
                  return next;
                }
                const next = Math.max(1, Math.round((current - 0.8) * 10) / 10);
                if (next <= 1) zoomingOut.current = false;
                return next;
              });
            }}
          />
        </div>
      ) : null}
    </>
  );
}
