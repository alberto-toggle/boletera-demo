import { PastEvents } from "@/features/event-experience/components/past-events";
import { MegaNavigation } from "./components/mega-navigation";
import { ScrollHero } from "./components/scroll-hero";
import { Agenda } from "@/features/event-discovery/components/agenda";
import {
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
        <Help />
      </main>
      <Footer />
      <ProposalSwitcher active="inmersiva" />
    </div>
  );
}
