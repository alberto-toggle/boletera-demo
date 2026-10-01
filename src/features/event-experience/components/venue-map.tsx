"use client";
// Adapted from jatin-yadav05/expand-map: expanding illustrated roads and location pin.
import { useId, useState } from "react";
import { MapPin, Maximize2, Minimize2 } from "lucide-react";
export function VenueMap({ venue, city }: { venue: string; city: string }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <div className={`venue-map ${expanded ? "is-expanded" : ""}`}>
      <div className="venue-map-art" id={id}>
        <svg
          viewBox="0 0 700 330"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <rect width="700" height="330" fill="var(--muted)" />
          <path
            d="M0 50H700 M0 150H700 M0 280H700 M100 0V330 M350 0V330 M580 0V330"
            stroke="var(--paper)"
            strokeWidth="25"
          />
          <path d="M-40 310 560-40" stroke="var(--paper)" strokeWidth="38" />
          <rect
            x="390"
            y="180"
            width="155"
            height="65"
            rx="8"
            fill="var(--accent-tone)"
            opacity=".18"
          />
          <path
            d="M410 195h100m-100 15h100m-100 15h100"
            stroke="var(--accent-tone)"
            opacity=".4"
          />
          <rect
            x="155"
            y="80"
            width="145"
            height="45"
            rx="5"
            fill="var(--line)"
          />
        </svg>
        <div className="venue-pin">
          <MapPin size={35} />
          <strong>{venue}</strong>
          <span>Punto ilustrativo</span>
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}{" "}
          {expanded ? "Reducir mapa" : "Ampliar mapa"}
        </button>
        <span className="map-caption">CROQUIS DE DEMOSTRACIÓN</span>
      </div>
      <div className="venue-map-caption">
        <strong>
          {venue} · {city}
        </strong>
        <p>
          Sede ficticia. Dirección y ubicación exacta por confirmar; este
          croquis no sirve como indicación de llegada.
        </p>
      </div>
    </div>
  );
}
