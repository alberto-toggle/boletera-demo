import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { MouseEventHandler } from "react";
import "./gallery-photo-controls.css";

/** Presentational controls: the gallery owns navigation and dialog state. */
export function GalleryPhotoControls({
  index,
  count,
  disabled,
  announcing,
  onPrevious,
  onNext,
  onOpen,
}: {
  index: number;
  count: number;
  disabled: boolean;
  announcing: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onOpen: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div className="gallery-photo-controls">
      <div
        className="gallery-photo-navigation"
        data-material="liquid"
        role="group"
        aria-label="Navegar fotos de portada"
      >
        <button
          type="button"
          aria-label="Foto anterior de portada"
          disabled={disabled}
          onClick={onPrevious}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <span
          className="gallery-photo-count"
          aria-live={announcing ? "polite" : "off"}
          aria-atomic="true"
        >
          <span className="sr-only">Foto </span>
          {index + 1}
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> de </span>
          {count}
        </span>
        <button
          type="button"
          aria-label="Foto siguiente de portada"
          disabled={disabled}
          onClick={onNext}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        className="gallery-photo-open"
        data-material="liquid"
        onClick={onOpen}
      >
        <Images size={18} aria-hidden="true" /> Ver fotos
      </button>
    </div>
  );
}
