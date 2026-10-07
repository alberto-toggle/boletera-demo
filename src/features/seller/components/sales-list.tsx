"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import {
  date,
  money,
  statusLabels,
  total,
  type Sale,
  type SellerEvent,
} from "../model";
export function SalesList({
  sales,
  events,
}: {
  sales: Sale[];
  events: SellerEvent[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const confirmed = sales.filter((s) => s.status === "confirmed");
  const visible = sales.filter(
    (s) =>
      (filter === "all" || s.status === filter) &&
      `${s.id} ${s.customer?.name ?? ""} ${events.find((e) => e.id === s.eventId)?.title ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="seller-main">
      <div className="seller-heading">
        <div>
          <p className="seller-eyebrow">TU ACTIVIDAD</p>
          <h1>Mis ventas</h1>
          <p>Consulta boletos y da seguimiento a tus operaciones.</p>
        </div>
        <Link className="seller-primary" href="/operacion/vendedor">
          Nueva venta <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="seller-metrics">
        <div>
          <small>Importe confirmado</small>
          <strong>{money(confirmed.reduce((n, s) => n + total(s), 0))}</strong>
        </div>
        <div>
          <small>Boletos vendidos</small>
          <strong>{confirmed.reduce((n, s) => n + s.seats.length, 0)}</strong>
        </div>
        <div>
          <small>Pendientes de revisión</small>
          <strong>
            {
              sales.filter(
                (s) => s.status === "review" || s.status === "terminal",
              ).length
            }
          </strong>
        </div>
      </div>
      <div className="seller-list-filters">
        <label className="seller-search">
          <Search size={17} />
          <input
            aria-label="Buscar ventas"
            placeholder="Folio, comprador o evento"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Filtrar por estado"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="seller-sales-list">
        {visible.map((s) => (
          <Link
            className="seller-sale-row"
            href={`/operacion/vendedor/venta/${s.id}`}
            key={s.id}
          >
            <div>
              <span className={`seller-status ${s.status}`}>
                {statusLabels[s.status]}
              </span>
              <h2>{events.find((e) => e.id === s.eventId)?.title}</h2>
              <p>
                {s.customer?.name ?? "Datos del comprador pendientes"} ·{" "}
                {s.seats.length} boletos
              </p>
              <small>
                {s.id} · {date(new Date(s.createdAt).toISOString())}
              </small>
            </div>
            <div>
              <strong>{money(total(s))}</strong>
              <span>
                {s.status === "confirmed" ? "Ver boletos" : "Ver operación"}{" "}
                <ArrowUpRight size={15} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {!visible.length && (
        <div className="seller-empty">
          <h2>
            {sales.length
              ? "Sin coincidencias"
              : "Tu primera venta empieza aquí"}
          </h2>
          <p>
            {sales.length
              ? "Prueba otra búsqueda o estado."
              : "Las operaciones que realices aparecerán en esta sección."}
          </p>
          <Link href="/operacion/vendedor" className="seller-text-button">
            Ver eventos disponibles <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </main>
  );
}
