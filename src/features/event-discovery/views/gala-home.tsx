import { PastEvents } from "@/features/event-experience/components/past-events";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Header, Footer, Help, ProposalSwitcher } from "../components/chrome";
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
            src={featuredEvent.image}
            alt={featuredEvent.imageAlt}
            style={{ objectPosition: featuredEvent.imagePosition }}
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
              Cena, música y una noche para recordar.
            </p>
            <EventPreview event={featuredEvent} className="demo-button">
              Descubre tu próxima noche{" "}
              <ArrowUpRight size={18} aria-hidden="true" />
            </EventPreview>
            <div className="gala-hero-bottom">
              <a href="#agenda" aria-label="Descubrir la selección de eventos">
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
          <Agenda events={demoEvents} presentation="cards" />
        </section>
        <PastEvents />
        <Help />
      </main>
      <Footer />
      <ProposalSwitcher active="gala" />
    </div>
  );
}
