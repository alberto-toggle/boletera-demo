import { validSeatOverrides } from "../inventory/model";
import { findVenue } from "@/domain/venues/catalog";
import { isEventCategory } from "@/domain/events/category";
import { isImageSource, isImageCollection } from "../media/model";
import { zoneSold, type AdminEvent, type AdminSale } from "../model";
export function validateEvent(
  event: AdminEvent,
  sales: readonly AdminSale[],
): string[] {
  const errors: string[] = [];
  if (
    event.seatOverrides !== undefined &&
    !validSeatOverrides(event.seatOverrides)
  )
    errors.push("Revisa la configuración individual de lugares.");
  if (!isEventCategory(event.category))
    errors.push("Selecciona Evento o Cena baile.");
  if (
    !isImageSource(event.image) ||
    (event.images !== undefined && !isImageCollection(event.images))
  )
    errors.push(
      event.image
        ? "Revisa las imágenes del evento."
        : "Selecciona una imagen de portada para el evento.",
    );
  if (event.title.trim().length < 3)
    errors.push("Escribe un nombre de al menos 3 caracteres.");
  if (
    !findVenue(event.venue) ||
    findVenue(event.venue)?.layout !== event.layout
  )
    errors.push("Selecciona un recinto y su distribución correspondiente.");
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?-06:00$/.test(event.startsAt) ||
    !Number.isFinite(Date.parse(event.startsAt))
  )
    errors.push("Selecciona una fecha y hora válidas.");
  if (event.description.trim().length < 20)
    errors.push("Describe el evento con al menos 20 caracteres.");
  if (
    !event.zones.length ||
    event.zones.some(
      (zone) =>
        !Number.isSafeInteger(zone.capacity) ||
        zone.capacity < 1 ||
        zone.capacity > 10000 ||
        !Number.isSafeInteger(zone.priceMinor) ||
        zone.priceMinor < 0 ||
        zone.priceMinor > 100000000,
    )
  )
    errors.push("Revisa el aforo (1 a 10,000) y el precio de cada zona.");
  if (
    event.zones.some(
      (zone) => zone.capacity < zoneSold(event.id, zone.id, sales),
    )
  )
    errors.push(
      "El aforo no puede ser menor que los boletos vendidos en esa zona.",
    );
  return errors;
}
export function isStoredEvent(value: unknown): value is AdminEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Record<string, unknown>;
  return (
    (event.seatOverrides === undefined ||
      validSeatOverrides(event.seatOverrides)) &&
    typeof event.id === "string" &&
    /^[a-zA-Z0-9-]+$/.test(event.id) &&
    typeof event.title === "string" &&
    isEventCategory(event.category) &&
    typeof event.startsAt === "string" &&
    Number.isFinite(Date.parse(event.startsAt)) &&
    typeof event.venue === "string" &&
    findVenue(event.venue)?.layout === event.layout &&
    isImageSource(event.image) &&
    (event.images === undefined || isImageCollection(event.images)) &&
    typeof event.description === "string" &&
    Array.isArray(event.includes) &&
    event.includes.every((item) => typeof item === "string") &&
    ["draft", "published", "unpublished"].includes(String(event.status)) &&
    ["banquet", "auditorium"].includes(String(event.layout)) &&
    typeof event.updatedAt === "string" &&
    Array.isArray(event.zones) &&
    event.zones.length > 0 &&
    event.zones.every((zone: unknown) => {
      if (!zone || typeof zone !== "object") return false;
      const z = zone as Record<string, unknown>;
      return (
        typeof z.id === "string" &&
        typeof z.name === "string" &&
        typeof z.capacity === "number" &&
        Number.isSafeInteger(z.capacity) &&
        z.capacity > 0 &&
        z.capacity <= 10000 &&
        typeof z.priceMinor === "number" &&
        Number.isSafeInteger(z.priceMinor) &&
        z.priceMinor >= 0 &&
        z.priceMinor <= 100000000
      );
    })
  );
}
