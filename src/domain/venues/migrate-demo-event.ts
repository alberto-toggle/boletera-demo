import { migrateDemoCategory } from "../events/category";
import { findVenue, venueForLayout } from "./catalog";

/** Normalize legacy demo names without clearing purchases or ticket identifiers. */
export function migrateDemoEvent(key: string, value: unknown): unknown {
  const migrated: unknown = migrateDemoCategory(key, value);
  if (!migrated || typeof migrated !== "object" || Array.isArray(migrated))
    return migrated;
  const event = migrated as Record<string, unknown>;
  if (typeof event.venue !== "string" || typeof event.category !== "string")
    return migrated;
  const legacyName = [
    "Salón de Honor",
    "Jardín Central",
    "Patio de Tradiciones",
  ].includes(event.venue);
  const legacyVenue = legacyName
    ? venueForLayout(event.category === "Cena baile" ? "banquet" : "auditorium")
    : undefined;
  const venue =
    findVenue(event.venue) ??
    legacyVenue ??
    venueForLayout(
      event.layout === "banquet" || event.layout === "auditorium"
        ? event.layout
        : event.category === "Cena baile"
          ? "banquet"
          : "auditorium",
    );
  return {
    ...event,
    venue: venue.name,
    ...(typeof event.layout === "string" ? { layout: venue.layout } : {}),
  };
}
