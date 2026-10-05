"use client";
// Selection remains controlled; the map shares one geometry at every scale.
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Map, Maximize2, Minimize2, X } from "lucide-react";
import type { DemoVenue } from "../fixtures";
import { VenueMap } from "./venue-map";
import { MAX_SEATS, totalForSeats } from "../model";
import { formatPrice } from "@/features/event-discovery/model";
interface Props {
  venue: DemoVenue;
  eventTitle: string;
  selectedIds: readonly string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
  notice: string | null;
}
function money(amountMinor: number) {
  return formatPrice({ amountMinor, currency: "MXN" });
}
export function VenueSelector({
  venue,
  eventTitle,
  selectedIds,
  onToggle,
  onContinue,
  notice,
}: Props) {
  const id = useId();
  const [showSelection, setShowSelection] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const shell = useRef<HTMLDialogElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = shell.current;
    if (!element) return;
    element.close();
    if (expanded) element.showModal();
    else element.show();
  }, [expanded]);
  const collapse = () => {
    setExpanded(false);
    requestAnimationFrame(() =>
      expandButton.current?.focus({ preventScroll: true }),
    );
  };
  const selected = venue.seats.filter((s) => selectedIds.includes(s.id));
  return (
    <dialog
      ref={shell}
      open
      className={`venue-workspace-shell${expanded ? " is-fullscreen" : ""}`}
      role={expanded ? "dialog" : "region"}
      aria-label="Selección de lugares"
      onCancel={(event) => {
        event.preventDefault();
        if (expanded) collapse();
      }}
    >
      <section
        className={`venue-workspace${showSelection ? " show-selection" : ""}`}
        aria-labelledby={`${id}-title`}
      >
        <div className="venue-dialog-header">
          <div>
            <h2 id={`${id}-title`}>{eventTitle}</h2>
            <p className="venue-step-label">Elige tus lugares · Paso 1 de 3</p>
          </div>
          <button
            ref={expandButton}
            type="button"
            className="venue-expand"
            aria-expanded={expanded}
            onClick={() => (expanded ? collapse() : setExpanded(true))}
          >
            {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            {expanded ? "Salir de pantalla completa" : "Ampliar mapa"}
          </button>
        </div>
        <div className="venue-dialog-body">
          <div className="venue-map-panel">
            <VenueMap
              venue={venue}
              selectedIds={selectedIds}
              onToggle={onToggle}
            />
          </div>
          <aside id={`${id}-selection`} className="venue-selection">
            <h3>
              {selected.length}{" "}
              {selected.length === 1 ? "lugar elegido" : "lugares elegidos"}
            </h3>
            <p>Puedes elegir hasta {MAX_SEATS} lugares.</p>
            <div className="seat-legend">
              <span>
                <i />
                Disponible
              </span>
              <span>
                <i className="selected" />
                Elegido
              </span>
              <span>
                <i className="occupied" />
                Ocupado
              </span>
            </div>
            {selected.length ? (
              <ul>
                {selected.map((seat) => (
                  <li key={seat.id}>
                    <div>
                      <strong>{seat.label}</strong>
                      <span>{money(seat.amountMinor)} MXN</span>
                    </div>
                    <button
                      type="button"
                      aria-label={`Quitar ${seat.label}`}
                      onClick={() => onToggle(seat.id)}
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="venue-selection-empty">
                <Map size={32} />
                <p>
                  Primero una sección.
                  <br />
                  Después, tu lugar favorito.
                </p>
              </div>
            )}
            <p role="status" className="venue-notice">
              {notice ??
                `${selected.length} de ${MAX_SEATS} lugares seleccionados`}
            </p>
          </aside>
        </div>
        <div className="venue-dialog-footer">
          <button
            type="button"
            className="venue-summary-toggle"
            aria-expanded={showSelection}
            aria-controls={`${id}-selection`}
            onClick={() => setShowSelection(!showSelection)}
          >
            {showSelection
              ? "Volver al mapa"
              : `Ver selección (${selected.length})`}
          </button>
          {notice && (
            <p className="venue-footer-notice" role="status">
              {notice}
            </p>
          )}
          <div>
            <span>{selected.length} lugares · Total de tu selección</span>
            <strong>
              {money(totalForSeats(selected))} <small>MXN</small>
            </strong>
          </div>
          <button
            type="button"
            className="demo-button"
            disabled={!selected.length}
            onClick={() => {
              onContinue();
            }}
          >
            Reservar y continuar <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </dialog>
  );
}
