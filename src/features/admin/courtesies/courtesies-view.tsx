"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gift, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "../demo/provider";
import { AdminSelect, EmptyState } from "../components/controls";
import { eventSeats, occupiedSeatIds } from "../inventory/model";
import { downloadCourtesy } from "./courtesy-pdf";
export function CourtesiesView({ eventId }: { eventId: string }) {
  const { events, sales, holds, now, canEdit, courtesies, issueCourtesy } =
    useAdmin();
  const [name, setName] = useState("");
  const [seatId, setSeatId] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const event = events.find((e) => e.id === eventId);
  if (!canEdit)
    return (
      <EmptyState
        title="Acceso restringido"
        description="Solo administración puede emitir e imprimir cortesías."
      />
    );
  if (!event)
    return (
      <EmptyState
        title="Evento no encontrado"
        description="Regresa al catálogo."
      />
    );
  const occupied = occupiedSeatIds(eventId, sales, holds, now);
  const free = eventSeats(event).filter(
    (s) => s.enabled && !occupied.has(s.id),
  );
  const issued = courtesies.filter((c) => c.eventId === eventId);
  return (
    <div className="admin-page">
      <Link className="admin-back" href={`/admin/eventos/${eventId}`}>
        <ArrowLeft size={16} />
        Volver al evento
      </Link>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">EXCLUSIVO DE ADMINISTRACIÓN</p>
          <h1>Cortesías</h1>
          <p>
            {event.title} · {issued.length}{" "}
            {issued.length === 1 ? "emitida" : "emitidas"}
          </p>
        </div>
      </div>
      <div className="admin-inventory-layout">
        <section className="admin-panel admin-panel-content">
          <h2>Una invitación con lugar asignado</h2>
          <p>
            La cortesía ocupa un lugar del recinto y permite un ingreso. No se
            contabiliza como venta ni genera ingresos.
          </p>
          <form
            className="admin-seat-editor admin-courtesy-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                const error = await issueCourtesy(eventId, seatId, name);
                setNotice(
                  error ??
                    "Cortesía emitida. Ya puedes descargarla para imprimir.",
                );
                if (!error) {
                  setSeatId("");
                  setName("");
                }
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              Nombre del invitado
              <Input
                required
                minLength={3}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Lugar disponible
              <AdminSelect
                label="Lugar de cortesía"
                value={seatId}
                onChange={setSeatId}
                options={[
                  { value: "", label: "Selecciona un lugar" },
                  ...free.map((s) => ({
                    value: s.id,
                    label: `${event.layout === "banquet" ? "Mesa" : "Fila"} ${s.row} · Lugar ${s.number}`,
                  })),
                ]}
              />
            </label>
            <Button
              type="submit"
              disabled={busy || !seatId || name.trim().length < 3}
            >
              <Gift size={16} />
              {busy ? "Emitiendo…" : "Emitir cortesía"}
            </Button>
          </form>
          <p role="status">{notice}</p>
        </section>
        <section className="admin-panel admin-panel-content">
          <h2>Cortesías emitidas</h2>
          {!issued.length ? (
            <p>Aquí podrás recuperar e imprimir las invitaciones emitidas.</p>
          ) : (
            issued.map((c) => (
              <div className="admin-hold-row" key={c.id}>
                <div>
                  <strong>{c.buyer}</strong>
                  <small>{c.seat}</small>
                  <small>{c.id}</small>
                </div>
                <Button
                  variant="outline"
                  disabled={busy}
                  aria-label={`Descargar cortesía de ${c.buyer}`}
                  onClick={async () => {
                    setBusy(true);
                    setNotice("Preparando PDF…");
                    try {
                      await downloadCourtesy(c);
                      setNotice("PDF preparado para imprimir.");
                    } catch {
                      setNotice(
                        "No se pudo generar el PDF. Intenta nuevamente.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <Download size={16} />
                  PDF
                </Button>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
