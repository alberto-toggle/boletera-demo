import type { EventCategory } from "@/domain/events/category";
import type { Venue, VenueSeat } from "../seating/model";
export const SELLER_LIMIT = 8;
export const SELLER_HOLD_MS = 600_000;
export const SELLER_EXTENSION_MS = 300_000;
export interface SellerEvent {
  id: string;
  title: string;
  startsAt: string;
  venue: string;
  image: string;
  category: EventCategory;
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
  noEmail?: boolean;
  verifiedEmail?: string;
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
  | "pending"
  | "partial"
  | "terminal"
  | "review"
  | "confirmed"
  | "expired"
  | "cancelled";
export interface PaymentDraft {
  method: "cash" | "terminal";
  amount: string;
  received: string;
  reference: string;
}
export interface Sale {
  customerDraft?: Customer;
  paymentDraft?: PaymentDraft;
  id: string;
  eventId: string;
  sellerId: string;
  createdAt: number;
  expiresAt: number;
  holdExtended?: boolean;
  seats: VenueSeat[];
  customer: Customer | null;
  status: SaleStatus;
  payments: SalePayment[];
  pendingTerminal: { amountMinor: number } | null;
}
export type SalePayment = {
  id: string;
  amountMinor: number;
  recordedAt: number;
} & (
  | { method: "cash"; receivedMinor: number }
  | { method: "terminal"; reference: string }
);
export const paid = (sale: Pick<Sale, "payments">) =>
  sale.payments.reduce((sum, p) => sum + p.amountMinor, 0);
export const balance = (sale: Sale) => total(sale) - paid(sale);
export const isCustomerEmailOptional = (customer: Customer) =>
  customer.delivery === "print" &&
  !customer.accountEmail &&
  !customer.accountRequested;
export const needsEmailVerification = (customer: Customer) =>
  !!customer.email.trim() && customer.verifiedEmail !== customer.email.trim();
export interface SellerState {
  signedIn: boolean;
  sales: Sale[];
}
export const statusLabels: Record<SaleStatus, string> = {
  pending: "Apartado activo",
  partial: "Pago parcial",
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
  if (
    customer.noEmail &&
    (customer.accountEmail ||
      customer.accountRequested ||
      customer.email ||
      customer.delivery !== "print")
  )
    return "La compra sin correo solo permite boletos impresos como invitado.";
  if (!customer.email.trim() && !isCustomerEmailOptional(customer))
    return "Escribe el correo electrónico del comprador.";
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
          ["pending", "partial", "terminal", "review", "confirmed"].includes(
            s.status,
          ),
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
  | { type: "customer-draft"; customer: Customer }
  | { type: "payment-draft"; draft: PaymentDraft }
  | { type: "customer"; customer: Customer }
  | { type: "terminal"; amountMinor: number }
  | { type: "cash"; amountMinor: number; receivedMinor: number }
  | { type: "approve"; reference: string }
  | { type: "unpaid" }
  | { type: "review" }
  | { type: "cancel" }
  | { type: "extend" }
  | { type: "demo-shorten-hold" }
  | { type: "verify-email"; email: string };

/** No confirmed payment can be removed or automatically expired. */
export function transitionSale(
  sale: Sale,
  action: SaleAction,
  now: number,
): Sale | string {
  if (["confirmed", "expired", "cancelled"].includes(sale.status))
    return "Esta operación ya está cerrada.";
  if (sale.status === "pending" && sale.expiresAt <= now)
    return "El tiempo de apartado terminó.";
  const next: Sale = { ...sale };
  const canCollect = ["pending", "partial"].includes(sale.status);
  if (action.type === "customer-draft") {
    if (sale.status !== "pending" || paid(sale))
      return "No puedes editar al comprador después de un cobro.";
    next.customerDraft = action.customer;
    return next;
  }
  if (action.type === "payment-draft") {
    next.paymentDraft = action.draft;
    return next;
  }
  if (action.type === "customer") {
    if (sale.status !== "pending" || paid(sale))
      return "No puedes cambiar al comprador después de registrar un cobro.";
    const error = customerError(action.customer, sale.seats.length);
    if (error) return error;
    if (needsEmailVerification(action.customer))
      return "Verifica el correo del comprador antes de continuar al cobro.";
    delete next.customerDraft;
    next.customer = {
      ...action.customer,
      name: action.customer.name.trim(),
      email: action.customer.email.trim(),
      registration:
        action.customer.audience === "military"
          ? action.customer.registration.trim()
          : "",
    };
    return next;
  }
  if (action.type === "cash" || action.type === "terminal") {
    if (!canCollect || !sale.customer)
      return "Primero completa los datos del comprador y aclara el cobro pendiente.";
    if (needsEmailVerification(sale.customer))
      return "Verifica el correo del comprador antes de cobrar.";
    if (
      !Number.isSafeInteger(action.amountMinor) ||
      action.amountMinor <= 0 ||
      action.amountMinor > balance(sale)
    )
      return "El importe debe ser mayor que cero y no superar el saldo pendiente.";
  }
  function addPayment(payment: SalePayment) {
    delete next.paymentDraft;
    next.payments = [...sale.payments, payment];
    next.pendingTerminal = null;
    next.status = balance(next) === 0 ? "confirmed" : "partial";
  }
  switch (action.type) {
    case "verify-email":
      if (!sale.customer || sale.customer.email.trim() !== action.email)
        return "El correo no corresponde al comprador de esta operación.";
      next.customer = { ...sale.customer, verifiedEmail: action.email };
      break;
    case "demo-shorten-hold":
      if (sale.status !== "pending" || paid(sale))
        return "Solo puedes adelantar un apartado activo sin cobros.";
      next.expiresAt = Math.min(sale.expiresAt, now + 10_000);
      break;
    case "extend":
      if (sale.status !== "pending" || paid(sale))
        return "Solo puedes extender un apartado activo sin cobros.";
      if (sale.holdExtended)
        return "Ya utilizaste la extensión de este apartado.";
      next.expiresAt = sale.expiresAt + SELLER_EXTENSION_MS;
      next.holdExtended = true;
      break;
    case "cash":
      if (
        !Number.isSafeInteger(action.receivedMinor) ||
        action.receivedMinor < action.amountMinor
      )
        return "El efectivo recibido no cubre este importe.";
      addPayment({
        id: `${sale.id}-P${sale.payments.length + 1}`,
        method: "cash",
        amountMinor: action.amountMinor,
        receivedMinor: action.receivedMinor,
        recordedAt: now,
      });
      break;
    case "terminal":
      next.pendingTerminal = { amountMinor: action.amountMinor };
      next.status = "terminal";
      break;
    case "approve":
      if (
        !["terminal", "review"].includes(sale.status) ||
        !sale.pendingTerminal
      )
        return "No hay un cobro de terminal pendiente.";
      if (!action.reference.trim())
        return "Escribe la referencia del comprobante.";
      if (
        sale.payments.some(
          (p) =>
            p.method === "terminal" &&
            p.reference.toLowerCase() === action.reference.trim().toLowerCase(),
        )
      )
        return "Esa referencia ya está registrada en esta venta. Revisa el comprobante.";
      addPayment({
        id: `${sale.id}-P${sale.payments.length + 1}`,
        method: "terminal",
        amountMinor: sale.pendingTerminal.amountMinor,
        reference: action.reference.trim(),
        recordedAt: now,
      });
      break;
    case "unpaid":
      if (!["terminal", "review"].includes(sale.status))
        return "No hay un cobro de terminal por aclarar.";
      next.pendingTerminal = null;
      next.status = paid(sale) ? "partial" : "pending";
      delete next.paymentDraft;
      if (next.status === "pending" && next.expiresAt <= now)
        next.status = "expired";
      break;
    case "review":
      if (sale.status !== "terminal") return "No hay cobro en curso.";
      next.status = "review";
      break;
    case "cancel":
      if (sale.status !== "pending" || paid(sale))
        return "No puedes cancelar una operación con cobros registrados o por aclarar.";
      next.status = "cancelled";
      break;
  }
  return next;
}
