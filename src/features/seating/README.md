# Mapa compartido

`VenueMap` recibe `Venue`, IDs seleccionados, callbacks `onToggle`/`onToggleGroup` y `maxSeats` opcional (sin límite por defecto).
No consulta cuenta, rutas, almacenamiento ni catálogos. La composición es responsable
de validar disponibilidad al confirmar. Elegir una mesa agrega sus diez lugares de forma atómica; si hay algún lugar ocupado, se eligen los disponibles individualmente.

`venue-layout.ts` conserva una sola geometría para zoom, secciones y asientos.
`demo/create-venue.ts` es únicamente un generador de datos ilustrativos, separado
del contrato de dominio en `model.ts`.

Cargar `map.css` y definir `--paper`, `--ink`, `--muted`, `--line`, `--subtle` y
`--accent-tone`. La composición fija la altura del viewport del mapa. Dependencias:
React y Lucide. Las demos públicas mantienen sus ajustes de layout en booking.css;
la consolidación de esos ajustes sigue registrada en DT-001.

## Plano confirmado de cenas baile · 2026-10-14

`domain/venues/banquet.ts` es la única definición física: mesas 1–58 y A–H,
10 lugares por mesa. Las letras también se consideran mesas por indicación del
usuario. Se conservan las posiciones del plano fotografiado; no se trasladan
las cruces rosas como bloqueos permanentes. `banquet-landmarks.tsx` representa
DJ, pista, sanitarios, bar, hall y acceso principal; lo usa también el panel.
Las coordenadas son una reconstrucción esquemática, no medidas arquitectónicas.

La disponibilidad sigue siendo ilustrativa y aislada por canal. El catálogo
público y taquilla usan `M<mesa>-<lugar>`; administración adapta su inventario
`salon-<índice>` a la misma numeración física. No hay zonas de precio en este salón.
