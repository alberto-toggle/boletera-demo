"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Images, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_EVENT_IMAGES, type EventMedia } from "./model";
import { useImageUpload } from "./use-image-upload";
import { SortableImageGallery } from "./sortable-image-gallery";
import { ImageViewer } from "./image-viewer";

export function EventMediaEditor({
  value,
  covers,
  onChange,
  onBusyChange,
}: {
  value: EventMedia;
  covers: readonly { src: string; label: string }[];
  onChange: (media: EventMedia) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [viewing, setViewing] = useState<number | null>(null);
  const upload = useImageUpload(
    (images) =>
      onChange({
        image: value.images.length ? value.image : images[0].src,
        images: [...value.images, ...images],
      }),
    onBusyChange,
  );
  const busy = upload.state.status === "processing";
  return (
    <section
      className="admin-form-section admin-media-editor"
      aria-label="Imágenes del evento"
    >
      <div className="admin-media-heading">
        <div>
          <h2>Imágenes del evento</h2>
          <p>Una portada que invite. Una galería que cuente la experiencia.</p>
        </div>
        <span>
          {value.images.length}/{MAX_EVENT_IMAGES}
        </span>
      </div>
      {value.image && (
        <div className="admin-media-cover">
          <Image
            src={value.image}
            alt="Portada del evento"
            fill
            sizes="(max-width: 760px) 90vw, 600px"
            unoptimized
          />
          <span>Portada actual</span>
        </div>
      )}
      <div
        className={`admin-media-drop ${dragging ? "is-dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void upload.select(
            Array.from(event.dataTransfer.files),
            value.images,
          );
        }}
        aria-busy={busy}
      >
        {busy ? (
          <LoaderCircle className="animate-spin" size={24} />
        ) : (
          <Upload size={24} />
        )}
        <div>
          <strong>
            {busy
              ? `Preparando imágenes · ${upload.state.status === "processing" ? `${upload.state.completed}/${upload.state.total}` : ""}`
              : "Arrastra tus fotos aquí"}
          </strong>
          <small>JPG, PNG o WebP · Hasta 5 MB por foto · Máximo 6</small>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={busy || value.images.length >= MAX_EVENT_IMAGES}
          onClick={() => input.current?.click()}
        >
          Elegir imágenes
        </Button>
        <input
          ref={input}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          aria-label="Seleccionar imágenes del evento"
          className="sr-only"
          tabIndex={-1}
          disabled={busy}
          onChange={(event) => {
            void upload.select(
              Array.from(event.target.files ?? []),
              value.images,
            );
            event.target.value = "";
          }}
        />
      </div>
      <div role="status" className="admin-media-status">
        {upload.announcement}
      </div>
      {upload.errors.length > 0 && (
        <ul className="admin-media-errors" role="alert">
          {upload.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      {value.images.length > 0 && (
        <SortableImageGallery
          images={value.images}
          cover={value.image}
          disabled={busy}
          onView={setViewing}
          onReorder={(images) => onChange({ ...value, images })}
          onCover={(image) => onChange({ ...value, image: image.src })}
          onRemove={(image) => {
            const images = value.images.filter((item) => item.id !== image.id);
            onChange({
              images,
              image:
                value.image === image.src
                  ? (images[0]?.src ?? "")
                  : value.image,
            });
          }}
        />
      )}
      <details className="admin-media-library">
        <summary>
          <Images size={16} />
          Elegir de la biblioteca
        </summary>
        <div className="admin-cover-options">
          {covers.map((cover) => (
            <button
              key={cover.src}
              type="button"
              disabled={busy}
              aria-label={`Usar portada: ${cover.label}`}
              aria-pressed={value.image === cover.src}
              onClick={() => onChange({ ...value, image: cover.src })}
            >
              <Image src={cover.src} alt={cover.label} fill sizes="120px" />
              {value.image === cover.src && (
                <span>
                  <Check size={13} />
                </span>
              )}
            </button>
          ))}
        </div>
      </details>
      <p className="admin-media-local-note">
        Las fotos se optimizan y se conservan en este navegador al guardar el
        evento.
      </p>
      <ImageViewer
        images={value.images}
        index={viewing}
        onChange={setViewing}
      />
    </section>
  );
}
