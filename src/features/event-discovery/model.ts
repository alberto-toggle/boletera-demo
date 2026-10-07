import type { EventCategory } from "@/domain/events/category";
export { eventCategories, type EventCategory } from "@/domain/events/category";
export type EventFilter = EventCategory | "Todos";
export type DemoDirection =
  "institucional" | "gala" | "editorial" | "inmersiva";

export interface DiscoveryEvent {
  readonly id: string;
  readonly title: string;
  readonly category: EventCategory;
  readonly startsAt: string;
  readonly venue: string;
  readonly city: string;
  readonly price: { readonly amountMinor: number; readonly currency: "MXN" };
  readonly image: string;
  readonly imageAlt: string;
  readonly imagePosition?: string;
  readonly description: string;
  readonly includes: readonly string[];
}

export const EVENT_TIME_ZONE = "America/Mexico_City";

export function formatEventDate(
  isoDate: string,
  style: "long" | "short" = "long",
): string {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: EVENT_TIME_ZONE,
    day: "numeric",
    month: style === "long" ? "long" : "short",
    ...(style === "long" ? { year: "numeric" } : {}),
  }).format(new Date(isoDate));
}

export function formatEventTime(isoDate: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: EVENT_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(isoDate));
}

export function formatPrice(price: DiscoveryEvent["price"]): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amountMinor / 100);
}

function normalizeQuery(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX")
    .trim();
}

export function filterEvents(
  events: readonly DiscoveryEvent[],
  category: EventFilter,
  query: string,
): DiscoveryEvent[] {
  const normalized = normalizeQuery(query);
  return events.filter(
    (event) =>
      (category === "Todos" || event.category === category) &&
      normalizeQuery(
        `${event.title} ${event.venue} ${event.category}`,
      ).includes(normalized),
  );
}
