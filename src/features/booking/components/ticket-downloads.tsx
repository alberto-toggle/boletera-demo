"use client";
import { useEffect, useRef, useState } from "react";
import { Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DemoOrder, DemoTicket } from "../model";

function PdfPreview({
  url,
  filename,
  onClose,
}: {
  url: string;
  filename: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="ticket-pdf-preview"
      aria-labelledby="pdf-preview-title"
      onCancel={onClose}
      onClose={onClose}
    >
      <header>
        <div>
          <h2 id="pdf-preview-title">Previsualización del PDF</h2>
          <p>{filename}.pdf</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Cerrar previsualización"
          onClick={onClose}
        >
          <X size={22} />
        </Button>
      </header>
      {url && <iframe src={url} title="PDF de tus boletos" />}
      <footer>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Abrir PDF en otra pestaña
        </a>
        <a
          href={url}
          download={`${filename}.pdf`}
          className="pdf-preview-download"
        >
          <Download size={18} /> Descargar PDF
        </a>
      </footer>
    </dialog>
  );
}

export function TicketDownloads({
  order,
  designName,
  getTicketElement,
  onBusyChange,
}: {
  order: DemoOrder;
  designName: string;
  getTicketElement: (ticket: DemoTicket) => HTMLElement;
  onBusyChange: (busy: boolean) => void;
}) {
  const [preview, setPreview] = useState<{
    url: string;
    filename: string;
  } | null>(null);
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview.url);
  }, [preview]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function download(
    tickets: readonly DemoTicket[],
    filename: string,
    showPreview = false,
  ) {
    setBusy(true);
    onBusyChange(true);
    setError("");
    try {
      const { createTicketPdf } = await import("../ticket-pdf");
      const pdf = await createTicketPdf(tickets.map(getTicketElement));
      filename = `${filename}-${designName}`;
      if (showPreview)
        setPreview({ url: URL.createObjectURL(pdf.output("blob")), filename });
      else pdf.save(`${filename}.pdf`);
    } catch {
      setError("No pudimos preparar el PDF. Intenta descargarlo de nuevo.");
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  }
  return (
    <div className="ticket-downloads">
      <Button
        variant="outline"
        disabled={busy}
        onClick={() => download(order.tickets, order.id, true)}
      >
        <Eye size={18} /> Previsualizar PDF
      </Button>
      <Button
        className="demo-button"
        disabled={busy}
        onClick={() => download(order.tickets, order.id)}
      >
        <Download size={18} />
        {busy
          ? "Preparando PDF…"
          : `Descargar ${order.tickets.length === 1 ? "boleto" : "todos los boletos"} en PDF`}
      </Button>
      {order.tickets.length > 1 && (
        <details>
          <summary>Descargar un boleto individual</summary>
          <ul>
            {order.tickets.map((ticket, index) => (
              <li key={ticket.id}>
                <span>{ticket.seatLabel}</span>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => download([ticket], ticket.id, true)}
                >
                  Ver boleto {index + 1}
                </Button>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => download([ticket], ticket.id)}
                >
                  PDF · Boleto {index + 1}
                </Button>
              </li>
            ))}
          </ul>
        </details>
      )}
      {error && <p role="alert">{error}</p>}
      {preview && <PdfPreview {...preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
