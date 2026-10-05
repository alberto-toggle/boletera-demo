import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { EventPreview } from "./event-preview";
import { formatEventDate, formatPrice, type DiscoveryEvent } from "../model";

export function EventCard({
  event,
  index,
}: {
  event: DiscoveryEvent;
  index?: number;
}) {
  return (
    <article className="discovery-card event-hit-area">
      <div className="card-photo">
        <Image
          src={event.image}
          alt={event.imageAlt}
          style={{ objectPosition: event.imagePosition }}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
        />
        <span className="photo-category">{event.category}</span>
        {index !== undefined && (
          <span className="card-number" aria-hidden="true">
            0{index + 1}
          </span>
        )}
      </div>
      <div className="card-content">
        <p className="eyebrow">
          <time dateTime={event.startsAt}>
            {formatEventDate(event.startsAt, "short")}
          </time>{" "}
          <span>·</span> Ciudad de México
        </p>
        <h3>{event.title}</h3>
        <p className="card-venue">{event.venue}</p>
        <div className="card-bottom">
          <span>
            Desde <strong>{formatPrice(event.price)}</strong> <small>MXN</small>
          </span>
          <EventPreview event={event} className="card-open stretched-trigger">
            <span className="sr-only">Ver {event.title}</span>
            <ArrowUpRight aria-hidden="true" />
          </EventPreview>
        </div>
      </div>
    </article>
  );
}
