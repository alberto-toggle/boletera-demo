import { PastEvents } from "@/features/event-experience/components/past-events";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { Header, Footer, Help } from "../components/chrome";
import { Agenda } from "../components/agenda";
import { EventPreview } from "../components/event-preview";
import { demoEvents, featuredEvent } from "../fixtures";

export function InstitutionalHome() {
  return (
    <div className="discovery institutional" id="inicio">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <div className="institutional-topline">
        <span>UN ESPACIO PARA ENCONTRARNOS</span>
        <span>CIUDAD DE MÉXICO · TEMPORADA 2027</span>
      </div>
      <Header direction="institucional" />
      <main id="contenido">
        <section className="institutional-hero">
          <div className="institutional-intro">
            <p className="eyebrow">
              <span className="status-dot" /> TRADICIÓN QUE NOS UNE
            </p>
            <h1>
              Los grandes
              <br />
              momentos se
              <br />
              <em>viven juntos.</em>
            </h1>
            <p className="hero-description">
              Celebraciones, encuentros y noches especiales.
              <br className="desktop-break" /> Encuentra tu próxima ocasión para
              compartir.
            </p>
            <a href="#agenda" className="demo-button">
              Descubrir la agenda <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="institutional-feature">
            <div className="institutional-hero-photo">
              <Image
                src={featuredEvent.image}
                alt={featuredEvent.imageAlt}
                style={{ objectPosition: featuredEvent.imagePosition }}
                fill
                sizes="(max-width: 800px) 100vw, 55vw"
                priority
              />
              <span className="image-label">UNA NOCHE PARA RECORDAR</span>
              <span className="year-stamp">
                20
                <br />
                27
              </span>
            </div>
            <div className="featured-ticket event-hit-area">
              <div className="ticket-date">
                <strong>15</strong>
                <span>SEP</span>
              </div>
              <div>
                <span className="eyebrow">EVENTO DESTACADO</span>
                <h2>{featuredEvent.title}</h2>
                <p>{featuredEvent.venue} · 19:00 h</p>
              </div>
              <EventPreview
                event={featuredEvent}
                className="card-open stretched-trigger"
              >
                <span className="sr-only">Ver Noche de Independencia</span>
                <ArrowUpRight aria-hidden="true" />
              </EventPreview>
            </div>
          </div>
        </section>
        <div className="institutional-ribbon">
          <span>
            <CalendarDays size={17} aria-hidden="true" /> Celebraciones durante
            todo el año
          </span>
          <span>
            <MapPin size={17} aria-hidden="true" /> Encuentros en Ciudad de
            México
          </span>
          <a href="#agenda">
            Encuentra tu próximo evento{" "}
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
        <section className="agenda-section" id="agenda">
          <div className="section-heading">
            <div>
              <p className="eyebrow">AGENDA 2027</p>
              <h2>
                Siempre hay un motivo
                <br />
                <em>para reunirnos.</em>
              </h2>
            </div>
          </div>
          <Agenda events={demoEvents} />
        </section>
        <PastEvents />
        <Help />
      </main>
      <Footer />
    </div>
  );
}
