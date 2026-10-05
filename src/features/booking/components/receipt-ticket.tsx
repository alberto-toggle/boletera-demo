"use client";

import { useId, useState } from "react";
import { QrCode } from "@ark-ui/react/qr-code";
import styles from "./receipt-ticket.module.css";

export interface ReceiptTicketData {
  id: string;
  event: string;
  occasion: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  section: string;
  table: string;
  seat: string;
  holder: string;
  groupLabel?: "MESA" | "FILA";
  amountMinor: number;
  currency: "MXN";
}

interface ReceiptTicketProps {
  ticket: ReceiptTicketData;
  orientation?: "vertical" | "horizontal";
}

export function ReceiptTicket({
  ticket,
  orientation = "vertical",
}: ReceiptTicketProps) {
  const [detached, setDetached] = useState(false);
  const headingId = useId();
  const stubId = useId();
  const amount = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: ticket.currency,
  }).format(ticket.amountMinor / 100);

  return (
    <div className={styles.wrapper} data-orientation={orientation}>
      <article
        data-pdf-ticket
        className={styles.ticket}
        aria-labelledby={headingId}
        data-detached={detached}
      >
        <div className={styles.body}>
          <header className={styles.header}>
            <p className={styles.brand}>BOLETERA</p>
            <p className={styles.micro}>
              ENTRADA INDIVIDUAL · EDICIÓN ESPECIAL
            </p>
          </header>
          <div className={styles.event}>
            <p className={styles.micro}>{ticket.occasion}</p>
            <h3 id={headingId}>{ticket.event}</h3>
            <span className={styles.stamp}>CONFIRMADO</span>
          </div>
          <dl className={styles.details}>
            <Detail label="FECHA" value={ticket.date} />
            <Detail label="APERTURA" value={ticket.time} />
            <Detail label="RECINTO" value={ticket.venue} />
          </dl>
          <p className={styles.address}>{ticket.address}</p>
          <dl className={styles.seats}>
            <div>
              <dt>SECCIÓN</dt>
              <dd>{ticket.section}</dd>
            </div>
            <div>
              <dt>{ticket.groupLabel ?? "MESA"}</dt>
              <dd>{ticket.table}</dd>
            </div>
            <div>
              <dt>LUGAR</dt>
              <dd>{ticket.seat}</dd>
            </div>
          </dl>
          <dl className={styles.details}>
            <Detail label="ASISTENTE" value={ticket.holder} />
            <Detail label="ACCESOS" value="01 PERSONA" />
          </dl>
          <div className={styles.total}>
            <span>TOTAL</span>
            <strong>
              {amount} <small>{ticket.currency}</small>
            </strong>
          </div>
          <p className={styles.micro}>
            CONSERVA TU BOLETO · DISFRUTA LA VELADA
          </p>
          <p className={styles.serial}>NO. {ticket.id}</p>
        </div>
        <div className={styles.stubWrap}>
          <div className={styles.perforation} aria-hidden="true" />
          <div id={stubId} data-pdf-stub className={styles.stub}>
            <p className={styles.micro}>TALÓN DE ACCESO</p>
            <QrCode.Root
              value={ticket.id}
              encoding={{ ecc: "M", border: 4 }}
              className={styles.qr}
            >
              <QrCode.Frame
                role="img"
                aria-label={`Código QR del boleto de demostración ${ticket.id}`}
              >
                <QrCode.Pattern />
              </QrCode.Frame>
            </QrCode.Root>
            <p className={styles.stubSeat}>
              {ticket.groupLabel ?? "MESA"} {ticket.table} · LUGAR {ticket.seat}
            </p>
            <p className={styles.serial}>{ticket.id}</p>
            <span className={styles.demo}>MUESTRA · SIN VALIDEZ DE ACCESO</span>
          </div>
        </div>
      </article>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => setDetached(!detached)}
          aria-controls={stubId}
        >
          {detached ? "Volver a unir el talón" : "Probar desprendimiento"}
        </button>
        <span role="status" className="sr-only">
          {detached ? "Talón desprendido" : "Talón unido"}
        </span>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detail}>
      <dt>{label}</dt>
      <span aria-hidden="true" />
      <dd>{value}</dd>
    </div>
  );
}
