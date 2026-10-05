import Link from "next/link";
import type { DiscoveryEvent } from "@/features/event-discovery/model";
import { formatEventTime } from "@/features/event-discovery/model";
import type { EventExperience } from "../model";
import { VenueMap } from "./venue-map";
export function EventDetails({
  event,
  experience,
  purchaseHref,
}: {
  event: DiscoveryEvent;
  experience: EventExperience;
  purchaseHref: string;
}) {
  return (
    <div className="event-details">
      <details className="event-extra">
        <summary>Programa del evento</summary>
        <section className="event-program">
          <div>
            <p className="eyebrow">EL RITMO DEL ENCUENTRO</p>
            <h2>
              Un programa
              <br />
              <em>para disfrutar.</em>
            </h2>
            <p>Horarios y actividades ilustrativos, sujetos a definición.</p>
          </div>
          <ol>
            {experience.program.map((item) => (
              <li key={item.offsetMinutes}>
                <time>
                  {formatEventTime(
                    new Date(
                      new Date(event.startsAt).getTime() +
                        item.offsetMinutes * 60000,
                    ).toISOString(),
                  )}{" "}
                  h
                </time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </details>
      <section id="ubicacion">
        <h2>Cómo llegar</h2>
        <div className="venue-information">
          <VenueMap venue={event.venue} city={event.city} />
          <div className="arrival-notes">
            <details className="event-extra" open>
              <summary>Tu llegada</summary>
              <p>{experience.arrival}</p>
            </details>
            <details className="event-extra">
              <summary>Cómo vestir</summary>
              <p>{experience.dressCode}</p>
            </details>
            <details className="event-extra">
              <summary>Accesibilidad</summary>
              <p>{experience.accessibility}</p>
            </details>
          </div>
        </div>
      </section>
      <Link href={purchaseHref} className="demo-button">
        Elegir lugares →
      </Link>
    </div>
  );
}
