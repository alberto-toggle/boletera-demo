"use client";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { DonutChart } from "../charts/donut-chart";
import { RevenueArea } from "../charts/revenue-area";
import { PaymentBars } from "../charts/payment-bars";
import { chartColors } from "../charts/chart-tokens";
import { AdminSelect, EmptyState } from "../components/controls";
import { money, number, type AdminSale, type DateRange } from "../model";
import { DEMO_TODAY } from "../demo/fixtures";
import { activityRange } from "./analytics-data";
import { adminDemoSellers } from "../demo/sellers";
import { salesSummary } from "./selectors";
import { activitySeries, paymentSeries, revenueSeries } from "./analytics-data";
const ActivitySkyline = dynamic(() => import("../charts/activity-skyline"), {
  ssr: false,
  loading: () => (
    <div className="admin-activity-loading" role="status">
      Preparando actividad de ventas…
    </div>
  ),
});

export function SalesAnalytics({
  sales,
  range,
}: {
  sales: readonly AdminSale[];
  range: DateRange;
}) {
  const reduced = useReducedMotion();
  const [seller, setSeller] = useState("all");
  const [activityDays, setActivityDays] = useState("365");
  const historyRange = activityRange(DEMO_TODAY, Number(activityDays));
  const [view, setView] = useState<"2d" | "3d">("3d");
  const summary = salesSummary(sales, range);
  const points = revenueSeries(summary.confirmed, range);
  const payments = paymentSeries(summary.confirmed);
  const activitySales = salesSummary(sales, historyRange).confirmed.filter(
    (sale) =>
      seller === "all" ||
      (seller === "box-office"
        ? sale.channel === "box-office"
        : sale.sellerId === seller),
  );
  const activity = activitySeries(activitySales);
  const periodLabel = `${historyRange.from} — ${historyRange.to}`;
  const channels = summary.channels.map((item) => ({
    value: item.revenue,
    label: item.channel === "web" ? "En línea" : "Taquilla",
    color: item.channel === "web" ? chartColors.web : chartColors.boxOffice,
  }));
  const empty = (
    <EmptyState
      title="Sin ventas confirmadas"
      description="Selecciona otro periodo para explorar la actividad."
    />
  );
  return (
    <div className="admin-analytics">
      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-chart-kicker">EVOLUCIÓN DE INGRESOS</span>
              <h2>Cada día cuenta</h2>
              <p>Ventas confirmadas · MXN</p>
            </div>
            <div className="admin-chart-legend">
              {channels.map((item) => (
                <span key={item.label}>
                  <i style={{ background: item.color }} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          {summary.confirmed.length ? <RevenueArea points={points} /> : empty}
          <details className="admin-chart-data">
            <summary>Ver datos por día</summary>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>En línea</th>
                    <th>Taquilla</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.date}>
                      <td>{point.date}</td>
                      <td>{money(point.web)}</td>
                      <td>{money(point.boxOffice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-chart-kicker">DISTRIBUCIÓN</span>
              <h2>Dos formas de llegar</h2>
              <p>Participación en los ingresos</p>
            </div>
            <ArrowUpRight size={17} />
          </div>
          {summary.revenue ? (
            <div className="admin-channel-donut">
              <DonutChart
                data={channels}
                size={190}
                strokeWidth={22}
                animationDuration={reduced ? 0 : 0.9}
                animationDelayPerSegment={reduced ? 0 : 0.1}
                centerContent={
                  <div className="admin-donut-center">
                    <span>{number(summary.confirmed.length)}</span>
                    <small>ventas confirmadas</small>
                  </div>
                }
              />
            </div>
          ) : (
            empty
          )}
          <div className="admin-chart-breakdown">
            {summary.channels.map((item, index) => (
              <div key={item.channel}>
                <span>
                  <i style={{ background: channels[index]?.color }} />
                  {item.channel === "web" ? "En línea" : "Taquilla"}
                </span>
                <strong>
                  {money(item.revenue)}
                  <small>
                    {summary.revenue
                      ? Math.round((item.revenue / summary.revenue) * 100)
                      : 0}
                    % · {number(item.tickets)} boletos
                  </small>
                </strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="admin-dashboard-grid admin-analytics-secondary">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-chart-kicker">MÉTODOS DE PAGO</span>
              <h2>Cómo se está pagando</h2>
              <p>Importes cobrados, incluyendo pagos divididos</p>
            </div>
          </div>
          {summary.revenue ? <PaymentBars data={payments} /> : empty}
          <div className="admin-payment-totals">
            {payments.map((item) => (
              <div key={item.method}>
                <span>{item.label}</span>
                <strong>{money(item.amount)}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="admin-panel admin-insight-card">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-chart-kicker">EL PERIODO EN CIFRAS</span>
              <h2>Más allá del ingreso</h2>
              <p>Solo compras confirmadas</p>
            </div>
            <CalendarDays size={18} />
          </div>
          <div className="admin-insight-grid">
            <div>
              <span>Promedio por compra</span>
              <strong>{money(summary.average)}</strong>
            </div>
            <div>
              <span>Boletos por compra</span>
              <strong>
                {summary.confirmed.length
                  ? (summary.tickets / summary.confirmed.length).toLocaleString(
                      "es-MX",
                      { maximumFractionDigits: 1 },
                    )
                  : "0"}
              </strong>
            </div>
            <div>
              <span>Días con ventas</span>
              <strong>
                {points.filter((p) => p.web + p.boxOffice > 0).length}
                <small> / {points.length}</small>
              </strong>
            </div>
            <div>
              <span>Boletos vendidos</span>
              <strong>{number(summary.tickets)}</strong>
            </div>
          </div>
          <p className="admin-insight-note">
            Los pagos rechazados y las operaciones expiradas no suman ingresos
            ni boletos vendidos.
          </p>
        </section>
      </div>
      <section className="admin-panel admin-activity-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="admin-chart-kicker">ACTIVIDAD DE VENTAS</span>
            <h2>El ritmo de tu operación</h2>
            <p>
              Cada bloque representa un día. Su altura muestra las ventas
              confirmadas. Periodo propio, independiente del resumen superior.
            </p>
          </div>
          <div className="admin-activity-filters">
            <AdminSelect
              label="Periodo de actividad"
              value={activityDays}
              onChange={setActivityDays}
              options={[
                { value: "90", label: "Últimos 90 días" },
                { value: "180", label: "Últimos 180 días" },
                { value: "365", label: "Últimos 12 meses" },
              ]}
            />
            <AdminSelect
              label="Vendedor de actividad"
              value={seller}
              onChange={setSeller}
              options={[
                { value: "all", label: "Todos los canales" },
                { value: "box-office", label: "Toda la taquilla" },
                ...adminDemoSellers,
              ]}
            />
          </div>
        </div>
        <ActivitySkyline
          data={activity}
          endDate={historyRange.to}
          startDate={historyRange.from}
          palette={[...chartColors.activity]}
          view={view}
          onViewChange={setView}
          duration={reduced ? 0 : 1100}
          unit="venta"
          unitPlural="ventas"
          locale="es-MX"
          weekStart={1}
          showStats
          title={`${number(activitySales.length)} ventas · ${periodLabel}`}
          footer="Actividad del periodo seleccionado. Arrastra para girar; toca un día o usa las flechas para ver su detalle."
        />
        {!activitySales.length && (
          <p className="admin-activity-empty" role="status">
            Sin ventas para este vendedor y periodo.
          </p>
        )}
      </section>
    </div>
  );
}
