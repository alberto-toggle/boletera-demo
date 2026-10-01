# Admit One Ticket

Origen: larsen66 en https://21st.dev/r/larsen66/admit-one-ticket.
Instalado desde el código completo copiado y proporcionado por el usuario; el registro requería autenticación.

- `admit-one-ticket.source.js`: exportación JavaScript suministrada, con motor de shaders incluido. Se conserva como auxiliar junto al bloque; únicamente este archivo generado queda excluido de ESLint.
- `admit-one-ticket.tsx`: interfaz TypeScript y tamaño adaptable mediante ResizeObserver.
- Demo: `/playground/21st-dev/admit-one-ticket`, registrada en el catálogo compartido.

Adaptaciones: separar componente y demo (el pegado incluía dos exportaciones default), cancelar inicialización asíncrona al desmontar, capturar fallos de WebGL y mantener un fondo degradado, respetar movimiento reducido también en la inclinación. La textura original necesita WebGL 2. La vista usa el motor generativo original y datos de ejemplo.

No se instalaron dependencias ni se modificaron primitivas compartidas. El bloque no realiza pagos ni genera boletos válidos.
