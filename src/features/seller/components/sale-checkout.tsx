"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HoldClock } from "./hold-clock";
import { CustomerForm } from "./customer-form";
import { EmailVerification } from "./email-verification";
import { PaymentCollection } from "./payment-collection";
import { PaymentBreakdown } from "./payment-breakdown";
import {
  customerError,
  needsEmailVerification,
  money,
  paid,
  total,
  type BuyerAccountOption,
  type Customer,
  type Sale,
  type SellerEvent,
  type SaleAction,
} from "../model";
const emptyCustomer: Customer = {
  name: "",
  email: "",
  delivery: "email",
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
  onSendCode,
  onVerifyCode,
}: {
  information: ReactNode;
  accounts: BuyerAccountOption[];
  sale: Sale;
  event: SellerEvent;
  onAction: (action: SaleAction) => string | null;
  onSendCode: (email: string) => string | null;
  onVerifyCode: (email: string, code: string) => string | null;
}) {
  const [customer, setCustomer] = useState<Customer>(
    sale.customer ?? emptyCustomer,
  );
  const [step, setStep] = useState<"customer" | "payment">(
    sale.customer && (paid(sale) > 0 || !needsEmailVerification(sale.customer))
      ? "payment"
      : "customer",
  );
  const [error, setError] = useState("");
  const [now, setNow] = useState(sale.createdAt);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const held = ["partial", "terminal", "review"].includes(sale.status);
  const collecting = sale.status === "terminal" || sale.status === "review";
  const remaining = Math.max(0, Math.ceil((sale.expiresAt - now) / 1000));
  const run = (action: SaleAction) => {
    const problem = onAction(action);
    setError(problem ?? "");
    return !problem;
  };
  return (
    <main className="seller-main">
      <Link className="seller-back" href="/operacion/vendedor/ventas">
        <ArrowLeft size={16} />
        Mis ventas
      </Link>
      <div className="seller-heading">
        <div>
          <p className="seller-eyebrow">{sale.id} · 02 / DATOS Y COBRO</p>
          <h1>
            {collecting ? "Confirma el resultado." : "Completa la venta."}
          </h1>
          <p>{event.title}</p>
          {information}
        </div>
      </div>
      <HoldClock
        remainingSeconds={remaining}
        held={held}
        collecting={collecting}
        extended={!!sale.holdExtended}
        onExtend={() => run({ type: "extend" })}
        onDemoShorten={() => {
          setNow(Date.now());
          run({ type: "demo-shorten-hold" });
        }}
      />
      <div className="seller-checkout-grid">
        <section className="seller-panel">
          {!collecting && (
            <div className="seller-tabs">
              <button
                aria-pressed={step === "customer"}
                disabled={paid(sale) > 0}
                onClick={() => setStep("customer")}
              >
                1. Comprador
              </button>
              <button
                aria-pressed={step === "payment"}
                disabled={!sale.customer || needsEmailVerification(customer)}
                onClick={() => {
                  if (paid(sale) > 0 || run({ type: "customer", customer }))
                    setStep("payment");
                }}
              >
                2. Cobro
              </button>
            </div>
          )}
          {!collecting && paid(sale) > 0 && needsEmailVerification(customer) ? (
            <EmailVerification
              email={customer.email.trim()}
              accountName={customer.accountEmail ? customer.name : undefined}
              verified={false}
              onSend={() => onSendCode(customer.email.trim())}
              onVerify={(code) => {
                const error = onVerifyCode(customer.email.trim(), code);
                if (!error)
                  setCustomer({
                    ...customer,
                    verifiedEmail: customer.email.trim(),
                  });
                return error;
              }}
            />
          ) : !collecting && step === "customer" ? (
            <CustomerForm
              accounts={accounts}
              customer={customer}
              count={sale.seats.length}
              onChange={(next) => {
                setCustomer({
                  ...next,
                  verifiedEmail:
                    next.email.trim() === customer.email.trim() &&
                    next.accountEmail === customer.accountEmail
                      ? next.verifiedEmail
                      : undefined,
                });
                setError("");
              }}
              verification={
                customer.email.trim() ? (
                  <EmailVerification
                    key={`${customer.accountEmail ?? "guest"}-${customer.email.trim()}`}
                    accountName={
                      customer.accountEmail ? customer.name : undefined
                    }
                    onCorrect={() => {
                      setCustomer({
                        ...customer,
                        email: "",
                        verifiedEmail: undefined,
                        ...(customer.accountEmail
                          ? { accountEmail: undefined, name: "" }
                          : {}),
                      });
                    }}
                    email={customer.email.trim()}
                    verified={!needsEmailVerification(customer)}
                    onSend={() => onSendCode(customer.email.trim())}
                    onVerify={(code) => {
                      const problem = onVerifyCode(customer.email.trim(), code);
                      if (!problem)
                        setCustomer({
                          ...customer,
                          verifiedEmail: customer.email.trim(),
                        });
                      return problem;
                    }}
                  />
                ) : null
              }
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
            <PaymentCollection
              key={`${sale.id}-${sale.payments.length}-${sale.status}`}
              sale={sale}
              onAction={run}
            />
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
            {sale.seats.map((seat) => (
              <div key={seat.id}>
                <span>{seat.label}</span>
                <strong>{money(seat.amountMinor)}</strong>
              </div>
            ))}
          </div>
          <div className="seller-total">
            <span>{sale.seats.length} boletos · Total MXN</span>
            <strong>{money(total(sale))}</strong>
          </div>
          <small>Sin cargos adicionales en esta demo.</small>
          <PaymentBreakdown sale={sale} />
          {sale.status === "partial" && (
            <p className="seller-muted">
              Hay pagos registrados. Puedes retomar esta operación desde Mis
              ventas; los lugares permanecen retenidos.
            </p>
          )}
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
