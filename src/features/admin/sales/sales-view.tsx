"use client";
import { useState } from "react";
import {
  Download,
  ArrowUpRight,
  Globe,
  Store,
  Wallet,
  Ticket,
  ReceiptText,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "../demo/provider";
import { DEMO_TODAY, initialRange } from "../demo/fixtures";
import {
  AdminSelect,
  EmptyState,
  Pagination,
  SearchField,
  StatusBadge,
} from "../components/controls";
import { DateFilter } from "../components/date-filter";
import { MetricCards } from "../components/metric-cards";
import {
  dateLabel,
  inRange,
  matchesQuery,
  money,
  number,
  saleStatusLabels,
  saleTotal,
  type AdminSale,
} from "../model";
import { salesSummary } from "../overview/selectors";
import { SaleDetail } from "./sale-detail";
import { exportSales } from "./export";
export function SalesView({ initialEvent = "all" }: { initialEvent?: string }) {
  const { sales, events } = useAdmin();
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [status, setStatus] = useState("all");
  const [eventId, setEventId] = useState(initialEvent);
  const [range, setRange] = useState(initialRange);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminSale | null>(null);
  const filtered = sales.filter(
    (sale) =>
      (channel === "all" || sale.channel === channel) &&
      (status === "all" || sale.status === status) &&
      (eventId === "all" || sale.eventId === eventId) &&
      inRange(sale, range) &&
      matchesQuery(`${sale.id} ${sale.buyer.name} ${sale.buyer.email}`, query),
  );
  const summary = salesSummary(filtered, { from: "", to: "" });
  const pageSize = 10;
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / pageSize)),
  );
  const eventOptions = [
    { value: "all", label: "Todos los eventos" },
    ...events.map((event) => ({ value: event.id, label: event.title })),
  ];
  const hasFilters =
    query ||
    channel !== "all" ||
    status !== "all" ||
    eventId !== "all" ||
    range.from !== initialRange.from ||
    range.to !== initialRange.to;
  function clear() {
    setQuery("");
    setChannel("all");
    setStatus("all");
    setEventId("all");
    setRange(initialRange);
    setPage(1);
  }
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">CADA VENTA, EN SU LUGAR</p>
          <h1>Ventas</h1>
          <p>Consulta compras, canales y pagos con todos sus detalles.</p>
        </div>
        <Button
          variant="outline"
          disabled={!filtered.length}
          onClick={() => exportSales(filtered, events)}
        >
          <Download />
          Exportar CSV
        </Button>
      </div>
      <MetricCards
        items={[
          {
            label: "Ingresos filtrados",
            value: money(summary.revenue),
            detail: "Solo ventas confirmadas · MXN",
            icon: Wallet,
          },
          {
            label: "Ventas confirmadas",
            value: number(summary.confirmed.length),
            detail: `${filtered.length} operaciones en los resultados`,
            icon: ReceiptText,
          },
          {
            label: "Boletos vendidos",
            value: number(summary.tickets),
            detail: "Excluye pagos rechazados y expirados",
            icon: Ticket,
          },
          {
            label: "Promedio por venta",
            value: money(summary.average),
            detail: "Importe promedio de compras confirmadas",
            icon: CreditCard,
          },
        ]}
      />
      <section className="admin-panel">
        <div className="admin-toolbar admin-sales-toolbar">
          <SearchField
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Buscar folio, nombre o correo…"
          />
          <div>
            <AdminSelect
              label="Evento"
              value={eventId}
              options={eventOptions}
              onChange={(value) => {
                setEventId(value);
                setPage(1);
              }}
            />
            <DateFilter
              value={range}
              onChange={(value) => {
                setRange(value);
                setPage(1);
              }}
              referenceDate={DEMO_TODAY}
            />
          </div>
        </div>
        <div className="admin-table-subtoolbar">
          <div
            className="admin-segmented"
            role="group"
            aria-label="Canal de venta"
          >
            {[
              { value: "all", label: "Todos los canales" },
              { value: "web", label: "En línea" },
              { value: "box-office", label: "Taquilla" },
            ].map((item) => (
              <button
                type="button"
                key={item.value}
                aria-pressed={channel === item.value}
                onClick={() => {
                  setChannel(item.value);
                  setPage(1);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div>
            <AdminSelect
              label="Estado de venta"
              value={status}
              options={[
                { value: "all", label: "Todos los estados" },
                ...Object.entries(saleStatusLabels).map(([value, label]) => ({
                  value,
                  label,
                })),
              ]}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            />
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clear}>
                Limpiar
              </Button>
            )}
          </div>
        </div>
        {filtered.length ? (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Compra</th>
                  <th>Evento / comprador</th>
                  <th>Canal</th>
                  <th>Estado</th>
                  <th className="align-right">Importe</th>
                  <th>
                    <span className="sr-only">Ver detalle</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((sale) => (
                    <tr key={sale.id}>
                      <td>
                        <button
                          type="button"
                          className="admin-folio"
                          onClick={() => setSelected(sale)}
                        >
                          {sale.id}
                        </button>
                        <small className="admin-cell-sub">
                          {dateLabel(sale.createdAt)}
                        </small>
                      </td>
                      <td>
                        <strong>
                          {events.find((event) => event.id === sale.eventId)
                            ?.title ?? "Evento"}
                        </strong>
                        <small className="admin-cell-sub">
                          {sale.buyer.name} · {sale.tickets.length}{" "}
                          {sale.tickets.length === 1 ? "boleto" : "boletos"}
                          {sale.status !== "confirmed" ? " solicitados" : ""}
                        </small>
                      </td>
                      <td>
                        <span className="admin-channel-cell">
                          {sale.channel === "web" ? (
                            <Globe size={14} />
                          ) : (
                            <Store size={14} />
                          )}
                          {sale.channel === "web" ? "En línea" : "Taquilla"}
                        </span>
                      </td>
                      <td>
                        <StatusBadge
                          label={saleStatusLabels[sale.status]}
                          tone={
                            sale.status === "confirmed"
                              ? "green"
                              : sale.status === "failed"
                                ? "red"
                                : "neutral"
                          }
                        />
                      </td>
                      <td className="align-right admin-money">
                        {money(saleTotal(sale))}
                        {sale.status !== "confirmed" && (
                          <small className="admin-cell-sub">Sin ingreso</small>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Ver venta ${sale.id}`}
                          onClick={() => setSelected(sale)}
                        >
                          <ArrowUpRight />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No hay ventas con estos filtros"
            description="Ajusta el periodo, el evento o los datos de búsqueda."
          >
            <Button variant="outline" onClick={clear}>
              Restablecer filtros
            </Button>
          </EmptyState>
        )}
        <Pagination
          page={currentPage}
          total={filtered.length}
          pageSize={pageSize}
          onChange={setPage}
        />
      </section>
      <SaleDetail
        sale={selected}
        event={events.find((event) => event.id === selected?.eventId)}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
