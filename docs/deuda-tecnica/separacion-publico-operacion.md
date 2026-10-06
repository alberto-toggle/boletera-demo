# DT-001 · Separación y portabilidad de los componentes públicos

- Fecha: 2026-10-06.
- Estado: pendiente; documentado antes de implementar vendedor.
- Alcance: propuestas institucional, gala, editorial e inmersiva, compra pública y cuenta del comprador.
- Momento de atención: al reutilizar una pieza fuera del entorno público o al preparar la aplicación real. No implica una refactorización completa inmediata.

## Contexto y objetivo

La demo debe conservar su apariencia y comportamiento al evolucionar al producto
real. La aplicación pública, operación interna y, posiblemente, administración
podrían reorganizarse dentro de este repositorio o trasladarse a repositorios
distintos. Los subdominios no obligan a separar repositorios; esa decisión queda
abierta.

Existe separación por funcionalidades, pero algunos componentes reutilizables
todavía dependen del contexto público. Esta deuda registra esos límites para que
la futura extracción no requiera reconstruir la interfaz que aprobó el cliente.

## Situación actual verificada

| Área | Organización existente | Dependencia pendiente de resolver |
| --- | --- | --- |
| Rutas | Las propuestas están en `src/app/(demos)` y componen vistas de funcionalidades. | El layout común carga estilos de descubrimiento, experiencia y cuenta, además de `DemoMotion`. Identificar los estilos y efectos que necesita realmente cada pieza extraída. |
| Presentaciones públicas | `features/event-discovery` contiene institucional, gala y editorial; `features/immersive` contiene la inmersiva. | Conservar las composiciones propias; extraer solo elementos compartidos de verdad. |
| Compra | `features/booking` contiene modelos, fixtures, componentes y PDF. | `booking-flow.tsx` importa `Brand` de descubrimiento, crea el recinto de demo y coordina la cuenta del comprador. No es un flujo neutral reutilizable directamente por vendedor. |
| Selección de lugares | Mapa y selector ya son componentes separados. | `venue-selector.tsx` importa `DemoVenue` desde fixtures, reglas desde el modelo de compra y formato de precio desde descubrimiento. Separar contratos de recinto y dependencias neutrales. |
| Boletos | Presentación, galería de diseños y exportación tienen archivos propios dentro de `booking`. | Delimitar la representación/exportación reutilizable frente a controles de exploración exclusivos de la demo pública. Inventariar estilos, fuentes e imágenes necesarios para el PDF. |
| Cuenta | `features/account` separa modelo, fixtures, validación y store. | Su store persiste en `localStorage` y utiliza el tipo `Buyer` de compra. Mantener esta implementación de demo fuera de la presentación y revisar el contrato compartido al extraerla. |
| Base visual | Existen primitivas en `src/components/ui`. | Documentar tokens, fuentes, estilos base y dependencias necesarios para utilizarlas en otro entorno. Copiar un TSX aislado no garantiza conservar el diseño. |

Este inventario identifica puntos concretos; no representa una auditoría exhaustiva
de todos los componentes ni afirma que ya sean portables de manera independiente.

## Límites deseados

1. **Base visual:** primitivas, tokens y recursos de marca explícitos, sin rutas ni lógica de compra.
2. **Piezas de boletería compartidas:** contratos de lugares, mapa y representación/exportación de boletos. Reciben datos y acciones tipadas; no conocen el rol, el catálogo ficticio ni el store del comprador.
3. **Aplicación pública:** conserva sus vistas, checkout y cuenta. Coordina las piezas compartidas según su propio recorrido.
4. **Operación:** cada rol conserva su flujo y composición. Vendedor no depende del checkout público; staff y administración no heredan obligatoriamente su navegación.
5. **Simulación y acceso a datos:** fixtures y persistencia detrás de contratos pequeños, adecuados al caso de uso. Sustituirlos por servicios no debe obligar a reescribir la presentación.

