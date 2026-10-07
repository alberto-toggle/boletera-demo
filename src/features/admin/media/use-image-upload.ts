"use client";
import { useEffect, useRef, useState } from "react";
import { MAX_EVENT_IMAGES, type EventImage } from "./model";
import { prepareEventImage } from "./prepare-image";
type UploadState =
  | { status: "idle" }
  | { status: "processing"; completed: number; total: number };
export function useImageUpload(
  onReady: (images: EventImage[]) => void,
  onBusyChange: (busy: boolean) => void,
) {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [errors, setErrors] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const active = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function select(
    files: readonly File[],
    existing: readonly EventImage[],
  ) {
    if (active.current || !files.length) return;
    const available = MAX_EVENT_IMAGES - existing.length;
    if (available <= 0) {
      setErrors([
        `Puedes agregar hasta ${MAX_EVENT_IMAGES} imágenes. Elimina una para añadir otra.`,
      ]);
      return;
    }
    const batch = files.slice(0, available);
    const messages: string[] =
      files.length > available
        ? [
            `Se procesarán las primeras ${available} imágenes para respetar el límite de ${MAX_EVENT_IMAGES}.`,
          ]
        : [];
    active.current = true;
    onBusyChange(true);
    setErrors([]);
    setAnnouncement("");
    setState({ status: "processing", completed: 0, total: batch.length });
    const prepared: EventImage[] = [];
    try {
      for (const [index, file] of batch.entries()) {
        try {
          const image = await prepareEventImage(file);
          if (
            [...existing, ...prepared].some((item) => item.src === image.src)
          ) {
            messages.push(`${file.name}: esta imagen ya está en la galería.`);
          } else {
            prepared.push(image);
          }
        } catch (error) {
          messages.push(
            `${file.name}: ${error instanceof Error ? error.message : "No se pudo procesar."}`,
          );
        }
        if (!mounted.current) return;
        setState({
          status: "processing",
          completed: index + 1,
          total: batch.length,
        });
      }
      if (mounted.current) {
        if (prepared.length) onReady(prepared);
        setErrors(messages);
        setAnnouncement(
          prepared.length
            ? `${prepared.length} ${prepared.length === 1 ? "imagen lista" : "imágenes listas"}. Guarda el evento para conservar los cambios.`
            : "No se agregaron imágenes.",
        );
      }
    } finally {
      active.current = false;
      if (mounted.current) {
        setState({ status: "idle" });
        onBusyChange(false);
      }
    }
  }
  return { state, errors, announcement, select };
}
