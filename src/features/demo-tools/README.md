# Herramientas de demostración

Widget compartido por las cuatro propuestas públicas y taquilla, montado una vez
por el layout raíz. Incluye navegación entre propuestas y un interruptor para
mostrar controles y ayudas. Por defecto están ocultos; la preferencia persiste en
`localStorage` con la clave `boletera-demo-tools-visible`, con sincronización entre
pestañas y respaldo en memoria si el almacenamiento no está disponible.

Marcar exclusivamente los nodos propios de la presentación con `data-demo`:
credenciales y códigos de ejemplo, autocompletado, salto del temporizador,
alerta manual, escenarios de pago y comparación de diseños. La marca agrega
borde discontinuo, azul saturado con texto blanco y etiqueta DEMO. No usar la clase histórica
`demo-button` para identificarlos: también la usan acciones reales de compra.

Ocultar usa CSS (`display: none`): retira los controles del layout y del recorrido
de teclado sin desmontar formularios ni reiniciar selección, pagos o cuenta.
Los estilos de las ayudas no dependen de los temas públicos ni de taquilla.
No se ocultan avisos de ausencia de cobros reales ni acciones de negocio como
verificar, comprar, extender una reserva o descargar boletos. Los cambios de
escenario ya elegidos se conservan al ocultar los controles.

Los diálogos de cuenta y verificación incluyen `DemoDialogTools` porque los
modales nativos bloquean la interacción con el widget del fondo. Comparten la
misma preferencia. El widget cierra con Escape, selección, salida de foco y clic
fuera. Las herramientas se excluyen de impresión.

Para extraer una aplicación a otro repositorio, omitir el widget, este CSS y los
accesos de diálogo. Los nodos `data-demo` señalan explícitamente el contenido que
se debe retirar; no cambian los contratos de los componentes de negocio.

## Restablecer demo

El inicio ofrece un reinicio confirmado de los datos propios de Boletera: cuentas,
compras, transferencias, cartera, ventas de taquilla y preferencias. Conserva los
ejemplos iniciales y no toca claves de otros proyectos. Se notifica mediante
`boletera-demo-reset-v1`; las pestañas abiertas se recargan y las sesiones de
taquilla antiguas se descartan al volver a abrirlas. No se usa `storage.clear()`.
