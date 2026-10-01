# Glass Order Summary

Origen: registro `@uitripled/glass-order-summary-shadcnui` de UI TripleD.
Importado el 30 de septiembre de 2026 mediante shadcn.
Vista: `/playground/uitripled/glass-order-summary-shadcnui`.

Adaptaciones:

- Destino ajustado a `src/components/blocks/<proveedor>/<bloque>/<bloque>.tsx`.
- Reutiliza Button, Card y Separator Base UI Nova, sin sobrescribir primitivas.
- Conserva props, productos, importes y efecto de cristal originales. Los totales
  se reciben como props; no se recalculan automáticamente al cambiar items.
- Next Image sin optimización para las imágenes externas de Unsplash.
- Espaciado de Card ajustado localmente para Nova; jerarquía de encabezados y
  tamaños flexibles para productos en pantallas pequeñas.
- Animaciones respetan movimiento reducido. Pay Now deshabilitado con nota.
- Fondo decorativo limitado a la vista para apreciar el efecto de cristal.
