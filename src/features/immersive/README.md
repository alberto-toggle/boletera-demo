# Propuesta inmersiva

Ruta `/demo-inmersiva`, conectada a `/demo-inmersiva/eventos/[eventId]` y al
mismo catálogo, selección, checkout simulado y emisión de boletos de booking.

Adaptaciones de componentes ya evaluados en el playground:

- [anelkabag/navbar2](https://21st.dev/r/anelkabag/navbar2): estructura de menú
  flotante, panel expandible, columnas y vista previa. Navegación local, cierre
  con Escape y clic exterior, versión móvil y compactación al desplazar la página.
- [arunachalam/scroll-expansion-hero](https://21st.dev/r/arunachalam/scroll-expansion-hero):
  fotografía expansiva, título desplazable y contenedor sticky. Se usa el scroll
  del documento, sin capturar la rueda en un contenedor interno.
- [larsen66/admit-one-ticket](https://21st.dev/r/larsen66/admit-one-ticket):
  geometría de boleto con talón, perforación, paleta champán con texto ciruela y detalles dorados suaves, composición y tilt.
  Port tipado a SVG; el motor WebGL y el audio del original no se incorporan.
  La textura y las órbitas se resuelven con SVG y CSS. Se muestra como vista previa
  y como boleto emitido, con el asiento e identificador de la compra simulada.

Los originales y sus notas de procedencia se conservan en
`src/components/blocks/21st-dev`. La demo no importa scaffolding del playground.

La ruta usa tokens propios limitados a `.inmersiva`. El menú, hero y boleto son
límites de cliente; la composición de la página sigue en servidor. La preferencia
por movimiento reducido usa un snapshot estable durante hidratación. No se
oculta contenido a la espera de JavaScript. El boleto no acredita acceso real.

## Verificación

- TypeScript y ESLint sin errores; siete pruebas de reglas de compra aprobadas.
- Revisión visual en Chrome a 1440, 390 y 320 px; sin desbordamiento horizontal.
- Compra de dos lugares en escritorio y móvil, importe y dos boletos distintos.
- Menú compacto, enlaces de categorías, Escape, activación por teclado y
  preferencia de movimiento reducido comprobados.
- PDF del boleto generado e inspeccionado visualmente.
- Revisión CLI 21st sin errores ni advertencias; las sugerencias de colores
  literales corresponden a la dirección visual y al arte SVG del boleto.
