"use client";

import { useId, useRef, useState } from "react";
import {
  formatEventDate,
  formatEventTime,
  type DemoDirection,
  type DiscoveryEvent,
} from "@/features/event-discovery/model";
import { StatementTicket } from "@/features/immersive/components/statement-ticket";
import type { DemoOrder } from "../model";
import type { DemoVenue } from "../fixtures";
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
}: {
  event: DiscoveryEvent;
  order: DemoOrder;
  venue: DemoVenue;
  direction: DemoDirection;
}) {
  const ticketsRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [design, setDesign] = useState<Design>(direction);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "horizontal",
  );
  const id = useId();
  const active = designs.find((item) => item.id === design) ?? designs[0];
  return (
    <section
      className="ticket-design-gallery"
      id="tus-boletos"
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>Tus boletos</h2>
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
      <div
        className={`discovery booking ticket-design-preview ${active.theme}${exporting ? " is-exporting" : ""}`}
        data-ticket-design={design}
      >
        <div className="issued-tickets" ref={ticketsRef}>
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
