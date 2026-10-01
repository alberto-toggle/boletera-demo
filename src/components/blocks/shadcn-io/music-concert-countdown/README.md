# Music Concert Countdown

Origen: https://www.shadcn.io/blocks/music-concert-countdown
Registro: https://www.shadcn.io/r/music-concert-countdown.json (acceso autorizado).
Importado el 30 de septiembre de 2026. No se almacena el token.

Vista: `/playground/shadcn-io/music-concert-countdown`.

Adaptaciones:

- Imports `~/` convertidos a `@/` y ubicación separada por proveedor.
- Reutiliza Badge, Button, framer-motion, lucide-react y NumberFlow ya instalados.
- El original descontaba desde 47 días independientemente de la fecha mostrada.
  Ahora cuenta hasta `2026-11-17T20:00:00-05:00`, fecha de ejemplo futura al importar.
- Calcula desde el reloj actual cada segundo para evitar deriva por pausas en la
  pestaña; se detiene en cero y muestra Started cuando llega la fecha.
- Primer render con guiones para evitar diferencias de hidratación. Limpieza de
  temporizadores al desmontar, formato numérico explícito y movimiento reducido.
- Contador con semántica timer sin anuncios cada segundo y dos columnas en móvil.
- Compra y calendario deshabilitados, con nota de vista previa.
- Entrada en el catálogo compartido del índice y la navegación.
