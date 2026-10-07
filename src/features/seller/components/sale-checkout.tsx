"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { CustomerForm } from "./customer-form";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CreditCard,
  Timer,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  customerError,
  money,
  parseCash,
  total,
  type BuyerAccountOption,
  type Customer,
  type Sale,
  type SellerEvent,
} from "../model";
import type { SaleAction } from "../model";
const emptyCustomer: Customer = {
  name: "",
  email: "",
  delivery: "print",
  audience: "public",
  registration: "",
  militaryCount: 0,
};
export function SaleCheckout({
  information,
  accounts,
  sale,
  event,
  onAction,
}: {
  information: ReactNode;
  accounts: BuyerAccountOption[];
  sale: Sale;
  event: SellerEvent;
  onAction: (action: SaleAction) => string | null;
}) {
  const [customer, setCustomer] = useState<Customer>(
    sale.customer ?? emptyCustomer,
  );
  const [step, setStep] = useState<"customer" | "payment">(
    sale.customer ? "payment" : "customer",
  );
  const [method, setMethod] = useState<"cash" | "terminal">("cash");
  const [received, setReceived] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [now, setNow] = useState(sale.createdAt);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const held = ["terminal", "review"].includes(sale.status);
  const remaining = Math.max(0, Math.ceil((sale.expiresAt - now) / 1000));
  const run = (action: SaleAction) => {
    const problem = onAction(action);
    setError(problem ?? "");
    return !problem;
  };
  return (
    <main className="seller-main">
      <Link className="seller-back" href="/operacion/vendedor/ventas">
        <ArrowLeft size={16} /> Mis ventas
      </Link>
      <div className="seller-heading">
        <div>
          <p className="seller-eyebrow">{sale.id} · 02 / DATOS Y COBRO</p>
          <h1>{held ? "Confirma el resultado." : "Completa la venta."}</h1>
          <p>{event.title}</p>
          {information}
        </div>
        <div
          className="seller-clock"
          role="timer"
          aria-label={
            held
              ? "Lugares retenidos durante el cobro"
              : `Tiempo restante ${Math.floor(remaining / 60)} minutos ${remaining % 60} segundos`
          }
        >
          <Timer size={21} />
          {held ? (
            <span>
              Lugares retenidos
              <br />
              <small>Hasta aclarar el cobro</small>
            </span>
          ) : (
            <>
              <span>Tiempo de apartado</span>
              <strong>
                {Math.floor(remaining / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(remaining % 60).toString().padStart(2, "0")}
              </strong>
            </>
          )}
        </div>
      </div>
      <div className="seller-checkout-grid">
        <section className="seller-panel">
          {held ? (
            <>
              <p className="seller-eyebrow">TERMINAL INDEPENDIENTE</p>
              <h2>
                {sale.status === "review"
                  ? "Esta operación necesita revisión"
                  : "Registra el cobro de tu terminal"}
              </h2>
              <p>
                Cobra <strong>{money(total(sale))}</strong> en tu terminal. Esta
                aplicación no está conectada con ella.
              </p>
              <div className="seller-notice">
                <ShieldCheck size={22} />
                <span>
                  Los lugares permanecen retenidos. Verifica el comprobante
                  antes de confirmar; no vuelvas a cobrar si el resultado es
                  incierto.
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (confirmed) run({ type: "approve", reference });
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
                  type="button"
                  className="seller-text-button"
                  onClick={() => setReference(`DEMO-${sale.id.slice(3)}`)}
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
                  Confirmo que la terminal aprobó el cobro por{" "}
                  {money(total(sale))}.
                </label>
                <Button
                  className="seller-primary"
                  type="submit"
                  disabled={!confirmed || !reference.trim()}
                >
                  Registrar cobro aprobado <ArrowRight size={17} />
                </Button>
              </form>
              <div className="seller-actions">
                <button
                  className="seller-secondary"
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Confirmas que no se realizó ningún cobro? Se abrirá un nuevo apartado de cinco minutos.",
                      )
                    ) {
                      run({ type: "unpaid" });
                      setMethod("terminal");
                      setConfirmed(false);
                    }
                  }}
                >
                  Pago rechazado / no realizado
                </button>
                {sale.status === "terminal" && (
                  <button
                    className="seller-text-button"
                    onClick={() => run({ type: "review" })}
                  >
                    Dejar pendiente de revisión
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="seller-tabs">
                <button
                  aria-pressed={step === "customer"}
                  onClick={() => setStep("customer")}
                >
                  1. Comprador
                </button>
                <button
                  aria-pressed={step === "payment"}
                  disabled={!sale.customer}
                  onClick={() => setStep("payment")}
                >
                  2. Cobro
                </button>
              </div>
              {step === "customer" ? (
                <CustomerForm
                  accounts={accounts}
                  customer={customer}
                  count={sale.seats.length}
                  onChange={setCustomer}
                  onContinue={() => {
                    const problem = customerError(customer, sale.seats.length);
                    if (problem) {
                      setError(problem);
                      return;
                    }
                    if (run({ type: "customer", customer })) setStep("payment");
                  }}
                />
              ) : (
                <>
                  <h2>Elige cómo cobrar</h2>
                  <p>
                    {customer.name} ·{" "}
                    {customer.delivery === "print"
                      ? "Entrega impresa"
                      : customer.email}
                  </p>
                  <div className="seller-payment-options">
                    <button
                      aria-pressed={method === "cash"}
                      onClick={() => {
                        setMethod("cash");
                        setConfirmed(false);
                      }}
                    >
                      <Banknote /> Efectivo
                    </button>
                    <button
                      aria-pressed={method === "terminal"}
                      onClick={() => {
                        setMethod("terminal");
                        setConfirmed(false);
                      }}
                    >
                      <CreditCard /> Tarjeta en terminal
                    </button>
                  </div>
                  {method === "cash" ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (confirmed)
                          run({
                            type: "cash",
                            customer,
                            receivedMinor: parseCash(received),
                          });
                      }}
                    >
                      <label>
                        Efectivo recibido (MXN)
                        <input
                          inputMode="decimal"
                          required
                          type="number"
                          min={total(sale) / 100}
                          step="0.01"
                          value={received}
                          onChange={(e) => setReceived(e.target.value)}
                          placeholder="0.00"
                        />
                      </label>
                      <button
                        type="button"
                        className="seller-text-button"
                        onClick={() =>
                          setReceived((total(sale) / 100).toFixed(2))
                        }
                      >
                        Importe exacto
                      </button>
                      <div className="seller-change">
                        <span>Cambio a entregar</span>
                        <strong>
                          {money(
                            Math.max(0, parseCash(received) - total(sale)),
                          )}
                        </strong>
                      </div>
                      <label className="seller-check">
                        <input
                          type="checkbox"
                          required
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                        />
                        Confirmo que recibí el efectivo y revisé los lugares.
                      </label>
                      <Button
                        type="submit"
                        className="seller-primary"
                        disabled={
                          !confirmed || parseCash(received) < total(sale)
                        }
                      >
                        Confirmar venta · {money(total(sale))}
                      </Button>
                    </form>
                  ) : (
                    <>
                      <div className="seller-notice">
                        <CreditCard size={24} />
                        <span>
                          Captura el importe en tu terminal física. Después
                          registra aquí el resultado y la referencia del
                          comprobante.
                        </span>
                      </div>
                      <Button
                        className="seller-primary"
                        onClick={() => run({ type: "terminal", customer })}
                      >
                        Iniciar cobro en terminal <ArrowRight size={17} />
                      </Button>
                      <p className="seller-muted">
                        Los lugares se mantendrán retenidos hasta que registres
                        el resultado.
                      </p>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {error && (
            <p className="seller-error" role="alert">
              {error}
            </p>
          )}
        </section>
        <aside className="seller-panel seller-order-summary">
          <p className="seller-eyebrow">RESUMEN DE VENTA</p>
          <h2>{event.title}</h2>
          <p>{event.venue}</p>
          <div className="seller-summary-seats">
            {sale.seats.map((s) => (
              <div key={s.id}>
                <span>{s.label}</span>
                <strong>{money(s.amountMinor)}</strong>
              </div>
            ))}
          </div>
          <div className="seller-total">
            <span>{sale.seats.length} boletos · Total MXN</span>
            <strong>{money(total(sale))}</strong>
          </div>
          <small>Sin cargos adicionales en esta demo.</small>
          {sale.status === "pending" && (
            <button
              className="seller-text-button seller-danger"
              onClick={() => {
                if (
                  window.confirm(
                    "¿Cancelar esta operación sin cobro y liberar los lugares?",
                  )
                )
                  run({ type: "cancel" });
              }}
            >
              Cancelar operación
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}
