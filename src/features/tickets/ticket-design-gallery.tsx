"use client";

import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatEventDate,
  formatEventTime,
  type DemoDirection,
  type DiscoveryEvent,
} from "./model";
import { StatementTicket } from "./statement-ticket";
import type { DemoOrder } from "./model";
import type { Venue as DemoVenue } from "../seating/model";
import { EventTicket } from "./event-ticket";
import { TicketDownloads } from "./ticket-downloads";
import { ReceiptTicket } from "./receipt-ticket";

const designs = [
  { id: "institucional", label: "Institucional", theme: "institutional" },
  { id: "gala", label: "Gala", theme: "gala" },
  { id: "editorial", label: "Editorial", theme: "editorial" },
  { id: "inmersiva", label: "Inmersivo", theme: "institutional" },
  { id: "clasico", label: "Clásico", theme: "institutional" },
] as const;
type Design = (typeof designs)[number]["id"];

export function TicketDesignGallery({
  event,
  order,
  venue,
  direction,
  compact = false,
}: {
  event: DiscoveryEvent;
  order: DemoOrder;
  venue: DemoVenue;
  direction: DemoDirection;
  compact?: boolean;
}) {
  const ticketsRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [design, setDesign] = useState<Design>(direction);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "horizontal",
  );
  const id = useId();
  const active = designs.find((item) => item.id === design) ?? designs[0];

  const [ticketIndex, setTicketIndex] = useState(0);
  function moveTicket(delta: number) {
    const list = ticketsRef.current;
    const target = list?.children.item(ticketIndex + delta);
    const first = list?.children.item(0);
    if (list && target instanceof HTMLElement && first instanceof HTMLElement)
      list.scrollTo({
        left: target.offsetLeft - first.offsetLeft,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  const controls = (
    <>
      <fieldset className="ticket-design-options" disabled={exporting}>
        <legend>Explora los diseños</legend>
        {designs.map((item) => (
          <label key={item.id}>
            <input
              type="radio"
              name={`${id}-design`}
              value={item.id}
              checked={design === item.id}
              onChange={() => setDesign(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </fieldset>
      {design === "clasico" && (
        <label className="ticket-orientation">
          Formato del boleto clásico
          <select
            disabled={exporting}
            value={orientation}
            onChange={(e) =>
              setOrientation(
                e.target.value === "horizontal" ? "horizontal" : "vertical",
              )
            }
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </label>
      )}
      <p className="ticket-design-note">
        El PDF conserva el diseño elegido · Un boleto por página.
      </p>
    </>
  );
  return (
    <section
      className={`ticket-design-gallery${compact ? " account-ticket-gallery" : ""}`}
      id="tus-boletos"
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`} className={compact ? "sr-only" : undefined}>
        Tus boletos
      </h2>
      {compact ? (
        <details className="account-design-control">
          <summary>Diseño del boleto · {active.label}</summary>
          {controls}
        </details>
      ) : (
        controls
      )}
      {compact && order.tickets.length > 1 && (
        <div className="account-carousel-controls">
          <span aria-live="polite">
            Boleto {ticketIndex + 1} de {order.tickets.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Boleto anterior"
            disabled={ticketIndex === 0 || exporting}
            onClick={() => moveTicket(-1)}
          >
            <ArrowLeft size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Boleto siguiente"
            disabled={ticketIndex === order.tickets.length - 1 || exporting}
            onClick={() => moveTicket(1)}
          >
            <ArrowRight size={18} />
          </Button>
        </div>
      )}
      <div
        className={`discovery booking ticket-design-preview ${active.theme}${exporting ? " is-exporting" : ""}`}
        data-ticket-design={design}
      >
        <div
          className="issued-tickets"
          ref={ticketsRef}
          onScroll={
            compact
              ? (e) => {
                  const list = e.currentTarget;
                  const first = list.children.item(0);
                  const second = list.children.item(1);
                  if (
                    first instanceof HTMLElement &&
                    second instanceof HTMLElement
                  )
                    setTicketIndex(
                      Math.max(
                        0,
                        Math.min(
                          order.tickets.length - 1,
                          Math.round(
                            list.scrollLeft /
                              (second.offsetLeft - first.offsetLeft),
                          ),
                        ),
                      ),
                    );
                }
              : undefined
          }
        >
          {order.tickets.map((ticket) => {
            const seat = venue.seats.find((item) => item.id === ticket.seatId);
            if (design === "inmersiva")
              return (
                <StatementTicket
                  key={ticket.id}
                  event={event}
                  ticket={ticket}
                />
              );
            if (design === "clasico" && seat)
              return (
                <div
                  className="classic-ticket-preview"
                  data-orientation={orientation}
                  key={ticket.id}
                >
                  <ReceiptTicket
                    orientation={orientation}
                    ticket={{
                      id: ticket.id,
                      event: event.title,
                      occasion: event.category,
                      date: formatEventDate(event.startsAt),
                      time: formatEventTime(event.startsAt),
                      venue: event.venue,
                      address: event.city,
                      section: seat.sectionId,
                      table:
                        venue.arrangement === "tables"
                          ? seat.group.replace(/^M/, "")
                          : seat.group,
                      groupLabel:
                        venue.arrangement === "tables" ? "MESA" : "FILA",
                      seat: String(seat.number),
                      holder: order.buyer.name,
                      amountMinor: seat.amountMinor,
                      currency: "MXN",
                    }}
                  />
                </div>
              );
            return (
              <EventTicket key={ticket.id} event={event} ticket={ticket} />
            );
          })}
        </div>
      </div>
      <TicketDownloads
        order={order}
        documentKey={JSON.stringify({ event, order, venue, direction })}
        designName={`${active.label}${design === "clasico" ? `-${orientation}` : ""}`}
        onBusyChange={setExporting}
        getTicketElement={(ticket) => {
          const index = order.tickets.findIndex(
            (item) => item.id === ticket.id,
          );
          const element = ticketsRef.current?.children.item(index);
          if (!(element instanceof HTMLElement))
            throw new Error("Boleto no disponible");
          return (
            element.querySelector<HTMLElement>("[data-pdf-ticket]") ?? element
          );
        }}
      />
    </section>
  );
}
