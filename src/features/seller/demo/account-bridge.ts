"use client";
// Explicit demo integration boundary. Does not sign in as the buyer or share inventory.
import { useAccount, updateAccount } from "@/features/account/store";
import { demoEvents } from "@/features/event-discovery/fixtures";
import type { BuyerAccountOption, Sale } from "../model";
import { total } from "../model";
export function useBuyerAccounts(): BuyerAccountOption[] {
  const { state } = useAccount();
  return state.users.map((u) => ({
    email: u.email,
    name: u.name,
    audience: u.audience,
    registration: u.registrationNumber,
  }));
}
export function publishSaleToAccount(sale: Sale): string | null {
  if (sale.status !== "confirmed" || !sale.customer?.accountEmail) return null;
  const customer = sale.customer;
  const event = demoEvents.find((e) => e.id === sale.eventId);
  if (!event) return "No se encontró el evento para vincular los boletos.";
  let error: string | null = null;
  updateAccount((state) => {
    const user = state.users.find((u) => u.email === customer.accountEmail);
    if (!user) {
      error =
        "La cuenta seleccionada ya no está disponible. Vuelve a seleccionar al comprador.";
      return state;
    }
    if (state.orders.some((o) => o.id === sale.id)) return state;
    return {
      ...state,
      orders: [
        ...state.orders,
        {
          id: sale.id,
          eventId: event.id,
          event,
          purchasedAt: new Date(
            sale.payments.at(-1)?.recordedAt ?? sale.createdAt,
          ).toISOString(),
          mode: "account",
          amountMinor: total(sale),
          buyer: {
            ...user,
            name: customer.name,
            email: user.email,
            audience: customer.audience,
            registrationNumber:
              customer.audience === "military" ? customer.registration : "",
            militaryAttendees: customer.militaryCount,
          },
          tickets: sale.seats.map((seat, index) => ({
            id: `${sale.id}-${index + 1}`,
            accessId: `${sale.id}-${index + 1}`,
            seatId: seat.id,
            seatLabel: seat.label,
            status: "valid",
            ownerEmail: user.email,
          })),
        },
      ],
    };
  });
  return error;
}
