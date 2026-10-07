"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Trash2, Armchair } from "lucide-react";
import { VenueMap } from "@/features/seating/venue-map";
import type { Venue } from "@/features/seating/model";
import { SELLER_LIMIT, date, money, type SellerEvent } from "../model";
import { Button } from "@/components/ui/button";
export function SellerSelection({
  event,
  venue,
  onReserve,
  information,
}: {
  information: ReactNode;
  event: SellerEvent;
  venue: Venue;
  onReserve: (ids: string[]) => void;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const seats = venue.seats.filter((s) => ids.includes(s.id));
  return (
    <main className="seller-selection">
      <header className="seller-selection-title">
        <Link href="/operacion/vendedor" aria-label="Volver a eventos">
          <ArrowLeft />
        </Link>
        <div>
          <h1>{event.title}</h1>
          <p>
            {date(event.startsAt)} · {event.venue}
          </p>
        </div>
        {information}
        <span>01 / Lugares</span>
      </header>
      <div className="seller-map-grid">
        <section className="seller-map" aria-label="Mapa de selección">
          <VenueMap
            venue={venue}
            maxSeats={SELLER_LIMIT}
            selectedIds={ids}
            onToggle={(id) =>
              setIds((current) =>
                current.includes(id)
                  ? current.filter((s) => s !== id)
                  : current.length < SELLER_LIMIT
                    ? [...current, id]
                    : current,
              )
            }
          />
        </section>
        <aside className="seller-selection-summary">
          <div className="seller-summary-head">
            <p className="seller-eyebrow">NUEVA VENTA</p>
            <h2>
              {ids.length}{" "}
              {ids.length === 1 ? "lugar elegido" : "lugares elegidos"}
            </h2>
            <button
              className="seller-text-button"
              disabled={!ids.length}
              onClick={() => setIds([])}
            >
              <Trash2 size={15} />
              Limpiar selección
            </button>
            <p className="seller-legend">
              <i />
              Disponible <i />
              Elegido <i />
              Ocupado
            </p>
          </div>
          <div className="seller-seat-list">
            {!seats.length ? (
              <div className="seller-empty">
                <Armchair size={36} />
                <p>Elige una sección y después los lugares.</p>
                <small>Hasta ocho boletos por venta.</small>
              </div>
            ) : (
              seats.map((s) => (
                <div className="seller-seat" key={s.id}>
                  <span>
                    {s.label}
                    <small>{s.zone}</small>
                  </span>
                  <strong>{money(s.amountMinor)}</strong>
                  <button
                    aria-label={`Quitar ${s.label}`}
                    onClick={() => setIds(ids.filter((x) => x !== s.id))}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
          <footer>
            <span>
              Total · {ids.length} {ids.length === 1 ? "boleto" : "boletos"}
            </span>
            <strong>
              {money(seats.reduce((n, s) => n + s.amountMinor, 0))}
            </strong>
            <Button
              className="seller-primary"
              disabled={!ids.length}
              onClick={() => onReserve(ids)}
            >
              Continuar a cobro <ArrowRight size={17} />
            </Button>
            <small>
              Al continuar, apartamos tus lugares durante 5 minutos.
            </small>
          </footer>
        </aside>
      </div>
    </main>
  );
}
