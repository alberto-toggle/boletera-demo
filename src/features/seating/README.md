# Mapa compartido

`VenueMap` recibe `Venue`, IDs seleccionados, callback `onToggle` y `maxSeats`.
No consulta cuenta, rutas, almacenamiento ni catálogos. La composición es responsable
de validar disponibilidad y límite al confirmar; el mapa también indica el límite.

`venue-layout.ts` conserva una sola geometría para zoom, secciones y asientos.
`demo/create-venue.ts` es únicamente un generador de datos ilustrativos, separado
del contrato de dominio en `model.ts`.

Cargar `map.css` y definir `--paper`, `--ink`, `--muted`, `--line`, `--subtle` y
`--accent-tone`. La composición fija la altura del viewport del mapa. Dependencias:
React y Lucide. Las demos públicas mantienen sus ajustes de layout en booking.css;
la consolidación de esos ajustes sigue registrada en DT-001.
