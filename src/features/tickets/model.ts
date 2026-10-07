export type DemoDirection =
  "institucional" | "gala" | "editorial" | "inmersiva";
export interface DiscoveryEvent {
  title: string;
  category: string;
  city: string;
  startsAt: string;
  venue: string;
}
export interface DemoTicket {
  id: string;
  seatId: string;
  seatLabel: string;
  status: "valid";
}
export interface DemoOrder {
  id: string;
  buyer: { name: string };
  tickets: DemoTicket[];
}
export const formatEventDate = (value: string) =>
  new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
export const formatEventTime = (value: string) =>
  new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
