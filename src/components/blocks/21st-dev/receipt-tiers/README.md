# Receipt Tiers

Origen: 21st.dev, confirmado por el usuario. Integrado desde el código pegado; autor específico no indicado.

Se conserva el diseño de recibos y los tres planes de la demo. Se reconstruyeron los auxiliares ausentes `types` y `reveal` a partir de las interfaces utilizadas. La animación usa un CSS Module e IntersectionObserver con limpieza y movimiento reducido; el contenido permanece visible si no hay observer. No se inyectan estilos en el render.

Adaptaciones: importaciones locales, formato monetario con centavos, características completas sin truncamiento y CTA desactivadas por tratarse de una demo sin contratación. La propiedad `annual` representa la tarifa mensual con facturación anual, tal como la muestra el original. No se instalaron dependencias ni se modificaron primitivas.

Vista: `/playground/21st-dev/receipt-tiers`. Categoría: Boletos. Las indicaciones genéricas del archivo sobre `/components/ui` se adaptaron a la organización acordada del workspace.
