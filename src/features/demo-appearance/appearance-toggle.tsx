"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  appearanceStorageKey as key,
  defaultAppearance,
  type Appearance,
} from "./appearance-config";
const changed = "boletera-demo-appearance-change";
let fallback: Appearance = defaultAppearance;
function snapshot(): Appearance {
  try {
    const stored = localStorage.getItem(key);
    return stored === "original" || stored === "glass"
      ? stored
      : defaultAppearance;
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
    () => defaultAppearance,
  );
  useEffect(() => {
    document.documentElement.dataset.demoAppearance = snapshot();
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
