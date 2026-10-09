# Administración · Demo

Ruta `/admin`, route group `(administracion)`. Acceso desde **Abrir administración**
en el inicio. Una propuesta propia, sin layout ni dependencia de vistas de comprador
ni de vendedor. Acceso simulado como Andrea Morales (administración) o Daniel Ríos (consulta).
El widget DEMO permite completar credenciales. No implementa autenticación real.

## Alcance

- Resumen: ingresos y boletos por periodo, canales de venta, eventos publicados y
  disponibilidad. Las dos últimas métricas son globales al catálogo y están etiquetadas.
- Eventos: búsqueda, categoría, estado, orden por fecha, paginación, detalle,
  creación/edición en tres pasos, selección de portada, recinto, distribución,
  aforo y precios. Guardar borrador, publicar y retirar publicación con confirmación.
- Ventas: fecha, canal, evento, estado, búsqueda por folio/nombre/correo, paginación,
  métricas derivadas, detalle de boletos y desglose multipago, exportación CSV filtrada.
- Escritorio: sidebar contraíble. Móvil: navegación en diálogo y tablas con scroll
  interno. Controles de selección, diálogos y popovers con Base UI.

El mapa es una referencia de una distribución preconfigurada. No es un editor libre
ni cambia los mapas públicos. Las portadas pueden elegirse de la biblioteca o de fotos propias. La galería
permite cargar hasta seis JPG/PNG/WebP (5 MB por archivo), ordenar, eliminar y
elegir portada. Se optimizan a WebP de hasta 1600 px mediante un adaptador local,
y se guardan junto al evento en el navegador; no hay carga a un servidor.
Si se agota la cuota local se informa que los cambios solo duran en la pestaña. La publicación se simula solo en este panel.

## Límites y portabilidad

```text
app/(administracion)/admin/       Rutas: componen vistas y leen parámetros
features/admin/
  model.ts                       Contratos y cálculos puros, dinero en centavos MXN
  components/                    Shell, controles, métricas y filtro de fechas
  overview/                      Agregaciones y resumen
  events/                        Validación, edición y detalle de eventos
  sales/                         Listado, detalle y exportación
  demo/fixtures.ts               Único adaptador del catálogo público
  demo/store.ts                  Persistencia explícita de demo
  demo/provider.tsx              Coordinación de datos y acciones simuladas
  admin.css                      Tokens/estilos acotados a administración
```

Las piezas visuales (métricas, gráfica, plano de referencia, campos de formulario,
detalle de venta) reciben props tipadas. Las vistas conectan con el proveedor de
la demo; no leen `localStorage` por sí mismas. Las rutas son Server Components;
los límites interactivos son Client Components. No hay capas genéricas ni servicios
reales simulados como si fueran integraciones terminadas.

Para trasladarlo: copiar `features/admin`, las rutas y las primitivas usadas de
`components/ui` (button, card, input, select); conservar `lib/utils`/`cn` según sus
imports. Dependencias: React, Next (Link, Image y navegación), Base UI, lucide-react,
Tailwind y las utilidades de las primitivas existentes. Mantener fuente Geist,
`globals.css` base y las imágenes referenciadas de `public/images/events`.
Sustituir el adaptador de catálogo en `demo/fixtures.ts` y el proveedor por el acceso
a datos definitivo. No depende de páginas ni del estado de las otras demos.

## Datos y reglas

- Diez eventos (nueve del catálogo y uno histórico) y 768 operaciones
  ficticias. Los indicadores se derivan de esos mismos registros, no son cifras sueltas.
- Ventas de ejemplo: 8 de septiembre a 7 de octubre de 2026. Los presets usan el
  7 de octubre como referencia fija de demo. Eventos programados en 2027.
- Todos los importes se almacenan en centavos MXN. Fechas mostradas en
  `America/Mexico_City`; fecha/hora de evento captura horario local CDMX, UTC-06.
- Operaciones fallidas y expiradas no generan ingresos ni boletos emitidos.
  Los datos históricos de precio en cada compra no cambian al editar tarifas.
- La distribución se bloquea si el evento ya tiene ventas. El aforo de una zona
  no puede bajar de sus boletos vendidos. Los apartados de ejemplo conservan su vencimiento al recargar y liberan disponibilidad al expirar.
- Venta y asistencia son conceptos distintos: el evento histórico incluye ingresos y boletos sin utilizar; los ingresos de staff actualizan Asistencia.
- Eventos editados/creados persisten en `boletera-admin-demo-v1`, con versión y
  validación de estructura al leer. Se sincronizan entre pestañas de admin. Si falla
  la escritura, se informa que el cambio se conserva únicamente en la pestaña actual.
