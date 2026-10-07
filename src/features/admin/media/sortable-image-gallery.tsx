"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Check, Expand, GripVertical, Trash2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { EventImage } from "./model";

interface GalleryProps {
  images: EventImage[];
  cover: string;
  disabled: boolean;
  onReorder: (images: EventImage[]) => void;
  onCover: (image: EventImage) => void;
  onRemove: (image: EventImage) => void;
  onView: (index: number) => void;
}

export function SortableImageGallery({
  images,
  cover,
  disabled,
  onReorder,
  onCover,
  onRemove,
  onView,
}: GalleryProps) {
  const id = useId();
  const reducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const activeImage = images.find((image) => image.id === activeId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const name = (key: string | number) =>
    images.find((image) => image.id === key)?.name ?? "Imagen";
  return (
    <div className="admin-sortable-gallery">
      <div className="admin-gallery-heading">
        <strong>
          Tu galería <span>{images.length} fotos</span>
        </strong>
        <p>
          Arrastra desde <GripVertical size={14} aria-hidden="true" /> para
          cambiar el orden.
        </p>
      </div>
      <DndContext
        id={id}
        sensors={sensors}
        collisionDetection={closestCenter}
        accessibility={{
          screenReaderInstructions: {
            draggable:
              "Pulsa espacio para tomar una foto. Usa las flechas para moverla y espacio para soltarla. Escape cancela el movimiento.",
          },
          announcements: {
            onDragStart: ({ active }) =>
              `Tomaste ${name(active.id)}. Usa las flechas para moverla.`,
            onDragOver: ({ over }) =>
              over
                ? `Posición ${images.findIndex((image) => image.id === over.id) + 1} de ${images.length}.`
                : "Fuera de la galería.",
            onDragEnd: ({ active, over }) =>
              over
                ? `${name(active.id)} en la posición ${images.findIndex((image) => image.id === over.id) + 1}.`
                : "Movimiento cancelado.",
            onDragCancel: () =>
              "Movimiento cancelado. Se conserva el orden anterior.",
          },
        }}
        onDragStart={({ active }) => setActiveId(String(active.id))}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={({ active, over }) => {
          setActiveId(null);
          if (disabled || !over || active.id === over.id) return;
          const from = images.findIndex((image) => image.id === active.id);
          const to = images.findIndex((image) => image.id === over.id);
          if (from < 0 || to < 0) return;
          onReorder(arrayMove(images, from, to));
          setAnnouncement(
            `Orden actualizado. ${name(active.id)} ocupa el lugar ${to + 1}.`,
          );
        }}
      >
        <SortableContext
          items={images.map((image) => image.id)}
          strategy={rectSortingStrategy}
        >
          <div className="admin-media-grid">
            {images.map((image, index) => (
              <SortablePhoto
                key={image.id}
                image={image}
                index={index}
                cover={cover === image.src}
                disabled={disabled}
                reducedMotion={Boolean(reducedMotion)}
                onCover={() => onCover(image)}
                onRemove={() => onRemove(image)}
                onView={() => onView(index)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay
          dropAnimation={
            reducedMotion
              ? null
              : { duration: 230, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          }
        >
          {activeImage && (
            <div className="admin-photo-overlay" aria-hidden="true">
              <div className="admin-photo-overlay-image">
                <Image
                  src={activeImage.src}
                  alt=""
                  fill
                  unoptimized
                  sizes="250px"
                />
              </div>
              <span>
                <GripVertical size={15} />
                {activeImage.name}
              </span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
      <p className="admin-gallery-status" role="status">
        {announcement ||
          "La portada se elige por separado del orden de las fotos."}
      </p>
    </div>
  );
}

function SortablePhoto({
  image,
  index,
  cover,
  disabled,
  reducedMotion,
  onCover,
  onRemove,
  onView,
}: {
  image: EventImage;
  index: number;
  cover: boolean;
  disabled: boolean;
  reducedMotion: boolean;
  onCover: () => void;
  onRemove: () => void;
  onView: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active,
  } = useSortable({
    id: image.id,
    disabled,
    transition: reducedMotion
      ? null
      : { duration: 230, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  });
  return (
    <article
      ref={setNodeRef}
      className={`admin-media-item admin-sortable-photo${isDragging ? " is-lifted" : ""}${isOver && active && !isDragging ? " is-target" : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className="admin-photo-topline">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <button
          ref={setActivatorNodeRef}
          type="button"
          className="admin-photo-grip"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={`Reordenar imagen: ${image.name}`}
          title="Arrastra para reordenar"
        >
          <GripVertical size={18} />
        </button>
      </div>
      <button
        type="button"
        className="admin-media-thumbnail"
        onClick={onView}
        aria-label={`Ver imagen: ${image.name}`}
      >
        <Image
          src={image.src}
          alt={image.name}
          fill
          sizes="250px"
          unoptimized
          draggable={false}
        />
        <Expand size={15} />
      </button>
      <span className="admin-media-filename" title={image.name}>
        {image.name}
      </span>
      <div className="admin-photo-footer">
        <button
          type="button"
          className="admin-media-set-cover"
          disabled={disabled}
          aria-pressed={cover}
          onClick={onCover}
        >
          {cover ? (
            <>
              <Check size={13} />
              Portada
            </>
          ) : (
            "Usar de portada"
          )}
        </button>
        <button
          type="button"
          className="admin-photo-remove"
          disabled={disabled}
          aria-label={`Eliminar imagen: ${image.name}`}
          onClick={onRemove}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}
