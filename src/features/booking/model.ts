import type { DiscoveryEvent } from "../event-discovery/model";

export interface BookingSeat {
  id: string;
  label: string;
  group: string;
  zone: string;
  sectionId: string;
  number: number;
  amountMinor: number;
  occupied: boolean;
}
export interface Buyer {
  name: string;
  email: string;
  phone: string;
  contactChannel: "email" | "phone";
  verifiedContact: string;
  audience: "public" | "military";
  registrationNumber: string;
  militaryAttendees: number;
}
export interface DemoTicket {
  id: string;
  seatId: string;
  seatLabel: string;
  status: "valid";
}
export interface DemoOrder {
  id: string;
  eventId: string;
  buyer: Buyer;
  mode: "guest" | "account" | "register";
  amountMinor: number;
  tickets: DemoTicket[];
}
export type BookingState =
  | { step: "selection"; selectedIds: string[]; notice: string | null }
  | { step: "checkout"; seatIds: string[]; expiresAt: number; orderId: string }
  | {
      step: "processing";
      seatIds: string[];
      expiresAt: number;
      orderId: string;
      payment: {
        buyer: Buyer;
        mode: "guest" | "account" | "register";
        outcome: "approved" | "declined";
      };
    }
  | { step: "failed" | "expired"; message: string }
  | { step: "confirmed"; order: DemoOrder };
export type BookingAction =
  | { type: "toggle"; seatId: string }
  | { type: "reserve"; now: number; orderId: string }
  | {
      type: "pay";
      now: number;
      buyer: Buyer;
      mode: "guest" | "account" | "register";
      outcome: "approved" | "declined";
    }
  | {
      type: "start-payment";
      now: number;
      buyer: Buyer;
      mode: "guest" | "account" | "register";
      outcome: "approved" | "declined";
    }
  | { type: "finish-payment"; now: number }
  | { type: "expire"; now: number }
  | { type: "back" }
  | { type: "reset" };
export const HOLD_MS = 5 * 60 * 1000;
export const MAX_SEATS = 8;
export const initialBookingState: BookingState = {
  step: "selection",
  selectedIds: [],
  notice: null,
};

export function validateContact(
  channel: "email" | "phone",
  value: string,
): boolean {
  return channel === "email"
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    : /^\+?[\d\s()-]{10,18}$/.test(value.trim()) &&
        value.replace(/\D/g, "").length >= 10;
}
export function validateBuyer(buyer: Buyer, count?: number): boolean {
  return (
    buyer.name.trim().length >= 3 &&
    validateContact(buyer.contactChannel, buyer[buyer.contactChannel]) &&
    buyer.verifiedContact === buyer[buyer.contactChannel].trim() &&
    (buyer.audience === "public" ||
      (buyer.audience === "military" &&
        buyer.registrationNumber.trim().length > 0)) &&
    Number.isInteger(buyer.militaryAttendees) &&
    buyer.militaryAttendees >= 0 &&
    (count === undefined || buyer.militaryAttendees <= count)
  );
}
export function totalForSeats(seats: readonly BookingSeat[]): number {
  return seats.reduce((sum, seat) => sum + seat.amountMinor, 0);
}
export function transitionBooking(
  state: BookingState,
  action: BookingAction,
  seats: readonly BookingSeat[],
  event: DiscoveryEvent,
): BookingState {
  if (action.type === "reset") return initialBookingState;
  if (action.type === "back" && state.step === "checkout")
    return {
      step: "selection",
      selectedIds: state.seatIds,
      notice: "Apartado liberado. Puedes cambiar tus lugares.",
    };
  if (action.type === "toggle" && state.step === "selection") {
    const seat = seats.find((item) => item.id === action.seatId);
    if (!seat || seat.occupied) return state;
    if (state.selectedIds.includes(seat.id))
      return {
        ...state,
        selectedIds: state.selectedIds.filter((id) => id !== seat.id),
        notice: null,
      };
    if (state.selectedIds.length >= MAX_SEATS)
      return {
        ...state,
        notice: `Puedes elegir hasta ${MAX_SEATS} lugares por compra en esta demo.`,
      };
    return {
      ...state,
      selectedIds: [...state.selectedIds, seat.id],
      notice: null,
    };
  }
  if (action.type === "reserve" && state.step === "selection") {
    if (
      !state.selectedIds.length ||
      !state.selectedIds.every((id) =>
        seats.some((seat) => seat.id === id && !seat.occupied),
      )
    )
      return state;
    return {
      step: "checkout",
      seatIds: state.selectedIds,
      expiresAt: action.now + HOLD_MS,
      orderId: action.orderId,
    };
  }
  if (state.step === "processing") {
    if (action.type === "expire" && action.now >= state.expiresAt)
      return {
        step: "expired",
        message:
          "Tu apartado expiró durante la simulación. No hubo cargos ni boletos emitidos.",
      };
    if (action.type !== "finish-payment") return state;
    return transitionBooking(
      {
        step: "checkout",
        seatIds: state.seatIds,
        expiresAt: state.expiresAt,
        orderId: state.orderId,
      },
      { type: "pay", now: action.now, ...state.payment },
      seats,
      event,
    );
  }
  if (state.step !== "checkout") return state;
  if (
    (action.type === "expire" ||
      action.type === "pay" ||
      action.type === "start-payment") &&
    action.now >= state.expiresAt
  )
    return {
      step: "expired",
      message:
        "Tu apartado expiró. Los lugares fueron liberados; vuelve al mapa para elegirlos.",
    };
  if (action.type === "start-payment") {
    if (!validateBuyer(action.buyer, state.seatIds.length)) return state;
    return {
      ...state,
      step: "processing",
      payment: {
        buyer: action.buyer,
        mode: action.mode,
        outcome: action.outcome,
      },
    };
  }
  if (
    action.type !== "pay" ||
    !validateBuyer(action.buyer, state.seatIds.length)
  )
    return state;
  if (action.outcome === "declined")
    return {
      step: "failed",
      message:
        "El pago de prueba fue rechazado. No hubo cargos ni boletos emitidos; los lugares fueron liberados.",
    };
  const selected = seats.filter((seat) => state.seatIds.includes(seat.id));
  if (
    selected.length !== state.seatIds.length ||
    selected.some((seat) => seat.occupied)
  )
    return {
      step: "failed",
      message:
        "Algún lugar ya no está disponible. No se confirmó la compra; elige nuevamente.",
    };
  return {
    step: "confirmed",
    order: {
      id: state.orderId,
      eventId: event.id,
      buyer: action.buyer,
      mode: action.mode,
      amountMinor: totalForSeats(selected),
      tickets: selected.map((seat, index) => ({
        id: `${state.orderId}-${String(index + 1).padStart(2, "0")}`,
        seatId: seat.id,
        seatLabel: seat.label,
        status: "valid",
      })),
    },
  };
}
