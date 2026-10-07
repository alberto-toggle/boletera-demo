import { findVenue } from "@/domain/venues/catalog";
import type { Venue, VenueSection, VenueSeat } from "../model";
// 500 is an illustrative scenario from RF-AFO-002, not a confirmed venue capacity.
export function createDemoVenue(event: {
  venue: string;
  price: { amountMinor: number };
}): Venue {
  const definition = findVenue(event.venue);
  if (!definition) throw new Error(`Recinto desconocido: ${event.venue}`);
  const arrangement = definition.arrangement;
  const sections: VenueSection[] = ["A", "B", "C", "D", "E"].map(
    (id, index) => ({
      id,
      name: `Sección ${id}`,
      zone: index < 2 ? "Preferente" : "General",
      amountMinor: event.price.amountMinor + (index < 2 ? 25000 : 0),
    }),
  );
  const seats: VenueSeat[] = [];
  for (let groupIndex = 0; groupIndex < 50; groupIndex++) {
    const section = sections[Math.floor(groupIndex / 10)];
    const group =
      arrangement === "tables"
        ? `M${groupIndex + 1}`
        : `${section.id}${(groupIndex % 10) + 1}`;
    for (let number = 1; number <= 10; number++) {
      seats.push({
        id: `${group}-${number}`,
        group,
        number,
        sectionId: section.id,
        zone: section.zone,
        amountMinor: section.amountMinor,
        label: `${section.name} · ${arrangement === "tables" ? "Mesa" : "Fila"} ${arrangement === "tables" ? groupIndex + 1 : group} · Lugar ${number}`,
        occupied:
          (groupIndex === 0 && number <= 2) ||
          (groupIndex > 0 && (groupIndex * 17 + number * 7) % 11 < 2),
      });
    }
  }
  return { arrangement, sections, seats };
}
