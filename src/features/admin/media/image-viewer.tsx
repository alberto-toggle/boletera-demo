"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminDialog } from "../components/controls";
export interface GalleryImage {
  src: string;
  name: string;
}
export function ImageViewer({
  images,
  index,
  onChange,
}: {
  images: readonly GalleryImage[];
  index: number | null;
  onChange: (index: number | null) => void;
}) {
  const selected = index === null ? undefined : images[index];
  return (
    <AdminDialog
      open={Boolean(selected)}
      onOpenChange={(open) => {
        if (!open) onChange(null);
      }}
      title="Galería del evento"
      description={
        selected
          ? `${(index ?? 0) + 1} de ${images.length} · ${selected.name}`
          : undefined
      }
    >
      {selected && (
        <>
          <div className="admin-image-viewer">
            <Image
              src={selected.src}
              alt={selected.name}
              fill
              sizes="600px"
              unoptimized
            />
          </div>
          <div className="admin-image-viewer-controls">
            <Button
              type="button"
              variant="outline"
              aria-label="Imagen anterior"
              disabled={images.length < 2}
              onClick={() =>
                onChange(((index ?? 0) - 1 + images.length) % images.length)
              }
            >
              <ChevronLeft />
              Anterior
            </Button>
            <span>
              {(index ?? 0) + 1} / {images.length}
            </span>
            <Button
              type="button"
              variant="outline"
              aria-label="Imagen siguiente"
              disabled={images.length < 2}
              onClick={() => onChange(((index ?? 0) + 1) % images.length)}
            >
              Siguiente
              <ChevronRight />
            </Button>
          </div>
        </>
      )}
    </AdminDialog>
  );
}
