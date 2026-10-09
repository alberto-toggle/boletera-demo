"use client";
import { CheckCircle2, ShieldAlert, ArrowRight, Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { accessTime, type AccessResult } from "@/features/access/model";
export function AccessResultCard({
  result,
  entered,
  busy,
  onConfirm,
  onClose,
}: {
  result: AccessResult | null;
  entered: boolean;
  busy: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!result)
    return (
      <section className="staff-result staff-result-empty">
        <Ticket size={32} strokeWidth={1.4} />
        <h2>Listos para recibir</h2>
        <p>
          Escanea un boleto o búscalo por nombre, correo o código. Aquí verás el
          resultado.
        </p>
      </section>
    );
  const ticket = "ticket" in result ? result.ticket : null;
  const good = result.kind === "ready" || entered;
  return (
    <section
      className="staff-result"
      data-tone={good ? "success" : "warning"}
      role="status"
    >
      <button
        className="staff-result-close"
        aria-label="Cerrar resultado"
        onClick={onClose}
      >
        <X size={18} />
      </button>
      <div className="staff-result-symbol">
        {good ? <CheckCircle2 size={32} /> : <ShieldAlert size={32} />}
      </div>
      <span className="staff-kicker">
        {entered
          ? "INGRESO REGISTRADO"
          : result.kind === "ready"
            ? "BOLETO VÁLIDO"
            : "REVISA ESTE ACCESO"}
      </span>
      <h2>
        {entered
          ? "¡Bienvenido al evento!"
          : result.kind === "ready"
            ? "Todo en orden."
            : result.kind === "used"
              ? "Este boleto ya ingresó"
              : result.kind === "wrong-event"
                ? "Es de otro evento"
                : "Boleto no encontrado"}
      </h2>
      <p>
        {entered
          ? "El primer acceso quedó guardado."
          : result.kind === "ready"
            ? "Confirma el ingreso para marcar este boleto como utilizado."
            : result.kind === "used"
              ? `Primer ingreso: ${accessTime(result.usedAt)}. No se registrará una segunda entrada.`
              : result.kind === "wrong-event"
                ? "Selecciona el evento correspondiente antes de registrar la entrada."
                : "Verifica el código o busca la compra por nombre o correo."}
      </p>
      {ticket && (
        <dl>
          <div>
            <dt>Comprador</dt>
            <dd>{ticket.buyer}</dd>
          </div>
          <div>
            <dt>Lugar</dt>
            <dd>
              Zona {ticket.zone} · {ticket.seat}
            </dd>
          </div>
          <div>
            <dt>Boleto</dt>
            <dd>{ticket.id}</dd>
          </div>
          <div>
            <dt>Compra</dt>
            <dd>{ticket.orderId}</dd>
          </div>
        </dl>
      )}
      {result.kind === "ready" && !entered && (
        <Button onClick={onConfirm} disabled={busy}>
          {busy ? "Registrando…" : "Confirmar ingreso"}
          <ArrowRight size={17} />
        </Button>
      )}
      {entered && (
        <Button variant="outline" onClick={onClose}>
          Siguiente boleto <ArrowRight size={16} />
        </Button>
      )}
    </section>
  );
}
