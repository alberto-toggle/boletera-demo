"use client";

// Adapted from shadcn.io checkout-event-tickets: header, buyer area and order summary.
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  CreditCard,
  UserIcon,
} from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  formatEventDate,
  formatPrice,
  type DiscoveryEvent,
} from "@/features/event-discovery/model";
import { demoAccount } from "../fixtures";
import {
  totalForSeats,
  validateBuyer,
  type BookingSeat,
  type Buyer,
} from "../model";

interface CheckoutProps {
  event: DiscoveryEvent;
  seats: readonly BookingSeat[];
  remainingSeconds: number;
  onBack: () => void;
  onExpire: () => void;
  onPay: (
    buyer: Buyer,
    mode: "guest" | "account",
    outcome: "approved" | "declined",
  ) => void;
}
export function Checkout({
  event,
  seats,
  remainingSeconds,
  onBack,
  onPay,
  onExpire,
}: CheckoutProps) {
  const instanceId = useId();
  const [mode, setMode] = useState<"guest" | "account">("guest");
  const [buyer, setBuyer] = useState<Buyer>({ name: "", email: "", phone: "" });
  const [outcome, setOutcome] = useState<"approved" | "declined">("approved");
  const [error, setError] = useState("");
  const currentBuyer = mode === "account" ? demoAccount : buyer;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateBuyer(currentBuyer)) {
      setError(
        "Revisa el nombre, un correo válido y un teléfono de al menos 10 dígitos.",
      );
      return;
    }
    setError("");
    onPay(currentBuyer, mode, outcome);
  }
  const price = { amountMinor: totalForSeats(seats), currency: "MXN" as const };
  return (
    <form className="booking-checkout" onSubmit={submit}>
      <section className="checkout-panel">
        <div className="checkout-section">
          <p className="eyebrow">02 · DATOS Y PAGO</p>
          <h2>Un paso más para estar ahí.</h2>
          <p>Solo necesitamos los datos de quien realiza la compra.</p>
        </div>
        <div className="checkout-section">
          <div
            className="buyer-options"
            role="group"
            aria-label="Modalidad de compra"
          >
            <Button
              type="button"
              variant={mode === "guest" ? "default" : "outline"}
              aria-pressed={mode === "guest"}
              onClick={() => setMode("guest")}
            >
              Como invitado
            </Button>
            <Button
              type="button"
              variant={mode === "account" ? "default" : "outline"}
              aria-pressed={mode === "account"}
              onClick={() => setMode("account")}
            >
              Con cuenta demo
            </Button>
          </div>
          {mode === "account" ? (
            <div className="demo-account">
              <UserIcon size={22} />
              <div>
                <strong>{demoAccount.name}</strong>
                <p>{demoAccount.email}</p>
                <small>
                  Sesión ficticia para mostrar una compra con cuenta.
                </small>
              </div>
            </div>
          ) : (
            <>
              <Button
                type="button"
                variant="link"
                onClick={() => setBuyer(demoAccount)}
              >
                Usar datos de ejemplo
              </Button>
              <div className="buyer-fields">
                {(
                  [
                    ["name", "Nombre completo", "text", "name"],
                    ["email", "Correo electrónico", "email", "email"],
                    ["phone", "Teléfono", "tel", "tel"],
                  ] as const
                ).map(([key, label, type, autoComplete]) => (
                  <div key={key}>
                    <Label htmlFor={`${instanceId}-${key}`}>{label}</Label>
                    <Input
                      id={`${instanceId}-${key}`}
                      type={type}
                      autoComplete={autoComplete}
                      required
                      value={buyer[key]}
                      onChange={(e) =>
                        setBuyer({ ...buyer, [key]: e.target.value })
                      }
                      maxLength={key === "phone" ? 18 : 120}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="checkout-section">
          <h3>
            <CreditCard size={18} /> Pago de demostración
          </h3>
          <p>
            No ingreses datos bancarios. La tarjeta de prueba ya está preparada.
          </p>
          <div className="demo-bank-card">
            <span>BOLETERA / DEMO</span>
            <strong>•••• •••• •••• 4242</strong>
            <span>TARJETA FICTICIA · SIN CARGOS</span>
          </div>
          <fieldset className="payment-scenario">
            <legend>Resultado del pago de prueba</legend>
            <label>
              <input
                type="radio"
                name={`${instanceId}-outcome`}
                checked={outcome === "approved"}
                onChange={() => setOutcome("approved")}
              />{" "}
              Aprobar pago
            </label>
            <label>
              <input
                type="radio"
                name={`${instanceId}-outcome`}
                checked={outcome === "declined"}
                onChange={() => setOutcome("declined")}
              />{" "}
              Rechazar pago
            </label>
          </fieldset>
        </div>
        {error && (
          <p className="booking-alert" role="alert">
            {error}
          </p>
        )}
      </section>
      <aside className="checkout-panel order-summary">
        <div className="checkout-section">
          <div className="summary-label">
            <TicketIcon size={18} />
            <span>Tu encuentro</span>
          </div>
          <h3>{event.title}</h3>
          <p>
            <CalendarIcon size={14} />
            {formatEventDate(event.startsAt)}
          </p>
          <p>
            <MapPinIcon size={14} />
            {event.venue}
          </p>
        </div>
        <div className="checkout-section">
          <span className="eyebrow">LUGARES APARTADOS</span>
          <ul>
            {seats.map((seat) => (
              <li key={seat.id}>
                <span>
                  {seat.label}
                  <small>{seat.zone}</small>
                </span>
                <strong>
                  {formatPrice({
                    amountMinor: seat.amountMinor,
                    currency: "MXN",
                  })}
                </strong>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="summary-total">
            <span>Total</span>
            <strong>
              {formatPrice(price)} <small>MXN</small>
            </strong>
          </div>
          <p>Precio final de prueba, sin cargos adicionales.</p>
        </div>
        <div className="checkout-section">
          <p className="hold-clock">
            Apartado de prueba: {Math.floor(remainingSeconds / 60)}:
            {String(remainingSeconds % 60).padStart(2, "0")}
          </p>
          <Button
            type="submit"
            className="demo-button booking-pay"
            disabled={remainingSeconds <= 0}
          >
            Simular pago · {formatPrice(price)}
          </Button>
          <Button type="button" variant="ghost" onClick={onBack}>
            Volver a mis lugares
          </Button>
          <Button type="button" variant="link" onClick={onExpire}>
            Simular apartado expirado
          </Button>
          <p className="checkout-note">
            Sin cobro real ni envío de correo. Al recargar se reinicia esta
            compra.
          </p>
        </div>
      </aside>
    </form>
  );
}