Las dependencias deben ir desde las composiciones públicas o de operación hacia
las piezas neutrales, nunca desde una pieza neutral hacia una aplicación.
Las rutas, sesión y navegación se resuelven en las composiciones. Compra, boleto
y acceso siguen siendo conceptos distintos.

Los nombres y destinos finales de las carpetas se decidirán al extraer cada pieza.
No se requiere crear ahora un paquete, monorepo o repositorio genérico. Componentes
visualmente parecidos pueden permanecer separados cuando representan tareas
distintas; compartir no significa introducir condiciones para todos los roles.

## Trabajo pendiente y orden sugerido

- [ ] Registrar las dependencias de cada pieza que se vaya a reutilizar: tipos, imports, CSS, tokens, recursos, librerías y APIs del navegador.
- [ ] Separar contratos de dominio de los tipos definidos en fixtures; mantener el generador de datos ficticios como implementación de demo.
- [ ] Extraer las piezas necesarias de selección de lugares, dejando límites de compra y coordinación de reservas explícitos en el flujo correspondiente.
- [ ] Delimitar representación y exportación de boletos, separándolas de navegación, cuenta y controles exclusivos de la demo.
- [ ] Separar elementos neutrales de marca y formato que hoy pertenecen a descubrimiento; documentar sus dependencias visuales.
- [ ] Revisar alcance de estilos y carga de fuentes para que las piezas funcionen sin montar el layout público completo.
- [ ] Aislar coordinación con cuenta, temporizadores y persistencia en el entorno que los utiliza, conservando una única fuente de verdad por flujo.
- [ ] Documentar entradas públicas de los módulos, contratos, dependencias, procedencia y licencias de componentes externos.
- [ ] Verificar una composición fuera del layout público que use las piezas extraídas sin importar vistas, fixtures implícitas o stores de comprador.

La migración debe ser incremental: extraer una pieza, actualizar sus consumidores
y comprobar las cuatro propuestas antes de continuar. Evitar mantener dos copias
divergentes de reglas de disponibilidad, cálculo de importes o emisión de boletos.

## Criterios de cierre

- Las piezas compartidas reciben datos y callbacks tipados y no importan rutas,
  layouts ni stores específicos de la aplicación pública.
- Sus estilos, tokens, fuentes, imágenes y dependencias están identificados y
  permiten conservar la apariencia al integrarlas en otra sección o repositorio.
- Las simulaciones pueden sustituirse mediante contratos explícitos; la UI no
  accede directamente a la persistencia como parte de su presentación.
- Se conservan navegación, responsive, accesibilidad y movimiento reducido de las
  cuatro propuestas, además de selección, checkout, cuenta y diseños/PDF de boletos.
- Cada extracción pasa comprobación de tipos, lint y revisión manual de los flujos
  afectados. Durante la demo no se añaden pruebas unitarias salvo nueva indicación.
- Hay instrucciones de integración y un inventario de recursos para trasladar los
  módulos. Extraer UI no equivale a tener autenticación, disponibilidad o cobros reales.

## Criterios acordados para la futura operación

Al comenzar vendedor se aplicarán estos límites desde el inicio: route group propio,
prefijo `/operacion`, layout específico de vendedor y una sola propuesta visual.
La base común podrá aportar identidad y contexto sin imponer sidebar ni distribución
a staff o administración. El panel administrativo podrá tener su propio layout.

El flujo de vendedor será independiente del checkout público. La primera entrega
contemplará efectivo y registro manual de cobro en terminal independiente, sin
simular conexión con hardware ni confirmación bancaria automática.

La deuda pública se resolverá únicamente en las piezas cuya reutilización lo
requiera, con el alcance de cada cambio explícito. Este documento no autoriza una
reestructuración total de las landings. En esta entrega solo se documenta la deuda;
el código de vendedor queda pendiente de la revisión del usuario.
