import { isEventCategory } from "@/domain/events/category";
import type { AccountState } from "./model";
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string";
const date = (v: unknown) => text(v) && Number.isFinite(Date.parse(v));
const strings = (v: unknown) => Array.isArray(v) && v.every(text);
const buyer = (v: unknown) =>
  object(v) &&
  [v.name, v.email, v.phone, v.verifiedContact, v.registrationNumber].every(
    text,
  ) &&
  (v.contactChannel === "email" || v.contactChannel === "phone") &&
  (v.audience === "public" || v.audience === "military") &&
  Number.isInteger(v.militaryAttendees);
const event = (v: unknown) =>
  object(v) &&
  [v.id, v.title, v.venue, v.city, v.image, v.imageAlt, v.description].every(
    text,
  ) &&
  isEventCategory(v.category) &&
  date(v.startsAt) &&
  strings(v.includes) &&
  object(v.price) &&
  v.price.currency === "MXN" &&
  Number.isInteger(v.price.amountMinor);
export function isAccountState(v: unknown): v is AccountState {
  return (
    object(v) &&
    v.version === 1 &&
    (v.paymentMethods === undefined ||
      (Array.isArray(v.paymentMethods) &&
        v.paymentMethods.every(
          (c) =>
            object(c) &&
            text(c.id) &&
            text(c.ownerEmail) &&
            ["Visa", "Mastercard"].includes(String(c.brand)) &&
            text(c.last4) &&
            /^\d{4}$/.test(c.last4) &&
            text(c.expiry) &&
            /^(0[1-9]|1[0-2])\/\d{2}$/.test(c.expiry) &&
            typeof c.isDefault === "boolean" &&
            Object.keys(c).every((key) =>
              [
                "id",
                "ownerEmail",
                "brand",
                "last4",
                "expiry",
                "isDefault",
              ].includes(key),
            ),
        ))) &&
    (v.session === null || text(v.session)) &&
    Array.isArray(v.users) &&
    v.users.every(buyer) &&
    (v.session === null ||
      v.users.some((u) => object(u) && u.email === v.session)) &&
    Array.isArray(v.orders) &&
    v.orders.every(
      (o) =>
        object(o) &&
        [o.id, o.eventId].every(text) &&
        buyer(o.buyer) &&
        event(o.event) &&
        date(o.purchasedAt) &&
        ["guest", "account", "register"].includes(String(o.mode)) &&
        Number.isInteger(o.amountMinor) &&
        Array.isArray(o.tickets) &&
        o.tickets.every(
          (t) =>
            object(t) &&
            [t.id, t.accessId, t.seatId, t.seatLabel, t.ownerEmail].every(
              text,
            ) &&
            ["valid", "used"].includes(String(t.status)),
        ),
    ) &&
    Array.isArray(v.transfers) &&
    v.transfers.every(
      (t) =>
        object(t) &&
        [t.id, t.orderId, t.from, t.to, t.recipientName].every(text) &&
        strings(t.ticketIds) &&
        date(t.createdAt) &&
        ["pending", "accepted", "cancelled"].includes(String(t.status)),
    )
  );
}
