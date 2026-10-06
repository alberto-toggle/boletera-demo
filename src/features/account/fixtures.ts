import { demoAccount, createDemoVenue } from "../booking/fixtures";
import { demoEvents, featuredEvent } from "../event-discovery/fixtures";
import type { DiscoveryEvent } from "../event-discovery/model";
import type { AccountOrder, AccountState } from "./model";

export const companion = {
  ...demoAccount,
  name: "Sofía Martínez",
  email: "sofia@example.com",
  verifiedContact: "sofia@example.com",
  phone: "5550005678",
};
function exampleOrder(
  event: DiscoveryEvent,
  id: string,
  count: number,
  used = false,
): AccountOrder {
  const seats = createDemoVenue(event)
    .seats.filter((s) => !s.occupied)
    .slice(0, count);
  return {
    id,
    eventId: event.id,
    event,
    buyer: demoAccount,
    mode: "account",
    purchasedAt: used
      ? "2025-08-10T12:00:00-06:00"
      : "2026-09-20T12:00:00-06:00",
    amountMinor: seats.reduce((sum, s) => sum + s.amountMinor, 0),
    tickets: seats.map((s, i) => ({
      id: `${id}-${i + 1}`,
      accessId: `${id}-${i + 1}`,
      seatId: s.id,
      seatLabel: s.label,
      ownerEmail: demoAccount.email,
      status: used && i === 0 ? "used" : "valid",
    })),
  };
}
export function initialAccountState(): AccountState {
  const ceremony =
    demoEvents.find((e) => e.id === "dia-ejercito") ?? demoEvents[0];
  return {
    version: 1,
    session: null,
    users: [demoAccount, companion],
    transfers: [],
    orders: [
      exampleOrder(featuredEvent, "DEMO-CUENTA-001", 4),
      exampleOrder(ceremony, "DEMO-CUENTA-002", 2),
      exampleOrder(
        {
          ...featuredEvent,
          id: "noche-independencia-2025",
          startsAt: "2025-09-15T19:00:00-06:00",
        },
        "DEMO-CUENTA-003",
        2,
        true,
      ),
    ],
  };
}
