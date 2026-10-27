"use client";

import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BanquetLandmarks } from "@/features/seating/banquet-landmarks";
import {
  availableTablePositions,
  alignBanquetExtras,
  banquetBounds,
  banquetSeatId,
  banquetView,
  configuredTables,
  emptyBanquetConfiguration,
  type BanquetConfiguration,
} from "@/domain/venues/banquet-configuration";

export function BanquetTableEditor({
  configuration,
  occupied,
  onChange,
  onPendingChange,
}: {
  configuration?: BanquetConfiguration;
  occupied: ReadonlySet<string>;
  onChange: (configuration: BanquetConfiguration) => void;
  onPendingChange: (pending: boolean) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [pending, setPending] = useState<{ x: number; y: number }[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const config = configuration ?? emptyBanquetConfiguration;
  const tables = configuredTables(config);
  const positions = adding ? availableTablePositions(config) : [];
  // Preview the expanded room and furniture around every available position
  // without modifying the stored floor plan until the selection is confirmed.
  const preview = {
    ...config,
    extras: [...config.extras, ...positions.map((p) => ({ ...p, label: "" }))],
  };
  const view = banquetView(preview);
  const chosen = adding
    ? undefined
    : config.extras.find((t) => t.label === selected);
  const lockedLabels = new Set(
    config.extras
      .filter((table) =>
        Array.from({ length: 10 }, (_, i) => banquetSeatId(table, i)).some(
          (id) => occupied.has(id),
        ),
      )
      .map((t) => t.label),
  );
  const aligned = alignBanquetExtras(config, lockedLabels);
  const locked =
    chosen &&
    Array.from({ length: 10 }, (_, i) => banquetSeatId(chosen, i)).some((id) =>
      occupied.has(id),
    );
  return (
    <section className="admin-form-section" aria-label="Configuración de mesas">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Mesas del evento</h3>
          <p className="text-sm text-muted-foreground">
            66 base + {config.extras.length}{" "}
            {config.extras.length === 1 ? "extra" : "extras"} ·{" "}
            {tables.length * 10} lugares
          </p>
        </div>
        <Button
          type="button"
          variant={adding ? "outline" : "default"}
          disabled={config.extras.length >= 934}
          onClick={() => {
            setAdding(!adding);
            setPending([]);
            onPendingChange(false);
            setSelected(null);
          }}
        >
          <Plus />
          {adding ? "Cancelar selección" : "Agregar mesas"}
        </Button>
      </div>
      {!adding && aligned !== config && (
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange(aligned)}
        >
          Alinear mesas extra al patrón del plano
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        {adding
          ? "Marca las posiciones que quieras agregar y confirma la selección. Vuelve a tocar una posición marcada para desmarcarla."
          : "El plano base se conserva. Selecciona una mesa extra para quitarla; sus números no cambian al quitar otra."}
      </p>
      <div className="admin-banquet-map overflow-auto rounded-xl border bg-background p-2">
        <svg
          viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
          className="min-w-[560px] w-full"
          aria-label="Plano editable: mesas base, extras y posiciones disponibles"
        >
          <BanquetLandmarks
            showRestrooms={false}
            bounds={banquetBounds(preview)}
          />
          {tables.map((t, index) => {
            const extra = index >= 66;
            return (
              <g
                key={t.label}
                role={extra && !adding ? "button" : undefined}
                tabIndex={extra && !adding ? 0 : undefined}
                aria-label={`Mesa ${t.label}${extra ? ", extra" : ", base"}`}
                aria-pressed={extra ? selected === t.label : undefined}
                onClick={
                  extra && !adding
                    ? () => {
                        setSelected(t.label);
                        setAdding(false);
                      }
                    : undefined
                }
                onKeyDown={
                  extra && !adding
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(t.label);
                          setAdding(false);
                        }
                      }
                    : undefined
                }
                className={
                  extra ? "cursor-pointer outline-offset-4" : undefined
                }
              >
                <circle
                  cx={t.x}
                  cy={t.y}
                  r={25}
                  fill={extra ? "var(--primary)" : "var(--muted)"}
                  stroke={
                    selected === t.label ? "var(--ring)" : "var(--border)"
                  }
                  strokeWidth={selected === t.label ? 5 : 2}
                />
                <text
                  x={t.x}
                  y={t.y}
                  dominantBaseline="central"
                  textAnchor="middle"
                  fill={
                    extra ? "var(--primary-foreground)" : "var(--foreground)"
                  }
                  fontSize={14}
                >
                  {t.label}
                </text>
              </g>
            );
          })}
          {positions.map((p) => {
            const pendingIndex = pending.findIndex(
              (point) => point.x === p.x && point.y === p.y,
            );
            const marked = pendingIndex >= 0;
            const add = () => {
              const next = marked
                ? pending.filter((_, i) => i !== pendingIndex)
                : [...pending, p];
              if (config.extras.length + next.length > 934) return;
              setPending(next);
              onPendingChange(next.length > 0);
            };
            return (
              <g
                key={`${p.x}-${p.y}`}
                role="button"
                tabIndex={0}
                aria-label={`${marked ? "Desmarcar" : "Seleccionar"} posición ${p.x}, ${p.y}`}
                aria-pressed={marked}
                onClick={add}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    add();
                  }
                }}
                className="cursor-pointer outline-offset-4"
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={23}
                  fill={marked ? "var(--primary)" : "var(--background)"}
                  stroke="var(--primary)"
                  strokeWidth={2}
                  strokeDasharray={marked ? undefined : "4 3"}
                />
                <text
                  x={p.x}
                  y={p.y}
                  dominantBaseline="central"
                  textAnchor="middle"
                  fill={marked ? "var(--primary-foreground)" : "var(--primary)"}
                  fontSize={marked ? 14 : 26}
                >
                  {marked ? config.nextNumber + pendingIndex : "+"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-muted-foreground sm:hidden">
        Desliza el plano horizontalmente para ver sus laterales.
      </p>
      <div
        aria-live="polite"
        className="flex flex-wrap items-center justify-between gap-3 text-sm"
      >
        {adding ? (
          <>
            <span>
              {pending.length} mesas seleccionadas · {pending.length * 10}{" "}
              lugares por agregar
            </span>
            <Button
              type="button"
              disabled={!pending.length}
              onClick={() => {
                onChange({
                  nextNumber: config.nextNumber + pending.length,
                  extras: [
                    ...config.extras,
                    ...pending.map((point, i) => ({
                      ...point,
                      label: String(config.nextNumber + i),
                    })),
                  ],
                });
                setPending([]);
                setAdding(false);
                onPendingChange(false);
              }}
            >
              <Check />
              Confirmar {pending.length}{" "}
              {pending.length === 1 ? "mesa" : "mesas"}
            </Button>
          </>
        ) : chosen ? (
          <>
            <span>
              Mesa extra {chosen.label} · 10 lugares
              {locked
                ? " · Tiene ventas, apartados o cortesías; no se puede quitar."
                : ""}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={Boolean(locked)}
              onClick={() => {
                onChange({
                  ...config,
                  extras: config.extras.filter((t) => t.label !== chosen.label),
                });
                setSelected(null);
              }}
            >
              <Trash2 />
              Quitar mesa {chosen.label}
            </Button>
          </>
        ) : (
          <span className="text-muted-foreground">
            La pista y el pasillo central hacia el acceso quedan libres.
          </span>
        )}
      </div>
    </section>
  );
}
