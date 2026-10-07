# Vendedor · Demo de taquilla

Entrada: `/operacion/vendedor`. En el acceso, elegir **Usar datos de ejemplo** y
**Iniciar sesión**. Credenciales ficticias: `vendedor@example.com` / `Demo2027`.
No son autenticación ni permisos reales.

## Límites y responsabilidades

- Route group `(operacion)/(vendedor)` con layout propio. No importa el layout,
  checkout ni CSS de las propuestas públicas. La integración de cuentas está
  aislada en un adaptador de demo.
- `seller-app.tsx` es el adaptador de navegación Next.js y composición de la demo.
- `components/` presenta datos y emite callbacks; no consulta persistencia.
  `seller-shell.tsx` es intercambiable y no está incrustado en el flujo de venta.
- `model.ts` define contratos, importes en centavos MXN, validación y reglas.
- `demo/fixtures.ts` adapta el catálogo público para conservar las fotografías y
  eventos existentes. Esta dependencia de catálogo puede
  sustituirse al extraer el módulo. El recinto ficticio viene de `seating/demo`.
- `demo/store.ts` coordina operaciones y persistencia en `sessionStorage`, validada
  al leer. Estado de ventas propio por pestaña; disponibilidad aislada de la compra
  pública. Sin almacenamiento disponible usa memoria.
  La clave es `boletera-seller-demo-v1`: cerrar sesión conserva las ventas y
  reiniciar el servidor no borra el almacenamiento del navegador. Antes de leer
  la sesión se muestra una pantalla neutral de carga, nunca un login provisional.
- `demo/account-bridge.ts` expone cuentas de ejemplo y publica únicamente ventas
  confirmadas vinculadas explícitamente por el vendedor en el historial del
  comprador. Conserva la sesión del comprador y evita duplicar la orden. Sustituir
  este adaptador por un servicio al trasladar el módulo.
- `seating/` contiene mapa, geometría y contratos neutrales extraídos del flujo
  público. Las entradas antiguas de booking reexportan estas piezas para mantener
  compatibilidad. El límite se pasa explícitamente desde vendedor.
- `tickets/` contiene una presentación de boleto independiente del comprador y el
  generador PDF compartido, extraído sin cambiar su algoritmo. Un boleto por página.
- Primitivas Base UI en `components/ui/button`; iconos Lucide. El mapa conserva la
  implementación de cámara continua ya utilizada por las demos públicas. QR con
  Ark UI; PDF con jsPDF y html-to-image. No hay dependencia de rutas de Playground.

## Recorrido y decisiones acordadas

1. Acceso ficticio como Mariana López, Taquilla principal / Caja 01.
2. Eventos autorizados: buscar, abrir ficha en `/evento/{id}` y elegir lugares en
   `/evento/{id}/lugares`. Descripción, programa, recomendaciones y precios usan
   el catálogo compartido mediante el adaptador de fixtures. Durante selección,
   cobro y confirmación, Información del evento abre la misma ficha sin navegar
   ni perder datos; el tiempo de apartado continúa. Hasta ocho lugares por venta.
3. Al continuar se crea una operación pendiente con apartado de diez minutos.
4. Nombre obligatorio. Impresos, correo o ambos; correo obligatorio para entrega
   digital. Invitado sin registro o comprador con cuenta: buscar por nombre/correo,
   seleccionar y asociar los boletos al confirmar el cobro. Invitados y compradores con cuenta
   deben verificar su correo con el código simulado `123456` antes de cobrar. El diálogo confirma nombre/correo antes de enviar y capturar el código. Cambiar el
   correo o la cuenta invalida la verificación. «Continuar sin correo · Solo
   impresos» es una alternativa explícita para invitados, sin código y con aviso
   de conservar boletos y folio. El correo es el camino recomendado.
5. Tipo del comprador, matrícula solo cuando es militar, cantidad de asistentes
   militares y cálculo del público general. El comprador puede no asistir.
6. Efectivo: monto recibido, cambio y confirmación explícita. Terminal independiente:
   iniciar cobro, referencia del comprobante y confirmación manual de aprobación.
   Se pueden combinar efectivo y varios cobros de terminal, cada uno con importe
   y referencia. Se emiten boletos solo al cubrir el total.
7. La confirmación produce un boleto individual por lugar. Explorar los cinco
   diseños compartidos (clásico horizontal por defecto). Descargar PDF, imprimir
   o simular envío de correo. Nunca se realiza un envío o cobro real ni se registra
   asistencia como efecto de vender.
8. Mis ventas permite buscar por folio, comprador o correo; filtrar por estado,
   evento, método y fecha de creación (zona Ciudad de México, días inclusivos).
   Incluye calendario de rango Ark UI, atajos semanales/mensuales y resúmenes
   derivados de los mismos resultados. El efectivo/terminal registrado incluye
   pagos parciales; el importe confirmado y boletos vendidos solo ventas completas.
   Se pueden retomar operaciones y reimprimir.
   No incluye devoluciones ni cancelación de ventas ya confirmadas.

## Apartado y terminal

El apartado inicia al confirmar lugares y pasar a los datos del comprador.
Dura diez minutos y permite una extensión de cinco minutos una sola vez por
operación, persistida al recargar. El contador no se pausa en la verificación.
Los apartados previos conservan su vencimiento, sin renovaciones silenciosas.


`pending` vence y libera lugares después de diez minutos. Iniciar cobro cambia a
`terminal`: retiene lugares sin vencimiento automático porque el resultado es
externo. Salir de la vista, cerrar sesión o recargar convierte ese cobro en `review`.
También puede marcarse pendiente de revisión manualmente.

