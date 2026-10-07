"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Search } from "lucide-react";
import { date, money, type SellerEvent } from "../model";
export function SellerEvents({
  events,
  availability,
}: {
  events: SellerEvent[];
  availability: Record<string, number>;
}) {
  const [query, setQuery] = useState("");
  const filtered = events.filter((e) =>
    `${e.title} ${e.venue}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  return (
    <main className="seller-main">
      <div className="seller-heading">
        <div>
          <p className="seller-eyebrow">TU PUNTO DE VENTA</p>
          <h1>Una nueva venta.</h1>
          <p>Elige un evento y encuentra el lugar perfecto.</p>
        </div>
        <label className="seller-search">
          <Search size={18} />
          <input
            aria-label="Buscar eventos"
            placeholder="Buscar evento o recinto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="seller-section-heading">
        <h2>Eventos autorizados</h2>
        <span>{filtered.length} eventos</span>
      </div>
      <div className="seller-events">
        {filtered.map((e) => (
          <article className="seller-event" key={e.id}>
            <div className="seller-event-image">
              <Image
                src={e.image}
                alt={e.title}
                fill
                sizes="(max-width:700px) 100vw, 33vw"
              />
              <span>{e.category}</span>
            </div>
            <div className="seller-event-body">
              <h3>{e.title}</h3>
              <p>
                <CalendarDays size={15} />
                {date(e.startsAt)}
              </p>
              <p>
                <MapPin size={15} />
                {e.venue}
              </p>
              <div className="seller-event-bottom">
                <span>
                  <small>Desde</small>
                  <strong>{money(e.priceMinor)}</strong>
                  <small>{availability[e.id]} lugares disponibles</small>
                </span>
                {availability[e.id] > 0 ? (
                  <Link
                    className="seller-primary"
                    href={`/operacion/vendedor/evento/${e.id}`}
                  >
                    Ver evento <ArrowUpRight size={17} />
                  </Link>
                ) : (
                  <span>Agotado</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <p className="seller-empty">No encontramos eventos con esa búsqueda.</p>
      )}
    </main>
  );
}
