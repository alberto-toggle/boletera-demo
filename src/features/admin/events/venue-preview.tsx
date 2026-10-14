import { banquetTables, BANQUET_PLAN_SCALE } from "@/domain/venues/banquet";
import { BanquetLandmarks } from "@/features/seating/banquet-landmarks";
import type { AdminEvent } from "../model";
export function VenuePreview({
  layout,
  zones,
}: Pick<AdminEvent, "layout" | "zones">) {
  if (layout === "banquet")
    return (
      <div className="admin-banquet-preview">
        <svg
          viewBox={`0 0 ${1400 * BANQUET_PLAN_SCALE} ${1270 * BANQUET_PLAN_SCALE}`}
          role="img"
          aria-label="Plano de cena baile: mesas 1 a 58 y A a H, pista central y acceso principal"
        >
          <BanquetLandmarks />
          {banquetTables.map((t) => (
            <g key={t.label}>
              <circle cx={t.x} cy={t.y} r="23" className="map-table" />
              <text
                x={t.x}
                y={t.y + 5}
                textAnchor="middle"
                className="map-section-label"
              >
                {t.label}
              </text>
            </g>
          ))}
        </svg>
        <p>66 mesas · 10 lugares por mesa · Precio único</p>
      </div>
    );
  return (
    <div
      className={`admin-venue-preview ${layout}`}
      role="img"
      aria-label={"Plano de referencia: cinco secciones de auditorio"}
    >
      <div className="admin-venue-stage">ESCENARIO</div>
      <div className="admin-venue-zones">
        {zones.map((zone) => (
          <div key={zone.id} className={`admin-venue-zone zone-${zone.id}`}>
            <strong>{zone.name}</strong>
            <div>
              {Array.from({ length: 15 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <small>{zone.capacity} lugares</small>
          </div>
        ))}
      </div>
      <span className="admin-venue-access">↑ ACCESO PRINCIPAL</span>
    </div>
  );
}
