# Ticket Confirmation Card

Origen: 21st.dev, confirmado por el usuario. Integrado desde el código pegado; autor específico no indicado.

Conserva la apariencia de confirmación, datos originales, importes en USD y barras decorativas deterministas. Se añadió la directiva cliente, fecha fija con zona UTC explícita para evitar diferencias de hidratación, encabezado h2, soporte de la prop icon y dimensiones adaptables.

El confeti usa valores deterministas y un CSS Module, limitado al contenedor del bloque. Los temporizadores se limpian al desmontar y se respeta movimiento reducido. No se inyectan estilos globales ni se usan valores aleatorios durante el render. No realiza pagos ni emite entradas.

Vista: `/playground/21st-dev/ticket-confirmation-card`. Categoría: Boletos. Sin dependencias nuevas ni cambios en primitivas compartidas.
