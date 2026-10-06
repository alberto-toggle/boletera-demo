import type { SavedPaymentMethod } from "./payment-methods";
import type { Buyer, DemoOrder, DemoTicket } from "../booking/model";
import type { DiscoveryEvent } from "../event-discovery/model";

export interface AccountTicket extends Omit<DemoTicket, "status"> {
  status: "valid" | "used";
  ownerEmail: string;
  accessId: string;
}
export interface AccountOrder extends Omit<DemoOrder, "tickets"> {
  event: DiscoveryEvent;
  purchasedAt: string;
  tickets: AccountTicket[];
}
export interface TicketTransfer {
  id: string;
  orderId: string;
  ticketIds: string[];
  from: string;
  to: string;
  recipientName: string;
  status: "pending" | "accepted" | "cancelled";
  createdAt: string;
}
export interface AccountState {
  version: 1;
  paymentMethods?: SavedPaymentMethod[];
  session: string | null;
  users: Buyer[];
  orders: AccountOrder[];
  transfers: TicketTransfer[];
}
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export function pendingTransfer(state: AccountState, ticketId: string) {
  return state.transfers.find(
    (t) => t.status === "pending" && t.ticketIds.includes(ticketId),
  );
}
export function canTransfer(
  state: AccountState,
  order: AccountOrder,
  ticket: AccountTicket,
  now: number,
) {
  return (
    ticket.ownerEmail === state.session &&
    ticket.status === "valid" &&
    Date.parse(order.event.startsAt) > now &&
    !pendingTransfer(state, ticket.id)
  );
}
export function requestTransfer(
  state: AccountState,
  transfer: TicketTransfer,
  now: number,
): AccountState {
  const order = state.orders.find((o) => o.id === transfer.orderId);
  const to = normalizeEmail(transfer.to);
  if (
    !state.session ||
    transfer.from !== state.session ||
    !order ||
    transfer.status !== "pending" ||
    !transfer.ticketIds.length ||
    new Set(transfer.ticketIds).size !== transfer.ticketIds.length ||
    state.transfers.some((t) => t.id === transfer.id) ||
    transfer.ticketIds.some(
      (id) =>
        !order.tickets.some(
          (t) => t.id === id && canTransfer(state, order, t, now),
        ),
    )
  )
    throw new Error("Estos boletos ya no están disponibles para transferir.");
  if (
    to === state.session ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) ||
    transfer.recipientName.trim().length < 3
  )
    throw new Error("Escribe el nombre y un correo válido de otra persona.");
  return { ...state, transfers: [...state.transfers, { ...transfer, to }] };
}
export function resolveTransfer(
  state: AccountState,
  id: string,
  action: "accept" | "cancel",
  now: number,
  newCode: (id: string) => string,
): AccountState {
  const transfer = state.transfers.find((t) => t.id === id);
  if (!transfer || transfer.status !== "pending")
    throw new Error("La transferencia ya no está pendiente.");
  if (state.session !== (action === "accept" ? transfer.to : transfer.from))
    throw new Error("Esta transferencia pertenece a otra cuenta.");
  const order = state.orders.find((o) => o.id === transfer.orderId);
  if (!order) throw new Error("No se encontró la compra.");
  if (
    action === "accept" &&
    (Date.parse(order.event.startsAt) <= now ||
      transfer.ticketIds.some(
        (id) =>
          !order.tickets.some(
            (t) =>
              t.id === id &&
              t.ownerEmail === transfer.from &&
              t.status === "valid",
          ),
      ))
  )
    throw new Error("Estos boletos ya no se pueden recibir.");
  const tickets = order.tickets.map((t) => {
    if (action !== "accept" || !transfer.ticketIds.includes(t.id)) return t;
    const accessId = newCode(t.id);
    if (
      !accessId ||
      accessId === t.accessId ||
      state.orders.some((o) => o.tickets.some((x) => x.accessId === accessId))
    )
      throw new Error("No se pudo renovar el código de acceso.");
    return { ...t, ownerEmail: transfer.to, accessId };
  });
  if (new Set(tickets.map((t) => t.accessId)).size !== tickets.length)
    throw new Error("Los códigos deben ser únicos.");
  return {
    ...state,
    orders: state.orders.map((o) =>
      o.id === order.id ? { ...o, tickets } : o,
    ),
    transfers: state.transfers.map((t) =>
      t.id === id
        ? { ...t, status: action === "accept" ? "accepted" : "cancelled" }
        : t,
    ),
  };
}
// The same ownership check can be used by a future access service. Old PDFs keep
// the old code, which is no longer present after acceptance.
export function isCurrentAccess(
  state: AccountState,
  code: string,
  eventId: string,
) {
  return state.orders.some(
    (o) =>
      o.eventId === eventId &&
      o.tickets.some((t) => t.accessId === code && t.status === "valid"),
  );
}
export function recordPurchase(
  state: AccountState,
  order: DemoOrder,
  event: DiscoveryEvent,
  now: number,
): AccountState {
  if (order.mode === "guest" || state.orders.some((o) => o.id === order.id))
    return state;
  const email = normalizeEmail(order.buyer.email);
  const buyer = { ...order.buyer, email };
  return {
    ...state,
    session: email,
    users: state.users.some((u) => u.email === email)
      ? state.users
      : [...state.users, buyer],
    orders: [
      ...state.orders,
      {
        ...order,
        buyer,
        event,
        purchasedAt: new Date(now).toISOString(),
        tickets: order.tickets.map((t) => ({
          ...t,
          ownerEmail: email,
          accessId: t.id,
        })),
      },
    ],
  };
}