- **Limpiar datos de demo**, desde `/`, también restablece el panel. No se toca
  almacenamiento ajeno ni se cambia la disponibilidad de taquilla/compra pública.
- CSV: incluye importe solicitado e ingreso confirmado por separado. Se escapan
  comillas y se neutralizan celdas que podrían interpretarse como fórmulas.

## Procedencia

Referencia principal: `shadcn-dashboard-landing-v1/nextjs-version`, ShadcnStore,
commit `65fc11224e96d56a62e224a58f7ed590aea5ac24` según su ATTRIBUTION.
`components/metric-cards.tsx` adapta `dashboard-2/components/metrics-overview.tsx`:
se retiran fixtures, gradientes y tendencias inventadas; se agregan props tipadas.
La organización sidebar/contenido y densidad de tablas son referencias visuales.
No se importan sus providers, dependencias Radix, configurador ni pantallas incompletas.
Licencia MIT preservada en [THIRD_PARTY_LICENSE.md](./THIRD_PARTY_LICENSE.md).

Se consultó el catálogo 21st (Advanced Data Table Filter Builder / Origin UI Table).
No se incorporaron esos bloques: para tres filtros simples agregaban complejidad;
se reutilizan las primitivas Base UI existentes. Material Dashboard se conserva
como referencia secundaria; no se copió su código.

## Validación manual sugerida

1. Abrir `/admin`, cambiar periodo y comprobar coherencia con Ventas.
2. Crear evento, elegir portada, configurar aforo/precio, guardar borrador y recargar.
3. Editar, publicar y retirar publicación; comprobar que las ventas se conservan.
4. Abrir un evento con ventas: no se puede cambiar distribución ni bajar aforo
   por debajo del vendido por zona.
5. Filtrar ventas, abrir una con pago mixto, comparar total y desglose; exportar CSV.
6. Probar filtros sin resultados, navegación móvil, teclado y diálogos con Escape.
7. Restablecer desde inicio y comprobar que desaparecen los eventos de prueba.

No se añaden pruebas unitarias por indicación del usuario. Comprobaciones de tipos,
lint y recorridos de navegador se realizan sobre el servidor existente, sin iniciarlo.

## Comprobaciones de esta entrega (2026-10-07)

- TypeScript (`tsc --noEmit`) y ESLint en archivos afectados: correctos.
- Revisión 21st: avisos informativos sobre colores del tema local; sin correcciones
  automáticas sobre estilos globales.
- Navegador aislado contra el servidor del usuario en puerto 3000: creación,
  recarga/persistencia, publicación/retiro, edición, filtros por canal/estado/fecha,
  detalle de compra, descarga CSV, estado vacío y restricción de distribución vendida.
- Revisión visual en 1440 px y navegación móvil a 390 px: sin desbordamiento de
  página y sin errores de consola al cerrar el recorrido. Tablas con scroll interno.
- El navegador integrado no conectó; se usó Chrome headless con perfil aislado.
  No se inició ningún servidor ni se cambiaron los datos del navegador del usuario.

## Galería y carga de fotos

`media/` separa contratos y validadores (`model`), preparación local de archivos
(`prepare-image`), estado de carga (`use-image-upload`) y componentes visuales.
El formulario controla la colección; el editor no conoce la persistencia.

La interacción de portada y arrastrar/seleccionar toma como referencia **Cover
Upload** de sean0205, ya disponible en el playground:
https://21st.dev/@sean0205/components/file-upload. Se adapta al tema administrativo,
con selección múltiple, progreso real de preparación y galería persistente; no se
importa su hook de progreso simulado. Su registro no declara licencia específica;
conservar esta procedencia y verificar términos antes de redistribuir el bloque.

Validación de la galería: carga, portada, orden, visor, rechazo de archivos no
admitidos, guardado/recarga/edición, eliminación y vista móvil. No se añaden tests
unitarios ni se inicia un servidor propio.

## Autollenado para presentaciones

El formulario de eventos incluye ayudas controladas por el widget DEMO: ejemplos de Evento y Cena baile con textos, fecha, recinto y precios. Los datos están aislados en `demo/event-form-examples.ts`. Al crear, la portada y la galería comienzan vacías. La ayuda reemplaza los campos y carga imágenes locales de ejemplo; al editar solo se completan campos vacíos sin alterar categoría, distribución, aforo ni precios. Deshacer recupera los campos y las imágenes previos al último autollenado. La acción no guarda ni publica el evento.

