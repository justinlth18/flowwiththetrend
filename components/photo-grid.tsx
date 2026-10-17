"use client";

import { useEffect, useState } from "react";

export function PhotoGrid({ images }: { images: { id: string; src: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="proposal-photos">
        {images.map((image) => (
          <button key={image.id} type="button" className="photo-thumb" onClick={() => setOpen(image.src)}>
            <img src={image.src} alt="" draggable={false} />
          </button>
        ))}
      </div>
      {open ? (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged picture" onClick={() => setOpen(null)}>
          <img src={open} alt="" onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </>
  );
}
