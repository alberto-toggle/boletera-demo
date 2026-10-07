export interface VenueSeat {
  id: string;
  label: string;
  group: string;
  zone: string;
  sectionId: string;
  number: number;
  amountMinor: number;
  occupied: boolean;
}

export interface VenueSection {
  id: string;
  name: string;
  zone: string;
  amountMinor: number;
}
export interface Venue {
  arrangement: "tables" | "rows";
  sections: readonly VenueSection[];
  seats: VenueSeat[];
}
export function formatPrice(price: { amountMinor: number; currency: "MXN" }) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amountMinor / 100);
}
