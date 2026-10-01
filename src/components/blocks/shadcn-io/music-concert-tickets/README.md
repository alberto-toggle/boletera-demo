# Music Concert Tickets

Origen: https://www.shadcn.io/blocks/music-concert-tickets
Registro: https://www.shadcn.io/r/music-concert-tickets.json (acceso autorizado).
Importado el 30 de septiembre de 2026. No se almacena el token.

Vista: `/playground/shadcn-io/music-concert-tickets`.

Adaptaciones:

- Imports `~/` convertidos a `@/` y ubicación separada por proveedor.
- Reutiliza Badge, Button, framer-motion y lucide-react existentes.
- Añade `@number-flow/react`, importado por el original pero ausente en su lista
  de dependencias. Formato numérico explícito en inglés.
- Mantiene categorías, datos de ejemplo, cantidad de 1 a 10, comisión de 12 %
  y animación de precios. La comisión es del ejemplo, no una regla del proyecto.
- Límites de cantidad reflejados en botones deshabilitados; estado seleccionado
  accesible mediante aria-pressed y foco visible en categorías.
- Datos del evento con ajuste de línea y categorías en una columna en móvil.
- Contenido visible desde el render inicial; NumberFlow respeta movimiento reducido.
- Compra deshabilitada y marcada como vista previa, sin implementar checkout.
- Entrada en el catálogo común para aparecer en el índice y la navegación.