### Orden visual de la galería

`media/sortable-image-gallery.tsx` es una pieza controlada: recibe imágenes y callbacks, sin persistencia ni dependencias del playground. Adapta el lenguaje visual de `21st-dev/file-upload` y `21st-dev/file-upload-1` (miniaturas, estados de carga y acciones discretas). Esos bloques permiten subir archivos, pero no reordenarlos: para la cuadrícula se usan las primitivas de [dnd-kit Sortable](https://dndkit.com/legacy/presets/sortable/overview/), con overlay flotante, movimiento entre posiciones, sensor de puntero/tacto y teclado (espacio, flechas, Escape). El asa limita el bloqueo táctil a la zona de arrastre, manteniendo el scroll del resto de la página. El movimiento reducido desactiva las transiciones. Reordenar conserva la portada y actualizar el evento guarda el nuevo orden.

## Recintos de la demo

`src/domain/venues/catalog.ts` define los dos recintos compartidos: Gran Salón Boletera (mesas y pista) y Auditorio Boletera (filas). Elegir el recinto carga su distribución y zonas. La categoría sigue siendo independiente. No se cambia el recinto de un evento con ventas confirmadas. El catálogo público, los mapas de compra y la adaptación de taquilla usan esta misma definición; los nombres antiguos en datos persistidos se normalizan sin borrar operaciones. Cada mapa de compra tiene cinco secciones de cien lugares; el plano administrativo es una vista esquemática.

## Estadísticas animadas

El resumen incorpora áreas de ingresos, dona por canal, barras de cobro y actividad
2D/3D por día con filtro de vendedor. Las tres primeras responden al rango global;
la actividad usa su propio periodo (12 meses por defecto, 180 o 90 días) y admite vendedor de taquilla o todos los canales. El filtro
por vendedor solo afecta la actividad. Los eventos publicados y su disponibilidad
son cifras de catálogo; la tabla inferior muestra valores acumulados y subtotal
de sus cuatro filas visibles. Ver `charts/README.md` para fuentes y arquitectura.

La actividad incluye total, día más activo, mayor racha y racha actual. Las fixtures
conservan las 156 operaciones originales de septiembre/octubre y agregan 600
operaciones históricas desde octubre de 2025. Los totales del rango inicial no
cambian; las cifras acumuladas del catálogo sí incluyen el historial ampliado.

## Ampliación de administración y acceso (2026-10-09)

- `/admin/asistencia`: búsqueda por comprador/boleto, filtro de evento, entradas
  registradas y boletos sin utilizar de eventos iniciados. Los pendientes futuros
  no se presentan como ausencias definitivas.
- `/admin/eventos/[eventId]/lugares`: consulta y edición individual de fila/mesa,
  número y habilitación. Los lugares vendidos o apartados no pueden deshabilitarse,
  renumerarse ni eliminarse. Los cambios se guardan en el evento administrativo.
- El resumen contabiliza boletos por método: en línea, efectivo, terminal y mixto.
  Una compra mixta pertenece a una sola categoría para no duplicar boletos.
- `inventory/` separa reglas, reloj/persistencia de apartados y vista. `attendance/`
  consume los mismos boletos confirmados y registros de acceso.
- `features/internal-access` contiene el acceso simulado compartido con staff;
  `features/access` define los contratos de ingreso y su adaptador local.
  Estos módulos deben acompañar al panel al trasladarlo a otro repositorio.

Las sesiones duran en la pestaña (`sessionStorage`). Credenciales de demo:
`andrea@boletera.demo` y `daniel@boletera.demo`, contraseña `Demo2026!`.
El perfil de consulta bloquea las acciones de escritura y las rutas directas de
edición. Esto demuestra permisos de interfaz; no constituye seguridad de servidor.

Los apartados usan `boletera-admin-holds-v1` y los ingresos
`boletera-access-demo-v1`. Staff y Asistencia comparten estos últimos en el mismo
origen, incluso entre pestañas. Publicación, mapas públicos y taquilla siguen
independientes del inventario administrativo. Restablecer la demo limpia estos
registros y las sesiones internas.

Validación: login, perfil de consulta, persistencia de lugares, protección de
vendidos/apartados, vencimiento sin reiniciar el plazo, ingreso, duplicado, boleto
incorrecto y búsqueda; sincronización de asistencia y vistas a 390/1440 px.
