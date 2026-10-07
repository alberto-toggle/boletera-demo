import { CheckCircle2, Globe, Store, Mail, CalendarDays } from "lucide-react";
import { AdminDialog, StatusBadge } from "../components/controls";
import {
  dateLabel,
  money,
  paymentLabels,
  saleStatusLabels,
  saleTotal,
  type AdminEvent,
  type AdminSale,
} from "../model";
export function SaleDetail({
  sale,
  event,
  onClose,
}: {
  sale: AdminSale | null;
  event?: AdminEvent;
  onClose: () => void;
}) {
  return (
    <AdminDialog
      open={Boolean(sale)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={sale ? `Venta ${sale.id}` : "Detalle de venta"}
      description={event?.title}
    >
      {sale && (
        <>
          <div className="admin-sale-detail-top">
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
            <span>
              {sale.channel === "web" ? (
                <Globe size={14} />
              ) : (
                <Store size={14} />
              )}
              {sale.channel === "web" ? "En línea" : "Taquilla"}
            </span>
          </div>
          <div className="admin-buyer">
            <span className="admin-avatar">
              {sale.buyer.name
                .split(" ")
                .slice(0, 2)
                .map((name) => name[0])
                .join("")}
            </span>
            <div>
              <h3>{sale.buyer.name}</h3>
              <p>
                <Mail size={13} />
                {sale.buyer.email}
              </p>
            </div>
          </div>
          <p className="admin-sale-date">
            <CalendarDays size={14} />
            {dateLabel(sale.createdAt, true)} · CDMX
          </p>
          <dl className="admin-review-list">
            <div>
              <dt>Perfil del comprador</dt>
              <dd>
                {sale.buyer.kind === "military" ? "Militar" : "Público general"}
              </dd>
            </div>
            <div>
              <dt>Asistentes</dt>
              <dd>
                {sale.militaryCount} militares ·{" "}
                {sale.tickets.length - sale.militaryCount} público general
              </dd>
            </div>
          </dl>
          <h3>
            {sale.status === "confirmed"
              ? "Boletos de esta compra"
              : "Lugares solicitados"}
          </h3>
          <div className="admin-ticket-list">
            {sale.tickets.map((ticket) => (
              <div key={ticket.id}>
                <span>
                  <strong>
                    Zona {ticket.zoneId} · {ticket.seat}
                  </strong>
                  <small>
                    {sale.status === "confirmed"
                      ? ticket.id
                      : "Sin boleto emitido"}
                  </small>
                </span>
                <strong>{money(ticket.priceMinor)}</strong>
              </div>
            ))}
          </div>
          <div className="admin-sale-total">
            <span>
              {sale.status === "confirmed"
                ? "Total de la venta"
                : "Importe solicitado"}
            </span>
            <strong>
              {money(saleTotal(sale))} <small>MXN</small>
            </strong>
          </div>
          <h3>Desglose de pago</h3>
          {sale.payments.length ? (
            <div className="admin-payment-list">
              {sale.payments.map((payment) => (
                <div key={payment.reference}>
                  <CheckCircle2 size={16} />
                  <span>
                    {paymentLabels[payment.method]}
                    <small>Referencia: {payment.reference}</small>
                  </span>
                  <strong>{money(payment.amountMinor)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-note">
              Esta operación no generó ingresos ni emitió boletos.
            </p>
          )}
          {sale.status === "confirmed" && (
            <p className="admin-note">
              Venta confirmada no equivale a asistencia. El acceso se registra
              por separado al ingresar al evento.
            </p>
          )}
        </>
      )}
    </AdminDialog>
  );
}
