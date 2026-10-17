"use client";

import { useEffect, useState } from "react";

const zoomed = 2;

function phoneSized() {
  return window.matchMedia("(max-width: 800px)").matches;
}

export function PhotoGrid({ images }: { images: { id: string; src: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  function close() {
    setOpen(null);
    setZoom(1);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(null);
      setZoom(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
          className={zoom > 1 ? "photo-lightbox is-zoomed" : "photo-lightbox"}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged picture"
          onClick={close}
        >
          <img
            src={open}
            alt=""
            className={zoom > 1 ? "is-zoomed is-max" : undefined}
            style={{ "--zoom": zoom } as React.CSSProperties}
            onClick={(event) => {
              event.stopPropagation();
              if (phoneSized()) {
                close();
                return;
              }
              setZoom((current) => (current > 1 ? 1 : zoomed));
            }}
          />
        </div>
      ) : null}
    </>
  );
}
