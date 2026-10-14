# Compra de demostración

Recorrido conectado desde las cuatro propuestas de inicio:
`/demo-{institucional|gala|editorial|inmersiva}/eventos/[eventId]`.
El detalle presenta los datos esenciales y enlaza mediante **Elegir lugares** a la ruta `/compra`, dedicada al mapa.

## Responsabilidades

- `event-page.tsx`: valida el identificador contra las fixtures; un evento desconocido devuelve 404.
- `fixtures.ts`: recintos de demo: salón de 660 lugares (66 mesas de diez, precio único) y auditorio de 500 lugares por filas, con ocupación determinista.
- `model.ts`: estados excluyentes de selección, checkout, procesamiento, rechazo, expiración y confirmación. Reglas de selección, importes en centavos, datos del comprador y emisión única de boletos.
- `components/booking-flow.tsx`: composición, reducer local, temporizador limpiado al abandonar el checkout, foco al cambiar de paso y descarga de boletos.
- `components/seat-map.tsx`: selector controlado adaptado del playground; no contiene disponibilidad ni importes propios.
- `components/checkout.tsx`: identificación como invitado, registro o cuenta ficticia; verificación de correo o teléfono, clasificación de comprador/asistentes, resumen y pago simulado.
- `components/event-ticket.tsx`: un boleto por asiento, alimentado por la compra confirmada.
- `booking.css`: temas heredados de cada propuesta, disposición de mesas, responsive e impresión de boletos.

## Código efectivamente adaptado del playground

