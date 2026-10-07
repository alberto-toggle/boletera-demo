"use client";
import { TicketDesignGallery } from "@/features/tickets/ticket-design-gallery";
import type { Venue } from "@/features/seating/model";
import { type Sale, type SellerEvent } from "../model";
export function SaleTicketDesigns({
  sale,
  event,
  venue,
}: {
  sale: Sale;
  event: SellerEvent;
  venue: Venue;
}) {
  return (
    <div className="seller-ticket-designs">
      <TicketDesignGallery
        direction="institucional"
        event={{ ...event, city: "Ciudad de México" }}
        venue={venue}
        order={{
          id: sale.id,
          buyer: { name: sale.customer?.name ?? "" },
          tickets: sale.seats.map((s, i) => ({
            id: `${sale.id}-${i + 1}`,
            seatId: s.id,
            seatLabel: s.label,
            status: "valid",
          })),
        }}
      />
    </div>
  );
}
