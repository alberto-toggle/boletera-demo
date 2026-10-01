# Navbar Sidebar Toggle

Origen: https://www.shadcn.io/blocks/navbar-sidebar-toggle
Registro: https://www.shadcn.io/r/navbar-sidebar-toggle.json (acceso autorizado).
Importado el 30 de septiembre de 2026. No se almacena el token.

Adaptado como navegación compartida de `/playground` mediante su layout:

- Reutiliza Avatar y Button existentes; añade framer-motion.
- Sustituye enlaces de muestra por Next Link, con estado activo mediante usePathname.
- Catálogo común en `src/lib/playground.ts` para el índice y la navegación.
- Sustituye el contenido de muestra por children y elimina la altura fija.
- Barra lateral animada y contraíble en escritorio; menú desplegable en móvil.
- Respeta movimiento reducido, incluye nombres accesibles, aria-current,
  controles de expansión y enlace para saltar al contenido.
- La navegación compartida conserva su estado al cambiar de ruta.
