import { adminDemoSellers } from "./sellers";
import { findVenue } from "@/domain/venues/catalog";
// The public catalog is adapted here only. Admin components have no public-app dependencies.
import { demoEvents } from "@/features/event-discovery/fixtures";
import type { AdminData, AdminEvent, AdminSale, VenueLayout } from "../model";
export const DEMO_TODAY = "2026-10-07";
export const initialRange = { from: "2026-09-08", to: DEMO_TODAY };
export function zonesForLayout(layout: VenueLayout, priceMinor = 125000) {
  return (
    layout === "banquet"
      ? [
          "A · Preferente",
          "B · Preferente",
          "C · General",
          "D · General",
          "E · General",
        ]
      : [
          "A · Preferente",
          "B · Preferente",
          "C · General",
          "D · General",
          "E · General",
        ]
  ).map((name, index) => ({
    id: String.fromCharCode(65 + index),
    name,
    capacity: 100,
    priceMinor: index < 2 ? priceMinor + 25000 : priceMinor,
  }));
}
const names = [
  "Alex Hernández",
  "Sofía Martínez",
  "Carlos Mendoza",
  "Mariana Torres",
  "Diego Ramírez",
  "Valeria Ruiz",
  "Jorge Castillo",
  "Lucía Sánchez",
];
export function createAdminFixtures(): AdminData {
  const events: AdminEvent[] = demoEvents.map((event, index) => ({
    id: event.id,
    title: event.title,
    category: event.category,
    startsAt: event.startsAt,
    venue: event.venue,
    image: event.image,
    description: event.description,
    includes: [...event.includes],
    status: index === 7 ? "draft" : index === 8 ? "unpublished" : "published",
    layout: findVenue(event.venue)?.layout ?? "banquet",
    zones: zonesForLayout(
      findVenue(event.venue)?.layout ?? "banquet",
      event.price.amountMinor,
    ),
    updatedAt: "2026-10-07T10:00:00-06:00",
  }));
  const sales: AdminSale[] = [];
  const seatCounters = new Map<string, number>();
  // Keep the original 30-day examples; add historical sales for annual activity.
  for (let i = 0; i < 756; i++) {
    const event = events[i % 7];
    if (!event) continue;
    const zone = event.zones[i % event.zones.length];
    if (!zone) continue;
    const count = (i % 4) + 1;
    const status =
      i % 17 === 0 ? "failed" : i % 23 === 0 ? "expired" : "confirmed";
    const channel = (i + Math.floor(i / 7)) % 3 === 0 ? "box-office" : "web";
    const soldKey = `${event.id}:${zone.id}`;
    const previous = seatCounters.get(soldKey) ?? 0;
    if (status === "confirmed") seatCounters.set(soldKey, previous + count);
    const day = new Date(
      i < 156
        ? Date.UTC(2026, 8, 8 + (i % 30), 17 + (i % 5))
        : Date.UTC(
            2025,
            9,
            8 + (((i - 156) * 73 + Math.floor((i - 156) / 7) * 19) % 335),
            17 + (i % 5),
          ),
    ).toISOString();
    const tickets = Array.from({ length: count }, (_, n) => ({
      id: `ADM-${i + 1001}-${n + 1}`,
      zoneId: zone.id,
      seat:
        event.layout === "banquet"
          ? `Mesa ${Math.floor((previous + n) / 10) + 1} · Lugar ${((previous + n) % 10) + 1}`
          : `Fila ${`${zone.id}${Math.floor((previous + n) / 10) + 1}`} · Asiento ${((previous + n) % 10) + 1}`,
      priceMinor: zone.priceMinor,
      used: false,
    }));
    const total = count * zone.priceMinor;
    const payments: AdminSale["payments"] =
      status !== "confirmed"
        ? []
        : channel === "web"
          ? [
              {
                method: "online",
                amountMinor: total,
                reference: `WEB-${8000 + i}`,
              },
            ]
          : i % 9 === 0
            ? [
                {
                  method: "cash",
                  amountMinor: Math.floor(total / 2),
                  reference: `CAJA-${i + 1}`,
                },
                {
                  method: "terminal",
                  amountMinor: total - Math.floor(total / 2),
                  reference: `POS-${8000 + i}`,
                },
              ]
            : [
                {
                  method: i % 2 === 0 ? "cash" : "terminal",
                  amountMinor: total,
                  reference: `TX-${8000 + i}`,
                },
              ];
    sales.push({
      id: `BOL-${String(i + 1001).padStart(5, "0")}`,
      eventId: event.id,
      createdAt: day,
      buyer: {
        name: names[i % names.length] ?? "Alex Hernández",
        email: `comprador${i + 1}@example.com`,
        kind: i % 3 === 0 ? "military" : "general",
      },
      militaryCount: i % 3 === 0 ? 1 : 0,
      channel,
      sellerId:
        channel === "box-office"
          ? adminDemoSellers[Math.floor(i / 3) % adminDemoSellers.length]?.value
          : undefined,
      status,
      tickets,
      payments,
    });
  }
  return {
    events,
    sales: sales.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}
