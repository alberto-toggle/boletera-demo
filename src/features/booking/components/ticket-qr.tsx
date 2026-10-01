"use client";
import { QrCode } from "@ark-ui/react/qr-code";
import type { DemoTicket } from "../model";

/** Encodes only the ticket identifier. No buyer data or external QR service. */
export function TicketQr({ ticket }: { ticket: DemoTicket }) {
  return (
    <div className="ticket-qr">
      <QrCode.Root value={ticket.id} encoding={{ ecc: "M", border: 4 }}>
        <QrCode.Frame
          role="img"
          aria-label={`QR del boleto de demostración ${ticket.id}`}
        >
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.Root>
      <span>QR DE DEMOSTRACIÓN</span>
      <code>{ticket.id}</code>
    </div>
  );
}
