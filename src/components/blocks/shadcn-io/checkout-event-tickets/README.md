# Checkout Event Tickets

Origen: https://www.shadcn.io/blocks/checkout-event-tickets
Registro: https://www.shadcn.io/r/checkout-event-tickets.json (acceso autorizado).
Importado el 30 de septiembre de 2026. No se almacena el token.

Vista: `/playground/shadcn-io/checkout-event-tickets`.

Adaptaciones:

- Imports `~/` convertidos a `@/` y ubicación separada por proveedor.
- Reutiliza Badge, Button y Separator; añade Input oficial con el preset Base UI Nova.
- Conserva tipos de boleto, cantidad de 1 a 10, campos de asistentes y resumen.
- Conserva comisión de ejemplo del 8 %, redondeada a unidades enteras como en el
  original. No representa una regla de negocio aprobada para Boletera.
- Nombres accesibles para controles, aria-pressed en tipos de boleto y foco visible.
- Campos de asistentes ajustables a pantallas pequeñas. Los valores solo viven
  en el estado local del componente; no se envían ni persisten.
- El mapa sigue siendo un placeholder. Compra deshabilitada con nota de vista previa.
- Los campos por asistente son parte del bloque original en evaluación, no una
  implementación de los requisitos del cliente (que solo piden datos del comprador).
- Entrada en el catálogo compartido del índice y la navegación.
