// Demo-only boundary: operations share a catalog, never presentation components.
import { createAdminFixtures } from "@/features/admin/demo/fixtures";
import type { AccessEvent, AccessTicket } from "../model";
export function accessCatalog(): {
  events: AccessEvent[];
  tickets: AccessTicket[];
} {
  const data = createAdminFixtures();
  return {
    events: data.events
      .filter((e) => e.status !== "draft")
      .map(({ id, title, venue, startsAt, image }) => ({
        id,
        title,
        venue,
        startsAt,
        image,
      })),
    tickets: data.sales
      .filter((s) => s.status === "confirmed")
      .flatMap((s) =>
        s.tickets.map((t) => ({
          id: t.id,
          eventId: s.eventId,
          orderId: s.id,
          buyer: s.buyer.name,
          email: s.buyer.email,
          seat: t.seat,
          zone: t.zoneId,
          usedAt: t.usedAt,
        })),
      ),
  };
}
