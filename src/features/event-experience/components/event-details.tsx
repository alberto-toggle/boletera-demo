import type { DiscoveryEvent } from "@/features/event-discovery/model";
import { formatEventTime } from "@/features/event-discovery/model";
import type { EventExperience } from "../model";
import { PhotoGallery } from "./photo-gallery";
import { VenueMap } from "./venue-map";
export function EventDetails({
  event,
  experience,
}: {
  event: DiscoveryEvent;
  experience: EventExperience;
}) {
  return (
    <div className="event-details">
      <section id="la-experiencia">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ANTES DE QUE LLEGUE EL GRAN DÍA</p>
            <h2>
              Así se vive
              <br />
              <em>{event.title}.</em>
            </h2>
          </div>
        </div>
        <p className="event-story-intro">{experience.introduction}</p>
        <PhotoGallery photos={experience.photos} />
      </section>
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
      <section id="ubicacion">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NOS ENCONTRAMOS AQUÍ</p>
            <h2>
              Todo listo
              <br />
              <em>para recibirte.</em>
            </h2>
          </div>
        </div>
        <div className="venue-information">
          <VenueMap venue={event.venue} city={event.city} />
          <div className="arrival-notes">
            <div>
              <h3>Tu llegada</h3>
              <p>{experience.arrival}</p>
            </div>
            <div>
              <h3>Cómo vestir</h3>
              <p>{experience.dressCode}</p>
            </div>
            <div>
              <h3>Accesibilidad</h3>
              <p>{experience.accessibility}</p>
            </div>
          </div>
        </div>
      </section>
      <a href="#lugares" className="demo-button">
        Ya quiero estar ahí · Elegir lugares ↑
      </a>
    </div>
  );
}
