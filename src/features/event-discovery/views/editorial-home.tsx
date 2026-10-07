import { PastEvents } from "@/features/event-experience/components/past-events";
import Image from "next/image";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { Header, Footer, Help } from "../components/chrome";
import { EventPreview } from "../components/event-preview";
import { Agenda } from "../components/agenda";
import { demoEvents, featuredEvent } from "../fixtures";

export function EditorialHome() {
  const recognition = demoEvents.find(
    (event) => event.id === "reconocimientos",
  );
  return (
    <div className="discovery editorial" id="inicio">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header direction="editorial" />
      <main id="contenido">
        <section className="editorial-hero">
          <div className="editorial-kicker">
            <span>AGENDA CULTURAL & ENCUENTROS</span>
            <span>EDICIÓN 2027 — CDMX</span>
          </div>
          <h1>
            Hay mucho
            <br />
            <span>
              que <em>celebrar.</em>
              <Asterisk aria-hidden="true" strokeWidth={1.1} />
            </span>
          </h1>
          <div className="editorial-deck">
            <p>
              Nuestras tradiciones. Nuevas historias.
              <br />
              El próximo gran momento comienza aquí.
            </p>
            <a href="#agenda">
              EXPLORAR LA AGENDA <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </div>
          <div className="editorial-feature-grid">
            <article className="editorial-cover event-hit-area">
              <Image
                src={featuredEvent.image}
                alt={featuredEvent.imageAlt}
                style={{ objectPosition: featuredEvent.imagePosition }}
                fill
                priority
                sizes="(max-width: 800px) 100vw, 65vw"
              />
              <span className="editorial-cover-label">
                EN PORTADA / SEPTIEMBRE
              </span>
              <div>
                <span className="eyebrow">15 SEP · CENA Y MÚSICA EN VIVO</span>
                <h2>{featuredEvent.title}</h2>
                <EventPreview
                  event={featuredEvent}
                  className="demo-button stretched-trigger"
                >
                  Quiero conocer el evento{" "}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </EventPreview>
              </div>
            </article>
            <aside className="editorial-aside">
              <div className="editorial-note">
                <span className="eyebrow">EL MOTIVO ES ENCONTRARNOS</span>
                <p>
                  Una fecha en
                  <br />
                  el calendario.
                  <br />
                  <em>
                    Un recuerdo
                    <br />
                    para siempre.
                  </em>
                </p>
                <span className="note-star" aria-hidden="true">
                  ✳
                </span>
              </div>
              {recognition && (
                <article className="editorial-side-event event-hit-area">
                  <div>
                    <Image
                      src={recognition.image}
                      alt={recognition.imageAlt}
                      fill
                      sizes="(max-width: 800px) 45vw, 25vw"
                    />
                  </div>
                  <span className="eyebrow">20 NOV · RECONOCIMIENTOS</span>
                  <h3>{recognition.title}</h3>
                  <EventPreview
                    event={recognition}
                    className="text-link stretched-trigger"
                  >
                    Ver encuentro <ArrowUpRight size={17} aria-hidden="true" />
                  </EventPreview>
                </article>
              )}
            </aside>
          </div>
        </section>
        <div className="editorial-strip" aria-hidden="true">
          <span>TRADICIÓN</span>
          <Asterisk />
          <span>COMUNIDAD</span>
          <Asterisk />
          <span>CELEBRACIÓN</span>
          <Asterisk />
          <span>ENCUENTRO</span>
        </div>
        <section className="agenda-section" id="agenda">
          <div className="section-heading">
            <div>
              <p className="eyebrow">GUARDA LA FECHA</p>
              <h2>
                En el <em>calendario.</em>
              </h2>
            </div>
          </div>
          <Agenda events={demoEvents} presentation="cards" />
        </section>
        <PastEvents />
        <Help />
      </main>
      <Footer />
    </div>
  );
}
