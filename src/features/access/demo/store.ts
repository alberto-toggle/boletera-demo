"use client";
import { useSyncExternalStore } from "react";
import type { AccessRecord } from "../model";
export const ACCESS_KEY = "boletera-access-demo-v1";
const changed = "boletera-access-changed";
const empty: AccessRecord[] = [];
let cachedRaw: string | null = null;
let cache = empty;
let memoryOnly = false;
function valid(value: unknown): value is AccessRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.ticketId === "string" &&
    typeof item.eventId === "string" &&
    typeof item.operator === "string" &&
    typeof item.usedAt === "string" &&
    Number.isFinite(Date.parse(item.usedAt))
  );
}
export function readAccess(): AccessRecord[] {
  if (memoryOnly) return cache;
  try {
    const raw = localStorage.getItem(ACCESS_KEY);
    if (raw === cachedRaw) return cache;
    const parsed: unknown = JSON.parse(raw ?? "[]");
    cache = Array.isArray(parsed) && parsed.every(valid) ? parsed : empty;
    cachedRaw = raw;
  } catch {
    /* Memory fallback. */
  }
  return cache;
}
function subscribe(callback: () => void) {
  window.addEventListener(changed, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(changed, callback);
    window.removeEventListener("storage", callback);
  };
}
export const useAccessRecords = () =>
  useSyncExternalStore(subscribe, readAccess, () => empty);
// Lock serializes confirmations across same-origin tabs in this local demo.
export async function registerAccess(
  record: AccessRecord,
): Promise<{ record: AccessRecord; duplicate: boolean; persisted: boolean }> {
  const commit = () => {
    const current = readAccess();
    const existing = current.find((r) => r.ticketId === record.ticketId);
    if (existing)
      return { record: existing, duplicate: true, persisted: !memoryOnly };
    cache = [...current, record];
    let persisted = true;
    try {
      cachedRaw = JSON.stringify(cache);
      localStorage.setItem(ACCESS_KEY, cachedRaw);
    } catch {
      cachedRaw = null;
      memoryOnly = true;
      persisted = false;
    }
    window.dispatchEvent(new Event(changed));
    return { record, duplicate: false, persisted };
  };
  return navigator.locks
    ? navigator.locks.request(ACCESS_KEY, commit)
    : commit();
}
