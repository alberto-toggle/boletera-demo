"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Armchair,
  LockKeyhole,
  Timer,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "../demo/provider";
import { AdminSelect, EmptyState } from "../components/controls";
import { MetricCards } from "../components/metric-cards";
import { eventInventory, type AdminEvent } from "../model";
import { eventSeats, occupiedSeatIds, type SeatOverride } from "./model";
export function InventoryView({ eventId }: { eventId: string }) {
  const admin = useAdmin();
  const event = admin.events.find((e) => e.id === eventId);
  if (!event)
    return (
      <EmptyState
        title="Evento no encontrado"
        description="Regresa al catálogo de eventos."
      />
    );
  return <InventoryEditor key={eventId} event={event} />;
}
function InventoryEditor({ event }: { event: AdminEvent }) {
  const { sales, holds, now, canEdit, saveEvent, expireDemo } = useAdmin();
  const [overrides, setOverrides] = useState<SeatOverride[]>(
    event.seatOverrides ?? [],
  );
  const [zone, setZone] = useState(event.zones[0]?.id ?? "A");
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const draft = { ...event, seatOverrides: overrides };
  const seats = eventSeats(draft);
  const occupied = occupiedSeatIds(event.id, sales, holds, now);
  const sold = occupiedSeatIds(event.id, sales);
  const stats = eventInventory(draft, sales, holds, now);
  const seat = seats.find((s) => s.id === selected);
  const locked = !!seat && occupied.has(seat.id);
  const filtered = seats.filter((s) => s.zoneId === zone);
  const activeHolds = holds.filter(
    (h) => h.eventId === event.id && h.expiresAt > now,
  );
  function update(value: SeatOverride) {
    setOverrides((previous) => [
      ...previous.filter((s) => s.id !== value.id),
      value,
    ]);
    setMessage("");
  }
  return (
    <div className="admin-page">
      <Link href={`/admin/eventos/${event.id}`} className="admin-back">
        <ArrowLeft size={15} />
        Volver al evento
      </Link>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">RECINTO E INVENTARIO</p>
          <h1>Un lugar para cada persona</h1>
          <p>
            {event.title} · {event.venue}
          </p>
        </div>
        {canEdit && (
          <Button
            onClick={() => {
              const error = saveEvent({
                ...draft,
                updatedAt: new Date().toISOString(),
              });
              setMessage(error ?? "Configuración de lugares guardada.");
            }}
          >
            <Save size={16} />
            Guardar lugares
          </Button>
        )}
      </div>
      <MetricCards
        items={[
          {
            label: "Aforo habilitado",
            value: String(stats.capacity),
            detail: "Lugares disponibles para operar",
            icon: Armchair,
          },
          {
            label: "Vendidos",
            value: String(stats.sold),
            detail: "No se pueden modificar",
            icon: Ticket,
          },
          {
            label: "Apartados",
            value: String(stats.held),
            detail: "Se liberan al vencer el plazo",
            icon: Timer,
          },
          {
            label: "Disponibles",
            value: String(stats.available),
            detail: "Excluye vendidos y apartados",
            icon: LockKeyhole,
          },
        ]}
      />
      {message && (
        <p role="status" className="admin-note">
          {message}
        </p>
      )}
      <div className="admin-inventory-layout">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Selecciona un lugar</h2>
              <p>
                Distribución por {event.layout === "banquet" ? "mesa" : "fila"}{" "}
                · 10 lugares por grupo
              </p>
            </div>
            <AdminSelect
              label="Zona del inventario"
              value={zone}
              onChange={(v) => {
                setZone(v);
                setSelected(null);
                setPage(0);
              }}
              options={event.zones.map((z) => ({ value: z.id, label: z.name }))}
            />
          </div>
          <div className="admin-seat-legend">
            <span>○ Disponible</span>
            <span>● Vendido</span>
            <span>◷ Apartado</span>
            <span>× Deshabilitado</span>
          </div>
          <div className="admin-seat-grid">
            {filtered.slice(page * 100, page * 100 + 100).map((s) => (
              <button
                key={s.id}
                type="button"
                className="admin-seat"
                data-state={
                  sold.has(s.id)
                    ? "sold"
                    : occupied.has(s.id)
                      ? "held"
                      : s.enabled
                        ? "free"
                        : "disabled"
                }
                aria-pressed={selected === s.id}
                aria-label={`${event.layout === "banquet" ? "Mesa" : "Fila"} ${s.row}, lugar ${s.number}, ${sold.has(s.id) ? "vendido" : occupied.has(s.id) ? "apartado" : s.enabled ? "disponible" : "deshabilitado"}`}
                onClick={() => setSelected(s.id)}
              >
                <small>{s.row}</small>
                {s.number}
              </button>
            ))}
          </div>
          {filtered.length > 100 && (
            <div className="admin-panel-heading">
              <Button
                variant="outline"
                disabled={!page}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <span>Página {page + 1}</span>
              <Button
                variant="outline"
                disabled={(page + 1) * 100 >= filtered.length}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </section>
        <aside className="admin-panel admin-panel-content admin-seat-editor">
          <h2>{seat ? `Lugar ${seat.id}` : "Detalles del lugar"}</h2>
          {seat ? (
            <>
              <p>
                {locked
                  ? "Este lugar está protegido porque está vendido o apartado."
                  : "Personaliza su identificación o retíralo del aforo vendible."}
              </p>
              <label>
                {event.layout === "banquet" ? "Mesa" : "Fila"}
                <Input
                  maxLength={16}
                  disabled={locked || !canEdit}
                  value={seat.row}
                  onChange={(e) => update({ ...seat, row: e.target.value })}
                />
              </label>
              <label>
                Número de lugar
                <Input
                  maxLength={16}
                  disabled={locked || !canEdit}
                  value={seat.number}
                  onChange={(e) => update({ ...seat, number: e.target.value })}
                />
              </label>
              <label className="admin-seat-enabled">
                <input
                  type="checkbox"
                  checked={seat.enabled}
                  disabled={locked || !canEdit}
                  onChange={(e) =>
                    update({ ...seat, enabled: e.target.checked })
                  }
                />
                Habilitado para venta
              </label>
            </>
          ) : (
            <p>
              Elige un lugar del plano para consultar o editar su configuración.
            </p>
          )}
          <div className="admin-top-line">
            <h3>Apartados activos</h3>
            {activeHolds.length ? (
              activeHolds.map((h) => (
                <div className="admin-hold-row" key={h.id}>
                  <span>
                    {h.id}
                    <small>{h.seatIds.length} lugares</small>
                  </span>
                  <strong>
                    {Math.floor((h.expiresAt - now) / 60000)}:
                    {String(
                      Math.floor((h.expiresAt - now) / 1000) % 60,
                    ).padStart(2, "0")}
                  </strong>
                </div>
              ))
            ) : (
              <p>No hay apartados vigentes.</p>
            )}
            {canEdit && activeHolds.length > 0 && (
              <button
                type="button"
                data-demo
                onClick={() => expireDemo(event.id)}
              >
                Simular vencimiento de apartados
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
