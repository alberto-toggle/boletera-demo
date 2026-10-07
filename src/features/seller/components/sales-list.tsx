"use client";
import { OperationRow } from "./operation-row";
import {
  operationGroups,
  operationGroup,
  type OperationGroup,
} from "../operations";
import { SalesDateRange } from "./sales-date-range";
import { mexicoDay, paymentKind, type DateRange } from "../sales-filters";
import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import {
  paid,
  balance,
  money,
  statusLabels,
  total,
  type Sale,
  type SellerEvent,
} from "../model";
export function SalesList({
  now,
  sales,
  events,
}: {
  now: number;
  sales: Sale[];
  events: SellerEvent[];
}) {
  const [group, setGroup] = useState<OperationGroup>("active");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [range, setRange] = useState<DateRange>({ from: "", to: "" });
  const [eventFilter, setEventFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const visible = sales.filter((s) => {
    const day = mexicoDay(s.createdAt);
    return (
      operationGroup(s, now) === group &&
      (!range.from || day >= range.from) &&
      (!range.to || day <= range.to) &&
      (filter === "all" || s.status === filter) &&
      (eventFilter === "all" || s.eventId === eventFilter) &&
      (methodFilter === "all" || paymentKind(s) === methodFilter) &&
      `${s.id} ${(s.customerDraft ?? s.customer)?.name ?? ""} ${(s.customerDraft ?? s.customer)?.email ?? ""} ${events.find((e) => e.id === s.eventId)?.title ?? ""}`
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
          <h1>Mis operaciones</h1>
          <p>Consulta boletos y da seguimiento a tus operaciones.</p>
        </div>
        <Link className="seller-primary" href="/operacion/vendedor">
          Nueva venta <ArrowUpRight size={17} />
        </Link>
      </div>
      <nav className="seller-operation-tabs" aria-label="Tipos de operación">
        {operationGroups.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={group === item.id}
            onClick={() => {
              setGroup(item.id);
              setFilter("all");
            }}
          >
            {item.label}{" "}
            <span>
              {
                sales.filter((sale) => operationGroup(sale, now) === item.id)
                  .length
              }
            </span>
          </button>
        ))}
      </nav>
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
      <section
        className="seller-filters-panel"
        aria-label="Filtros de operaciones"
      >
        <SalesDateRange value={range} onChange={setRange} />
        <div className="seller-list-filters">
          <label className="seller-search">
            <Search size={17} />
            <input
              aria-label="Buscar operaciones"
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
            {Object.entries(statusLabels)
              .filter(([status]) =>
                group === "completed"
                  ? status === "confirmed"
                  : group === "closed"
                    ? ["cancelled", "expired"].includes(status)
                    : ["pending", "partial", "terminal", "review"].includes(
                        status,
                      ),
              )
              .map(([value, label]) => (
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
          <OperationRow
            key={s.id}
            sale={s}
            eventTitle={
              events.find((e) => e.id === s.eventId)?.title ?? "Evento"
            }
            now={now}
          />
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
