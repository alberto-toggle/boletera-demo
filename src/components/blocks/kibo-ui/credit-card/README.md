# Credit Card

Origen: registro `@kibo-ui/credit-card`, autor Hayden Bleasel.
Importado el 30 de septiembre de 2026 mediante shadcn.
Vista: `/playground/kibo-ui/credit-card`.

- Ubicado en `src/components/blocks/kibo-ui/credit-card` para separar el proveedor.
- Reutiliza `@/lib/utils`; instala `react-svg-credit-card-payment-icons`.
- Detección de hover mediante useSyncExternalStore para compatibilidad con
  renderizado en servidor y las reglas de ESLint del proyecto.
- Añade foco, giro con Enter/Espacio y respeto por movimiento reducido.
- Conserva giro por hover y toque del componente original.
- Ejemplo compuesto con frente, reverso, chip, marca y datos ficticios fijos.
- No captura datos, valida tarjetas ni procesa pagos; es una muestra visual.
