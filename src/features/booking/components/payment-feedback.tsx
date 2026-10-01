"use client";
// Confirmation composition and deterministic confetti adapted from playground's
// 21st-dev/ticket-confirmation-card (user-supplied source; author unspecified).
import { useEffect, useState } from "react";
import { Check, CreditCard, Ticket, ShieldCheck } from "lucide-react";
import type { DemoOrder } from "../model";
import { formatPrice } from "@/features/event-discovery/model";

export const PAYMENT_ANIMATION_MS = 2800;
const stages = [
  "Revisando tus lugares",
  "Simulando el pago",
  "Preparando el resultado",
];
export function PaymentProcessing() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const first = setTimeout(() => setStage(1), 850);
    const second = setTimeout(() => setStage(2), 1750);
    return () => {
      clearTimeout(first);
      clearTimeout(second);
    };
  }, []);
  return (
    <section
      className="payment-processing"
      aria-busy="true"
      aria-label="Pago simulado en proceso"
    >
      <div className="payment-orbit" aria-hidden="true">
        <CreditCard size={36} />
        <i />
      </div>
      <p className="eyebrow">ESTAMOS PREPARANDO TU EXPERIENCIA</p>
      <h2 role="status" aria-live="polite">
        {stages[stage]}…
      </h2>
      <p>Un momento. Tus lugares siguen apartados.</p>
      <ol>
        {stages.map((label, index) => (
          <li key={label} aria-current={stage === index ? "step" : undefined}>
            <span>{index < stage ? <Check size={16} /> : index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <small>Simulación de demostración. No se realiza ningún cargo.</small>
    </section>
  );
}
const confetti = Array.from({ length: 38 }, (_, i) => ({
  left: `${(i * 37.7) % 100}%`,
  backgroundColor: ["var(--accent-tone)", "var(--ink)", "#bc9463"][i % 3],
  animationDuration: `${2.1 + (i % 7) * 0.16}s`,
  animationDelay: `${(i % 6) * 0.1}s`,
}));
export function PaymentSuccess({ order }: { order: DemoOrder }) {
  return (
    <div className="confirmation-heading payment-success">
      <div className="payment-confetti" aria-hidden="true">
        {confetti.map((style, index) => (
          <i key={index} style={style} />
        ))}
      </div>
      <div className="success-seal" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="29" />
          <path d="m18 32 10 10 19-21" />
        </svg>
      </div>
      <p className="eyebrow">YA ERES PARTE DEL ENCUENTRO</p>
      <h2>Compra de prueba confirmada.</h2>
      <p>
        {order.buyer.name},{" "}
        {order.tickets.length === 1
          ? "tu lugar está listo"
          : "tus lugares están listos"}
        . Ahora comienza la cuenta regresiva.
      </p>
      <div className="success-facts">
        <span>
          <Ticket size={18} />
          {order.tickets.length}{" "}
          {order.tickets.length === 1 ? "boleto con QR" : "boletos con QR"}
        </span>
        <span>
          <ShieldCheck size={18} />
          {formatPrice({ amountMinor: order.amountMinor, currency: "MXN" })} MXN
          · simulado
        </span>
      </div>
      <small>Orden {order.id}</small>
      <a className="demo-button" href="#tus-boletos">
        Ver mis boletos ↓
      </a>
    </div>
  );
}
