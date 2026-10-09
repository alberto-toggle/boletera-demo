"use client";
import { useState } from "react";
import { Users, Ticket, UserCheck, Clock } from "lucide-react";
import { useAdmin } from "../demo/provider";
import { AdminSelect, SearchField, StatusBadge } from "../components/controls";
import { MetricCards } from "../components/metric-cards";
import { accessTime } from "@/features/access/model";
export function AttendanceView() {
  const { events, sales, now } = useAdmin();
  const [eventId, setEventId] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const tickets = sales
    .filter(
      (s) =>
        s.status === "confirmed" &&
        (eventId === "all" || s.eventId === eventId),
    )
    .flatMap((s) =>
      s.tickets.map((t) => ({
        ...t,
        buyer: s.buyer.name,
        email: s.buyer.email,
        event: events.find((e) => e.id === s.eventId),
      })),
    );
  const entered = tickets.filter((t) => t.used).length;
  const pastUnused = tickets.filter(
    (t) => !t.used && t.event && Date.parse(t.event.startsAt) < now,
  ).length;
  const rows = tickets.filter((t) =>
    `${t.id} ${t.buyer} ${t.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">CADA ENTRADA CUENTA</p>
          <h1>Asistencia</h1>
          <p>Boletos vendidos, entradas registradas y accesos pendientes.</p>
        </div>
        <AdminSelect
          label="Evento de asistencia"
          value={eventId}
          onChange={(v) => {
            setEventId(v);
            setPage(0);
          }}
          options={[
            { value: "all", label: "Todos los eventos" },
            ...events.map((e) => ({ value: e.id, label: e.title })),
          ]}
        />
      </div>
      <MetricCards
        items={[
          {
            label: "Boletos vendidos",
            value: String(tickets.length),
            detail: "Compras confirmadas",
            icon: Ticket,
          },
          {
            label: "Entradas registradas",
            value: String(entered),
            detail: "Un acceso por boleto",
            icon: UserCheck,
          },
          {
            label: "Pendientes de ingreso",
            value: String(tickets.length - entered),
            detail: "Incluye eventos futuros",
            icon: Clock,
          },
          {
            label: "Sin utilizar · eventos iniciados",
            value: String(pastUnused),
            detail: "Ausencia definitiva al cierre del evento",
            icon: Users,
          },
        ]}
      />
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Registro de boletos</h2>
            <p>
              La fecha del primer ingreso se conserva al intentar usar el boleto
              otra vez.
            </p>
          </div>
          <SearchField
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(0);
            }}
            placeholder="Buscar nombre, correo o boleto"
          />
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Boleto / comprador</th>
                <th>Evento</th>
                <th>Lugar</th>
                <th>Acceso</th>
                <th>Primer ingreso</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(page * 15, page * 15 + 15).map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.buyer}</strong>
                    <small className="admin-cell-sub">{t.id}</small>
                  </td>
                  <td>{t.event?.title}</td>
                  <td>
                    {t.zoneId} · {t.seat}
                  </td>
                  <td>
                    <StatusBadge
                      label={t.used ? "Utilizado" : "Sin utilizar"}
                      tone={t.used ? "green" : "neutral"}
                    />
                  </td>
                  <td>{t.usedAt ? accessTime(t.usedAt) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <p className="admin-panel-content">
              No hay boletos con estos filtros.
            </p>
          )}
        </div>
        <div className="admin-panel-heading">
          <span>
            {rows.length} boletos · Página {page + 1}
          </span>
          <div className="admin-actions">
            <button disabled={!page} onClick={() => setPage(page - 1)}>
              Anterior
            </button>
            <button
              disabled={(page + 1) * 15 >= rows.length}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
