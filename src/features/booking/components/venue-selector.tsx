"use client";
// Controlled section drill-down adapts the installed lavikatiyar/seat-selection
// interaction model to a 500-seat venue. No availability is stored in this view.
import { useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Map, Maximize2, X } from "lucide-react";
import type { DemoVenue, VenueSection } from "../fixtures";
import { MAX_SEATS, totalForSeats } from "../model";
import { formatPrice } from "@/features/event-discovery/model";
interface Props {
  venue: DemoVenue;
  selectedIds: readonly string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
  notice: string | null;
}
function money(amountMinor: number) {
  return formatPrice({ amountMinor, currency: "MXN" });
}
function Overview({
  venue,
  selectedIds,
  onSelect,
}: {
  venue: DemoVenue;
  selectedIds: readonly string[];
  onSelect: (section: VenueSection) => void;
}) {
  return (
    <div className="venue-floorplan">
      <div className="venue-stage">
        <span>ESCENARIO</span>
        <small>Frente del recinto</small>
      </div>
      <div className="venue-floor-grid">
        {venue.sections.map((section) => {
          const seats = venue.seats.filter((s) => s.sectionId === section.id),
            available = seats.filter((s) => !s.occupied).length,
            selected = seats.filter((s) => selectedIds.includes(s.id)).length;
          return (
            <button
              key={section.id}
              type="button"
              className={`venue-sector sector-${section.id}`}
              onClick={() => onSelect(section)}
              aria-label={`${section.name}, ${section.zone}, ${available} disponibles, ${selected} seleccionados`}
            >
              <span className="sector-title">
                {section.name}
                <ArrowRight size={17} />
              </span>
              <span className="sector-miniatures" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <i key={i} />
                ))}
              </span>
              <strong>
                {section.zone} · {money(section.amountMinor)}
              </strong>
              <small>
                {available} de 100 disponibles
                {selected > 0 ? ` · ${selected} elegidos` : ""}
              </small>
            </button>
          );
        })}
        <div className="venue-center" aria-hidden="true">
          <span>✳</span>
          {venue.arrangement === "tables"
            ? "PISTA / ÁREA CENTRAL"
            : "PASILLO CENTRAL"}
        </div>
      </div>
      <div className="venue-entrances">
        <span>↗ ACCESO A</span>
        <span>ACCESO PRINCIPAL ↑</span>
        <span>ACCESO B ↖</span>
      </div>
    </div>
  );
}
export function VenueSelector({
  venue,
  selectedIds,
  onToggle,
  onContinue,
  notice,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const id = useId();
  const [active, setActive] = useState<VenueSection | null>(null);
  const selected = venue.seats.filter((s) => selectedIds.includes(s.id));
  const showSection = (section: VenueSection | null) => {
    setActive(section);
    requestAnimationFrame(() => {
      body.current?.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    });
  };
  const sectionSeats = active
    ? venue.seats.filter((s) => s.sectionId === active.id)
    : [];
  const groups = [...new Set(sectionSeats.map((s) => s.group))];
  return (
    <>
      <div className="venue-preview">
        <p className="eyebrow">500 LUGARES · 5 SECCIONES</p>
        <h2>
          Encuentra tu lugar
          <br />
          <em>en el gran encuentro.</em>
        </h2>
        <p>
          Explora el recinto, entra a una sección y elige{" "}
          {venue.arrangement === "tables"
            ? "tu mesa y tus lugares"
            : "tus asientos"}
          .
        </p>
        <div className="venue-preview-plan" aria-hidden="true">
          <div>ESCENARIO</div>
          <span>A</span>
          <span>B</span>
          <span>C</span>
          <span>D</span>
          <span>E</span>
        </div>
        <button
          type="button"
          className="demo-button"
          onClick={() => {
            setActive(null);
            dialog.current?.showModal();
          }}
        >
          <Maximize2 size={18} /> Abrir mapa del recinto
        </button>
        <small>
          {venue.arrangement === "tables"
            ? "50 mesas de 10 lugares"
            : "50 filas de 10 asientos"}{" "}
          · Distribución de demostración
        </small>
      </div>
      <dialog
        ref={dialog}
        className="venue-dialog"
        aria-labelledby={`${id}-title`}
      >
        <div className="venue-dialog-header">
          <div>
            <p className="eyebrow">ELIGE DÓNDE VIVIRLO</p>
            <h2 id={`${id}-title`} ref={heading} tabIndex={-1}>
              {active
                ? `${active.name} · ${active.zone}`
                : "Explora el recinto"}
            </h2>
          </div>
          <button
            type="button"
            className="venue-close"
            aria-label="Cerrar mapa del recinto"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <div className="venue-dialog-body" ref={body}>
          <div className="venue-map-panel">
            <div className="venue-map-toolbar">
              {active ? (
                <button type="button" onClick={() => showSection(null)}>
                  <ArrowLeft size={17} /> Ver todas las secciones
                </button>
              ) : (
                <span>
                  <Map size={18} /> Vista general · 500 lugares
                </span>
              )}
              <span>
                {active
                  ? `${money(active.amountMinor)} MXN por lugar`
                  : "Elige una sección para acercarte"}
              </span>
            </div>
            {active ? (
              <div className="venue-section-detail">
                <div className="section-orientation">↑ HACIA EL ESCENARIO</div>
                <p className="section-instructions">
                  {venue.arrangement === "tables"
                    ? "Selecciona los lugares alrededor de cada mesa."
                    : "Selecciona tus asientos en la fila que prefieras."}
                </p>
                <div className={`venue-group-grid ${venue.arrangement}`}>
                  {groups.map((group) => (
                    <div className="venue-seat-group" key={group}>
                      <div className="venue-group-name">
                        {venue.arrangement === "tables"
                          ? `Mesa ${group.slice(1)}`
                          : `Fila ${group}`}
                      </div>
                      <div className="venue-group-seats">
                        {sectionSeats
                          .filter((s) => s.group === group)
                          .map((seat, index) => {
                            const chosen = selectedIds.includes(seat.id);
                            const angle =
                              (index / 10) * Math.PI * 2 - Math.PI / 2;
                            return (
                              <button
                                type="button"
                                key={seat.id}
                                disabled={seat.occupied}
                                aria-pressed={chosen}
                                aria-label={`${seat.label}, ${seat.occupied ? "ocupado" : chosen ? "seleccionado" : "disponible"}, ${money(seat.amountMinor)} MXN`}
                                onClick={() => onToggle(seat.id)}
                                style={
                                  venue.arrangement === "tables"
                                    ? {
                                        left: `${50 + 40 * Math.cos(angle)}%`,
                                        top: `${50 + 40 * Math.sin(angle)}%`,
                                      }
                                    : undefined
                                }
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Overview
                venue={venue}
                selectedIds={selectedIds}
                onSelect={showSection}
              />
            )}
          </div>
          <aside className="venue-selection">
            <p className="eyebrow">TU NOCHE EMPIEZA AQUÍ</p>
            <h3>
              {selected.length}{" "}
              {selected.length === 1 ? "lugar elegido" : "lugares elegidos"}
            </h3>
            <p>
              Hasta {MAX_SEATS} lugares por compra. Puedes combinar secciones.
            </p>
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
              dialog.current?.close();
              onContinue();
            }}
          >
            Continuar al checkout <ArrowRight size={17} />
          </button>
        </div>
      </dialog>
    </>
  );
}
