import type { AdminEvent } from "../model";
export function VenuePreview({
  layout,
  zones,
}: Pick<AdminEvent, "layout" | "zones">) {
  return (
    <div
      className={`admin-venue-preview ${layout}`}
      role="img"
      aria-label={
        layout === "banquet"
          ? "Plano de referencia: cinco zonas y pista de baile central"
          : "Plano de referencia: cinco secciones de auditorio"
      }
    >
      <div className="admin-venue-stage">ESCENARIO</div>
      <div className="admin-venue-zones">
        {zones.map((zone) => (
          <div key={zone.id} className={`admin-venue-zone zone-${zone.id}`}>
            <strong>{zone.name}</strong>
            <div>
              {Array.from(
                { length: layout === "banquet" ? 6 : 15 },
                (_, index) => (
                  <i key={index} />
                ),
              )}
            </div>
            <small>{zone.capacity} lugares</small>
          </div>
        ))}
        {layout === "banquet" && (
          <div className="admin-dance-floor">
            PISTA
            <br />
            DE BAILE
          </div>
        )}
      </div>
      <span className="admin-venue-access">↑ ACCESO PRINCIPAL</span>
    </div>
  );
}
