# Contexto y memorias del evento

Compartido por las cuatro direcciones visuales, con sus tokens de color y tipografía.
`model.ts` define contratos; `fixtures.ts` contiene perfiles tipados por categoría,
imágenes locales y tres ediciones anteriores ficticias. `getEventExperience` prepara
los datos en la página de servidor y los pasa al flujo. No se inventan direcciones
geográficas ni políticas confirmadas de sedes reales.

## Bloques adaptados

- `photo-gallery.tsx`: [Filmstrip Gallery](../../components/blocks/shadcn-ui-blocks/marketing-gallery-filmstrip-gallery/README.md).
  Reutiliza el desplazamiento horizontal, control de extremos, ResizeObserver y
  navegación por flechas. Recibe fotos tipadas; añade ampliación con diálogo nativo,
  cierre por Escape, texto en español y movimiento reducido.
- `past-events.tsx`: [Timeline 02](../../components/blocks/21st-dev/timeline-02/README.md).
  Conserva selección de fechas y transición entre historia/foto. Composición responsive,
  botones completos con aria-pressed y contenido anunciado al cambiar. Visible en
  las cuatro páginas de inicio; las ediciones son ejemplos, no un archivo real.
- `venue-map.tsx`: [Expand Map](../../components/blocks/21st-dev/expand-map/README.md).
  Adapta el mapa ilustrado, marcador y expansión; no depende de teselas ni servicios
  externos. La sede es ficticia y la dirección está por confirmar. Se indica que el
  croquis no sirve para llegar a un lugar real.

El detalle del evento incluye galería, programa relativo a la hora de inicio,
indicaciones de llegada y accesibilidad por confirmar. Se conserva el mapa de
selección al principio y enlaces para saltar entre secciones.

## Verificación

Galería/ampliación/Escape, selección de fechas, expansión del mapa y flujo completo
comprobados en Chrome en las cuatro rutas; vistas de escritorio y móvil. Sin errores
de consola. Estilos aislados del playground; no se sustituyen primitivas compartidas.

## Portada y galería del evento

`components/event-hero-gallery.tsx` unifica portada y fotos en las cuatro propuestas. Parte estática, reproducción voluntaria y regreso a portada. `gallery-strip-mask.ts` adapta las máscaras por franjas de [Scroll Gallery, soralabs](../../components/blocks/21st-dev/scroll-gallery/README.md), con GSAP temporal en lugar de ScrollTrigger. Se conserva la atribución y la nota de términos del origen.

El diálogo adapta navegación, miniaturas, teclado y gesto táctil de [Carousel Gallery](../../components/blocks/shadcn-ui-blocks/marketing-gallery-carousel-gallery/README.md), con datos del evento y diálogo nativo. Se detiene la reproducción al abrirlo, al ocultar la pestaña o salir de la vista; se respeta movimiento reducido. No depende de rutas del Playground.
