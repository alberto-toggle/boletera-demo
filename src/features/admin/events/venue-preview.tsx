import {
  configuredTables,
  banquetBounds,
  banquetView,
} from "@/domain/venues/banquet-configuration";
import { BanquetLandmarks } from "@/features/seating/banquet-landmarks";
import type { AdminEvent } from "../model";
export function VenuePreview({
  layout,
  zones,
  banquetConfiguration,
}: Pick<AdminEvent, "layout" | "zones" | "banquetConfiguration">) {
  if (layout === "banquet")
    return (
      <div className="admin-banquet-preview admin-banquet-map">
        <svg
          viewBox={Object.values(banquetView(banquetConfiguration)).join(" ")}
          role="img"
          aria-label="Plano de cena baile: mesas 1 a 58 y A a H, pista central y acceso principal"
        >
          <BanquetLandmarks
            showRestrooms={false}
            bounds={banquetBounds(banquetConfiguration)}
          />
          {configuredTables(banquetConfiguration).map((t) => (
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
        <p>
          {configuredTables(banquetConfiguration).length} mesas · 10 lugares por
          mesa · Precio único
        </p>
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
