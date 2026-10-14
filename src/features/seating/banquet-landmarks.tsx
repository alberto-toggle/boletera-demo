import { BANQUET_PLAN_SCALE } from "@/domain/venues/banquet";
/** Shared SVG furniture; geometry follows the client floor plan, not a photograph. */
export function BanquetLandmarks() {
  return (
    <g
      className="banquet-landmarks"
      transform={`scale(${BANQUET_PLAN_SCALE})`}
      aria-label="Pista central, DJ, sanitarios, bar y acceso principal"
    >
      <rect
        x="25"
        y="30"
        width="1350"
        height="1210"
        rx="8"
        className="venue-shell"
      />
      <rect
        x="500"
        y="155"
        width="400"
        height="75"
        rx="8"
        className="map-stage"
      />
      <text x="700" y="184" textAnchor="middle" className="map-stage-label">
        D.J. “BOC PRODUCCIONES”
      </text>
      <text x="700" y="208" textAnchor="middle" className="map-stage-label">
        AGRUPACIONES MUSICALES
      </text>
      <g className="map-dance-floor">
        <rect x="540" y="350" width="320" height="320" rx="10" />
        <text x="700" y="515" textAnchor="middle">
          <tspan x="700">PISTA DE BAILE</tspan>
        </text>
      </g>
      {[
        { x: 55, y: 65 },
        { x: 1225, y: 65 },
        { x: 55, y: 1170 },
        { x: 1225, y: 1170 },
      ].map(({ x, y }) => (
        <g key={`${x}-${y}`}>
          <rect
            x={x}
            y={y}
            width="120"
            height="42"
            rx="4"
            className="map-section-ground"
          />
          <text
            x={x + 60}
            y={y + 25}
            textAnchor="middle"
            className="map-section-label"
          >
            SANITARIOS
          </text>
        </g>
      ))}
      <g transform="translate(1310 1110) rotate(-55)">
        <rect
          x="-30"
          y="-12"
          width="60"
          height="24"
          className="map-section-ground"
        />
        <text textAnchor="middle" y="4" className="map-section-label">
          BAR
        </text>
      </g>
      <text x="700" y="1175" textAnchor="middle" className="map-aisle">
        HALL
      </text>
      <text x="700" y="1220" textAnchor="middle" className="map-aisle">
        ↑ ACCESO PRINCIPAL
      </text>
    </g>
  );
}
