import type { AdminEvent, AdminSale } from "../model";
export interface SeatOverride {
  id: string;
  row: string;
  number: string;
  enabled: boolean;
}
export interface InventoryHold {
  id: string;
  eventId: string;
  seatIds: string[];
  expiresAt: number;
}
export function eventSeats(event: AdminEvent) {
  const overrides = new Map(event.seatOverrides?.map((s) => [s.id, s]));
  return event.zones.flatMap((zone) =>
    Array.from({ length: zone.capacity }, (_, index) => {
      const id = `${zone.id}-${index + 1}`;
      return {
        id,
        zoneId: zone.id,
        row: String(Math.floor(index / 10) + 1),
        number: String((index % 10) + 1),
        enabled: true,
        ...overrides.get(id),
      };
    }),
  );
}
export function occupiedSeatIds(
  eventId: string,
  sales: readonly AdminSale[],
  holds: readonly InventoryHold[] = [],
  now = Date.now(),
) {
  return new Set(
    [
      ...sales
        .filter((s) => s.eventId === eventId && s.status === "confirmed")
        .flatMap((s) => s.tickets.map((t) => t.seatId)),
      ...holds
        .filter((h) => h.eventId === eventId && h.expiresAt > now)
        .flatMap((h) => h.seatIds),
    ].filter((id): id is string => !!id),
  );
}
export function inventoryChangeError(
  next: AdminEvent,
  previous: AdminEvent | undefined,
  sales: readonly AdminSale[],
  holds: readonly InventoryHold[],
  now: number,
) {
  if (!previous) return null;
  const occupied = occupiedSeatIds(next.id, sales, holds, now);
  if (
    occupied.size &&
    (next.layout !== previous.layout || next.venue !== previous.venue)
  )
    return "No puedes cambiar el recinto mientras existan lugares vendidos o apartados.";
  const before = new Map(eventSeats(previous).map((s) => [s.id, s]));
  const after = new Map(eventSeats(next).map((s) => [s.id, s]));
  for (const id of occupied) {
    const a = before.get(id),
      b = after.get(id);
    if (!b || !b.enabled || (a && (a.row !== b.row || a.number !== b.number)))
      return "No puedes eliminar, deshabilitar o renumerar un lugar vendido o apartado.";
  }
  const labels = eventSeats(next).map(
    (s) => `${s.zoneId}:${s.row}:${s.number}`,
  );
  if (new Set(labels).size !== labels.length)
    return "Cada lugar debe tener una combinación única de zona, fila o mesa y número.";
  return null;
}
export function validSeatOverrides(value: unknown): value is SeatOverride[] {
  return (
    Array.isArray(value) &&
    value.length <= 50000 &&
    value.every(
      (s) =>
        s &&
        typeof s === "object" &&
        typeof s.id === "string" &&
        typeof s.row === "string" &&
        s.row.trim().length > 0 &&
        s.row.length <= 16 &&
        typeof s.number === "string" &&
        s.number.trim().length > 0 &&
        s.number.length <= 16 &&
        typeof s.enabled === "boolean",
    ) &&
    new Set(value.map((s) => s.id)).size === value.length
  );
}
