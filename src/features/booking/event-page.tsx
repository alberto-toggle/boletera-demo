import { EventHeroGallery } from "../event-experience/components/event-hero-gallery";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { getEventExperience } from "../event-experience/fixtures";
import { EventDetails } from "../event-experience/components/event-details";
import { demoEvents } from "../event-discovery/fixtures";
import { Brand } from "../event-discovery/components/chrome";
import { AccountMenu } from "../account/components/account-menu";
import {
  formatEventDate,
  formatEventTime,
  formatPrice,
  type DemoDirection,
} from "../event-discovery/model";
import { BookingFlow } from "./components/booking-flow";
import "../event-experience/experience.css";
import "./booking.css";

export function EventPage({
  eventId,
  direction,
  purchase = false,
}: {
  eventId: string;
  direction: DemoDirection;
  purchase?: boolean;
}) {
  const event = demoEvents.find((event) => event.id === eventId);
  if (!event) notFound();
  if (purchase)
    return <BookingFlow key={event.id} event={event} direction={direction} />;
  const experience = getEventExperience(event);
  const home = `/demo-${direction}`;
  const purchaseHref = `${home}/eventos/${event.id}/compra`;
  return (
    <div
      className={`discovery booking ${direction === "institucional" ? "institutional" : direction}`}
    >
      <header className="booking-header">
        <Link href={home} aria-label="Boletera, inicio">
          <Brand />
        </Link>
        <Link href={`${home}#agenda`}>
          <ArrowLeft size={16} /> Cartelera
        </Link>
        <AccountMenu />
      </header>
      <main className="booking-main event-detail-main">
        <section className="event-detail-hero">
          <EventHeroGallery event={event} photos={experience.photos} />
          <div className="event-detail-copy">
            <p className="eyebrow">{event.category}</p>
            <h1>{event.title}</h1>
            <p>{event.description}</p>
            <div className="event-detail-facts">
              <p>
                <CalendarDays size={18} /> {formatEventDate(event.startsAt)} ·{" "}
                {formatEventTime(event.startsAt)} h
              </p>
              <a href="#ubicacion">
                <MapPin size={18} /> {event.venue}
              </a>
            </div>
            <p>
              Desde <strong>{formatPrice(event.price)} MXN</strong> / persona
            </p>
            <Link href={purchaseHref} className="demo-button">
              Elegir lugares <ArrowRight size={18} />
            </Link>
            <details className="event-extra">
              <summary>Qué incluye tu entrada</summary>
              <ul>
                {event.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          </div>
        </section>
        <EventDetails
          event={event}
          experience={experience}
          purchaseHref={purchaseHref}
        />
      </main>
      <footer className="booking-footer">
        Boletera · Eventos y precios de demostración.
      </footer>
    </div>
  );
}
