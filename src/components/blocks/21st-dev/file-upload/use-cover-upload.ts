"use client";

import { useEffect, useRef, useState } from "react";
import { defaultCover, validateCover } from "./file-upload-data";

type Cover = { name: string; url: string };
type UploadState =
  | { status: "empty" }
  | { status: "ready"; cover: Cover }
  | { status: "uploading"; cover: Cover; progress: number };

export function useCoverUpload() {
  const [state, setState] = useState<UploadState>({ status: "ready", cover: defaultCover });
  const [error, setError] = useState<string | null>(null);
  const objectUrl = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const cancel = () => {
    if (timer.current !== null) clearInterval(timer.current);
    timer.current = null;
  };
  const release = () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
  };

  useEffect(() => () => {
    cancel();
    release();
  }, []);

  const select = (file: File) => {
    const message = validateCover(file);
    if (message) {
      setError(message);
      return;
    }
    cancel();
    release();
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    const cover = { name: file.name, url };
    setError(null);
    setState({ status: "uploading", cover, progress: 0 });
    let progress = 0;
    timer.current = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        cancel();
        setState({ status: "ready", cover });
      } else {
        setState({ status: "uploading", cover, progress });
      }
    }, 120);
  };

  const remove = () => {
    cancel();
    release();
    setError(null);
    setState({ status: "empty" });
  };

  return { state, error, select, remove, reportImageError: () => setError("No se pudo mostrar esta imagen. Prueba con otro archivo.") };
}
