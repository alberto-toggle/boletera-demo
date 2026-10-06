# Cuenta del comprador (demo)

Flujo compartido por las cuatro propuestas, bajo `/demo-<propuesta>/cuenta`.
El menú abre un desplegable compacto en desktop y un diálogo inferior en móvil.
`/pasados`, `/perfil` y `/boletos/<folio>` muestran historial, datos y boletos;
"Ver boletos" nunca redirige al detalle promocional del evento.

## Probar

- En la pantalla de acceso, Alex carga `alex@example.com` y `Demo2027`.
  Tiene dos compras futuras y una de 2025 con un acceso utilizado y otro sin uso.
- Sofía carga `sofia@example.com` y la misma contraseña ilustrativa. Empieza sin compras.
- Google es una simulación que abre Alex. Las contraseñas no se almacenan ni se
  validan como credenciales reales; se solicita un mínimo de seis caracteres.
- Se puede crear otra cuenta de prueba, editar nombre/teléfono y cerrar sesión.
- Las compras confirmadas en modo cuenta/registro se incorporan una sola vez.
  Las compras como invitado no se asocian automáticamente a ninguna cuenta.
- La sesión, usuarios, compras y transferencias se guardan en localStorage
  (`boletera-account-demo-v1`), con validación de forma al leer y respaldo en memoria
  si el navegador no permite persistir. Comparten datos entre las cuatro propuestas.
  Borrar esa clave y recargar restaura los ejemplos iniciales.

## Transferencias

Seleccionar boletos → destinatario → revisión → pendiente → aceptación/cancelación.
Se transfieren únicamente boletos futuros, válidos y propios, sin otra transferencia
pendiente. El destinatario acepta desde su cuenta. El emisor puede cancelar mientras
siga pendiente. Una sección secundaria permite cambiar a la cuenta destinataria
para recorrer la simulación sin envío de correos.

Los boletos conservan su identidad/asiento; al aceptar, cambia el propietario y se
renueva `accessId`. Ese nuevo código se usa en la vista y en los PDFs. Los códigos
anteriores dejan de pasar `isCurrentAccess`; no se puede modificar un PDF ya
almacenado por el usuario. Una integración real con Staff deberá consultar el
registro vigente en el servidor. Este módulo no implementa autenticación segura,
correo ni control de acceso real. El cliente nunca es una autoridad de validación.

La operación completa se comprueba nuevamente al confirmar. No se transfieren
boletos utilizados ni pasados; el historial no infiere asistencia a partir de la fecha.
Una transferencia es independiente de la compra y del estado de acceso.

## Componentes y procedencia

Reutiliza Button/Input/Label de la base existente, FancyButton/GoogleIcon del
acceso adaptado previamente, y TicketDesignGallery (UI TripleD, StatementTicket y
boleto clásico existentes). El modo compacto añade navegación horizontal y deja
los diseños en un desplegable, sin alterar la confirmación de compra original.
No hay dependencias de las rutas Playground.

## Verificación

`node --test tests/account.test.mjs tests/booking.test.mjs` cubre 23 casos de
compra, selección y transferencia: permisos, cancelación, aceptación única,
renovación de códigos, expiración, boletos usados, retransferencia y datos corruptos.
Prueba Chrome local: cuatro temas, desktop/móvil, entrada desde landing, Escape y
foco, próximos/pasados, perfil, registro, aislamiento entre cuentas, compra con
sesión, persistencia, aceptación/cancelación y PDF de cuatro boletos desde carrusel.

## Métodos de pago

Las cuatro rutas `/cuenta/metodos-de-pago` comparten una cartera de ejemplo por
usuario. Permite agregar ejemplos fijos, elegir predeterminada y eliminar con
confirmación. Si se elimina la principal, la primera restante la sustituye.
El estado anterior es compatible y conserva compras y transferencias.
Solo persiste marca, últimos cuatro dígitos, vencimiento y metadatos de demo.
No captura PAN/CVV, tokeniza tarjetas ni conecta esta cartera a cobros.

`components/payment-folder.tsx` adapta la animación del Card Folder de BE UI
(Saurabh), descargado de https://beui.dev/r/card-folder.json, sin depender del
Playground. Conserva la cartera SVG y transición original, con contenido
semántico y tokens propios; elimina controles de revelado de número/CVV.
