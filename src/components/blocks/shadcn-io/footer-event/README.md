# Footer Event

Origen: https://www.shadcn.io/blocks/footer-event
Registro: https://www.shadcn.io/r/footer-event.json (acceso autorizado).
Importado el 30 de septiembre de 2026. No se almacena el token.

Vista: `/playground/shadcn-io/footer-event`. Solo se monta en esta vista,
no como footer global del playground.

Adaptaciones:

- Imports `~/` convertidos a `@/` y ubicación separada por proveedor.
- Reutiliza Button, framer-motion y lucide-react existentes.
- Usa balanceo nativo de CSS (`text-balance`) en lugar de react-wrap-balancer,
  que insertaba un script al renderizar en cliente y provocaba un error de React.
- Conserva contenido de ejemplo y animaciones; respeta movimiento reducido.
- Elemento footer con idioma inglés; columnas apiladas en pantallas pequeñas y
  ajuste de línea en la llamada a la acción y la barra de copyright.
- Enlaces placeholder inactivos, sin saltos al inicio; Get Tickets deshabilitado.
- Entrada en el catálogo compartido del índice y la navegación.
