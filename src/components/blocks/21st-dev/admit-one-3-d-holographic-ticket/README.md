# Admit One 3D Holographic Ticket

Origen: código pegado por el usuario para el bloque `admit-one-3-d-holographic-ticket`, correspondiente al bloque de 21st.dev solicitado anteriormente. No se descargó nuevamente del registro ni se verificó autoría externa.

El archivo incluía componente, motor de shaders y demo concatenados. Se separaron y el componente suministrado se transpila a JavaScript en `admit-one-3-d-holographic-ticket.source.js`, sin conservar `@ts-nocheck`. Solo ese auxiliar generado se excluye de ESLint, siguiendo el patrón del otro Admit One Ticket. La interfaz pública y la adaptación de tamaño están en TypeScript y se verifican normalmente.

Adaptaciones: ancho máximo de 580 px con ResizeObserver, fondo morado alternativo si WebGL falla, captura de errores asíncronos y cancelación al desmontar, inclinación desactivada con movimiento reducido y ajuste de texto al área del boleto. Conserva los shaders y datos de la demo suministrada. No añade dependencias ni modifica primitivas o el otro boleto.

Vista: `/playground/21st-dev/admit-one-3-d-holographic-ticket`. Categoría: Boletos. La animación de textura requiere WebGL 2; sin él se muestra el degradado estático.
