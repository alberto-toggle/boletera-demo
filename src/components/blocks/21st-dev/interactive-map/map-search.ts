import type { LatLngTuple } from "leaflet";

export interface Place { position: LatLngTuple; name: string }

export async function searchPlace(query: string, signal: AbortSignal): Promise<Place | null> {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`, { signal });
  if (!response.ok) throw new Error("No se pudo consultar la búsqueda.");
  const result: unknown = await response.json();
  if (!Array.isArray(result) || result.length === 0) return null;
  const place: unknown = result[0];
  if (!place || typeof place !== "object" || !("lat" in place) || !("lon" in place) || !("display_name" in place)) throw new Error("Respuesta de búsqueda inválida.");
  const lat = Number(place.lat), lng = Number(place.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180 || typeof place.display_name !== "string") throw new Error("Coordenadas inválidas.");
  return { position: [lat, lng], name: place.display_name };
}
