import type { AdvancedMapProps } from "./interactive-map-types";

export const interactiveMapData: AdvancedMapProps = {
  center: [51.505, -0.09],
  zoom: 13,
  markers: [
    { id: "london", position: [51.505, -0.09], color: "blue", size: "medium", popup: {
      title: "London", content: "Capital of England",
      image: "https://cdn.21st.dev/assets/localized/2a96f091fa7b599f6752c827c4d5ba36fa15456d4d3a80a9aa89cf43aead2a9f.jpg",
    } },
    { id: "westminster", position: [51.51, -0.1], color: "red", size: "large", popup: { title: "Westminster", content: "Political center" } },
  ],
  polygons: [{ id: "area", positions: [[51.515, -0.09], [51.52, -0.1], [51.52, -0.12]], style: { color: "green", weight: 2, fillOpacity: 0.4 }, popup: "Área de ejemplo del autor" }],
  circles: [{ id: "radius", center: [51.508, -0.11], radius: 500, style: { color: "purple", fillOpacity: 0.3 }, popup: "Radio de 500 m" }],
};
