import { migrateDemoEvent } from "@/domain/venues/migrate-demo-event";
import type { AdminEvent } from "../model";
import { isStoredEvent } from "../events/validation";
export const ADMIN_STORAGE_KEY = "boletera-admin-demo-v1";
// A deliberately small boundary: replace these functions when a real service exists.
export function readAdminEvents(fallback: AdminEvent[]): AdminEvent[] {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(ADMIN_STORAGE_KEY) ?? "null",
      migrateDemoEvent,
    );
    if (
      raw &&
      typeof raw === "object" &&
      "version" in raw &&
      raw.version === 1 &&
      "events" in raw &&
      Array.isArray(raw.events) &&
      raw.events.every(isStoredEvent) &&
      new Set(raw.events.map((event) => event.id)).size === raw.events.length
    ) {
      const storedEvents = raw.events;
      return [...storedEvents, ...fallback.filter(event => !storedEvents.some(stored => stored.id === event.id))];
    }
  } catch {
    /* Invalid/unavailable storage leaves the seeded demo usable. */
  }
  return fallback;
}
export function writeAdminEvents(events: AdminEvent[]): boolean {
  try {
    localStorage.setItem(
      ADMIN_STORAGE_KEY,
      JSON.stringify({ version: 1, events }),
    );
    return true;
  } catch {
    return false;
  }
}
