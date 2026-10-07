"use client";
import { useSyncExternalStore } from "react";
import {
  availableVenue,
  customerError,
  expireSales,
  SELLER_HOLD_MS,
  SELLER_LIMIT,
  transitionSale,
  type Customer,
  type SaleAction,
  type Sale,
  type SellerState,
} from "../model";
import { publishSaleToAccount } from "./account-bridge";
import { seller, venues } from "./fixtures";
const empty: SellerState = { signedIn: false, sales: [] };
let state = empty;
const listeners = new Set<() => void>();
let loaded = false;
const key = "boletera-seller-demo-v1";
// Session-scoped on purpose: no synchronization with public checkout or other tabs.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function validSale(value: unknown): value is Sale {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.eventId !== "string" ||
    !venues[value.eventId] ||
    value.sellerId !== seller.id ||
    typeof value.createdAt !== "number" ||
    !Number.isFinite(value.createdAt) ||
    typeof value.expiresAt !== "number" ||
    !Number.isFinite(value.expiresAt) ||
    !Array.isArray(value.seats) ||
    value.seats.length < 1 ||
    value.seats.length > SELLER_LIMIT ||
    typeof value.status !== "string" ||
    ![
      "pending",
      "terminal",
      "review",
      "confirmed",
      "expired",
      "cancelled",
    ].includes(value.status)
  )
    return false;
  const seats = value.seats;
  if (
    !seats.every(
      (s) =>
        isRecord(s) &&
        venues[value.eventId as string].seats.some(
          (v) =>
            v.id === s.id &&
            v.amountMinor === s.amountMinor &&
            v.label === s.label &&
            v.group === s.group &&
            v.zone === s.zone &&
            v.sectionId === s.sectionId &&
            v.number === s.number &&
            v.occupied === s.occupied,
        ),
    )
  )
    return false;
  if (new Set(seats.map((s) => s.id)).size !== seats.length) return false;
  const c = value.customer;
  if (
    c !== null &&
    (!isRecord(c) ||
      !["name", "email", "registration"].every(
        (k) => typeof c[k] === "string",
      ) ||
      !["print", "email", "both"].includes(String(c.delivery)) ||
      !["public", "military"].includes(String(c.audience)) ||
      typeof c.militaryCount !== "number" ||
      (c.accountEmail !== undefined && typeof c.accountEmail !== "string") ||
      (c.accountRequested !== undefined &&
        typeof c.accountRequested !== "boolean") ||
      customerError(c as unknown as Customer, seats.length))
  )
    return false;
  const p = value.payment;
  if (
    p !== null &&
    (!isRecord(p) ||
      (p.method === "cash"
        ? typeof p.receivedMinor !== "number" ||
          !Number.isSafeInteger(p.receivedMinor) ||
          p.receivedMinor < seats.reduce((n, s) => n + s.amountMinor, 0)
        : p.method !== "terminal" ||
          typeof p.reference !== "string" ||
          !p.reference.trim()))
  )
    return false;
  if (["terminal", "review", "confirmed"].includes(value.status) && !c)
    return false;
  if (value.status === "confirmed" && !p) return false;
  if (value.status !== "confirmed" && p !== null) return false;
  return true;
}
function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw: unknown = JSON.parse(sessionStorage.getItem(key) || "null");
    if (
      isRecord(raw) &&
      typeof raw.signedIn === "boolean" &&
      Array.isArray(raw.sales) &&
      raw.sales.every(validSale)
    )
      state = {
        signedIn: raw.signedIn,
        sales: expireSales(
          raw.sales.map((s) =>
            s.status === "terminal" ? { ...s, status: "review" } : s,
          ),
          Date.now(),
        ),
      };
  } catch {
    /* Empty isolated demo if storage is unavailable or corrupt. */
  }
}
function emit(next: SellerState) {
  state = next;
  try {
    sessionStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* In-memory fallback. */
  }
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  listener();
  return () => {
    listeners.delete(listener);
  };
}
export function useSeller() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => empty,
  );
}
export function signIn() {
  emit({ ...state, signedIn: true });
}
export function signOut() {
  emit({
    signedIn: false,
    sales: state.sales.map((s) =>
      s.status === "terminal" ? { ...s, status: "review" } : s,
    ),
  });
}
export function tick() {
  const sales = expireSales(state.sales, Date.now());
  if (sales.some((s, i) => s !== state.sales[i])) emit({ ...state, sales });
}
export function reserve(eventId: string, ids: string[]): string | null {
  tick();
  const base = venues[eventId];
  if (!base || !state.signedIn || ids.length < 1 || ids.length > SELLER_LIMIT)
    return null;
  const venue = availableVenue(base, state.sales, eventId);
  const seats = venue.seats.filter((s) => ids.includes(s.id) && !s.occupied);
  if (seats.length !== ids.length) return null;
  const now = Date.now();
  const id = `VT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  emit({
    ...state,
    sales: [
      {
        id,
        eventId,
        sellerId: seller.id,
        createdAt: now,
        expiresAt: now + SELLER_HOLD_MS,
        seats,
        customer: null,
        status: "pending",
        payment: null,
      },
      ...state.sales,
    ],
  });
  return id;
}

export function act(id: string, action: SaleAction): string | null {
  tick();
  const sale = state.sales.find((s) => s.id === id);
  if (!state.signedIn || !sale) return "No se encontró la operación.";
  const next = transitionSale(sale, action, Date.now());
  if (typeof next === "string") return next;
  if (next.status === "confirmed") {
    const error = publishSaleToAccount(next);
    if (error) return error;
  }
  emit({ ...state, sales: state.sales.map((s) => (s.id === id ? next : s)) });
  return null;
}

export function interruptTerminal(id: string) {
  const sale = state.sales.find((s) => s.id === id);
  if (sale?.status === "terminal")
    emit({
      ...state,
      sales: state.sales.map((s) =>
        s.id === id ? { ...s, status: "review" } : s,
      ),
    });
}
