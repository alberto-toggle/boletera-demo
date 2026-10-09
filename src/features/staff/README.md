# Staff de acceso · Demo

Ruta `/operacion/staff`, grupo `(acceso)`. Layout independiente de administración,
venta pública y taquilla. Acceso desde inicio o el widget DEMO.

## Recorrido

Usar la ayuda de acceso o `mariana@boletera.demo` / `Demo2026!`. Elegir evento,
leer QR con cámara o buscar por código, folio, nombre o correo. Revisar el boleto
y confirmar ingreso. Un segundo intento muestra el primer ingreso y no lo duplica.
También se muestran estados de otro evento y boleto inexistente.

El widget controla las ayudas para probar esos escenarios y mostrar un QR del
catálogo de staff. La cámara usa `getUserMedia` y `jsqr`, requiere localhost o HTTPS
y permiso del navegador. La lectura ocurre localmente. Si se deniega el permiso,
la búsqueda y captura manual siguen disponibles. La cámara se detiene al salir
del lector. No se solicita permiso hasta pulsar Activar cámara.

## Separación y datos

- `staff-app.tsx`: composición y coordinación del recorrido.
- `components/`: lector, búsqueda y resultado con props tipadas.
- `features/access/model.ts`: contratos y validación pura del boleto.
- `features/access/demo/catalog.ts`: adaptador explícito de fixtures administrativas.
- `features/access/demo/store.ts`: registros locales y sincronización entre pestañas;
  usa Web Locks cuando están disponibles para serializar confirmaciones.
- `features/internal-access`: sesión y permisos simulados, compartidos con admin.

Para trasladar el flujo, copiar estas piezas, rutas, estilos, primitivas importadas
y sus dependencias. Reemplazar los adaptadores demo por servicios; no se importan
vistas de administración ni componentes del playground. Se reutilizan Button/Input
y el QR de Ark UI ya instalado. `jsqr` es la única dependencia nueva del lector.

El catálogo es ficticio y no recibe ventas nuevas de taquilla ni de la landing.
Los ingresos sí se reflejan en Asistencia del panel en este navegador/origen.
El retiro de publicación de un evento no invalida los boletos de ejemplo.
La cuenta de staff no permite iniciar sesión administrativa.

La sesión usa `sessionStorage`; los ingresos usan `boletera-access-demo-v1` en
`localStorage`. Limpiar datos de demo restablece ambos. No hay autenticación real,
validación en servidor ni garantía entre dispositivos desconectados.

## Validación

Recorrido en Chrome aislado contra el servidor existente: ingreso válido,
duplicado, evento incorrecto, inexistente, búsqueda, recarga, sincronización con
admin y móvil sin desbordamiento. No se añaden pruebas unitarias. El lector se comprobó con un QR en video sintético, liberación de cámara y permiso denegado. La cámara física
queda para validación con un dispositivo; las ayudas permiten presentar el flujo
sin depender de ella.
