import {
  eventSeats,
  type SeatOverride,
  type InventoryHold,
} from "./inventory/model";
import type { EventCategory } from "@/domain/events/category";
import type { EventImage } from "./media/model";
export type EventStatus = "published" | "draft" | "unpublished";
import type { VenueLayout } from "@/domain/venues/catalog";
export type { VenueLayout } from "@/domain/venues/catalog";
export interface EventZone {
  id: string;
  name: string;
  capacity: number;
  priceMinor: number;
}
export interface AdminEvent {
  id: string;
  title: string;
  category: EventCategory;
  startsAt: string;
  venue: string;
  image: string;
  images?: EventImage[];
  description: string;
  includes: string[];
  status: EventStatus;
  layout: VenueLayout;
  zones: EventZone[];
  seatOverrides?: SeatOverride[];
  updatedAt: string;
}
export type SaleStatus = "confirmed" | "failed" | "expired";
export type SaleChannel = "web" | "box-office";
export interface AdminSale {
  id: string;
  eventId: string;
  createdAt: string;
  buyer: { name: string; email: string; kind: "military" | "general" };
  militaryCount: number;
  sellerId?: string;
  channel: SaleChannel;
  status: SaleStatus;
  tickets: {
    id: string;
    zoneId: string;
    seatId?: string;
    usedAt?: string;
    seat: string;
    priceMinor: number;
    used: boolean;
  }[];
  payments: {
    method: "online" | "cash" | "terminal";
    amountMinor: number;
    reference: string;
  }[];
}
export interface AdminData {
  events: AdminEvent[];
  sales: AdminSale[];
}
export interface DateRange {
  from: string;
  to: string;
}
export const eventStatusLabels: Record<EventStatus, string> = {
  published: "Publicado",
  draft: "Borrador",
  unpublished: "No publicado",
};
export const saleStatusLabels: Record<SaleStatus, string> = {
  confirmed: "Confirmada",
  failed: "Pago rechazado",
  expired: "Expirada",
};
export const paymentLabels = {
  online: "Pago en línea",
  cash: "Efectivo",
  terminal: "Terminal",
};
export const ADMIN_CURRENCY = "MXN" as const;
export const ADMIN_TIME_ZONE = "America/Mexico_City";
export function money(amountMinor: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: ADMIN_CURRENCY,
    maximumFractionDigits: amountMinor % 100 === 0 ? 0 : 2,
  }).format(amountMinor / 100);
}
export function number(value: number) {
  return new Intl.NumberFormat("es-MX").format(value);
}
export function dateLabel(iso: string, withTime = false) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: ADMIN_TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(iso));
}
export function dayKey(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ADMIN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  return ["year", "month", "day"]
    .map((type) => parts.find((part) => part.type === type)?.value ?? "")
    .join("-");
}
export function matchesQuery(value: string, query: string) {
  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  return normalize(value).includes(normalize(query));
}
export function saleTotal(sale: AdminSale) {
  return sale.tickets.reduce((total, ticket) => total + ticket.priceMinor, 0);
}
export function eventInventory(
  event: AdminEvent,
  sales: readonly AdminSale[],
  holds: readonly InventoryHold[] = [],
  now = Date.now(),
) {
  const confirmed = sales.filter(
    (sale) => sale.eventId === event.id && sale.status === "confirmed",
  );
  const sold = confirmed.reduce((sum, sale) => sum + sale.tickets.length, 0);
  const capacity = eventSeats(event).filter((s) => s.enabled).length;
  const held = new Set(
    holds
      .filter((h) => h.eventId === event.id && h.expiresAt > now)
      .flatMap((h) => h.seatIds),
  ).size;
  const revenue = confirmed.reduce((sum, sale) => sum + saleTotal(sale), 0);
  return {
    sold,
    capacity,
    available: Math.max(0, capacity - sold - held),
    held,
    revenue,
    percentage: capacity ? Math.round((sold / capacity) * 100) : 0,
  };
}
export function zoneSold(
  eventId: string,
  zoneId: string,
  sales: readonly AdminSale[],
) {
  return sales
    .filter((sale) => sale.eventId === eventId && sale.status === "confirmed")
    .flatMap((sale) => sale.tickets)
    .filter((ticket) => ticket.zoneId === zoneId).length;
}
export function inRange(sale: AdminSale, range: DateRange) {
  const day = dayKey(sale.createdAt);
  return (!range.from || day >= range.from) && (!range.to || day <= range.to);
}
