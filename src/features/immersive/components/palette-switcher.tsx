"use client";
import { useSyncExternalStore, type ReactNode } from "react";
import { Palette } from "lucide-react";

type PaletteName = "original" | "institucional" | "granate";
const key = "boletera-immersive-palette";
const eventName = "boletera-palette-change";
function snapshot(): PaletteName {
  try {
    const value = localStorage.getItem(key);
    return value === "original" ||
      value === "institucional" ||
      value === "granate"
      ? value
      : "institucional";
  } catch {
    return "institucional";
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(eventName, callback);
  };
}
export function ImmersivePalette({ children }: { children: ReactNode }) {
  const palette = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "institucional",
  );
  return (
    <div className="immersive-palette" data-palette={palette}>
      {children}
    </div>
  );
}

export function PaletteSelector({ compact = false }: { compact?: boolean }) {
  const palette = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "institucional",
  );
  return (
    <label
      data-demo={compact ? undefined : ""}
      className={compact ? "demo-palette-control" : "palette-control"}
    >
      {!compact && <Palette size={17} aria-hidden="true" />}
      <span>Tema</span>
      <select
        aria-label="Tema de la demo inmersiva"
        value={palette}
        onChange={(e) => {
          try {
            localStorage.setItem(key, e.target.value);
          } catch {
            return;
          }
          window.dispatchEvent(new Event(eventName));
        }}
      >
        <option value="original">Ciruela</option>
        <option value="institucional">Institucional</option>
        <option value="granate">Granate</option>
      </select>
    </label>
  );
}
