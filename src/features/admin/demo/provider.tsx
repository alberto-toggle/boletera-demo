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
import { useAccessRecords } from "@/features/access/demo/store";
import { useInventoryHolds } from "../inventory/holds";
import { inventoryChangeError, type InventoryHold } from "../inventory/model";
import type { AdminData, AdminEvent } from "../model";
import { createAdminFixtures } from "./fixtures";
import { ADMIN_STORAGE_KEY, readAdminEvents, writeAdminEvents } from "./store";
import { validateEvent } from "../events/validation";
interface AdminContextValue extends AdminData {
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
  const { holds, now, expireDemo } = useInventoryHolds(
    data.events,
    data.sales,
    ready,
  );
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
