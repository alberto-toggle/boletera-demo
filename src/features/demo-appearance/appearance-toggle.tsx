"use client";

import { useEffect, useSyncExternalStore } from "react";

const key = "boletera-demo-appearance";
const changed = "boletera-demo-appearance-change";
type Appearance = "original" | "glass";
let fallback: Appearance = "original";
function snapshot(): Appearance {
  try {
    return localStorage.getItem(key) === "glass" ? "glass" : "original";
  } catch {
    return fallback;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changed, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changed, callback);
  };
}
function setAppearance(value: Appearance) {
  fallback = value;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Session-only preference when storage is unavailable. */
  }
  window.dispatchEvent(new Event(changed));
}

export function AppearanceToggle() {
  const appearance = useSyncExternalStore(
    subscribe,
    snapshot,
    () => "original" as const,
  );
  useEffect(() => {
    document.documentElement.dataset.demoAppearance = appearance;
    return () => {
      delete document.documentElement.dataset.demoAppearance;
    };
  }, [appearance]);
  return (
    <label className="demo-appearance-control">
      <span>Acabado glass</span>
      <input
        type="checkbox"
        role="switch"
        aria-label="Acabado glass"
        checked={appearance === "glass"}
        onChange={(event) =>
          setAppearance(event.target.checked ? "glass" : "original")
        }
      />
      <span className="demo-appearance-track" aria-hidden="true" />
    </label>
  );
}
