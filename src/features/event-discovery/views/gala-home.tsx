import { EventCarousel } from "../components/event-carousel";
import { PastEvents } from "@/features/event-experience/components/past-events";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
import {
  Header,
  Footer,
  Experience,
  Help,
  ProposalSwitcher,
} from "../components/chrome";
import { EventPreview } from "../components/event-preview";
import { Agenda } from "../components/agenda";
import { demoEvents, featuredEvent } from "../fixtures";

export function GalaHome() {
  return (
    <div className="discovery gala" id="inicio">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <main id="contenido">
        <div className="gala-opening">
          <Image
            className="gala-backdrop"
            src="/images/events/dinner.jpg"
            alt="Una mesa preparada para una velada especial"
            fill
            sizes="100vw"
            priority
          />
          <Header direction="gala" />
          <section className="gala-hero">
            <p className="eyebrow">
              ENCUENTROS EXTRAORDINARIOS · TEMPORADA 2027
            </p>
            <h1>
              Hay noches
              <br />
              que <em>se quedan.</em>
            </h1>
            <p className="hero-description">
              La mesa está puesta. La música está por empezar.
              <br />
              Solo falta que tú seas parte de la historia.
            </p>
            <EventPreview event={featuredEvent} className="demo-button">
              Descubre tu próxima noche{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </EventPreview>
            <div className="gala-hero-bottom">
              <a
                href="#seleccion"
                aria-label="Descubrir la selección de eventos"
              >
                <ArrowDown size={20} />
                <span>SIGUE LA EXPERIENCIA</span>
              </a>
              <div>
                <span className="eyebrow">PRÓXIMA GRAN CELEBRACIÓN</span>
                <p>{featuredEvent.title}</p>
                <span>
                  15 SEPTIEMBRE 2027 <span className="gala-separator">/</span>{" "}
                  CIUDAD DE MÉXICO
                </span>
              </div>
              <span className="gala-edition" aria-hidden="true">
                01 — 09
              </span>
            </div>
          </section>
        </div>
        <div className="gala-manifesto">
          <Asterisk size={36} strokeWidth={1} aria-hidden="true" />
          <p>
            Nos reunimos por una fecha.
            <br />
            <em>Volvemos por lo que sentimos.</em>
          </p>
          <span>NUESTRA ESENCIA</span>
        </div>
        <section className="gala-selection" id="seleccion">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EL ARTE DE CELEBRAR</p>
              <h2>
                Elige un momento.
                <br />
                <em>Hazlo inolvidable.</em>
              </h2>
            </div>
            <a href="#agenda" className="text-link">
              Toda la agenda <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <EventCarousel events={demoEvents} film />
        </section>
        <section className="gala-ticket-section">
          <p className="eyebrow">TU LUGAR EN UNA GRAN HISTORIA</p>
          <div className="gala-ticket">
            <div>
              <span className="eyebrow">BOLETERA PRESENTA</span>
              <h2>
                Noche de
                <br />
                <em>Independencia</em>
              </h2>
              <span>UNA CELEBRACIÓN DE LO QUE SOMOS</span>
            </div>
            <div className="gala-ticket-stub">
              <span>SEP</span>
              <strong>15</strong>
              <span>2027 · 19:00 H</span>
              <EventPreview event={featuredEvent} className="demo-button">
                Ver evento <ArrowUpRight size={17} aria-hidden="true" />
              </EventPreview>
            </div>
          </div>
        </section>
        <section className="agenda-section" id="agenda">
          <div className="section-heading">
            <div>
              <p className="eyebrow">UN AÑO PARA COMPARTIR</p>
              <h2>
                La agenda <em>completa.</em>
              </h2>
            </div>
            <span className="eyebrow">09 ENCUENTROS · 2027</span>
          </div>
          <Agenda events={demoEvents} presentation="list" />
        </section>
        <PastEvents />
        <Experience />
        <Help />
      </main>
      <Footer />
      <ProposalSwitcher active="gala" />
    </div>
  );
}