Desde terminal o revisión, el vendedor confirma la aprobación con referencia o
confirma que **este cobro no se realizó**. Si hay cobros anteriores conserva
`partial`, sus lugares y pagos; si no hay pagos, abre un nuevo apartado de
diez minutos y permite reintentar, cambiar a efectivo o cancelar. Esta renovación
es una decisión de demo para mostrar la recuperación; la política real debe
acordarse con el cliente. Una operación incierta nunca libera lugares automáticamente.

`partial` conserva lugares sin expiración. No permite cambiar comprador ni
cancelar: hay dinero registrado y esta demo no simula devoluciones. Al cubrir el
saldo pasa a `confirmed`. El efectivo recibido puede exceder el importe aplicado;
la diferencia se registra como cambio, no como ingreso. Las referencias de
terminal no se pueden repetir dentro de la misma venta.

Cancelar solo está permitido en `pending` sin pagos. Un rechazo no emite boletos. Las
operaciones confirmadas no admiten una segunda confirmación. La conservación de
lugares afecta únicamente las ventas de esta sesión de demo.

## Verificación de correo y compatibilidad

`demo/email-verification.ts` simula códigos con vigencia de cinco minutos y espera
de 30 segundos para reenviar. No envía correos ni implementa seguridad real.
La UI recibe callbacks; el formulario y los cobros están separados. La verificación
exitosa se conserva al guardar el comprador. Los retos pendientes se reinician al
recargar y se solicita un nuevo código. La cuenta seleccionada también requiere código.

El store migra las ventas antiguas de un pago al arreglo de cobros, preservando
folios y boletos. No se sincroniza aforo con compra pública. Los adjuntos de
comprobantes no están implementados: evaluar por proveedor si el proyecto se concreta.

## Portabilidad

Para trasladar vendedor, llevar `seller/`, `seating/`, `tickets/`, la primitiva
Button y sus dependencias, Ark UI DatePicker, más las imágenes usadas.
La primitiva de calendario proviene del paquete instalado `@ark-ui/react` (MIT):
https://ark-ui.com/docs/components/date-picker. No se añadió otra dependencia. Reemplazar el adaptador de
catálogo, cuentas y el store por implementaciones reales; adaptar enlaces de navegación
con prefijo `/operacion/vendedor` en la capa de composición y sus vistas.

Cargar `seller.css`, `seating/map.css` y `tickets/design-gallery.css`. Los tokens
institucionales tienen alcance `.seller-app`. La tipografía utiliza
`--font-geist-sans` con fallback Arial; títulos Georgia. Conservar Tailwind y la
base de Button o sustituir esa primitiva mediante un adaptador equivalente.

No se implementa SSO, multirrol, administración de permisos, sincronización de
aforo, integración de terminales ni backend. La deuda pública restante se registra
en `docs/deuda-tecnica/separacion-publico-operacion.md`.

## Validación manual

- Efectivo: seleccionar lugares, continuar, comprador solo impreso sin correo,
  importe exacto o superior, confirmar y revisar cambio y PDF.
- Terminal: iniciar cobro, salir a Mis ventas o recargar, revisar estado pendiente,
  confirmar que no hubo cobro y reintentar; luego registrar una aprobación ficticia.
- Cuenta: buscar Alex o Sofía, seleccionar, cobrar y abrir Mis boletos en la
  cuenta elegida; no se vinculan ventas de invitado por coincidencia de correo.
- Entrega digital: código incorrecto/correcto, cambio de correo y reenviar;
  después elegir correo o ambos y usar envío simulado.
- Multimétodo: efectivo parcial con cambio, dos terminales con referencias
  distintas, rechazo, recarga durante cobro y saldo cero antes de emitir.
- Mis ventas: rango y presets, combinación de evento/estado/método/búsqueda,
  calendario por teclado, resumen consistente y limpiar filtros.
- Asistentes: comprador militar con matrícula, cantidades entre cero y boletos.
- Cancelación: cancelar apartado pendiente y volver a seleccionar los lugares.
- Expiración: esperar diez minutos antes de iniciar cobro; comprobar liberación.
- Mapa: límite de ocho, aviso al noveno intento, quitar lugares y limpiar selección.
- Persistencia: recargar Mis ventas en la misma pestaña; cerrar sesión y volver a entrar.
- Responsive: catálogo, mapa, formularios y boletos en escritorio y móvil.

No se agregan pruebas unitarias durante esta etapa, por decisión del usuario.

## Verificación de esta entrega

- TypeScript y ESLint de los archivos modificados: sin errores.
- Revisión 21st: sin errores ni advertencias; sugerencias informativas sobre colores.
- Chrome local: acceso, límite de ocho, limpiar selección, efectivo con cambio,
  terminal rechazada, recuperación al recargar/salir de la vista, confirmación,
  correo simulado, consulta persistente, cancelación y expiración.
- Vista móvil de ventas y compra sin desbordamiento horizontal; CSS de impresión
  oculta navegación. No se probó una impresora física.
- PDF descargado de dos boletos: dos páginas. Sin correos ni pagos reales.
- Selección sobre el mapa compartido verificada en las cuatro propuestas públicas.

El contador de apartado ocupa una barra sticky antes de datos y resumen. Usa
`components/ui/rolling-digits` compartido con compra pública, sin importar su
lógica ni estilos. «Alerta · Demo» pulsa solo icono y dígitos, respeta movimiento
reducido y no cambia el plazo. Al registrar cobros se muestra «Lugares retenidos».

«Saltar a 00:10 · Demo» acorta el vencimiento del apartado activo a diez
segundos como máximo y deja actuar la expiración normal. No prolonga el plazo
ni está disponible durante el procesamiento/retención de un cobro.
