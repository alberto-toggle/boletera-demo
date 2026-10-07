/** Recintos de la demo. La categoría del evento no determina su distribución. */
export const venueCatalog = [
  {
    id: "gran-salon",
    name: "Gran Salón Boletera",
    layout: "banquet",
    arrangement: "tables",
    description:
      "Mesas y lugares asignados · 5 secciones · Pista de baile central",
  },
  {
    id: "auditorio",
    name: "Auditorio Boletera",
    layout: "auditorium",
    arrangement: "rows",
    description: "Butacas y filas numeradas · 5 secciones",
  },
] as const;
export type VenueLayout = (typeof venueCatalog)[number]["layout"];
export function findVenue(name: string) {
  return venueCatalog.find((venue) => venue.name === name);
}
export function venueForLayout(layout: VenueLayout) {
  return layout === "banquet" ? venueCatalog[0] : venueCatalog[1];
}
