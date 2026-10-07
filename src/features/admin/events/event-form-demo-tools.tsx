"use client";

import { Undo2, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eventCategories, type EventCategory } from "@/domain/events/category";

export function EventFormDemoTools({
  editing,
  category,
  disabled,
  canUndo,
  message,
  onFill,
  onUndo,
}: {
  editing: boolean;
  category: EventCategory;
  disabled: boolean;
  canUndo: boolean;
  message: string;
  onFill: (category: EventCategory) => void;
  onUndo: () => void;
}) {
  return (
    <div data-demo className="mb-5 flex flex-wrap items-center gap-3">
      <div className="min-w-0 flex-1 basis-64">
        <p className="font-medium">Prepara tu presentación</p>
        <p className="mt-1 text-xs">
          {editing
            ? "Completa campos vacíos sin reemplazar los datos del evento."
            : "Carga textos, fecha, recinto, precios e imágenes de ejemplo. Reemplaza los datos actuales."}
        </p>
        <p role="status" className="mt-1 text-xs">
          {message || "Puedes editar los datos antes de guardar."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(editing ? [category] : eventCategories).map((value) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onFill(value)}
          >
            <WandSparkles aria-hidden="true" />
            {editing ? "Completar campos vacíos" : `Ejemplo: ${value}`}
          </Button>
        ))}
        {canUndo && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={onUndo}
          >
            <Undo2 aria-hidden="true" />
            Deshacer
          </Button>
        )}
      </div>
    </div>
  );
}
