"use client";
import { useEffect, useState } from "react";
import type { AdminEvent, AdminSale } from "../model";
import { eventSeats, occupiedSeatIds, type InventoryHold } from "./model";
export const HOLDS_KEY = "boletera-admin-holds-v1";
export function useInventoryHolds(
  events: AdminEvent[],
  sales: AdminSale[],
  ready: boolean,
) {
  const [holds, setHolds] = useState<InventoryHold[]>([]);
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!ready) return;
    const load = () => {
      setNow(Date.now());
      try {
        const raw: unknown = JSON.parse(
          localStorage.getItem(HOLDS_KEY) ?? "null",
        );
        if (
          Array.isArray(raw) &&
          raw.every(
            (h) =>
              h &&
              typeof h.id === "string" &&
              typeof h.eventId === "string" &&
              Number.isFinite(h.expiresAt) &&
              Array.isArray(h.seatIds) &&
              h.seatIds.every((id: unknown) => typeof id === "string"),
          )
        ) {
          setHolds(raw);
          return;
        }
        const created = events
          .filter((e) => e.status === "published")
          .map((e, i) => {
            const sold = occupiedSeatIds(e.id, sales);
            return {
              id: `AP-${100 + i}`,
              eventId: e.id,
              seatIds: eventSeats(e)
                .filter((s) => s.enabled && !sold.has(s.id))
                .slice(-Math.min(8, 3 + i))
                .map((s) => s.id),
              expiresAt: Date.now() + (8 + i) * 60000,
            };
          });
        localStorage.setItem(HOLDS_KEY, JSON.stringify(created));
        setHolds(created);
      } catch {
        setHolds([]);
      }
    };
    load();
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const sync = (e: StorageEvent) => {
      if (e.key === HOLDS_KEY) load();
    };
    window.addEventListener("storage", sync);
    return () => {
      clearInterval(tick);
      window.removeEventListener("storage", sync);
    };
  }, [ready, events, sales]);
  function expireDemo(eventId: string) {
    const next = holds.map((h) =>
      h.eventId === eventId ? { ...h, expiresAt: Date.now() } : h,
    );
    try {
      localStorage.setItem(HOLDS_KEY, JSON.stringify(next));
    } catch {}
    setHolds(next);
    setNow(Date.now());
  }
  return { holds, now, expireDemo };
}
