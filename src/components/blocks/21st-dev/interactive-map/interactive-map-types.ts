import type { LatLngTuple, PathOptions } from "leaflet";

export interface MapMarker {
  id: string;
  position: LatLngTuple;
  color?: "blue" | "red" | "green" | "orange";
  size?: "small" | "medium" | "large";
  popup?: { title: string; content: string; image?: string };
}
export interface MapShape {
  id: string;
  positions: LatLngTuple[];
  style?: PathOptions;
  popup?: string;
}
export interface MapCircle {
  id: string;
  center: LatLngTuple;
  radius: number;
  style?: PathOptions;
  popup?: string;
}
export interface AdvancedMapProps {
  center: LatLngTuple;
  zoom?: number;
  markers: MapMarker[];
  polygons?: MapShape[];
  polylines?: MapShape[];
  circles?: MapCircle[];
}
