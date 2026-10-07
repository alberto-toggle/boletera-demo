"use client";
import { QrCode } from "@ark-ui/react/qr-code";
export interface AdmissionTicketData {
  id: string;
  eventTitle: string;
  dateLabel: string;
  venue: string;
  seatLabel: string;
  orderId: string;
}
export function AdmissionTicket({ ticket }: { ticket: AdmissionTicketData }) {
  return (
    <article className="admission-ticket" data-pdf-ticket>
      <header>
        <strong>boletera.</strong>
        <span>BOLETO DE DEMOSTRACIÓN</span>
      </header>
      <div className="admission-ticket-content">
        <div>
          <p>ACCESO INDIVIDUAL</p>
          <h2>{ticket.eventTitle}</h2>
          <p>{ticket.dateLabel}</p>
          <p>{ticket.venue}</p>
          <hr />
          <h3>{ticket.seatLabel}</h3>
          <small>Compra {ticket.orderId}</small>
          <p className="admission-ticket-disclaimer">
            Sin validez de acceso · No registra asistencia
          </p>
        </div>
        <div className="admission-code">
          <QrCode.Root value={ticket.id} encoding={{ ecc: "M", border: 4 }}>
            <QrCode.Frame aria-label={`QR de demostración ${ticket.id}`}>
              <QrCode.Pattern />
            </QrCode.Frame>
          </QrCode.Root>
          <code>{ticket.id}</code>
        </div>
      </div>
    </article>
  );
}
