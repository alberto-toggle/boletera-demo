import { StickyHeader } from "./sticky-header";
import {
  ArrowUpRight,
  Asterisk,
  Plus,
  Ticket,
  Users,
  MapPin,
} from "lucide-react";
import { AccountPreview } from "./event-preview";
import { MobileMenu } from "./mobile-menu";
import type { DemoDirection } from "../model";

export function Brand() {
  return (
    <span className="circle-brand">
      <Asterisk aria-hidden="true" strokeWidth={1.5} />
      <span>
        boletera<span className="brand-dot">.</span>
      </span>
    </span>
  );
}

export function Header({ direction }: { direction: DemoDirection }) {
  return (
    <StickyHeader>
      <header className="discovery-header">
        <a href="#inicio" aria-label="Boletera, inicio">
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#agenda">Agenda de eventos</a>
          <a href="#eventos-anteriores">Eventos anteriores</a>
          <a href="#ayuda">Ayuda</a>
        </nav>
        <div className="header-end">
          <AccountPreview />
          <a href="#agenda" className="header-cta">
            Explorar eventos <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <MobileMenu />
        </div>
        <span className="sr-only">Propuesta {direction}</span>
      </header>
    </StickyHeader>
  );
}

export function Experience() {
  return (
    <section className="experience-section" id="experiencia">
      <div>
        <p className="eyebrow">EL ENCUENTRO EMPIEZA AQUÍ</p>
        <h2>
          Menos pasos.
          <br />
          <em>Más momentos.</em>
        </h2>
        <p>
          De elegir tu evento a compartir una gran noche. Todo comienza con un
          lugar para ti.
        </p>
      </div>
      <ol className="experience-steps">
        <li>
          <span>01</span>
          <Ticket aria-hidden="true" />
          <div>
            <h3>Encuentra tu ocasión</h3>
            <p>Explora la agenda y descubre los detalles de cada encuentro.</p>
          </div>
        </li>
        <li>
          <span>02</span>
          <MapPin aria-hidden="true" />
          <div>
            <h3>Elige tu lugar</h3>
            <p>
              Consulta las zonas y encuentra el espacio ideal para disfrutar.
            </p>
          </div>
        </li>
        <li>
          <span>03</span>
          <Users aria-hidden="true" />
          <div>
            <h3>Ven a compartir</h3>
            <p>
              Compra como invitado o con tu cuenta. Tú decides cómo empezar.
            </p>
          </div>
        </li>
      </ol>
    </section>
  );
}

export function Help() {
  return (
    <section className="help-section" id="ayuda">
      <div>
        <p className="eyebrow">ANTES DE ENCONTRARNOS</p>
        <h2>
          Todo claro,
          <br />
          <em>desde el principio.</em>
        </h2>
      </div>
      <div className="faq-list">
        {[
          [
            "¿Necesito una cuenta para comprar?",
            "No. Podrás comprar como invitado con tus datos de contacto. Si prefieres tener una cuenta, también tendrás esa opción para consultar tus compras y boletos.",
          ],
          [
            "¿Cómo sé qué incluye mi entrada?",
            "Cada evento tendrá su propia información: fecha, sede, tipo de acceso e inclusiones. Consulta los detalles al abrir un evento.",
          ],
          [
            "¿Puedo elegir una mesa o un asiento?",
            "Sí. Abre un evento y elige tus lugares en el mapa. La demo muestra mesas para celebraciones y filas para conferencias antes de pasar al checkout.",
          ],
        ].map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <Plus size={18} aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="discovery-footer">
      <div className="footer-top">
        <Brand />
        <p>
          Hay momentos que nos reúnen.
          <br />Y recuerdos que nos acompañan.
        </p>
        <a href="#inicio">
          Volver al inicio <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© Boletera 2027</span>
        <span>
          Concepto de demostración · Eventos, sedes y precios ficticios
        </span>
        <a href="#ayuda">Preguntas frecuentes</a>
      </div>
    </footer>
  );
}

export const directions: readonly {
  id: DemoDirection;
  label: string;
  number: string;
  description: string;
}[] = [
  {
    id: "institucional",
    label: "Institucional",
    number: "01",
    description:
      "Confianza, tradición y claridad. Una experiencia cercana con estructura sobria y tonos verdes.",
  },
  {
    id: "gala",
    label: "Gala",
    number: "02",
    description:
      "La emoción de una gran noche. Fotografía inmersiva, ritmo pausado y una atmósfera elegante.",
  },
  {
    id: "editorial",
    label: "Editorial",
    number: "03",
    description:
      "Una agenda con carácter. Composición gráfica, grandes titulares y cultura de encuentro.",
  },
  {
    id: "inmersiva",
    label: "Inmersiva",
    number: "04",
    description:
      "Una invitación a vivirlo. Menú flotante, fotografía en movimiento y boletos con carácter.",
  },
];
