"use client";

import { useId, useState } from "react";
import { Search, ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCarousel } from "./event-carousel";
import { EventPreview } from "./event-preview";
import {
  eventCategories,
  filterEvents,
  formatEventDate,
  formatPrice,
  type DiscoveryEvent,
  type EventFilter,
} from "../model";

export function Agenda({
  events,
  presentation = "cards",
}: {
  events: readonly DiscoveryEvent[];
  presentation?: "cards" | "list";
}) {
  const [category, setCategory] = useState<EventFilter>("Todos");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const searchId = useId();
  const filtered = filterEvents(events, category, query);
  const visible =
    presentation === "cards" || expanded || category !== "Todos" || query.trim()
      ? filtered
      : filtered.slice(0, 3);
  return (
    <>
      <div className="agenda-tools">
        <div
          className="category-filters"
          aria-label="Filtrar por tipo de evento"
        >
          {(["Todos", ...eventCategories] as const).map((item) => (
            <button
              key={item}
              id={`tipo-${item.toLowerCase()}`}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="event-search" htmlFor={searchId}>
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Buscar eventos</span>
          <input
            id={searchId}
            type="search"
            placeholder="Encuentra tu evento"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <p className="sr-only" role="status">
        {filtered.length} eventos encontrados. Mostrando {visible.length}.
      </p>
      {visible.length === 0 ? (
        <div className="empty-agenda">
          <h3>No encontramos ese evento.</h3>
          <p>Prueba con otro nombre o explora todas las categorías.</p>
          <Button
            variant="outline"
            onClick={() => {
              setCategory("Todos");
              setQuery("");
            }}
          >
            Limpiar búsqueda
          </Button>
        </div>
      ) : presentation === "cards" ? (
        <EventCarousel key={`${category}-${query}`} events={visible} />
      ) : (
        <div className="agenda-list">
          {visible.map((event) => (
            <article className="agenda-row event-hit-area" key={event.id}>
              <time dateTime={event.startsAt}>
                {formatEventDate(event.startsAt, "short")}
              </time>
              <div>
                <span className="eyebrow">{event.category}</span>
                <h3>{event.title}</h3>
                <p>{event.venue}</p>
              </div>
              <span className="row-price">
                Desde {formatPrice(event.price)} <small>MXN</small>
              </span>
              <EventPreview
                event={event}
                className="card-open stretched-trigger"
              >
                <span className="sr-only">Ver {event.title}</span>
                <ArrowUpRight aria-hidden="true" />
              </EventPreview>
            </article>
          ))}
        </div>
      )}
      {presentation === "list" &&
        category === "Todos" &&
        !query.trim() &&
        filtered.length > 3 && (
          <Button
            variant="ghost"
            className="agenda-more"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded
              ? "Mostrar menos"
              : `Ver los ${filtered.length} eventos del año`}{" "}
            <ArrowDown
              className={expanded ? "rotate-180" : ""}
              aria-hidden="true"
            />
          </Button>
        )}
    </>
  );
}
