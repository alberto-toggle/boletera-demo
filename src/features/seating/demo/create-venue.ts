import { banquetTables } from "@/domain/venues/banquet";
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
  if (arrangement === "tables") {
    const amountMinor = event.price.amountMinor;
    return {
      arrangement,
      sections: [
        { id: "salon", name: "Salón", zone: "Precio único", amountMinor },
      ],
      seats: banquetTables.flatMap((table, index) =>
        Array.from({ length: 10 }, (_, i) => ({
          id: `M${table.label}-${i + 1}`,
          group: `M${table.label}`,
          number: i + 1,
          sectionId: "salon",
          zone: "Precio único",
          amountMinor,
          label: `Mesa ${table.label} · Lugar ${i + 1}`,
          occupied: index % 9 === 3 && i < 3,
        })),
      ),
    };
  }
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
    const group = `${section.id}${(groupIndex % 10) + 1}`;
    for (let number = 1; number <= 10; number++) {
      seats.push({
        id: `${group}-${number}`,
        group,
        number,
        sectionId: section.id,
        zone: section.zone,
        amountMinor: section.amountMinor,
        label: `${section.name} · Fila ${group} · Lugar ${number}`,
        occupied:
          (groupIndex === 0 && number <= 2) ||
          (groupIndex > 0 && (groupIndex * 17 + number * 7) % 11 < 2),
      });
    }
  }
  return { arrangement, sections, seats };
}
