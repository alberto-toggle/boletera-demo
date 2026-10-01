# Glass Checkout Card

Origen: registro `@uitripled/glass-checkout-card-shadcnui` de UI TripleD.
Importado el 30 de septiembre de 2026 mediante shadcn.
Vista: `/playground/uitripled/glass-checkout-card-shadcnui`.

Adaptaciones:

- Destino ajustado a la estructura por proveedor acordada.
- Reutiliza Button, Card, Input y Label de Base UI Nova, sin sobrescribirlos.
- Conserva efecto de cristal, importe configurable (85.80 por defecto) y campos.
- Métodos con nombres accesibles, aria-pressed y foco visible. PayPal y Apple Pay
  muestran una nota de proveedor no conectado; conservan los campos al regresar.
- IDs únicos, teclados numéricos, límites de longitud y autocompletado desactivado.
- Espaciado local para Nova e iconos centrados verticalmente en los campos.
- Respeta movimiento reducido. Pago deshabilitado y texto de ejemplo explícito
  en lugar de afirmar que existe procesamiento seguro de pagos.
- No envía ni persiste datos. No implementa validación ni integración de pagos.
