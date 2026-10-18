"use client";

import { useEffect, useState } from "react";

const zoomed = 2;

function phoneSized() {
  return window.matchMedia("(max-width: 800px)").matches;
}

type Shot = { id: string; src: string; caption?: string };

export function PhotoGrid({ images, variant = "thumbs" }: { images: Shot[]; variant?: "thumbs" | "figures" }) {
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

  function show(src: string) {
    setZoom(1);
    setOpen(src);
  }

  const lightbox = open ? (
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
      ) : null;

  if (variant === "figures") {
    return (
      <>
        <div className="sow-figures">
          {images.map((image) => (
            <figure className="sow-figure" key={image.id}>
              <button type="button" onClick={() => show(image.src)}>
                <img src={image.src} alt={image.caption || ""} draggable={false} />
              </button>
              {image.caption ? <figcaption>{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
        {lightbox}
      </>
    );
  }

  return (
    <>
      <div className="proposal-photos">
        {images.map((image) => (
          <button key={image.id} type="button" className="photo-thumb" onClick={() => show(image.src)}>
            <img src={image.src} alt="" draggable={false} />
          </button>
        ))}
      </div>
      {lightbox}
    </>
  );
}
