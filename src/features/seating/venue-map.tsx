"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CircleAlert, Minus, Plus, RotateCcw } from "lucide-react";

import type { Venue as DemoVenue } from "./model";
import {
  constrainCamera,
  focusBox,
  layoutVenue,
  VENUE_VIEW,
  type MapBox,
} from "./venue-layout";
import { formatPrice } from "./model";

export function VenueMap({
  venue,
  selectedIds,
  onToggle,
  maxSeats = 8,
}: {
  maxSeats?: number;
  venue: DemoVenue;
  selectedIds: readonly string[];
  onToggle: (id: string) => void;
}) {
  const [limitHint, setLimitHint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const hintTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const atLimit = selectedIds.length >= maxSeats;
  useEffect(
    () => () => {
      if (hintTimeout.current) clearTimeout(hintTimeout.current);
    },
    [],
  );
  function selectSeat(id: string, element: SVGGElement) {
    if (hintTimeout.current) clearTimeout(hintTimeout.current);
    if (atLimit && !selectedIds.includes(id)) {
      const bounds = canvas.current?.getBoundingClientRect();
      const seat = element.getBoundingClientRect();
      if (bounds)
        setLimitHint({
          x: Math.max(
            12,
            Math.min(
              bounds.width - 272,
              seat.x + seat.width / 2 - bounds.x - 130,
            ),
          ),
          y: Math.max(
            12,
            Math.min(bounds.height - 100, seat.y - bounds.y - 90),
          ),
        });
      hintTimeout.current = setTimeout(() => setLimitHint(null), 4500);
      return;
    }
    setLimitHint(null);
    onToggle(id);
  }
  const sections = useMemo(() => layoutVenue(venue), [venue]);
  const [camera, setCamera] = useState(VENUE_VIEW);
  const current = useRef(camera);
  const svg = useRef<SVGSVGElement>(null);
  const frame = useRef(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragged = useRef(false);
  const helpId = useId();
  const detailed = camera.width < 640;
  const focusedSection = detailed
    ? sections.find(({ box }) => {
        const x = camera.x + camera.width / 2,
          y = camera.y + camera.height / 2;
        return (
          x >= box.x &&
          x <= box.x + box.width &&
          y >= box.y &&
          y <= box.y + box.height
        );
      })
    : undefined;
  function move(next: MapBox, animate = false) {
    setLimitHint(null);
    cancelAnimationFrame(frame.current);
    const target = constrainCamera(next);
    const start = current.current;
    const update = (value: MapBox) => {
      current.current = value;
      setCamera(value);
    };
    if (
      !animate ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      update(target);
      return;
    }
    const beginning = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - beginning) / 480);
      const t = 1 - Math.pow(1 - progress, 3);
      update({
        x: start.x + (target.x - start.x) * t,
        y: start.y + (target.y - start.y) * t,
        width: start.width + (target.width - start.width) * t,
        height: start.height + (target.height - start.height) * t,
      });
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }
  function worldPoint(x: number, y: number) {
    const matrix = svg.current?.getScreenCTM();
    return matrix
      ? new DOMPoint(x, y).matrixTransform(matrix.inverse())
      : { x: 500, y: 500 };
  }
  function zoom(
    factor: number,
    point?: { x: number; y: number },
    animate = true,
  ) {
    const c = current.current;
    const p = point ?? { x: c.x + c.width / 2, y: c.y + c.height / 2 };
    const width = Math.min(1060, Math.max(140, c.width * factor));
    move(
      {
        x: p.x - ((p.x - c.x) * width) / c.width,
        y: p.y - ((p.y - c.y) * width) / c.width,
        width,
        height: width,
      },
      animate,
    );
  }
  useEffect(() => {
    const element = svg.current;
    const preventScroll = (event: WheelEvent) => event.preventDefault();
    element?.addEventListener("wheel", preventScroll, { passive: false });
    return () => {
      cancelAnimationFrame(frame.current);
      element?.removeEventListener("wheel", preventScroll);
    };
  }, []);
  return (
    <div className="continuous-venue">
      <div className="venue-map-toolbar">
        <label>
          Sección{" "}
          <select
            aria-label="Acercar a una sección"
            value={focusedSection?.id ?? ""}
            onChange={(event) => {
              const section = sections.find((s) => s.id === event.target.value);
              move(section ? focusBox(section.box) : VENUE_VIEW, true);
            }}
          >
            <option value="">Todo el recinto</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.zone}
              </option>
            ))}
          </select>
        </label>
        <span
          id={helpId}
          role="status"
          className={atLimit ? "venue-limit-reached" : undefined}
        >
          {atLimit ? (
            <>
              <CircleAlert size={22} aria-hidden="true" />
              <span>
                <strong>Llegaste al máximo de {maxSeats} lugares.</strong>
                <span>Quita un lugar si deseas cambiar tu selección.</span>
              </span>
            </>
          ) : (
            "Arrastra para explorar · + / − para acercar"
          )}
        </span>
      </div>
      <div className="venue-map-canvas" ref={canvas}>
        <svg
          ref={svg}
          className="venue-world"
          viewBox={`${camera.x} ${camera.y} ${camera.width} ${camera.height}`}
          role="group"
          aria-label="Mapa interactivo del recinto"
          aria-describedby={helpId}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            const c = current.current;
            const step = c.width * 0.12;
            if (
              [
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "+",
                "=",
                "-",
                "Home",
              ].includes(event.key)
            )
              event.preventDefault();
            if (event.key === "+" || event.key === "=") zoom(0.75);
            if (event.key === "-") zoom(1.33);
            if (event.key === "Home") move(VENUE_VIEW, true);
            if (event.key.startsWith("Arrow"))
              move({
                ...c,
                x:
                  c.x +
                  (event.key === "ArrowLeft"
                    ? -step
                    : event.key === "ArrowRight"
                      ? step
                      : 0),
                y:
                  c.y +
                  (event.key === "ArrowUp"
                    ? -step
                    : event.key === "ArrowDown"
                      ? step
                      : 0),
              });
          }}
          onWheel={(event) => {
            zoom(
              Math.exp(Math.max(-0.2, Math.min(0.2, event.deltaY * 0.002))),
              worldPoint(event.clientX, event.clientY),
              false,
            );
          }}
          onPointerDown={(event) => {
            dragged.current = false;
            pointers.current.set(event.pointerId, {
              x: event.clientX,
              y: event.clientY,
            });
          }}
          onPointerMove={(event) => {
            const before = pointers.current.get(event.pointerId);
            if (!before) return;
            const after = { x: event.clientX, y: event.clientY };
            const other = [...pointers.current.entries()].find(
              ([id]) => id !== event.pointerId,
            )?.[1];
            if (Math.hypot(after.x - before.x, after.y - before.y) > 2)
              dragged.current = true;
            if (dragged.current)
              event.currentTarget.setPointerCapture(event.pointerId);
            if (other) {
              dragged.current = true;
              const oldDistance = Math.hypot(
                before.x - other.x,
                before.y - other.y,
              );
              const distance = Math.hypot(after.x - other.x, after.y - other.y);
              if (distance > 0)
                zoom(
                  oldDistance / distance,
                  worldPoint((after.x + other.x) / 2, (after.y + other.y) / 2),
                  false,
                );
            } else {
              const from = worldPoint(before.x, before.y),
                to = worldPoint(after.x, after.y);
              move({
                ...current.current,
                x: current.current.x + from.x - to.x,
                y: current.current.y + from.y - to.y,
              });
            }
            pointers.current.set(event.pointerId, after);
          }}
          onPointerUp={(event) => {
            pointers.current.delete(event.pointerId);
          }}
          onPointerCancel={(event) => {
            pointers.current.delete(event.pointerId);
            dragged.current = true;
          }}
        >
          <rect
            x="20"
            y="10"
            width="960"
            height="990"
            rx="45"
            className="venue-shell"
          />
          <rect
            x="320"
            y="40"
            width="360"
            height="65"
            rx="12"
            className="map-stage"
          />
          <text x="500" y="79" textAnchor="middle" className="map-stage-label">
            ESCENARIO
          </text>
          {venue.arrangement === "tables" ? (
            <g
              aria-label="Pista de baile, área no seleccionable"
              className="map-dance-floor"
            >
              <rect x="360" y="150" width="280" height="360" rx="12" />
              <text x="500" y="325" textAnchor="middle">
                <tspan x="500">PISTA</tspan>
                <tspan x="500" dy="26">
                  DE BAILE
                </tspan>
              </text>
            </g>
          ) : (
            <text x="500" y="550" textAnchor="middle" className="map-aisle">
              PASILLO CENTRAL
            </text>
          )}
          <text x="500" y="979" textAnchor="middle" className="map-aisle">
            ↑ ACCESO PRINCIPAL
          </text>
          {sections.map((section) => (
            <g key={section.id} data-section={section.id}>
              <rect {...section.box} rx="12" className="map-section-ground" />
              <text
                x={section.box.x + section.box.width / 2}
                y={section.box.y + 26}
                textAnchor="middle"
                className="map-section-label"
              >
                {section.name} · {section.zone}
              </text>
              <text
                x={section.box.x + section.box.width / 2}
                y={section.box.y + 43}
                textAnchor="middle"
                className="map-section-price"
              >
                {formatPrice({
                  amountMinor: section.amountMinor,
                  currency: "MXN",
                })}{" "}
                MXN / lugar
              </text>
              {section.groups.map((group) => (
                <g key={group.name}>
                  {venue.arrangement === "tables" && (
                    <circle
                      cx={group.x}
                      cy={group.y}
                      r="15"
                      className="map-table"
                    />
                  )}
                  <text
                    x={group.x}
                    y={group.y + 3}
                    textAnchor="middle"
                    className="map-group-label"
                  >
                    {group.name}
                  </text>
                  {group.seats.map((seat) => {
                    const chosen = selectedIds.includes(seat.id);
                    const visible =
                      detailed &&
                      seat.x > camera.x &&
                      seat.x < camera.x + camera.width &&
                      seat.y > camera.y &&
                      seat.y < camera.y + camera.height;
                    return (
                      <g
                        key={seat.id}
                        role="button"
                        tabIndex={visible && !seat.occupied ? 0 : -1}
                        aria-disabled={seat.occupied}
                        aria-pressed={chosen}
                        aria-label={`${seat.label}, ${seat.occupied ? "ocupado" : chosen ? "seleccionado" : "disponible"}, ${formatPrice({ amountMinor: seat.amountMinor, currency: "MXN" })} MXN`}
                        className={`map-seat${chosen ? " chosen" : ""}${seat.occupied ? " occupied" : ""}`}
                        onClick={(event) => {
                          if (!dragged.current && detailed && !seat.occupied)
                            selectSeat(seat.id, event.currentTarget);
                        }}
                        onKeyDown={(event) => {
                          if (
                            (event.key === "Enter" || event.key === " ") &&
                            !seat.occupied
                          ) {
                            event.preventDefault();
                            selectSeat(seat.id, event.currentTarget);
                          }
                        }}
                      >
                        <title>{seat.label}</title>
                        <circle
                          cx={seat.x}
                          cy={seat.y}
                          r="9"
                          className="map-seat-hit"
                        />
                        <circle
                          cx={seat.x}
                          cy={seat.y}
                          r={venue.arrangement === "tables" ? 5.2 : 7}
                        />
                        {detailed && (
                          <text x={seat.x} y={seat.y + 2.5} textAnchor="middle">
                            {chosen ? "✓" : seat.number}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              ))}
              {!detailed && (
                <rect
                  {...section.box}
                  rx="12"
                  className="map-section-target"
                  role="button"
                  tabIndex={0}
                  aria-label={`Acercar a ${section.name}, ${section.zone}`}
                  onClick={() => {
                    if (!dragged.current) {
                      svg.current?.focus({ preventScroll: true });
                      move(focusBox(section.box), true);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      svg.current?.focus({ preventScroll: true });
                      move(focusBox(section.box), true);
                    }
                  }}
                />
              )}
            </g>
          ))}
        </svg>
        {atLimit && limitHint && (
          <div
            className="venue-limit-hint"
            role="status"
            style={{ left: limitHint.x, top: limitHint.y }}
          >
            <strong>Llegaste al máximo de {maxSeats} lugares.</strong>
            <span>Quita un lugar si deseas cambiar tu selección.</span>
            <button
              type="button"
              aria-label="Cerrar aviso de límite"
              onClick={() => setLimitHint(null)}
            >
              ×
            </button>
          </div>
        )}
        <div className="venue-camera-controls" aria-label="Controles del mapa">
          <button
            type="button"
            aria-label="Ver todo el recinto"
            onClick={() => move(VENUE_VIEW, true)}
          >
            <RotateCcw size={19} />
          </button>
          <button
            type="button"
            aria-label="Acercar mapa"
            disabled={camera.width <= 140}
            onClick={() => zoom(0.72)}
          >
            <Plus size={20} />
          </button>
          <button
            type="button"
            aria-label="Alejar mapa"
            disabled={camera.width >= 1060}
            onClick={() => zoom(1.4)}
          >
            <Minus size={20} />
          </button>
        </div>
        <span className="venue-camera-caption">
          {detailed
            ? "Selecciona tus lugares"
            : "Toca una sección para acercarte"}
        </span>
      </div>
    </div>
  );
}
