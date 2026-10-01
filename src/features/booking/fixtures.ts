import type { DiscoveryEvent } from "../event-discovery/model";
import type { BookingSeat, Buyer } from "./model";
export const demoAccount: Buyer = {
  name: "Alex Hernández",
  email: "alex@example.com",
  phone: "5550001234",
};
export interface VenueSection {
  id: string;
  name: string;
  zone: string;
  amountMinor: number;
}
export interface DemoVenue {
  arrangement: "tables" | "rows";
  sections: readonly VenueSection[];
  seats: BookingSeat[];
}
// 500 is an illustrative scenario from RF-AFO-002, not a confirmed venue capacity.
export function createDemoVenue(event: DiscoveryEvent): DemoVenue {
  const arrangement = event.id === "encuentro-liderazgo" ? "rows" : "tables";
  const sections: VenueSection[] = ["A", "B", "C", "D", "E"].map(
    (id, index) => ({
      id,
      name: `Sección ${id}`,
      zone: index < 2 ? "Preferente" : "General",
      amountMinor: event.price.amountMinor + (index < 2 ? 25000 : 0),
    }),
  );
  const seats: BookingSeat[] = [];
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