| Archivo de compra             | Bloque de origen                                                                                        | Cambios                                                                                                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/seat-map.tsx`     | [Seat Selection, lavikatiyar / 21st.dev](../../components/blocks/21st-dev/seat-selection/README.md)     | Copia del selector controlado; mesas además de filas, escenario, precios en centavos, español y render inicial estable con movimiento reducido.                                                                             |
| `components/checkout.tsx`     | [Checkout Event Tickets, shadcn.io](../../components/blocks/shadcn-io/checkout-event-tickets/README.md) | Adaptación de la cabecera, secciones de comprador y resumen; cantidades derivadas del mapa, sin nombres por asistente ni tarifa ficticia adicional, botón conectado a la simulación.                                        |
| `components/event-ticket.tsx` | [Theater Ticket, UI TripleD](../../components/blocks/uitripled/theater-ticket-shadcnui/README.md)       | Copia del boleto con talón perforado; datos reales de la compra de prueba, identificador individual, español e impresión. Se retiró la textura remota. QR legible del identificador individual, generado localmente en SVG. |

Se conservan las referencias originales y sus notas de procedencia en los README
vinculados. No se sustituyen primitivas compartidas, no se reinstalan bloques y
no se importa el scaffolding del playground. La tarjeta bancaria ilustrativa es
propia, contiene solo datos fijos y no solicita datos bancarios.

## Relación con los documentos funcionales

Referencias: `Boleteria_MVP_Funcional.docx.pdf` y
`Boleteria_Requerimientos_Funcionales.docx.pdf`, en la carpeta padre del proyecto.

- Flujo de compra web (§6.1 del MVP): evento → mapa → lugares → comprador → pago → boletos.
- RN-01/RN-02/RN-03: compra pendiente antes de pagar, confirmación completa y emisión de un boleto único por lugar; volver a enviar la acción de pago no duplica la emisión.
- RN-05/RN-06: apartado al continuar, expiración y liberación al volver, rechazar o expirar. El temporizador no es el único control: pagar después del límite también expira la compra.
- Datos del comprador: nombre y correo verificado. Clasificación público/militar, matrícula libre obligatoria para comprador militar y cantidad de asistentes militares; no un formulario por asistente.
- Compra y asistencia separadas: los boletos nacen con estado válido de prueba; esta pantalla no marca asistencia.
- Aclaración del usuario sobre cuentas: comprar como invitado es opcionalmente compatible con una sesión de cuenta ficticia. No se implementa autenticación real.

Los cinco minutos de apartado y las cuentas de ejemplo son decisiones **de demo**.
La distribución de cenas baile procede del plano del cliente y no tiene límite de
compra ni suplemento por zona. El auditorio conserva sus zonas de precio ilustrativas. El precio mostrado es el total de prueba, sin cargos adicionales.

## Límites explícitos

Toda la operación vive en memoria del navegador y se reinicia al recargar o salir
de la ruta. La disponibilidad no se sincroniza entre pestañas, usuarios ni taquilla;
no representa control real de concurrencia. No hay cobros ni correos enviados.
Los controles de aprobar/rechazar/expirar son herramientas de la simulación.
La confirmación descarga PDF mediante jsPDF, uno por boleto o todos en un archivo;
los boletos están marcados sin validez de acceso.

Esta ampliación cubre el recorrido del comprador. Administración, venta presencial,
validación de acceso y métricas de los documentos siguen pendientes; no se presentan
como implementados. Tampoco hay bandeja persistente de compras ni autenticación.

## Pruebas

Las comprobaciones en Chrome usan el servidor iniciado por el usuario.
No iniciar otro servidor sin su autorización.

La dirección `inmersiva` reutiliza las mismas reglas y formularios, y renderiza
`StatementTicket`, adaptación tipada de Admit One Ticket documentada en
`../immersive/README.md`, al confirmar la compra.

## Pago animado y QR

`payment-feedback.tsx` adapta el sello de éxito, composición y confeti determinista
[Ticket Confirmation Card](../../components/blocks/21st-dev/ticket-confirmation-card/README.md).
Autor del original no indicado en el código compartido. La secuencia visual dura
2.8 segundos y tiene un estado de dominio `processing`: bloquea nuevos envíos,
conserva la expiración y solo emite al terminar con resultado aprobado. Timers se
limpian al cambiar de paso/desmontar; rechazo y expiración no muestran éxito.
Confeti y trazado del sello son finitos y respetan movimiento reducido.

`ticket-qr.tsx` usa `@ark-ui/react/qr-code`, dependencia ya instalada. El bloque QR
del playground era un presentador de imágenes con placeholder, por lo que no se
usó como codificador. El QR SVG contiene únicamente `ticket.id`, con margen blanco,
contraste negro/blanco y corrección M; no transmite datos a servicios externos.
Todos los boletos, incluido Admit One de la cuarta propuesta, conservan también
el identificador legible. Se incluyen al imprimir y guardar PDF. QR legible no
implica un boleto autorizado: los identificadores DEMO no validan acceso real.

Referencias funcionales revisadas: RF-BOL-001 a RF-BOL-007 y RF-ACC-002 a
RF-ACC-004. No se implementan envío de correo ni un sistema de validación de puerta.

Verificado: doce pruebas de dominio, compra de dos asientos en las cuatro
propuestas, distintos QR por asiento, decodificación de los cuatro estilos y
lectura del QR desde el PDF renderizado. Revisión visual de PDF con la guía PDF.

## Exploración por secciones

`venue-selector.tsx` ocupa la ruta de compra. `venue-map.tsx` mantiene un único
plano SVG: acercarse a una sección anima la cámara, sin cambiar de pantalla.
`venue-layout.ts` calcula una sola geometría para las cinco secciones y sus 500
lugares; las filas siguen siendo filas y las mesas conservan sus diez lugares a
cualquier escala. El zoom revela números; la selección sigue en el reducer.

Hay arrastre, rueda, pellizco de dos dedos, controles de zoom y ajuste del recinto,
selector de secciones y teclado (flechas, +/−, Inicio). Se respeta movimiento
reducido. Total y continuación permanecen visibles. Volver desde identificación
conserva la selección. El límite anterior de ocho se retiró con la actualización de octubre de 2026.

Se adapta el patrón controlado de `lavikatiyar/seat-selection` instalado en el
playground, con una nueva composición de recinto y mesas de diez. `seat-map.tsx`
queda como adaptación anterior, sin uso en las rutas de compra. Ninguna selección
ni precio se guarda por duplicado dentro del mapa.

500 lugares es un escenario de demostración autorizado por el usuario a partir
del ejemplo RF-AFO-002; no un aforo confirmado de una sede. Los boletos identifican
sección, mesa/fila y lugar. La prueba de importes combina Preferente A con General C.

Validación de esta ampliación: TypeScript y ESLint sin errores; doce pruebas de
dominio aprobadas. Chrome: compra cruzando secciones, regreso con selección,
importe y QR en las cuatro propuestas; teclado, Escape/retorno de foco, límite de
ocho, retiro de lugares y vista por filas a 320 px. Sin errores de consola.

## Entrega de simplificación del recorrido

Inicio visual → detalle → mapa dedicado → contacto verificado → asistentes → pago → boletos. Reserva de cinco minutos desde «Reservar y continuar», con contador fijo y aviso al último minuto. Código de verificación simulado: `123456`. Registro y cuenta existente son simulaciones locales.

`ticket-pdf.ts` genera una página por boleto con jsPDF y QR vectorial mediante uqr, sin servicios externos. Descarga conjunta e individual; QR contiene solo el identificador DEMO. PDF renderizado y códigos decodificados para verificar legibilidad.

Validación: ocho compras completas (cuatro temas en escritorio y móvil), sin desbordamiento horizontal ni errores de ejecución. TypeScript, ESLint y doce pruebas de dominio.

## Login y registro del Playground

La identificación adapta Sign Up Split Panel (diarmuradi) y Modern & Stunning Sign In (preetsuthar17), conservando las fuentes en [auth/README.md](components/auth/README.md). Incluye acceso Google con selección de cuenta de prueba, contraseña visible/oculta, registro, login y compra como invitado. No usa OAuth real.

Verificado en Chrome: compra completa por registro, login, invitado con teléfono y Google en los cuatro temas; cancelación de Google conserva datos, código incorrecto rechazado, contraseña alternable, sin desbordamiento móvil ni errores de ejecución.

### PDF con el diseño seleccionado

`ticket-pdf.ts` usa `html-to-image` para capturar los componentes actuales a 3× y `jsPDF` para colocar un boleto por página A4, conservando sus proporciones y el QR. La exportación usa gráficos rasterizados de alta resolución; el texto no es seleccionable. La previsualización y las descargas individual/completa usan el mismo generador. El selector queda bloqueado durante la captura; se eliminan transformaciones interactivas y se excluyen los controles de desprendimiento.

## Ajustes de presentación de la demo (6 de octubre de 2026)

- Los mapas con mesas incluyen una pista de baile central no seleccionable;
  los mapas de filas conservan su pasillo. A y B tienen el mismo ancho que C, D y E;
  la pista ocupa el bloque central sobre D, entre A y B.
- Invitado y registro verifican exclusivamente correo electrónico; Google simulado
  se conserva. El teléfono del perfil no es una vía de autenticación o verificación.
- La reserva muestra un contador centrado con dígitos rodantes. «Alerta demo»
  conserva el fondo y pulsa icono y números. Se desactiva al repetir el clic,
  no altera el vencimiento y no se activa automáticamente por tiempo.
- El detalle permite mostrar u ocultar la cuenta regresiva al inicio del evento.
  Parte oculta y usa su fecha con zona horaria. Adapta el cálculo y NumberFlow del
  bloque Music Concert Countdown de shadcn.io ya descargado en Playground;
  los componentes de la demo no importan scaffolding del Playground.
- Ambos contadores respetan movimiento reducido y evitan anuncios cada segundo.

«Saltar a 00:10 · Demo» acorta el vencimiento del apartado activo a diez
segundos como máximo y deja actuar la expiración normal. No prolonga el plazo
ni está disponible durante el procesamiento/retención de un cobro.

## Actualización de recinto y reglas · 2026-10-14

Las cenas baile usan el plano compartido del cliente: 66 mesas (1–58 y A–H),
10 lugares cada una, 660 en total y precio único por evento. Venta en línea y
taquilla permiten lugares sueltos y mesas completas disponibles, sin el límite
anterior de ocho. Las ventas confirmadas son finales; cancelar un apartado sin
pago no equivale a cancelar una venta. Sin descuentos ni modo offline.

El evento destacado es Cena baile · Día de Muertos, 30 de octubre de 2026.
Nombre y fecha proceden del cliente; 19:00, $1,250 MXN, nombre del recinto,
textos complementarios y fotografía son datos ilustrativos autorizados.
Las marcas rosas del documento no son ocupación permanente del mapa.

Administración incluye cortesías por evento, exclusivas del perfil administrador:
se asigna un lugar libre, se persiste y se descarga un PDF para imprimir.
No son ventas ni ingresos; sí descuentan disponibilidad, protegen el lugar y
aparecen en Asistencia. Staff reconoce su código y conserva el primer ingreso.
El adaptador `features/access/demo/courtesies.ts` sincroniza estas invitaciones
entre pestañas del mismo origen con la clave `boletera-courtesies-demo-v1`.
No implica sincronización de todo el inventario con los canales de venta.

Los eventos administrativos antiguos de mesas se adaptan al aforo y precio único;
las configuraciones individuales del antiguo plano de cinco secciones se descartan
al migrar ese plano. Las ventas guardadas de taquilla conservan sus importes y
etiquetas históricas, aunque el catálogo cambie. Limpiar datos de demo permite
mostrar todos los ejemplos desde cero con la nueva distribución.
