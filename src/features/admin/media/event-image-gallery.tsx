"use client";
import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { ImageViewer } from "./image-viewer";
import type { EventImage } from "./model";
export function EventImageGallery({
  cover,
  title,
  images = [],
}: {
  cover: string;
  title: string;
  images?: readonly EventImage[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const gallery = [
    { src: cover, name: title },
    ...images.filter((image) => image.src !== cover),
  ];
  return (
    <div className="admin-saved-gallery">
      <button
        type="button"
        className="admin-detail-cover"
        aria-label="Ver galería del evento"
        onClick={() => setIndex(0)}
      >
        <Image
          src={cover}
          alt={title}
          fill
          sizes="(max-width: 800px) 100vw, 55vw"
          unoptimized
        />
        <span>
          <Expand size={14} />
          Ver fotos · {gallery.length}
        </span>
      </button>
      {gallery.length > 1 && (
        <div className="admin-saved-thumbnails">
          {gallery.map((image, i) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              <Image
                src={image.src}
                alt={image.name}
                fill
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
      <ImageViewer images={gallery} index={index} onChange={setIndex} />
    </div>
  );
}
