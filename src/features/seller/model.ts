import type { Venue, VenueSeat } from "../seating/model";
export const SELLER_LIMIT = 8;
export const SELLER_HOLD_MS = 300_000;
export interface SellerEvent {
  id: string;
  title: string;
  startsAt: string;
  venue: string;
  image: string;
  category: string;
  priceMinor: number;
  city: string;
  imageAlt: string;
  imagePosition?: string;
  description: string;
  includes: readonly string[];
  information: {
    introduction: string;
    dressCode: string;
    arrival: string;
    accessibility: string;
    program: readonly {
      offsetMinutes: number;
      title: string;
      description: string;
    }[];
  };
}
export interface BuyerAccountOption {
  email: string;
  name: string;
  audience: "public" | "military";
  registration: string;
}
export interface Customer {
  accountEmail?: string;
  accountRequested?: boolean;
  name: string;
  email: string;
  delivery: "print" | "email" | "both";
  audience: "public" | "military";
  registration: string;
  militaryCount: number;
}
export type SaleStatus =
  "pending" | "terminal" | "review" | "confirmed" | "expired" | "cancelled";
export interface Sale {
  id: string;
  eventId: string;
  sellerId: string;
  createdAt: number;
  expiresAt: number;
  seats: VenueSeat[];
  customer: Customer | null;
  status: SaleStatus;
  payment:
    | { method: "cash"; receivedMinor: number }
    | { method: "terminal"; reference: string }
    | null;
}
export interface SellerState {
  signedIn: boolean;
  sales: Sale[];
}
export const statusLabels: Record<SaleStatus, string> = {
  pending: "Apartado activo",
  terminal: "Cobro en terminal",
  review: "Pendiente de revisión",
  confirmed: "Venta confirmada",
  expired: "Apartado vencido",
  cancelled: "Cancelada",
};
export const money = (minor: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    minor / 100,
  );
export const date = (iso: string) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(iso));
export const total = (sale: Pick<Sale, "seats">) =>
  sale.seats.reduce((sum, s) => sum + s.amountMinor, 0);
export function customerError(customer: Customer, count: number) {
  if (customer.accountRequested && !customer.accountEmail)
    return "Selecciona una cuenta o continúa como invitado.";
  if (customer.accountEmail && customer.accountEmail !== customer.email)
    return "El correo debe corresponder a la cuenta seleccionada.";
  if (!customer.name.trim()) return "Escribe el nombre del comprador.";
  if (
    customer.delivery !== "print" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
  )
    return "Escribe un correo válido para entregar los boletos.";
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    return "Revisa el correo electrónico.";
  if (customer.audience === "military" && !customer.registration.trim())
    return "Escribe la matrícula del comprador.";
  if (
    !Number.isInteger(customer.militaryCount) ||
    customer.militaryCount < 0 ||
    customer.militaryCount > count
  )
    return "Revisa la cantidad de asistentes militares.";
  return null;
}
export function availableVenue(
  venue: Venue,
  sales: Sale[],
  eventId: string,
): Venue {
  const reserved = new Set(
    sales
      .filter(
        (s) =>
          s.eventId === eventId &&
          ["pending", "terminal", "review", "confirmed"].includes(s.status),
      )
      .flatMap((s) => s.seats.map((x) => x.id)),
  );
  return {
    ...venue,
    seats: venue.seats.map((s) => ({
      ...s,
      occupied: s.occupied || reserved.has(s.id),
    })),
  };
}
export function expireSales(sales: Sale[], now: number) {
  return sales.map((s) =>
    s.status === "pending" && s.expiresAt <= now
      ? { ...s, status: "expired" as const }
      : s,
  );
}
export function parseCash(value: string): number {
  return /^\d+(\.\d{1,2})?$/.test(value) ? Math.round(Number(value) * 100) : 0;
}

export type SaleAction =
  | { type: "customer"; customer: Customer }
  | { type: "terminal"; customer: Customer }
  | { type: "cash"; customer: Customer; receivedMinor: number }
  | { type: "approve"; reference: string }
  | { type: "unpaid" }
  | { type: "review" }
  | { type: "cancel" };

/** Pure transitions; persistence and clock are provided by the caller. */
export function transitionSale(
  sale: Sale,
  action: SaleAction,
  now: number,
): Sale | string {
  const next: Sale = { ...sale };
  if ("customer" in action) {
    const error = customerError(action.customer, sale.seats.length);
    if (error) return error;
    if (sale.status !== "pending") return "El apartado ya no está activo.";
    next.customer = {
      ...action.customer,
      name: action.customer.name.trim(),
      email: action.customer.email.trim(),
      registration:
        action.customer.audience === "military"
          ? action.customer.registration.trim()
          : "",
    };
  }
  switch (action.type) {
    case "customer":
      break;
    case "terminal":
      next.status = "terminal";
      break;
    case "cash":
      if (
        !Number.isSafeInteger(action.receivedMinor) ||
        action.receivedMinor < total(sale)
      )
        return "El efectivo recibido no cubre el total.";
      next.status = "confirmed";
      next.payment = { method: "cash", receivedMinor: action.receivedMinor };
      break;
    case "approve":
      if (!["terminal", "review"].includes(sale.status))
        return "No hay un cobro de terminal pendiente.";
      if (!action.reference.trim())
        return "Escribe la referencia del comprobante.";
      next.status = "confirmed";
      next.payment = { method: "terminal", reference: action.reference.trim() };
      break;
    case "unpaid":
      if (!["terminal", "review"].includes(sale.status))
        return "La operación no está pendiente de aclaración.";
      next.status = "pending";
      next.expiresAt = now + SELLER_HOLD_MS;
      break;
    case "review":
      if (sale.status !== "terminal") return "No hay cobro en curso.";
      next.status = "review";
      break;
    case "cancel":
      if (sale.status !== "pending")
        return "Primero aclara si se realizó el cobro.";
      next.status = "cancelled";
      break;
  }
  return next;
}
