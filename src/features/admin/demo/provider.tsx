"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useInternalAccess } from "@/features/internal-access/access";
import {
  useCourtesies,
  saveCourtesy,
  type Courtesy,
} from "@/features/access/demo/courtesies";
import { eventSeats, occupiedSeatIds } from "../inventory/model";
import { useAccessRecords } from "@/features/access/demo/store";
import { useInventoryHolds } from "../inventory/holds";
import { inventoryChangeError, type InventoryHold } from "../inventory/model";
import type { AdminData, AdminEvent } from "../model";
import { createAdminFixtures } from "./fixtures";
import { ADMIN_STORAGE_KEY, readAdminEvents, writeAdminEvents } from "./store";
import { validateEvent } from "../events/validation";
interface AdminContextValue extends AdminData {
  courtesies: Courtesy[];
  issueCourtesy: (
    eventId: string,
    seatId: string,
    name: string,
  ) => Promise<string | null>;
  ready: boolean;
  canEdit: boolean;
  holds: InventoryHold[];
  now: number;
  expireDemo: (eventId: string) => void;
  notice: string;
  saveEvent: (event: AdminEvent) => string | null;
  clearNotice: () => void;
}
const AdminContext = createContext<AdminContextValue | null>(null);
export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(createAdminFixtures);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const { canEdit } = useInternalAccess();
  const records = useAccessRecords();
  const courtesies = useCourtesies();
  const {
    holds: baseHolds,
    now,
    expireDemo,
  } = useInventoryHolds(data.events, data.sales, ready);
  const holds: InventoryHold[] = [
    ...baseHolds,
    ...courtesies.map((c) => ({
      id: c.id,
      eventId: c.eventId,
      seatIds: [c.seatId],
      expiresAt: Number.MAX_SAFE_INTEGER,
      kind: "courtesy" as const,
    })),
  ];
  async function issueCourtesy(eventId: string, seatId: string, name: string) {
    if (!canEdit) return "Solo administración puede emitir cortesías.";
    const event = data.events.find((e) => e.id === eventId);
    if (!event || name.trim().length < 3 || name.trim().length > 100)
      return "Revisa el evento y el nombre del invitado.";
    const seat = eventSeats(event).find((s) => s.id === seatId && s.enabled);
    if (
      !seat ||
      occupiedSeatIds(eventId, data.sales, holds, Date.now()).has(seatId)
    )
      return "El lugar ya no está disponible.";
    const id = `COR-${crypto.randomUUID().slice(0, 12).toUpperCase()}`;
    return saveCourtesy({
      id,
      orderId: id,
      eventId,
      seatId,
      buyer: name.trim(),
      email: "",
      zone: seat.zoneId,
      seat: `${event.layout === "banquet" ? "Mesa" : "Fila"} ${seat.row} · Lugar ${seat.number}`,
      issuedAt: new Date().toISOString(),
      event: {
        id: event.id,
        title: event.title,
        venue: event.venue,
        startsAt: event.startsAt,
        image: event.image,
      },
    });
  }
  const sales = useMemo(
    () =>
      data.sales.map((s) => ({
        ...s,
        tickets: s.tickets.map((t) => {
          const record = records.find(
            (r) => r.ticketId === t.id && r.eventId === s.eventId,
          );
          return record ? { ...t, used: true, usedAt: record.usedAt } : t;
        }),
      })),
    [data.sales, records],
  );
  useEffect(() => {
    const load = () => {
      const seed = createAdminFixtures();
      setData({ ...seed, events: readAdminEvents(seed.events) });
      setReady(true);
    };
    load();
    const sync = (event: StorageEvent) => {
      if (event.key === ADMIN_STORAGE_KEY) load();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function saveEvent(event: AdminEvent) {
    if (!canEdit) return "Tu perfil solo permite consultar información.";
    const error =
      validateEvent(event, data.sales)[0] ??
      inventoryChangeError(
        event,
        data.events.find((e) => e.id === event.id),
        data.sales,
        holds,
        Date.now(),
      );
    if (error) return error;
    const exists = data.events.some((item) => item.id === event.id);
    const events = exists
      ? data.events.map((item) => (item.id === event.id ? event : item))
      : [event, ...data.events];
    const persisted = writeAdminEvents(events);
    setData({ ...data, events });
    setNotice(
      persisted
        ? "Cambios guardados en esta demo."
        : "Cambios guardados en esta pestaña. El navegador no permite conservarlos al recargar.",
    );
    return null;
  }
  return (
    <AdminContext.Provider
      value={{
        ...data,
        courtesies,
        issueCourtesy,
        sales,
        canEdit,
        holds,
        now,
        expireDemo,
        ready,
        notice,
        saveEvent,
        clearNotice: () => setNotice(""),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("Admin components require AdminProvider");
  return context;
}
