"use client";
// Adapted from shadcn-ui-blocks/marketing-gallery-filmstrip-gallery.
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { EventPhoto } from "../model";
import { useMotionPreference } from "@/features/immersive/use-motion-preference";
export function PhotoGallery({ photos }: { photos: readonly EventPhoto[] }) {
  const track = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<EventPhoto | null>(null),
    [edges, setEdges] = useState({ left: false, right: false });
  const reduced = useMotionPreference();
  const update = useCallback(() => {
    const el = track.current;
    if (el)
      setEdges({
        left: el.scrollLeft > 1,
        right: el.scrollLeft < el.scrollWidth - el.clientWidth - 2,
      });
  }, []);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update);
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);
  const scroll = (sign: number) =>
    track.current?.scrollBy({
      left: sign * (track.current.clientWidth * 0.8),
      behavior: reduced ? "instant" : "smooth",
    });
  return (
    <div className="experience-gallery">
      <div className="gallery-toolbar">
        <p>Imágenes de ambiente · ilustrativas</p>
        <div>
          <button
            type="button"
            aria-label="Fotos anteriores"
            disabled={!edges.left}
            onClick={() => scroll(-1)}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Más fotos"
            disabled={!edges.right}
            onClick={() => scroll(1)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <div className="experience-filmstrip" ref={track}>
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.src}
            onClick={() => {
              setSelected(photo);
              dialog.current?.showModal();
            }}
            aria-label={`Ampliar foto: ${photo.caption}`}
          >
            <span className="filmstrip-photo">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width:700px) 80vw, 35vw"
              />
            </span>
            <span className="filmstrip-caption">
              <small>0{index + 1}</small>
              {photo.caption}
              <span aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>
      <dialog
        className="gallery-dialog"
        ref={dialog}
        aria-label="Fotografía ampliada"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          type="button"
          aria-label="Cerrar fotografía"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        {selected && (
          <figure>
            <div>
              <Image src={selected.src} alt={selected.alt} fill sizes="90vw" />
            </div>
            <figcaption>{selected.caption} · Imagen ilustrativa</figcaption>
          </figure>
        )}
      </dialog>
    </div>
  );
}
