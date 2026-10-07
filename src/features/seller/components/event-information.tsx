"use client";
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  X,
  CalendarDays,
  MapPin,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Venue } from "@/features/seating/model";
import { date, money, SELLER_LIMIT, type SellerEvent } from "../model";

type Props = { event: SellerEvent; venue: Venue };
function EventInformation({ event, venue }: Props) {
  const info = event.information;
  return (
    <div className="seller-event-information">
      <div className="seller-event-facts">
        <p>
          <CalendarDays size={18} />
          {date(event.startsAt)} · Hora de Ciudad de México
        </p>
        <p>
          <MapPin size={18} />
          {event.venue} · {event.city}
        </p>
      </div>
      <section>
        <h2>Sobre el evento</h2>
        <p>{event.description}</p>
        <p>{info.introduction}</p>
      </section>
      <section>
        <h2>Qué incluye</h2>
        <ul className="seller-includes">
          {event.includes.map((item) => (
            <li key={item}>
              <Check size={16} />
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Precios por sección</h2>
        <div className="seller-price-table">
          <table>
            <thead>
              <tr>
                <th>Sección</th>
                <th>Zona</th>
                <th>Por lugar</th>
              </tr>
            </thead>
            <tbody>
              {venue.sections.map((section) => (
                <tr key={section.id}>
                  <th scope="row">{section.name}</th>
                  <td>{section.zone}</td>
                  <td>{money(section.amountMinor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="seller-muted">
          Precios en MXN · Hasta {SELLER_LIMIT} boletos por venta.
        </p>
      </section>
      <section>
        <h2>Programa del evento</h2>
        <p className="seller-muted">
          Horarios y actividades ilustrativos, sujetos a definición.
        </p>
        <ol className="seller-event-program">
          {info.program.map((item) => (
            <li key={item.offsetMinutes}>
              <time>
                {new Intl.DateTimeFormat("es-MX", {
                  timeZone: "America/Mexico_City",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).format(
                  new Date(
                    new Date(event.startsAt).getTime() +
                      item.offsetMinutes * 60000,
                  ),
                )}{" "}
                h
              </time>
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section>
        <h2>Información para los asistentes</h2>
        <dl className="seller-event-notes">
          <div>
            <dt>Tu llegada</dt>
            <dd>{info.arrival}</dd>
          </div>
          <div>
            <dt>Cómo vestir</dt>
            <dd>{info.dressCode}</dd>
          </div>
          <div>
            <dt>Accesibilidad</dt>
            <dd>{info.accessibility}</dd>
          </div>
          <div>
            <dt>Edad y restricciones de acceso</dt>
            <dd>
              No especificadas en la información del evento. Confirmar con la
              organización.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
export function SellerEventDetail({ event, venue }: Props) {
  const available = venue.seats.filter((seat) => !seat.occupied).length;
  return (
    <main className="seller-main seller-event-detail">
      <Link className="seller-back" href="/operacion/vendedor">
        <ArrowLeft size={16} />
        Volver a eventos
      </Link>
      <div className="seller-detail-hero">
        <div className="seller-detail-image">
          <Image
            src={event.image}
            alt={event.imageAlt}
            fill
            sizes="(max-width: 700px) 100vw, 40vw"
            style={{ objectPosition: event.imagePosition }}
          />
        </div>
        <div>
          <p className="seller-eyebrow">{event.category} · FICHA DE EVENTO</p>
          <h1>{event.title}</h1>
          <p>{date(event.startsAt)}</p>
          <p>
            {event.venue} · {event.city}
          </p>
          <strong className="seller-detail-price">
            Desde {money(event.priceMinor)}
          </strong>
          <small>{available} lugares disponibles</small>
          {available > 0 ? (
            <Link
              className="seller-primary"
              href={`/operacion/vendedor/evento/${event.id}/lugares`}
            >
              Elegir lugares <ArrowRight size={18} />
            </Link>
          ) : (
            <p>Boletos agotados</p>
          )}
        </div>
      </div>
      <EventInformation event={event} venue={venue} />
    </main>
  );
}
function InformationDialog({
  event,
  venue,
  onClose,
}: Props & { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const opener = document.activeElement;
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="seller-information-dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header>
        <div>
          <p className="seller-eyebrow">INFORMACIÓN DEL EVENTO</p>
          <h2 id={titleId}>{event.title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cerrar información del evento"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
      </header>
      <div className="seller-information-scroll">
        <EventInformation event={event} venue={venue} />
      </div>
    </dialog>
  );
}
export function EventInformationButton(props: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="seller-information-button"
        onClick={() => setOpen(true)}
      >
        <Info size={16} />
        Información del evento
      </Button>
      {open && <InformationDialog {...props} onClose={() => setOpen(false)} />}
    </>
  );
}
