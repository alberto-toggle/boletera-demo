# Seat Selection

Origen: código proporcionado por el usuario para `lavikatiyar/seat-selection` de 21st.dev. Instalado desde el archivo pegado, sin descargar el registro autenticado.

`seat-selection.tsx` conserva el componente controlado. `seat-selection-demo.tsx` aporta seis categorías: Preferente ($350), Clásico ($200), Balcón preferente ($180), Balcón central ($150), Lateral ($120) y General ($100). Son doce filas (A–L) de diez asientos, con pasillo y dieciocho asientos ocupados. Permite seleccionar, deseleccionar y limpiar entre categorías; muestra subtotal sin impuestos. Contenido en español e importes ficticios en pesos mexicanos (MXN), sin conversión de divisas, cálculo de impuestos ni reservas.

Adaptaciones: directiva cliente, sombra compatible con los colores del tema actual, movimiento reducido, botones de tipo button y filas sin saltos que mantienen el mapa mediante desplazamiento horizontal en móvil. Reutiliza Framer Motion y las primitivas existentes; no instala dependencias ni sobrescribe componentes compartidos.

Vista: `/playground/21st-dev/seat-selection`. Categoría: Selectores de asientos.
