# Calendar Event Details

Origen: https://www.shadcn.io/blocks/calendar-event-details
Registro: https://www.shadcn.io/r/calendar-event-details.json (acceso autorizado).
Importado el 30 de septiembre de 2026. No se almacena el token.

Vista: `/playground/shadcn-io/calendar-event-details`.

Adaptaciones:

- Imports `~/` convertidos a `@/` y ubicación separada por proveedor.
- Reutiliza Avatar, Badge, Button y lucide-react existentes.
- Conserva datos de reunión, asistentes y sus estados estáticos de ejemplo.
- Accept, Maybe y Decline modifican únicamente la respuesta local del visitante;
  no cambian la lista de asistentes ni envían confirmaciones.
- Estado seleccionado accesible mediante aria-pressed y grupo con nombre.
- Copia al portapapeles confirmada solo tras éxito; mensaje accesible ante error
  y limpieza del temporizador. URL visible seleccionable para copia manual.
- Botón Edit deshabilitado, pues el original no incluye su implementación.
- Encabezado subordinado al de la página e idioma inglés para el ejemplo.
- Filas de asistentes y acciones con ajuste de línea en pantallas pequeñas.
- Entrada en el catálogo compartido del índice y la navegación.
