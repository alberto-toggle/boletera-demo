export interface AccessEvent {
  id: string;
  title: string;
  venue: string;
  startsAt: string;
  image: string;
}
export interface AccessTicket {
  id: string;
  eventId: string;
  orderId: string;
  buyer: string;
  email: string;
  seat: string;
  zone: string;
  usedAt?: string;
}
export interface AccessRecord {
  ticketId: string;
  eventId: string;
  usedAt: string;
  operator: string;
}
export type AccessResult =
  | { kind: "ready"; ticket: AccessTicket }
  | { kind: "used"; ticket: AccessTicket; usedAt: string }
  | { kind: "wrong-event"; ticket: AccessTicket }
  | { kind: "not-found" };
export function checkTicket(
  tickets: readonly AccessTicket[],
  eventId: string,
  code: string,
): AccessResult {
  const ticket = tickets.find(
    (t) => t.id.toLowerCase() === code.trim().toLowerCase(),
  );
  if (!ticket) return { kind: "not-found" };
  if (ticket.eventId !== eventId) return { kind: "wrong-event", ticket };
  if (ticket.usedAt) return { kind: "used", ticket, usedAt: ticket.usedAt };
  return { kind: "ready", ticket };
}
export function searchTickets(
  tickets: readonly AccessTicket[],
  eventId: string,
  query: string,
) {
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const value = normalize(query.trim());
  return tickets.filter(
    (t) =>
      t.eventId === eventId &&
      (!value ||
        normalize(`${t.id} ${t.orderId} ${t.buyer} ${t.email}`).includes(
          value,
        )),
  );
}
export const accessTime = (value: string) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Mexico_City",
  }).format(new Date(value));
