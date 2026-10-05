# Pago de demostración

`payment-details.tsx` adapta [Glass Checkout Card de UI TripleD](../../../../components/blocks/uitripled/glass-checkout-card-shadcnui/README.md): Card translúcida, entrada animada, campos con iconos y acciones de pago. Respeta movimiento reducido y los tokens de cada tema.

`credit-card.tsx` se extrae del [Credit Card de Kibo UI, Hayden Bleasel](../../../../components/blocks/kibo-ui/credit-card/README.md). Conserva frente, reverso, chip, Visa y giro por hover, toque y teclado. La composición usa los datos fijos del ejemplo y el nombre del comprador de prueba.

Los campos son de solo lectura, no capturan credenciales bancarias. Solo se muestra tarjeta; no se ofrecen proveedores desconectados. El botón de pago y la confirmación se inyectan desde checkout, manteniendo una única fuente para importes, reserva, resultados y emisión. Los bloques originales del Playground no se modifican.
