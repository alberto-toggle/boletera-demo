"use client";
import { ActionLink } from "../components/controls";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Ticket,
  Wallet,
  CalendarDays,
  Armchair,
  ArrowDownUp,
} from "lucide-react";
import { useAdmin } from "../demo/provider";
import { DEMO_TODAY, initialRange } from "../demo/fixtures";
import { dateLabel, eventInventory, money, number } from "../model";
import { MetricCards } from "../components/metric-cards";
import { DateFilter } from "../components/date-filter";
import { StatusBadge } from "../components/controls";
import { salesSummary } from "./selectors";
import { SalesAnalytics } from "./sales-analytics";
export function OverviewView() {
  const { events, sales, holds, now, canEdit } = useAdmin();
  const [range, setRange] = useState(initialRange);
  const [sort, setSort] = useState<{
    key: "revenue" | "sold";
    direction: 1 | -1;
  }>({ key: "revenue", direction: -1 });
  function sortBy(key: "revenue" | "sold") {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === -1 ? 1 : -1,
    }));
  }
  const summary = salesSummary(sales, range);
  const published = events.filter((event) => event.status === "published");
  const available = published.reduce(
    (sum, event) => sum + eventInventory(event, sales, holds, now).available,
    0,
  );
  const relevant = [...published]
    .sort(
      (a, b) =>
        (eventInventory(a, sales, holds, now)[sort.key] -
          eventInventory(b, sales, holds, now)[sort.key]) *
        sort.direction,
    )
    .slice(0, 4);
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">TU OPERACIÓN, EN PERSPECTIVA</p>
          <h1>Todo listo para el próximo encuentro.</h1>
          <p>Un vistazo a tus eventos y al movimiento de tus ventas.</p>
        </div>
        {canEdit && (
          <ActionLink href="/admin/eventos/nuevo">
            <Plus />
            Crear evento
          </ActionLink>
        )}
      </div>
      <div className="admin-section-heading">
        <h2>
          Resumen de ventas <span>MXN</span>
        </h2>
        <DateFilter
          value={range}
          onChange={setRange}
          referenceDate={DEMO_TODAY}
        />
      </div>
      <MetricCards
        items={[
          {
            label: "Ingresos del periodo",
            value: money(summary.revenue),
            detail: `${number(summary.confirmed.length)} ventas confirmadas`,
            icon: Wallet,
          },
          {
            label: "Boletos vendidos",
            value: number(summary.tickets),
            detail: "Venta en línea y taquilla",
            icon: Ticket,
          },
          {
            label: "Eventos publicados",
            value: String(published.length).padStart(2, "0"),
            detail: `${events.filter((event) => event.status === "draft").length} en preparación · Total del catálogo`,
            icon: CalendarDays,
          },
          {
            label: "Lugares disponibles",
            value: number(available),
            detail: "En todos los eventos publicados",
            icon: Armchair,
          },
        ]}
      />
      <SalesAnalytics sales={sales} range={range} />
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Eventos en movimiento</h2>
            <p>Eventos publicados · cifras acumuladas de todo el catálogo</p>
          </div>
          <Link href="/admin/eventos" className="admin-text-link">
            Todos los eventos
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table admin-records-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Estado</th>
                <th
                  aria-sort={
                    sort.key === "sold"
                      ? sort.direction === -1
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                >
                  <button
                    className="admin-table-sort"
                    onClick={() => sortBy("sold")}
                  >
                    Boletos vendidos <ArrowDownUp size={12} />
                  </button>
                </th>
                <th
                  className="align-right"
                  aria-sort={
                    sort.key === "revenue"
                      ? sort.direction === -1
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                >
                  <button
                    className="admin-table-sort"
                    onClick={() => sortBy("revenue")}
                  >
                    Ingresos <ArrowDownUp size={12} />
                  </button>
                </th>
                <th>
                  <span className="sr-only">Ver evento</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {relevant.map((event) => {
                const stats = eventInventory(event, sales, holds, now);
                return (
                  <tr key={event.id}>
                    <td>
                      <Link
                        className="admin-event-cell"
                        href={`/admin/eventos/${event.id}`}
                      >
                        <Image
                          src={event.image}
                          width={48}
                          height={40}
                          alt=""
                        />
                        <span>
                          <strong>{event.title}</strong>
                          <small>
                            {dateLabel(event.startsAt)} · {event.venue}
                          </small>
                        </span>
                      </Link>
                    </td>
                    <td>
                      <StatusBadge label="Publicado" tone="green" />
                    </td>
                    <td>
                      <div className="admin-capacity">
                        <span>
                          {stats.sold} <small>/ {stats.capacity}</small>
                          <small>{stats.percentage}%</small>
                        </span>
                        <progress
                          value={stats.sold}
                          max={stats.capacity}
                          aria-label={`Ocupación de ${event.title}`}
                        />
                      </div>
                    </td>
                    <td className="align-right admin-money">
                      {money(stats.revenue)}
                    </td>
                    <td>
                      <ActionLink
                        href={`/admin/eventos/${event.id}`}
                        variant="ghost"
                        size="icon"
                        aria-label={`Ver ${event.title}`}
                      >
                        <ArrowUpRight />
                      </ActionLink>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>
                  Subtotal · {relevant.length} eventos mostrados
                </td>
                <td>
                  {number(
                    relevant.reduce(
                      (sum, event) =>
                        sum + eventInventory(event, sales, holds, now).sold,
                      0,
                    ),
                  )}{" "}
                  boletos
                </td>
                <td className="align-right">
                  {money(
                    relevant.reduce(
                      (sum, event) =>
                        sum + eventInventory(event, sales, holds, now).revenue,
                      0,
                    ),
                  )}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
      <p className="admin-data-note" data-demo>
        Los ejemplos incluyen ventas de octubre de 2025 a octubre de 2026. Los
        filtros usan el 7 de octubre como fecha de referencia.
      </p>
    </div>
  );
}
