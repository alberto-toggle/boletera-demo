"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { type LatLngTuple } from "leaflet";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchPlace, type Place } from "./map-search";
import type { AdvancedMapProps, MapMarker } from "./interactive-map-types";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

function createIcon(color: MapMarker["color"] = "blue", size: MapMarker["size"] = "medium") {
  const sizes: Record<NonNullable<MapMarker["size"]>, [number, number]> = { small: [20, 32], medium: [25, 41], large: [30, 50] };
  const [width, height] = sizes[size];
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://cdn.21st.dev/assets/mirror/26/264f5c640339f042dd729062cfc04c17f8ea0f29882b538e3848ed8f10edb4da.png",
    iconSize: [width, height], iconAnchor: [width / 2, height], popupAnchor: [0, -height + 7], shadowSize: [41, 41],
  });
}

function MapInteraction({ destination }: { destination: Place | null }) {
  const [clicked, setClicked] = useState<LatLngTuple | null>(null);
  const reducedMotion = useReducedMotion();
  const map = useMapEvents({ click: (event) => setClicked([event.latlng.lat, event.latlng.lng]) });
  useEffect(() => {
    if (destination) map.flyTo(destination.position, 13, { animate: !reducedMotion });
  }, [destination, map, reducedMotion]);
  return <>
    {destination && <Marker position={destination.position} icon={createIcon("green", "large")}><Popup>{destination.name}</Popup></Marker>}
    {clicked && <Marker position={clicked} icon={createIcon("orange", "small")}><Popup>Lat: {clicked[0].toFixed(6)}<br />Lng: {clicked[1].toFixed(6)}</Popup></Marker>}
  </>;
}

function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export default function AdvancedMap({ center, zoom = 13, markers, polygons = [], circles = [], polylines = [] }: AdvancedMapProps) {
  const [satellite, setSatellite] = useState(false);
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState<Place | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const request = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  const lastSearch = useRef(0);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; request.current?.abort(); };
  }, []);

  async function search() {
    if (!query.trim() || busy || Date.now() - lastSearch.current < 1100) return;
    lastSearch.current = Date.now();
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setMessage("Buscando…");
    try {
      const place = await searchPlace(query.trim(), controller.signal);
      if (controller.signal.aborted) return;
      if (place) setDestination(place);
      setMessage(place ? place.name : "No se encontraron resultados.");
    } catch (error) {
      if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "No se pudo buscar.");
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  function locate() {
    if (!navigator.geolocation) { setMessage("Tu navegador no admite geolocalización."); return; }
    setMessage("Solicitando ubicación…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!mounted.current) return;
        setDestination({ position: [coords.latitude, coords.longitude], name: "Tu ubicación" });
        setMessage("Ubicación encontrada.");
      },
      () => { if (mounted.current) setMessage("No se pudo obtener la ubicación. Revisa los permisos del navegador."); },
      { timeout: 10000 },
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <form onSubmit={(event) => { event.preventDefault(); void search(); }} className="flex min-w-0 flex-1 gap-2">
          <Input aria-label="Buscar un lugar" placeholder="Buscar lugares…" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Button type="submit" disabled={busy || !query.trim()}>Buscar</Button>
        </form>
        <Button variant="outline" onClick={locate}>Mi ubicación</Button>
        <Button variant="outline" aria-pressed={satellite} onClick={() => setSatellite((value) => !value)}>Satélite</Button>
      </div>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">{message || "Selecciona un marcador o pulsa el mapa para ver sus coordenadas."}</p>
      <div className="relative isolate h-[600px] max-h-[80svh] min-h-80 overflow-hidden rounded-xl border">
        <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom={false}>
          {satellite
            ? <TileLayer key="satellite" attribution='&copy; <a href="https://www.esri.com/">Esri</a>' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            : <TileLayer key="streets" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />}
          <ResizeMap />
          <MapInteraction destination={destination} />
          <MarkerClusterGroup>
            {markers.map((marker) => <Marker key={marker.id} position={marker.position} icon={createIcon(marker.color, marker.size)}>
              {marker.popup && <Popup><h3>{marker.popup.title}</h3><p>{marker.popup.content}</p>{marker.popup.image && <Image src={marker.popup.image} alt={marker.popup.title} width={300} height={200} unoptimized className="h-auto max-w-full" />}</Popup>}
            </Marker>)}
          </MarkerClusterGroup>
          {polygons.map((shape) => <Polygon key={shape.id} positions={shape.positions} pathOptions={shape.style}>{shape.popup && <Popup>{shape.popup}</Popup>}</Polygon>)}
          {circles.map((shape) => <Circle key={shape.id} center={shape.center} radius={shape.radius} pathOptions={shape.style}>{shape.popup && <Popup>{shape.popup}</Popup>}</Circle>)}
          {polylines.map((shape) => <Polyline key={shape.id} positions={shape.positions} pathOptions={shape.style}>{shape.popup && <Popup>{shape.popup}</Popup>}</Polyline>)}
        </MapContainer>
      </div>
    </div>
  );
}
