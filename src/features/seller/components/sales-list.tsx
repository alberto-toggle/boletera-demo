"use client";
import { SalesDateRange } from "./sales-date-range";
import { mexicoDay, paymentKind, type DateRange } from "../sales-filters";
import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import {
  date,
  paid,
  balance,
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
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const [eventFilter, setEventFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const visible = sales.filter((s) => {
    const day = mexicoDay(s.createdAt);
    return (
      (!range.from || day >= range.from) &&
      (!range.to || day <= range.to) &&
      (filter === "all" || s.status === filter) &&
      (eventFilter === "all" || s.eventId === eventFilter) &&
      (methodFilter === "all" || paymentKind(s) === methodFilter) &&
      `${s.id} ${s.customer?.name ?? ""} ${s.customer?.email ?? ""} ${events.find((e) => e.id === s.eventId)?.title ?? ""}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase())
    );
  });
  const confirmed = visible.filter((s) => s.status === "confirmed");
  const collected = (method: "cash" | "terminal") =>
    visible
      .flatMap((s) => s.payments)
      .filter((p) => p.method === method)
      .reduce((n, p) => n + p.amountMinor, 0);
  const clear = () => {
    setQuery("");
    setFilter("all");
    setEventFilter("all");
    setMethodFilter("all");
    setRange({ from: "", to: "" });
  };
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
              visible.filter(
                (s) => s.status === "review" || s.status === "terminal",
              ).length
            }
          </strong>
        </div>
      </div>
      <p className="seller-muted">
        Resumen de los resultados filtrados · {visible.length}{" "}
        {visible.length === 1 ? "operación" : "operaciones"}
      </p>
      <div className="seller-collection-summary">
        <span>
          Efectivo registrado <strong>{money(collected("cash"))}</strong>
        </span>
        <span>
          Terminal registrada <strong>{money(collected("terminal"))}</strong>
        </span>
        <span>
          Saldo de pagos parciales{" "}
          <strong>
            {money(
              visible
                .filter((s) => paid(s) > 0 && s.status !== "confirmed")
                .reduce((n, s) => n + balance(s), 0),
            )}
          </strong>
        </span>
      </div>
      <section className="seller-filters-panel" aria-label="Filtros de ventas">
        <SalesDateRange value={range} onChange={setRange} />
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
        <div className="seller-extra-filters">
          <label>
            Evento
            <select
              aria-label="Evento"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
            >
              <option value="all">Todos los eventos</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Método de pago
            <select
              aria-label="Método de pago"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="all">Todos los métodos</option>
              <option value="cash">Efectivo</option>
              <option value="terminal">Terminal</option>
              <option value="mixed">Mixto</option>
              <option value="none">Sin cobros</option>
            </select>
          </label>
          <button type="button" className="seller-text-button" onClick={clear}>
            Limpiar filtros
          </button>
        </div>
      </section>
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
              <small>
                {paymentKind(s) === "mixed"
                  ? "Pago mixto"
                  : paymentKind(s) === "cash"
                    ? "Efectivo"
                    : paymentKind(s) === "terminal"
                      ? "Terminal"
                      : "Sin cobros"}{" "}
                · {s.payments.length}{" "}
                {s.payments.length === 1 ? "cobro" : "cobros"}
              </small>
              {paid(s) > 0 && s.status !== "confirmed" && (
                <small>Pendiente: {money(balance(s))}</small>
              )}
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
              ? "Prueba otro rango de fechas, búsqueda o filtro."
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
