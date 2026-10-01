import { PastEvents } from "@/features/event-experience/components/past-events";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MegaNavigation } from "./components/mega-navigation";
import { ScrollHero } from "./components/scroll-hero";
import { StatementTicket } from "./components/statement-ticket";
import { EventCarousel } from "@/features/event-discovery/components/event-carousel";
import { Agenda } from "@/features/event-discovery/components/agenda";
import {
  Experience,
  Help,
  Footer,
  ProposalSwitcher,
} from "@/features/event-discovery/components/chrome";
import { demoEvents, featuredEvent } from "@/features/event-discovery/fixtures";

export function ImmersiveHome() {
  return (
    <div className="discovery inmersiva" id="inicio">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <MegaNavigation events={demoEvents} />
      <main id="contenido">
        <ScrollHero event={featuredEvent} />
        <section className="immersive-curation">
          <div className="section-heading">
            <div>
              <p className="eyebrow">UNA FECHA. MIL FORMAS DE SENTIRLA.</p>
              <h2>
                Hay un encuentro
                <br />
                <em>que lleva tu nombre.</em>
              </h2>
            </div>
            <a href="#agenda" className="text-link">
              Explorar la temporada <ArrowUpRight size={18} />
            </a>
          </div>
          <EventCarousel events={demoEvents} categoryAnchors />
        </section>
        <section className="immersive-ticket-section">
          <div className="ticket-introduction">
            <p className="eyebrow">EL RECUERDO EMPIEZA ANTES.</p>
            <h2>
              No es solo
              <br />
              <em>un boleto.</em>
            </h2>
            <p>
              Es tu lugar en la mesa. La primera canción. Un brindis que todavía
              no sucede.
            </p>
            <Link
              href={`/demo-inmersiva/eventos/${featuredEvent.id}`}
              className="demo-button"
            >
              Elige tu lugar <ArrowUpRight size={18} />
            </Link>
            <small>Explora la compra y recibe tu boleto de demostración.</small>
          </div>
          <StatementTicket event={featuredEvent} />
        </section>
        <section className="agenda-section" id="agenda">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TEMPORADA 2027</p>
              <h2>
                Haz espacio
                <br />
                <em>para vivirlo.</em>
              </h2>
            </div>
            <span className="eyebrow">09 EVENTOS · CIUDAD DE MÉXICO</span>
          </div>
          <Agenda events={demoEvents} presentation="cards" />
        </section>
        <PastEvents />
        <Experience />
        <Help />
      </main>
      <Footer />
      <ProposalSwitcher active="inmersiva" />
    </div>
  );
}
