"use client";
import { useEffect, useRef, useState } from "react";
import { Download, Eye, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DemoOrder, DemoTicket } from "./model";

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
  documentKey,
  getTicketElement,
  onBusyChange,
}: {
  order: DemoOrder;
  designName: string;
  documentKey: string;
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
  const [progress, setProgress] = useState("");
  const inFlight = useRef(false);
  // In-memory only; preview and download share the same finished document.
  // Bound retained documents to avoid accumulating high-resolution exports.
  const cache = useRef(new Map<string, Blob>());
  const [error, setError] = useState("");
  async function download(
    tickets: readonly DemoTicket[],
    filename: string,
    showPreview = false,
  ) {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setProgress("Preparando el diseño de tus boletos…");
    onBusyChange(true);
    setError("");
    try {
      // Paint the immediate feedback even when the generator is already loaded.
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => setTimeout(resolve, 0)),
      );
      const elements = tickets.map(getTicketElement);
      const key = JSON.stringify([
        documentKey,
        designName,
        tickets.map((ticket) => ticket.id),
        elements.map((element) => {
          const { width, height } = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const tokens = Array.from(style)
            .filter((property) => property.startsWith("--"))
            .sort()
            .map((property) => [property, style.getPropertyValue(property)]);
          return [width, height, style.fontFamily, tokens];
        }),
      ]);
      let blob = cache.current.get(key);
      if (!blob) {
        const { createTicketPdf } = await import("./ticket-pdf");
        const pdf = await createTicketPdf(elements, setProgress);
        blob = pdf.output("blob");
        cache.current.set(key, blob);
        let bytes = [...cache.current.values()].reduce(
          (sum, item) => sum + item.size,
          0,
        );
        for (const [oldKey, oldBlob] of cache.current) {
          if (cache.current.size <= 4 && bytes <= 32 * 1024 * 1024) break;
          cache.current.delete(oldKey);
          bytes -= oldBlob.size;
        }
      }
      filename = `${filename}-${designName}`;
      if (showPreview) setPreview({ url: URL.createObjectURL(blob), filename });
      else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.pdf`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }
    } catch {
      setError("No pudimos preparar el PDF. Intenta descargarlo de nuevo.");
    } finally {
      setBusy(false);
      setProgress("");
      inFlight.current = false;
      onBusyChange(false);
    }
  }
  return (
    <div className="ticket-downloads">
      <div
        className="ticket-pdf-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {busy && (
          <>
            <LoaderCircle size={20} aria-hidden="true" />
            <span>
              {progress}
              <small>El PDF se abrirá o descargará al terminar.</small>
            </span>
          </>
        )}
      </div>
      <Button
        variant="outline"
        disabled={busy}
        onClick={() => download(order.tickets, order.id, true)}
      >
        <Eye size={18} /> {busy ? "Generando PDF…" : "Previsualizar PDF"}
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
