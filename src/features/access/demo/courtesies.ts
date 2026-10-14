"use client";
import { useSyncExternalStore } from "react";
import type { AccessEvent, AccessTicket } from "../model";
export interface Courtesy extends AccessTicket {
  seatId: string;
  issuedAt: string;
  event: AccessEvent;
}
export const COURTESY_KEY = "boletera-courtesies-demo-v1";
const changed = "boletera-courtesies-changed";
const empty: Courtesy[] = [];
let rawCache: string | null = null;
let cache = empty;
function valid(value: unknown): value is Courtesy {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (
    ![
      "id",
      "eventId",
      "seatId",
      "orderId",
      "buyer",
      "email",
      "seat",
      "zone",
      "issuedAt",
    ].every((k) => typeof v[k] === "string") ||
    !v.event ||
    typeof v.event !== "object"
  )
    return false;
  const e = v.event as Record<string, unknown>;
  return (
    ["id", "title", "venue", "startsAt", "image"].every(
      (k) => typeof e[k] === "string",
    ) &&
    e.id === v.eventId &&
    Number.isFinite(Date.parse(String(e.startsAt)))
  );
}
export function readCourtesies(): Courtesy[] {
  try {
    const raw = localStorage.getItem(COURTESY_KEY);
    if (raw === rawCache) return cache;
    const data: unknown = JSON.parse(raw ?? "[]");
    cache = Array.isArray(data) && data.every(valid) ? data : empty;
    rawCache = raw;
  } catch {
    /* Preserve current snapshot when storage is unavailable. */
  }
  return cache;
}
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(changed, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(changed, cb);
  };
}
export function useCourtesies() {
  return useSyncExternalStore(subscribe, readCourtesies, () => empty);
}
/** Called only by the administrator demo boundary after checking inventory. */
export async function saveCourtesy(value: Courtesy): Promise<string | null> {
  const save = () => {
    const previous = readCourtesies();
    if (
      previous.some(
        (c) => c.eventId === value.eventId && c.seatId === value.seatId,
      )
    )
      return "Este lugar ya tiene una cortesía.";
    try {
      const raw = JSON.stringify([...previous, value]);
      localStorage.setItem(COURTESY_KEY, raw);
      rawCache = raw;
      cache = [...previous, value];
      window.dispatchEvent(new Event(changed));
      return null;
    } catch {
      return "No se pudo guardar la cortesía. Revisa el almacenamiento del navegador antes de emitirla.";
    }
  };
  return navigator.locks ? navigator.locks.request(COURTESY_KEY, save) : save();
}
