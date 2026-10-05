"use client";

// Order summary adapted from installed shadcn.io/checkout-event-tickets.
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatEventDate,
  formatPrice,
  type DiscoveryEvent,
} from "@/features/event-discovery/model";
import {
  totalForSeats,
  validateBuyer,
  type BookingSeat,
  type Buyer,
  type DemoOrder,
} from "../model";
import { PaymentDetails, type PaymentMethod } from "./payment/payment-details";
import { BuyerIdentification } from "./buyer-identification";

type Stage = "identity" | "attendees" | "payment";
interface CheckoutProps {
  event: DiscoveryEvent;
  seats: readonly BookingSeat[];
  onBack: () => void;
  onExpire: () => void;
  onPay: (
    buyer: Buyer,
    mode: DemoOrder["mode"],
    outcome: "approved" | "declined",
  ) => void;
}
const emptyBuyer: Buyer = {
  name: "",
  email: "",
  phone: "",
  contactChannel: "email",
  verifiedContact: "",
  audience: "public",
  registrationNumber: "",
  militaryAttendees: 0,
};
export function Checkout({
  event,
  seats,
  onBack,
  onPay,
  onExpire,
}: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [stage, setStage] = useState<Stage>("identity");
  const [buyer, setBuyer] = useState<Buyer>(emptyBuyer);
  const [mode, setMode] = useState<DemoOrder["mode"]>("guest");
  const [outcome, setOutcome] = useState<"approved" | "declined">("approved");
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [stage]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateBuyer(buyer, seats.length)) {
      setError("Revisa tu matrícula y la cantidad de asistentes.");
      return;
    }
    setError("");
    if (stage === "attendees") setStage("payment");
    else onPay(buyer, mode, outcome);
  }
  return (
    <div className="booking-checkout">
      <section className="checkout-panel">
        <div className="checkout-section">
          <nav className="checkout-progress" aria-label="Progreso del checkout">
            {(
              [
                ["identity", "Contacto"],
                ["attendees", "Asistentes"],
                ["payment", "Pago"],
              ] as const
            ).map(([value, label], index) => (
              <span
                key={value}
                aria-current={stage === value ? "step" : undefined}
              >
                {index + 1} · {label}
              </span>
            ))}
          </nav>
          <h2
            ref={heading}
            tabIndex={-1}
            className={stage === "identity" ? "sr-only" : undefined}
          >
            {stage === "identity"
              ? "¿Cómo quieres continuar?"
              : stage === "attendees"
                ? "Cuéntanos quiénes vienen."
                : "Todo listo para tu compra."}
          </h2>
          {stage === "identity" ? (
            <BuyerIdentification
              initialBuyer={buyer}
              initialMode={mode}
              onComplete={(buyer, mode) => {
                setBuyer(buyer);
                setMode(mode);
                setStage("attendees");
              }}
            />
          ) : (
            <form onSubmit={submit}>
              {stage === "attendees" ? (
                <div className="buyer-fields">
                  <p className="verified-contact">
                    <Check size={17} /> {buyer[buyer.contactChannel]} ·
                    verificado
                  </p>
                  <fieldset className="audience-options">
                    <legend>Quien realiza la compra es</legend>
                    {(
                      [
                        ["public", "Público general"],
                        ["military", "Militar"],
                      ] as const
                    ).map(([value, label]) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="buyer-audience"
                          checked={buyer.audience === value}
                          onChange={() =>
                            setBuyer({
                              ...buyer,
                              audience: value,
                              registrationNumber: "",
                            })
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>
                  {buyer.audience === "military" && (
                    <div>
                      <Label htmlFor="buyer-registration">
                        Matrícula del comprador
                      </Label>
                      <Input
                        id="buyer-registration"
                        required
                        maxLength={80}
                        value={buyer.registrationNumber}
                        onChange={(e) =>
                          setBuyer({
                            ...buyer,
                            registrationNumber: e.target.value,
                          })
                        }
                      />
                      <small>Demo: puedes escribir cualquier matrícula.</small>
                    </div>
                  )}
                  <fieldset className="attendee-count">
                    <legend>
                      De tus {seats.length}{" "}
                      {seats.length === 1 ? "entrada" : "entradas"}
                    </legend>
                    <Label htmlFor="military-attendees">
                      ¿Cuántas son para militares?
                    </Label>
                    <Input
                      id="military-attendees"
                      type="number"
                      min={0}
                      max={seats.length}
                      step={1}
                      required
                      value={buyer.militaryAttendees}
                      onChange={(e) =>
                        setBuyer({
                          ...buyer,
                          militaryAttendees: e.target.valueAsNumber || 0,
                        })
                      }
                    />
                    <p>
                      {Math.max(0, seats.length - buyer.militaryAttendees)} para
                      público general · {seats.length} en total
                    </p>
                    <small>
                      Inclúyete solo si vas a asistir. Solo pedimos la matrícula
                      del comprador.
                    </small>
                  </fieldset>
                  <Button type="submit" className="demo-button booking-pay">
                    Continuar al pago <ArrowRight size={17} />
                  </Button>
                </div>
              ) : (
                <>
                  <p className="verified-contact">
                    <Check size={17} /> {buyer.name} · Contacto verificado
                  </p>
                  <PaymentDetails
                    name={buyer.name}
                    method={paymentMethod}
                    onMethodChange={setPaymentMethod}
                  >
                    <label className="purchase-terms">
                      <input required type="checkbox" />
                      Confirmo el evento, mis lugares y el total de esta compra
                      de prueba.
                    </label>
                    <Button type="submit" className="demo-button booking-pay">
                      <CreditCard size={18} />{" "}
                      {paymentMethod === "card"
                        ? "Pagar"
                        : paymentMethod === "paypal"
                          ? "Pagar con PayPal"
                          : "Pagar con Apple Pay"}{" "}
                      {formatPrice({
                        amountMinor: totalForSeats(seats),
                        currency: "MXN",
                      })}{" "}
                      MXN
                    </Button>
                  </PaymentDetails>
                  <details className="event-extra">
                    <summary>Opciones de demostración</summary>
                    <fieldset className="payment-scenario">
                      <legend>Resultado del pago</legend>
                      {(
                        [
                          ["approved", "Aprobar"],
                          ["declined", "Rechazar"],
                        ] as const
                      ).map(([value, label]) => (
                        <label key={value}>
                          <input
                            type="radio"
                            name="payment-outcome"
                            checked={outcome === value}
                            onChange={() => setOutcome(value)}
                          />
                          {label}
                        </label>
                      ))}
                    </fieldset>
                    <Button type="button" variant="link" onClick={onExpire}>
                      Simular vencimiento de reserva
                    </Button>
                  </details>
                </>
              )}
              {error && (
                <p role="alert" className="booking-alert">
                  {error}
                </p>
              )}
            </form>
          )}
          <Button
            type="button"
            variant="link"
            onClick={() => {
              setError("");
              if (stage === "identity") onBack();
              else setStage(stage === "payment" ? "attendees" : "identity");
            }}
          >
            <ArrowLeft size={16} />
            {stage === "identity" ? "Cambiar lugares" : "Volver"}
          </Button>
        </div>
      </section>
      <aside className="checkout-panel order-summary">
        <div className="checkout-section">
          <p className="eyebrow">TU COMPRA</p>
          <h3>{event.title}</h3>
          <p>{formatEventDate(event.startsAt)}</p>
          <p>{event.venue}</p>
        </div>
        <div className="checkout-section">
          <details open>
            <summary>
              {seats.length}{" "}
              {seats.length === 1 ? "lugar reservado" : "lugares reservados"}
            </summary>
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
          </details>
          <div className="summary-total">
            <span>Boletos</span>
            <span>
              {formatPrice({
                amountMinor: totalForSeats(seats),
                currency: "MXN",
              })}
            </span>
          </div>
          <div className="summary-total">
            <span>Cargos adicionales</span>
            <span>$0</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>
              {formatPrice({
                amountMinor: totalForSeats(seats),
                currency: "MXN",
              })}{" "}
              <small>MXN</small>
            </strong>
          </div>
        </div>
      </aside>
    </div>
  );
}
