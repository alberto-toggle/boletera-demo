import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Brand,
  directions,
} from "@/features/event-discovery/components/chrome";
import "@/features/event-discovery/discovery.css";

const previews = {
  inmersiva: {
    image: "/images/events/architecture.jpg",
    alt: "Una celebración de nuestras tradiciones",
    text: (
      <>
        No lo imagines.
        <br />
        Vívelo.
      </>
    ),
  },
  institucional: {
    image: "/images/events/banquet.jpg",
    alt: "Salón de celebración",
    text: (
      <>
        Los grandes
        <br />
        momentos.
      </>
    ),
  },
  gala: {
    image: "/images/events/dinner.jpg",
    alt: "Mesas para una cena especial",
    text: (
      <>
        Hay noches
        <br />
        que se quedan.
      </>
    ),
  },
  editorial: {
    image: "/images/events/architecture.jpg",
    alt: "Papel picado sobre una fachada mexicana",
    text: (
      <>
        Hay mucho
        <br />
        que celebrar.
      </>
    ),
  },
};

export default function Home() {
  return (
    <main className="proposal-hub">
      <header className="hub-header">
        <Brand />
        <Link href="/playground">Abrir playground ↗</Link>
      </header>
      <section className="hub-intro">
        <p>BOLETERA · EXPLORACIÓN VISUAL 01</p>
        <h1>
          Cuatro formas de imaginar
          <br />
          <em>el próximo encuentro.</em>
        </h1>
        <p>
          Una misma agenda, cuatro identidades. Explora las propuestas y
          descubre qué experiencia representa mejor a la comunidad.
        </p>
      </section>
      <section className="hub-grid" aria-label="Propuestas de diseño">
        {directions.map((direction) => {
          const preview = previews[direction.id];
          return (
            <Link
              key={direction.id}
              href={`/demo-${direction.id}`}
              className="hub-card"
            >
              <div className={`hub-preview ${direction.id}-preview`}>
                <Image
                  src={preview.image}
                  alt={preview.alt}
                  fill
                  sizes="(max-width: 600px) 100vw, 33vw"
                  priority
                />
                <span>{preview.text}</span>
              </div>
              <div className="hub-card-heading">
                <h2>
                  <span>{direction.number}</span>
                  {direction.label}
                </h2>
                <ArrowUpRight size={22} aria-hidden="true" />
              </div>
              <p>{direction.description}</p>
            </Link>
          );
        })}
      </section>
      <footer className="hub-footer">
        <span>
          Boletera es un nombre provisional para explorar estas propuestas.
        </span>
        <span>Demo con información ficticia · Compra simulada</span>
      </footer>
    </main>
  );
}
