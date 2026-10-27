import { BANQUET_PLAN_SCALE } from "@/domain/venues/banquet";
/** Shared SVG furniture; geometry follows the client floor plan, not a photograph. */
export function BanquetLandmarks({
  showRestrooms = true,
  bounds = { x: 25, y: 30, width: 1350, height: 1210 },
}: {
  showRestrooms?: boolean;
  bounds?: { x: number; y: number; width: number; height: number };
}) {
  return (
    <g
      className="banquet-landmarks"
      transform={`scale(${BANQUET_PLAN_SCALE})`}
      aria-label={
        showRestrooms
          ? "Pista central, DJ, sanitarios, bar y acceso principal"
          : "Pista central, DJ, bar y acceso principal"
      }
    >
      <rect
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
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
        <rect x="500" y="280" width="400" height="550" rx="10" />
        <text x="700" y="555" textAnchor="middle" dominantBaseline="middle">
          <tspan x="700">PISTA DE BAILE</tspan>
        </text>
      </g>
      {showRestrooms &&
        [
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
      <g
        transform={`translate(${bounds.x + bounds.width - 65} ${bounds.y + bounds.height - 130}) rotate(-55)`}
      >
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
      <text
        x="700"
        y={bounds.y + bounds.height - 65}
        textAnchor="middle"
        className="map-aisle"
      >
        HALL
      </text>
      <text
        x="700"
        y={bounds.y + bounds.height - 20}
        textAnchor="middle"
        className="map-aisle"
      >
        ↑ ACCESO PRINCIPAL
      </text>
    </g>
  );
}
