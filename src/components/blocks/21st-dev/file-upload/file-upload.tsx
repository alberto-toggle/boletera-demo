"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { CloudUpload, ImageIcon, TriangleAlert, Upload, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { coverMimeTypes } from "./file-upload-data";
import { useCoverUpload } from "./use-cover-upload";

export default function CoverUpload() {
  const { state, error, select, remove, reportImageError } = useCoverUpload();
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const hintId = useId();
  const errorId = useId();
  const open = () => input.current?.click();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl border transition-colors motion-reduce:transition-none",
          dragging ? "border-dashed border-primary bg-primary/5" : "border-border bg-background",
        )}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) select(file);
        }}
      >
        <input
          ref={input}
          type="file"
          accept={coverMimeTypes.join(",")}
          aria-label="Seleccionar imagen de portada"
          aria-describedby={error ? errorId : hintId}
          aria-invalid={Boolean(error)}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) select(file);
            event.target.value = "";
          }}
        />
        {state.status !== "empty" ? (
          <div className="relative aspect-[21/9] min-h-52 w-full">
            <Image key={state.cover.url} src={state.cover.url} alt={state.cover.name} fill unoptimized sizes="(max-width: 900px) 100vw, 900px" className="object-cover" onError={reportImageError} />
            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/40 motion-reduce:transition-none" />
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <Button onClick={open} variant="secondary" size="sm" className="bg-white/90 text-gray-900 hover:bg-white"><Upload />Cambiar portada</Button>
              <Button onClick={remove} variant="destructive" size="sm" className="bg-red-700 text-white hover:bg-red-800"><XIcon />Eliminar</Button>
            </div>
            {state.status === "uploading" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60">
                <div role="progressbar" aria-label="Carga simulada" aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.progress} className="relative">
                  <svg className="size-16 -rotate-90" viewBox="0 0 64 64" aria-hidden="true">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/20" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - state.progress / 100)} className="text-white" strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">{state.progress}%</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="rounded-full bg-primary/10 p-4"><CloudUpload className="size-8 text-primary" /></div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Imagen de portada</h2>
              <p className="text-sm text-muted-foreground">Arrastra una imagen aquí o selecciónala desde tu equipo.</p>
            </div>
            <Button onClick={open} variant="outline" size="sm"><ImageIcon />Seleccionar archivo</Button>
          </div>
        )}
      </div>
      {error && <div id={errorId} role="alert" className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"><TriangleAlert className="size-5 shrink-0" />{error}</div>}
      <p role="status" className="text-sm text-muted-foreground">
        {state.status === "uploading" ? "Simulando carga local…" : state.status === "empty" ? "No hay imagen seleccionada." : "Vista previa disponible. No se ha enviado ningún archivo."}
      </p>
      <div id={hintId} className="rounded-lg bg-muted/50 p-4">
        <h3 className="mb-2 text-sm font-medium">Recomendaciones para la portada</h3>
        <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
          <li>Usa imágenes con buena iluminación y composición.</li>
          <li>Proporción recomendada: 21:9 (1200 × 514 px).</li>
          <li>Evita contenido importante cerca de los bordes.</li>
          <li>Formatos: JPG, PNG y WebP. Tamaño máximo: 5 MB.</li>
        </ul>
      </div>
    </div>
  );
}
