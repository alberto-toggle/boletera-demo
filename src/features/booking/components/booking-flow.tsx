"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/features/event-discovery/components/chrome";
import {
  type DemoDirection,
  type DiscoveryEvent,
} from "@/features/event-discovery/model";
import { createDemoVenue } from "../fixtures";
import {
  initialBookingState,
  transitionBooking,
  type BookingAction,
  type BookingState,
} from "../model";
import { VenueSelector } from "./venue-selector";
import {
  PaymentProcessing,
  PaymentSuccess,
  PAYMENT_ANIMATION_MS,
} from "./payment-feedback";
import { Checkout } from "./checkout";
import { TicketDesignGallery } from "./ticket-design-gallery";
import { ReservationClock } from "./reservation-clock";

export function BookingFlow({
  event,
  direction,
}: {
  event: DiscoveryEvent;
  direction: DemoDirection;
}) {
  const venue = useMemo(() => createDemoVenue(event), [event]);
  const [state, dispatch] = useReducer(
    (state: BookingState, action: BookingAction) =>
      transitionBooking(state, action, venue.seats, event),
    initialBookingState,
  );
  const [now, setNow] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(state.step);
  const expiresAt =
    state.step === "checkout" || state.step === "processing"
      ? state.expiresAt
      : null;
  useEffect(() => {
    if (expiresAt === null) return;
    const timer = window.setInterval(() => {
      const time = Date.now();
      setNow(time);
      dispatch({ type: "expire", now: time });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);
  useEffect(() => {
    if (previousStep.current !== state.step) {
      headingRef.current?.focus();
      previousStep.current = state.step;
    }
  }, [state.step]);
  useEffect(() => {
    if (state.step !== "processing") return;
    const timer = window.setTimeout(
      () => dispatch({ type: "finish-payment", now: Date.now() }),
      PAYMENT_ANIMATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.step]);
  const selectedIds =
    state.step === "selection"
      ? state.selectedIds
      : state.step === "checkout" || state.step === "processing"
        ? state.seatIds
        : [];
  const selectedSeats = venue.seats.filter((seat) =>
    selectedIds.includes(seat.id),
  );
  function reserve() {
    const time = Date.now();
    setNow(time);
    dispatch({
      type: "reserve",
      now: time,
      orderId: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    });
  }
  const home = `/demo-${direction}`;
  const theme = direction === "institucional" ? "institutional" : direction;
  return (
    <div
      className={`discovery booking purchase-page ${theme}${state.step === "selection" ? " booking-map-page" : ""}`}
    >
      <header className="booking-header">
        <Link href={home} aria-label="Boletera, inicio">
          <Brand />
        </Link>
        <Link href={`${home}/eventos/${event.id}`}>
          <ArrowLeft size={16} /> Detalle del evento
        </Link>
        <span>DEMOSTRACIÓN · SIN COBROS REALES</span>
      </header>
      {expiresAt !== null && (
        <ReservationClock
          remainingSeconds={Math.max(0, Math.ceil((expiresAt - now) / 1000))}
        />
      )}
      <main className="booking-main">
        <nav className="booking-steps" aria-label="Pasos de compra">
          {["Elige tus lugares", "Identificación y pago", "Tus boletos"].map(
            (label, index) => (
              <span
                key={label}
                aria-current={
                  (state.step === "selection"
                    ? 0
                    : state.step === "confirmed"
                      ? 2
                      : 1) === index
                    ? "step"
                    : undefined
                }
              >
                <b>0{index + 1}</b>
                {label}
              </span>
            ),
          )}
        </nav>
        <h1 className="booking-title" ref={headingRef} tabIndex={-1}>
          {state.step === "confirmed"
            ? "Tu próxima historia ya tiene lugar."
            : state.step === "processing"
              ? "Tu siguiente gran momento está cerca."
              : state.step === "checkout"
                ? "Completa tu experiencia."
                : state.step === "failed" || state.step === "expired"
                  ? "Vamos a intentarlo de nuevo."
                  : "Elige tus lugares"}
        </h1>
        {state.step === "selection" && (
          <>
            <p className="purchase-event-name">{event.title}</p>
            <VenueSelector
              venue={venue}
              eventTitle={event.title}
              selectedIds={state.selectedIds}
              onToggle={(seatId) => dispatch({ type: "toggle", seatId })}
              onContinue={reserve}
              notice={state.notice}
            />
          </>
        )}
        {state.step === "checkout" && (
          <Checkout
            event={event}
            seats={selectedSeats}
            onBack={() => dispatch({ type: "back" })}
            onExpire={() => dispatch({ type: "expire", now: state.expiresAt })}
            onPay={(buyer, mode, outcome) =>
              dispatch({
                type: "start-payment",
                now: Date.now(),
                buyer,
                mode,
                outcome,
              })
            }
          />
        )}
        {state.step === "processing" && <PaymentProcessing />}
        {(state.step === "failed" || state.step === "expired") && (
          <section className="booking-result checkout-panel" role="alert">
            <RotateCcw size={38} />
            <h2>
              {state.step === "failed" ? "Pago rechazado" : "Apartado expirado"}
            </h2>
            <p>{state.message}</p>
            <Button
              className="demo-button"
              onClick={() => dispatch({ type: "reset" })}
            >
              Volver a elegir lugares
            </Button>
          </section>
        )}
        {state.step === "confirmed" && (
          <section className="booking-confirmation">
            <PaymentSuccess order={state.order} />
            <div className="booking-alert">
              Compra simulada · Sin cargos ni envíos reales. Boletos sin validez
              de acceso.
            </div>
            <TicketDesignGallery
              event={event}
              order={state.order}
              venue={venue}
              direction={direction}
            />
            <div className="confirmation-actions">
              <Button
                variant="outline"
                onClick={() => dispatch({ type: "reset" })}
              >
                Reiniciar demo
              </Button>
              <Link href={home}>
                Explorar otros eventos <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}
      </main>
      <footer className="booking-footer">
        Boletera · Experiencia de compra de demostración. Los boletos no tienen
        validez de acceso.
      </footer>
    </div>
  );
}
