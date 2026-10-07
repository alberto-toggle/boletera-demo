"use client";
import { useState } from "react";
import { Banknote, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  balance,
  money,
  parseCash,
  type Sale,
  type SaleAction,
} from "../model";
export function PaymentCollection({
  sale,
  onAction,
}: {
  sale: Sale;
  onAction: (action: SaleAction) => boolean;
}) {
  const method = sale.paymentDraft?.method ?? "cash";
  const amount = sale.paymentDraft?.amount ?? (balance(sale) / 100).toFixed(2);
  const received = sale.paymentDraft?.received ?? "";
  const reference = sale.paymentDraft?.reference ?? "";
  const saveDraft = (patch: Partial<import("../model").PaymentDraft>) =>
    onAction({
      type: "payment-draft",
      draft: { method, amount, received, reference, ...patch },
    });
  const setMethod = (method: "cash" | "terminal") => saveDraft({ method });
  const setAmount = (amount: string) => saveDraft({ amount });
  const setReceived = (received: string) => saveDraft({ received });
  const setReference = (reference: string) => saveDraft({ reference });
  const [confirmed, setConfirmed] = useState(false);
  const inTerminal = sale.status === "terminal" || sale.status === "review";
  const amountMinor = parseCash(amount);
  const validAmount = amountMinor > 0 && amountMinor <= balance(sale);
  if (inTerminal)
    return (
      <>
        <p className="seller-eyebrow">TERMINAL INDEPENDIENTE</p>
        <h2>
          {sale.status === "review"
            ? "Revisa este cobro"
            : "Registra el resultado"}
        </h2>
        <p>
          Importe de este cobro:{" "}
          <strong>{money(sale.pendingTerminal?.amountMinor ?? 0)}</strong>.
        </p>
        <div className="seller-notice">
          <ShieldCheck size={22} />
          <span>
            Verifica el comprobante de la terminal. Si el resultado es incierto,
            no vuelvas a cobrar. Los lugares siguen retenidos.
          </span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (confirmed) onAction({ type: "approve", reference });
          }}
        >
          <label>
            Referencia del comprobante
            <input
              required
              maxLength={80}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Folio o número de autorización"
            />
          </label>
          <button
            data-demo
            type="button"
            className="seller-text-button"
            onClick={() =>
              setReference(
                `DEMO-${sale.id.slice(3)}-${sale.payments.length + 1}`,
              )
            }
          >
            Usar referencia de ejemplo
          </button>
          <label className="seller-check">
            <input
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Confirmo que la terminal aprobó este importe.
          </label>
          <Button
            type="submit"
            className="seller-primary"
            disabled={!confirmed || !reference.trim()}
          >
            Registrar cobro aprobado
          </Button>
        </form>
        <div className="seller-actions">
          <Button
            variant="outline"
            onClick={() => {
              if (
                window.confirm(
                  "¿Confirmas que este cobro no se realizó? Los cobros anteriores se conservarán.",
                )
              )
                onAction({ type: "unpaid" });
            }}
          >
            Pago rechazado / no realizado
          </Button>
          {sale.status === "terminal" && (
            <button
              className="seller-text-button"
              onClick={() => onAction({ type: "review" })}
            >
              Dejar pendiente de revisión
            </button>
          )}
        </div>
      </>
    );
  return (
    <>
      <h2>
        {sale.payments.length
          ? "Completa el saldo pendiente"
          : "Elige cómo cobrar"}
      </h2>
      <p>
        Puedes combinar efectivo y una o varias tarjetas. Registra cada cobro
        por separado.
      </p>
      <div className="seller-payment-options">
        <button
          aria-pressed={method === "cash"}
          onClick={() => {
            setMethod("cash");
            setConfirmed(false);
          }}
        >
          <Banknote />
          Efectivo
        </button>
        <button
          aria-pressed={method === "terminal"}
          onClick={() => {
            setMethod("terminal");
            setConfirmed(false);
          }}
        >
          <CreditCard />
          Tarjeta en terminal
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!validAmount) return;
          if (method === "terminal")
            onAction({ type: "terminal", amountMinor });
          else if (confirmed)
            onAction({
              type: "cash",
              amountMinor,
              receivedMinor: parseCash(received),
            });
        }}
      >
        <label>
          Importe a aplicar (MXN)
          <input
            required
            type="number"
            min="0.01"
            max={balance(sale) / 100}
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setConfirmed(false);
            }}
          />
        </label>
        <button
          className="seller-text-button"
          type="button"
          onClick={() => setAmount((balance(sale) / 100).toFixed(2))}
        >
          Usar saldo pendiente · {money(balance(sale))}
        </button>
        {method === "cash" ? (
          <>
            <label>
              Efectivo recibido (MXN)
              <input
                required
                type="number"
                min={amountMinor / 100}
                step="0.01"
                value={received}
                onChange={(e) => {
                  setReceived(e.target.value);
                  setConfirmed(false);
                }}
              />
            </label>
            <button
              type="button"
              className="seller-text-button"
              onClick={() => setReceived((amountMinor / 100).toFixed(2))}
            >
              Importe exacto
            </button>
            <div className="seller-change">
              <span>Cambio a entregar</span>
              <strong>
                {money(Math.max(0, parseCash(received) - amountMinor))}
              </strong>
            </div>
            <label className="seller-check">
              <input
                required
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              Confirmo que recibí el efectivo y revisé este importe.
            </label>
            <Button
              className="seller-primary"
              type="submit"
              disabled={
                !validAmount || !confirmed || parseCash(received) < amountMinor
              }
            >
              {amountMinor === balance(sale)
                ? "Confirmar venta"
                : "Registrar pago parcial"}{" "}
              · {money(amountMinor)}
            </Button>
          </>
        ) : (
          <>
            <p className="seller-notice">
              Cobra este importe en la terminal física y registra después su
              referencia. No hay conexión con la terminal.
            </p>
            <Button
              className="seller-primary"
              type="submit"
              disabled={!validAmount}
            >
              Iniciar cobro en terminal
            </Button>
          </>
        )}
      </form>
      <p className="seller-muted">
        Los boletos se emitirán cuando el saldo pendiente sea $0.00.
      </p>
    </>
  );
}
